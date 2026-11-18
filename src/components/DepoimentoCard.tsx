import type { Depoimento } from '../types'

interface DepoimentoCardProps {
  depoimento: Depoimento
}

export default function DepoimentoCard({ depoimento }: DepoimentoCardProps) {
  return (
    <div className="card">
      <div className="text-yellow-400 mb-3">
        {'★'.repeat(depoimento.nota)}{'☆'.repeat(5 - depoimento.nota)}
      </div>
      <p className="text-slate-600 italic mb-4">"{depoimento.texto}"</p>
      <p className="font-bold text-slate-800">{depoimento.nome}</p>
      <p className="text-sm text-slate-500">{depoimento.empresa}</p>
    </div>
  )
}