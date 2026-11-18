import axios from "axios";
import { load } from "cheerio";
import express from "express";

const MAX_BODY_BYTES = "8kb";
const MAX_PENDING_REQUESTS = 100;
const SSW_REQUEST_INTERVAL_MS = 55;

const port = Number(process.env.API_PORT || 3001);
const app = express();
let nextSswRequestAt = 0;
let pendingRequests = 0;

function isValidCpf(value) {
  if (/^(\d)\1{10}$/.test(value)) return false;
  const digits = [...value].map(Number);
  const firstSum = digits
    .slice(0, 9)
    .reduce((sum, digit, index) => sum + digit * (10 - index), 0);
  const firstDigit = ((firstSum * 10) % 11) % 10;
  const secondSum = digits
    .slice(0, 10)
    .reduce((sum, digit, index) => sum + digit * (11 - index), 0);
  return (
    firstDigit === digits[9] && ((secondSum * 10) % 11) % 10 === digits[10]
  );
}

function isValidCnpj(value) {
  if (/^(\d)\1{13}$/.test(value)) return false;
  const calculateDigit = (base, weights) => {
    const sum = [...base].reduce(
      (total, char, index) => total + Number(char) * weights[index],
      0
    );
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };
  const first = calculateDigit(
    value.slice(0, 12),
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );
  const second = calculateDigit(
    value.slice(0, 12) + first,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );
  return value.endsWith(`${first}${second}`);
}

