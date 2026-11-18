import type { Servico } from '../types'

interface CardServicoProps {
  servico: Servico
}

export default function CardServico({ servico }: CardServicoProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="aspect-[16/8] overflow-hidden bg-slate-100">
        <img
          src={servico.imagem}
          alt={`${servico.titulo} C4 Xpress`}
          className="h-full w-full object-cover object-center"
          loading="lazy"
        />
      </div>
      <div className="p-6 sm:p-8">
        <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-xl" aria-hidden="true">
          {servico.icone}
        </span>
        <h3 className="mb-3 text-xl font-bold text-c4-blue-dark">{servico.titulo}</h3>
        <p className="text-slate-600">{servico.descricao}</p>
      </div>
    </article>
  )
}