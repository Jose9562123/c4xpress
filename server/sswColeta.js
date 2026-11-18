import axios from "axios";
import { load } from "cheerio";

export const SSW_COLETA_URL = "https://ssw.inf.br/ws/sswColeta/index.php";

const requestFields = [
  ["dominio", "string"],
  ["login", "string"],
  ["senha", "string"],
  ["cnpjRemetente", "string"],
  ["cnpjDestinatario", "string"],
  ["numeroNF", "string"],
  ["tipoPagamento", "string"],
  ["enderecoEntrega", "string"],
  ["cepEntrega", "integer"],
  ["solicitante", "string"],
  ["limiteColeta", "dateTime"],
  ["quantidade", "integer"],
  ["peso", "decimal"],
  ["observacao", "string"],
  ["instrucao", "string"],
  ["cubagem", "decimal"],
  ["valorMerc", "decimal"],
  ["especie", "string"],
  ["chaveNF", "string"],
  ["cnpjSolicitante", "string"],
  ["nroPedido", "string"],
  ["mercadoria", "string"],
  ["cepEndColeta", "integer"],
  ["logradouroEndColeta", "string"],
  ["numeroEndColeta", "string"],
  ["complementoEndColeta", "string"],
  ["bairroEndColeta", "string"],
  ["nomeRemetente", "string"],
  ["reversa", "string"]
];

function escapeXml(value) {
  const text = String(value ?? "");
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text)) {
    throw new Error("O conteúdo contém caracteres inválidos para o SSW.");
  }
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildSswColetaEnvelope(data, credentials) {
  const values = {
    dominio: credentials.domain,
    login: credentials.username,
    senha: credentials.password,
    ...data,
    cnpjSolicitante: credentials.cnpjSolicitante
  };
  const parameters = requestFields
    .map(
      ([name, type]) =>
        `<${name} xsi:type="xsd:${type}">${escapeXml(values[name])}</${name}>`
    )
    .join("");

  return (
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
    'xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" ' +
    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
    'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
    'xmlns:tns="urn:sswinfbr.sswColeta">' +
    "<soapenv:Body>" +
    '<tns:coletar soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">' +
    parameters +
    "</tns:coletar>" +
    "</soapenv:Body>" +
    "</soapenv:Envelope>"
  );
}

export function parseSswColetaResponse(xml) {
  const $ = load(xml, { xmlMode: true });
  const values = new Map();
  const wantedNames = new Set(["erro", "mensagem", "numeroColeta", "faultstring"]);

  $("*").each((_, element) => {
    const tagName = (element.name || element.tagName || "").split(":").pop();
    if (wantedNames.has(tagName) && !values.has(tagName)) {
      values.set(tagName, $(element).text().trim());
    }
  });

  const fault = values.get("faultstring");
  if (fault) {
    throw new Error("O SSW não aceitou a solicitação de coleta.");
  }

  const rawErrorCode = values.get("erro");
  if (rawErrorCode === undefined || !/^-?\d+$/.test(rawErrorCode)) {
    throw new Error("O SSW retornou uma resposta inválida para a coleta.");
  }

  return {
    erro: Number(rawErrorCode),
    mensagem: values.get("mensagem") || "",
    numeroColeta: values.get("numeroColeta") || ""
  };
}

export async function solicitarColetaSsw(data, credentials) {
  const envelope = buildSswColetaEnvelope(data, credentials);
  const response = await axios.post(SSW_COLETA_URL, envelope, {
    headers: {
      Accept: "text/xml",
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: '"urn:sswinfbr.sswColeta#coletar"'
    },
    timeout: 20000,
    maxContentLength: 1024 * 1024,
    maxBodyLength: 64 * 1024,
    responseType: "text"
  });

  return parseSswColetaResponse(
    typeof response.data === "string" ? response.data : ""
  );
}