function normalizeKey(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function getOccurrenceDate(value) {
  const match = value.match(
    /(\d{1,2}[/.]\d{1,2}[/.]\d{2,4})\s+(\d{1,2}:\d{2}(?::\d{2})?)/
  );
  if (!match) return null;
  return { data: match[1], hora: match[2] };
}

function getSswActionUrl($, anchor) {
  const element = $(anchor);
  const onclick = element.attr("onclick") || "";
  const actionMatch = onclick.match(/\bopx\s*\(\s*(['"])(.*?)\1\s*\)/i);
  const target = actionMatch?.[2] || element.attr("href") || "";
  if (!target || target === "#" || /^\s*javascript:/i.test(target)) return null;

  try {
    const url = new URL(target, "https://ssw.inf.br/2/rastreamento_dest");
    if (
      (url.protocol !== "https:" && url.protocol !== "http:") ||
      url.username ||
      url.password
    ) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

function getSswDetailParams($, anchor) {
  const url = getSswActionUrl($, anchor);
  if (
    !url ||
    url.protocol !== "https:" ||
    url.hostname !== "ssw.inf.br" ||
    url.pathname.toLowerCase() !== "/2/ssw_sswdetalhado"
  ) {
    return null;
  }

  const id = getSswQueryValue(url, "id");
  const md = getSswQueryValue(url, "md");
  if (!isValidSswToken(id) || !isValidSswToken(md)) return null;
  return { id, md };
}

function getSswQueryValue(url, name) {
  for (const pair of url.search.slice(1).split("&")) {
    const separator = pair.indexOf("=");
    if (separator < 0) continue;

    let key;
    let value;
    try {
      key = decodeURIComponent(pair.slice(0, separator).replace(/\+/g, " "))
        .toLowerCase();
      value = decodeURIComponent(
        pair.slice(separator + 1).replace(/\+/g, "%2B")
      );
    } catch {
      continue;
    }

    if (key === name) return value;
  }
  return "";
}

function isValidSswToken(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value === value.trim() &&
    value.length <= 512 &&
    !/[\u0000-\u001f\u007f]/.test(value)
  );
}

function findSswDetailAnchor($, row) {
  function findInRow(candidate) {
    let anchor = null;
    candidate.find("a").each((_, element) => {
      const label =
        $(element).text().replace(/\s+/g, " ").trim() ||
        $(element).attr("title")?.trim() ||
        "";
      if (normalizeKey(label) === "maisdetalhes") {
        anchor = element;
        return false;
      }
    });
    return anchor;
  }

  const currentRow = $(row);
  const anchor = findInRow(currentRow);
  if (anchor) return anchor;

  const followingRow = currentRow.next("tr");
  if (normalizeKey(followingRow.text()) !== "maisdetalhes") return null;
  return findInRow(followingRow);
}

function getSswDocumentLinks($, scope) {
  const links = [];
  $(scope)
    .find("a")
    .each((_, anchor) => {
      const label =
        $(anchor).text().replace(/\s+/g, " ").trim() ||
        $(anchor).attr("title")?.trim() ||
        "";
      const normalizedLabel = normalizeKey(label);
      if (
        !normalizedLabel.includes("dacte") &&
        normalizedLabel !== "xml" &&
        normalizedLabel !== "comprovantedeentrega"
      ) {
        return;
      }

      const url = getSswActionUrl($, anchor);
      if (url) {
        links.push({
          label:
            normalizedLabel === "comprovantedeentrega"
              ? "Comprovante de Entrega"
              : label,
          href: url.href
        });
      }
    });
  return links;
}

function parseSswHtml(raw) {
  const $ = load(raw);
  const pageText = $("body").text().replace(/\s+/g, " ").trim();
  const normalizedPageText = normalizeKey(pageText);
  if (
    /senha.{0,30}(incorret|inv[aá]lid)|password.{0,30}(incorrect|invalid)/i.test(
      pageText
    )
  ) {
    throw Object.assign(
      new Error("Senha incorreta. Confira os dados e tente novamente."),
      { status: 401 }
    );
  }

  const occurrences = [];
  let destinatario = "";
  let remetente = "";
  $("table tr").each((_, row) => {
    const cells = $(row).children("td, th");
    const rowText = $(row).text().replace(/\s+/g, " ").trim();
    const recipientMatch = rowText.match(
      /Destinat.{0,2}rio\s*:\s*(.*?)(?=N\s*Fiscal|$)/i
    );
    if (!destinatario && recipientMatch)
      destinatario = recipientMatch[1].trim();

    const senderMatch = rowText.match(/Remetente\s*:\s*(.*)/i);
    if (senderMatch) {
      remetente = senderMatch[1].trim();
      return;
    }

    if (cells.length < 3) return;

    const locationCell = $(cells[1]).clone();
    locationCell.find("br").replaceWith("\n");
    const locationText = locationCell
      .text()
      .replace(/\u00a0/g, " ")
      .trim();
    const date = getOccurrenceDate(locationText);
    if (!date) return;

    const statusCell = $(cells[2]);
    const descricao =
      statusCell.find("b, strong").first().text().replace(/\s+/g, " ").trim() ||
      statusCell
        .text()
        .replace(/\s+/g, " ")
        .trim()
        .split(/\s{2,}/)[0];
    if (!descricao) return;

    const numberCell = $(cells[0]).clone();
    numberCell.find("br").replaceWith("\n");
    const numbers = numberCell
      .text()
      .replace(/\u00a0/g, " ")
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean);

    const detailsCell = statusCell.clone();
    detailsCell.find("a").remove();
    detailsCell.find("b, strong").first().remove();
    detailsCell.find("br").replaceWith("\n");
    const detalhes = detailsCell.text().replace(/\s+/g, " ").trim();
    const links = getSswDocumentLinks($, row);
    const detailsAnchor = findSswDetailAnchor($, row);
    const detalhesSsw = detailsAnchor
      ? getSswDetailParams($, detailsAnchor)
      : null;

    const cidade = locationText
      .replace(
        /\d{1,2}[/.]\d{1,2}[/.]\d{2,4}\s+\d{1,2}:\d{2}(?::\d{2})?.*$/,
        ""
      )
      .replace(/\s+/g, " ")
      .trim();

    occurrences.push({
      numeroFiscalColeta: numbers[0] || "",
      numeroPedido: numbers[1] || "",
      data: date.data,
      hora: date.hora,
      cidade,
      descricao,
      detalhes,
      remetente,
      detalhesSsw,
      links
    });
  });

  const uniqueOccurrences = [
    ...new Map(
      occurrences.map((occurrence) => [
        `${occurrence.numeroFiscalColeta}|${occurrence.numeroPedido}|${occurrence.data}|${occurrence.hora}|${occurrence.cidade}|${occurrence.descricao}`,
        occurrence
      ])
    ).values()
  ];
  if (!uniqueOccurrences.length) {
    if (
      /semocorr|nenhumregistro|naoencontrad|naoexist|nenhumacarga/.test(
        normalizedPageText
      )
    )
      return null;

    const title = $("title").text().replace(/\s+/g, " ").trim();
    const error = new Error(
      title
        ? `O SSW respondeu com uma página inesperada ("${title}"), sem ocorrências reconhecíveis.`
        : "O SSW respondeu com uma página sem ocorrências reconhecíveis."
    );
    throw Object.assign(error, { status: 502 });
  }
  return {
    status_atual: uniqueOccurrences.at(-1).descricao,
    remetente: uniqueOccurrences.at(-1).remetente,
    destinatario,
    ocorrencias: uniqueOccurrences
  };
}

function parseSswDetailHtml(raw) {
  const $ = load(raw);
  const pageText = $("body").text().replace(/\s+/g, " ").trim();
  const occurrences = [];

  $("table tr").each((_, row) => {
    const cells = $(row).children("td, th");
    if (cells.length < 3) return;

    const dateCell = $(cells[0]).clone();
    dateCell.find("br").replaceWith(" ");
    const date = getOccurrenceDate(dateCell.text().replace(/\s+/g, " ").trim());
    if (!date) return;

    const unitCell = $(cells[1]).clone();
    unitCell.find("br").replaceWith("\n");
    const unidade = unitCell
      .text()
      .replace(/\u00a0/g, " ")
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean)
      .join("\n");

    const statusCell = $(cells[2]);
    const descricao = statusCell
      .find("b, strong")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim();
    const detailsCell = statusCell.clone();
    detailsCell.find("a").remove();
    detailsCell.find("b, strong").first().remove();
    detailsCell.find("br").replaceWith(" ");
    const detalhes = detailsCell.text().replace(/\s+/g, " ").trim();
    if (!descricao) return;

    occurrences.push({
      data: date.data,
      hora: date.hora,
      unidade,
      descricao,
      detalhes
    });
  });

  const remetente =
    pageText.match(/Remetente\s*:?\s*(.*?)\s*Destinat[aá]rio/i)?.[1]?.trim() ||
    "";
  const destinatario =
    pageText.match(/Destinat[aá]rio\s*:?\s*(.*?)\s*N\s*Fiscal/i)?.[1]?.trim() ||
    "";
  const numeroFiscalColeta =
    pageText.match(/N\s*Fiscal(?:\/Coleta)?\s*:?\s*(.*?)\s*N\s*Pedido/i)?.[1]?.trim() ||
    "";
  const numeroPedido =
    pageText.match(/N\s*Pedido\s*:?\s*(.*?)\s*Previs[aã]o\s+de\s+entrega/i)?.[1]?.trim() ||
    "";
  const previsaoEntrega =
    pageText.match(/Previs[aã]o\s+de\s+entrega\s*:?\s*(\d{1,2}[/.]\d{1,2}[/.]\d{2,4})/i)?.[1] ||
    "";

  if (!occurrences.length && !destinatario && !remetente) {
    throw Object.assign(
      new Error("O SSW respondeu sem dados detalhados reconhecíveis."),
      { status: 502 }
    );
  }

  return {
    remetente,
    destinatario,
    numeroFiscalColeta,
    numeroPedido,
    previsaoEntrega,
    ocorrencias: occurrences,
    links: getSswDocumentLinks($, $("body"))
  };
}

function describeSswError(status, body) {
  const message = body.toLowerCase();
  if (status === 429)
    return "O serviço de rastreamento está recebendo muitas consultas. Tente novamente em instantes.";
  if (/senha|password/.test(message))
    return "Senha incorreta. Confira os dados e tente novamente.";
  if (
    /nao encontrado|não encontrado|sem ocorr|nenhum registro|not found/.test(
      message
    )
  ) {
    return "Nenhuma carga encontrada para este documento nos últimos 30 dias.";
  }
  if (status === 401 || status === 403)
    return "Não foi possível autenticar a consulta. Confira os dados do destinatário.";
  return "O serviço de rastreamento está temporariamente indisponível. Tente novamente em instantes.";
}

async function reserveSswSlot() {
  const scheduledAt = Math.max(Date.now(), nextSswRequestAt);
  nextSswRequestAt = scheduledAt + SSW_REQUEST_INTERVAL_MS;
  const wait = scheduledAt - Date.now();
  if (wait > 0)
    await new Promise((resolveWait) => setTimeout(resolveWait, wait));
}

async function postSswForm(url, body) {
  await reserveSswSlot();
  return axios.post(url, body, {
    headers: {
      Accept: "text/html",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    timeout: 15000,
    responseType: "text"
  });
}

async function querySsw(documento, senha) {
  const url = "https://ssw.inf.br/2/ssw_resultSSW_dest";
  const form = new URLSearchParams({
    cnpjdest: documento,
    senha,
    urlori: "https://c4xpress.com.br/rastreamento"
  });
  let upstream;
  try {
    upstream = await postSswForm(url, form);
  } catch (error) {
    if (!axios.isAxiosError(error)) throw error;
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      throw Object.assign(
        new Error(
          "A consulta ao rastreamento excedeu o tempo limite. Tente novamente."
        ),
        { status: 504 }
      );
    }
    if (error.response) {
      const status = error.response.status;
      const body =
        typeof error.response.data === "string"
          ? error.response.data
          : JSON.stringify(error.response.data ?? "");
      throw Object.assign(new Error(describeSswError(status, body)), {
        status: status === 429 ? 429 : 502
      });
    }
    throw Object.assign(
      new Error("Não foi possível conectar ao serviço de rastreamento SSW."),
      { status: 502 }
    );
  }

  const raw = typeof upstream.data === "string" ? upstream.data : "";
  if (!raw.trim()) return null;
  return parseSswHtml(raw);
}

async function querySswDetails(id, md) {
  await reserveSswSlot();
  const upstream = await axios.get("https://ssw.inf.br/2/ssw_SSWDetalhado", {
    params: { id, md },
    headers: { Accept: "text/html" },
    timeout: 15000,
    responseType: "text"
  });
  const raw = typeof upstream.data === "string" ? upstream.data : "";
  if (!raw.trim()) {
    throw Object.assign(
      new Error("O SSW não retornou os detalhes desta ocorrência."),
      { status: 502 }
    );
  }

  return parseSswDetailHtml(raw);
}

app.use((req, res, next) => {
  res.set({
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  next();
});
app.use(express.json({ limit: MAX_BODY_BYTES }));

app.get("/api/rastreio", (req, res) => {
  res.json({
    message: "Servidor C4 Xpress ativo. Envie um POST para testar o rastreio."
  });
});

app.post("/api/rastreio/detalhes", async (req, res) => {
  if (!req.is("application/json")) {
    res.status(415).json({ error: "Envie os dados no formato JSON." });
    return;
  }

  const { id, md } = req.body ?? {};
  if (!isValidSswToken(id) || !isValidSswToken(md)) {
    res
      .status(400)
      .json({
        error: "Não foi possível identificar os detalhes da ocorrência."
      });
    return;
  }
  if (pendingRequests >= MAX_PENDING_REQUESTS) {
    res.set("Retry-After", "1");
    res.status(429).json({
      error:
        "Muitas consultas simultâneas. Aguarde um momento e tente novamente."
    });
    return;
  }

  pendingRequests += 1;
  try {
    const details = await querySswDetails(id, md);
    res.status(200).json({ details });
  } catch (error) {
    const status =
      error.status ||
      (axios.isAxiosError(error) &&
      (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT")
        ? 504
        : 502);
    if (status >= 500)
      console.error("Falha ao carregar detalhes de uma ocorrência do SSW.");
    res.status(status).json({
      error:
        status === 504
          ? "O carregamento dos detalhes excedeu o tempo limite. Tente novamente."
          : error.message ||
            "Não foi possível carregar os detalhes desta ocorrência."
    });
  } finally {
    pendingRequests -= 1;
  }
});

app.post("/api/rastreio", async (req, res) => {
  if (!req.is("application/json")) {
    res.status(415).json({ error: "Envie os dados no formato JSON." });
    return;
  }

  const { documento: rawDocumento, senha: rawSenha } = req.body ?? {};
  const documento =
    typeof rawDocumento === "string" ? rawDocumento.replace(/\D/g, "") : "";
  const senha = typeof rawSenha === "string" ? rawSenha : "";
  const cpfValido = documento.length === 11 && isValidCpf(documento);
  const cnpjValido = documento.length === 14 && isValidCnpj(documento);
  if (!cpfValido && !cnpjValido) {
    res.status(400).json({ error: "Informe um CPF ou CNPJ válido." });
    return;
  }
  if (senha.length > 8) {
    res.status(400).json({ error: "A senha deve ter no máximo 8 caracteres." });
    return;
  }
  if (cnpjValido && !senha) {
    res.status(400).json({ error: "Informe a senha do destinatário." });
    return;
  }
  if (pendingRequests >= MAX_PENDING_REQUESTS) {
    res.set("Retry-After", "1");
    res.status(429).json({
      error:
        "Muitas consultas simultâneas. Aguarde um momento e tente novamente."
    });
    return;
  }

  pendingRequests += 1;
  try {
    const result = await querySsw(documento, senha);
    if (!result || (!result.status_atual && result.ocorrencias.length === 0)) {
      res
        .status(404)
        .json({ error: "Nenhuma carga encontrada para este documento." });
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    const status = error.status || 502;
    if (status >= 500)
      console.error(`Falha na consulta ao SSW: ${error.message}`);
    res
      .status(status)
      .json({ error: error.message || "Falha ao consultar o rastreamento." });
  } finally {
    pendingRequests -= 1;
  }
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const status = error.type === "entity.too.large" ? 413 : 400;
  res.status(status).json({
    error:
      status === 413 ? "Payload muito grande." : "Corpo da requisição inválido."
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint não encontrado." });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`API de rastreamento disponível na porta ${port}.`);
});
