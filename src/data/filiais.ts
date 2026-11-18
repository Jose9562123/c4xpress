import type { Filial } from "../types";

export const filiais: Filial[] = [
  {
    id: "maceio",
    cidade: "Maceió",
    uf: "AL",
    tipo: "FILIAL",
    imagem: "/images/filiais/Filial Maceio.png",
    endereco: "Rua João José Pereira Filho, Lote 1129, Quadra 6, Galpão 8/9",
    cep: "57.081-000",
    telefone: "(82) 3512-0512",
    descricao: "Sede administrativa e terminal principal"
  },
  {
    id: "saopaulo",
    cidade: "São Paulo",
    uf: "SP",
    tipo: "FILIAL",
    imagem: "/images/filiais/Filial São Paulo.png",
    endereco:
      "Avenida Pato,969-Cumbica, Lote 10 A 13, Quadra C-3, Bairro: Cidade Industrial Satélite",
    cep: "07.222-010",
    telefone: "(11) 5200-0380",
    descricao: "Hub de operação — Sudeste"
  },
  {
    id: "salvador",
    cidade: "Salvador",
    uf: "BA",
    tipo: "FILIAL",
    imagem: "/images/filiais/Filial Lauro de Freitas.png",
    endereco: "Rua dr Gerino de Souza Filho, 2894 , Bairro: Recreio Ipitanga",
    cep: "42.700-210",
    telefone: "(71) 3838-8522",
    descricao: "Filial Operacional — Região Nordeste"
  },
  {
    id: "aracaju",
    cidade: "Aracaju",
    uf: "SE",
    tipo: "FILIAL",
    imagem: "/images/filiais/Filial Aracaju.png",
    endereco: "Rua osvanda oliveira vieira,138, Bairro: Pereira Lobo",
    cep: "49.050-550",
    telefone: "(79) 3512-0192",
    descricao: "Ponto de Apoio e Distribuição"
  },
  {
    id: "recife",
    cidade: "Abreu e Lima",
    uf: "PE",
    tipo: "MATRIZ",
    imagem: "/images/filiais/Matriz Abreu e Lima.png",
    endereco: "Av governador nilo coelho, Nº 728, Bairro: TIMBO",
    cep: "53.520-810",
    telefone: "(81) 3299-0999",
    descricao: "Terminal de Transbordo"
  },
  {
    id: "caruaru",
    cidade: "Caruaru",
    uf: "PE",
    tipo: "FILIAL",
    imagem: "/images/filiais/Filial Caruaru.png",
    endereco: "Rua araujo lima,416, Bairro: São Francisco",
    cep: "55.008-201",
    telefone: "(81) 3299-0935",
    descricao: "Ponto Estratégico — Interior de Pernambuco"
  }
];
