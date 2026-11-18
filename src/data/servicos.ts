import type { Servico } from '../types'

export const servicos: Servico[] = [
  {
    id: 'encomendas',
    titulo: 'Transporte de Encomendas',
    descricao: 'Entrega rápida e segura de encomendas urgentes, com acompanhamento em todas as etapas e compromisso com o prazo.',
    icone: '📦',
    imagem: '/images/transporte-encomendas.png'
  },
  {
    id: 'cargas',
    titulo: 'Transporte de Cargas',
    descricao: 'Transporte rodoviário de cargas em geral, com estrutura dedicada, coleta, entrega e diligenciamento ativo.',
    icone: '🚛',
    imagem: '/images/transporte-carga.png'
  }
]