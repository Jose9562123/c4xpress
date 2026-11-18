export interface Filial {
  id: string
  cidade: string
  uf: string
  tipo: 'MATRIZ' | 'FILIAL'
  imagem: string
  endereco?: string
  cep?: string
  telefone: string
  descricao?: string
}

export interface Servico {
  id: string
  titulo: string
  descricao: string
  icone: string
  imagem: string
}

export interface Post {
  id: string
  titulo: string
  resumo: string
  conteudo: string[]
}

export interface Depoimento {
  id: string
  nome: string
  empresa: string
  texto: string
  nota: number
}