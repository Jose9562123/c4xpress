import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSswColetaEnvelope,
  parseSswColetaResponse
} from "./sswColeta.js";

const sampleData = {
  cnpjRemetente: "11222333000181",
  cnpjDestinatario: "99888777000166",
  numeroNF: "",
  tipoPagamento: "O",
  enderecoEntrega: "Rua A & B, 10",
  cepEntrega: "57000000",
  solicitante: "Pessoa Teste",
  limiteColeta: "2026-12-01T10:30:00",
  quantidade: "2",
  peso: "12.5",
  observacao: "",
  instrucao: "",
  cubagem: "0",
  valorMerc: "100",
  especie: "",
  chaveNF: "",
  nroPedido: "",
  mercadoria: "Caixas",
  cepEndColeta: "57000001",
  logradouroEndColeta: "Rua A",
  numeroEndColeta: "10",
  complementoEndColeta: "",
  bairroEndColeta: "Centro",
  nomeRemetente: "Empresa Teste",
  reversa: "N"
};

const sampleCredentials = {
  domain: "c4t",
  username: "test-user",
  password: "test-password",
  cnpjSolicitante: "11222333000181"
};

test("builds the SSW SOAP request with escaped data and server credentials", () => {
  const envelope = buildSswColetaEnvelope(sampleData, sampleCredentials);

  assert.match(envelope, /<dominio xsi:type="xsd:string">c4t<\/dominio>/);
  assert.match(envelope, /<senha xsi:type="xsd:string">test-password<\/senha>/);
  assert.match(envelope, /Rua A &amp; B, 10/);
  assert.match(envelope, /<cepEntrega xsi:type="xsd:integer">57000000<\/cepEntrega>/);
});

test("reads namespaced collection responses", () => {
  const result = parseSswColetaResponse(`
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <ns:coletarResponse xmlns:ns="urn:sswinfbr.sswColeta">
          <return>
            <erro>0</erro>
            <mensagem>Coleta registrada</mensagem>
            <numeroColeta>12345</numeroColeta>
          </return>
        </ns:coletarResponse>
      </soap:Body>
    </soap:Envelope>
  `);

  assert.deepEqual(result, {
    erro: 0,
    mensagem: "Coleta registrada",
    numeroColeta: "12345"
  });
});

test("rejects malformed or fault SOAP responses", () => {
  assert.throws(() => parseSswColetaResponse("<html>error</html>"), /resposta inválida/i);
  assert.throws(
    () =>
      parseSswColetaResponse(`
        <soap:Fault xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <faultstring>invalid credentials</faultstring>
        </soap:Fault>
      `),
    /não aceitou/i
  );
});
