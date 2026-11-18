# Rastreamento SSW

O formulário da página `/rastreamento` envia o CPF/CNPJ e, para CNPJ, a senha digitada para `POST /api/rastreio`. A integração com o SSW acontece no backend, por POST URL-encoded para `https://ssw.inf.br/2/ssw_resultSSW_dest`; a consulta não abre uma aba do SSW no navegador.

O backend valida e limpa o documento, envia os campos `cnpjdest`, `senha` e `urlori=https://c4xpress.com.br/rastreamento`, e processa o HTML retornado com Cheerio. A página C4 Xpress exibe destinatário, remetente, números fiscal/coleta e pedido, unidade, data/hora, situação e detalhes de cada ocorrência em uma tabela responsiva.

Os links “Mais detalhes” do SSW são identificados no HTML e abertos dentro da janela de rastreamento por `POST /api/rastreio/detalhes`, que consulta o endpoint fixo do SSW usando os parâmetros `id` e `md`. O backend extrai o resumo, o histórico detalhado e os links de documentos do HTML do SSW; a interface apresenta esses dados no layout C4 Xpress, sem incorporar a página externa em um `iframe`. Entre os documentos, são exibidos DACTE, XML e “Comprovante de Entrega”, sem o link genérico “Comprovante”.

Execute `npm run dev` para iniciar o backend na porta 3001 e o Vite na porta 3000 juntos. O Vite encaminha `/api/*` para o backend; `npm run api` inicia somente o serviço. Em produção, publique o frontend e execute o serviço Node atrás de um proxy HTTPS no mesmo domínio.

As consultas são espaçadas em 55 ms, com fila máxima de 100 consultas e timeout de 15 segundos.
