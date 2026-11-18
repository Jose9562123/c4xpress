import type { Filial } from '../types'

interface CardFilialProps {
  filial: Filial
}

const corTipo = {
  MATRIZ: 'bg-c4-red text-white',
  FILIAL: 'bg-c4-blue-dark text-white'
}

const bordaTipo = {
  MATRIZ: 'border-t-c4-red',
  FILIAL: 'border-t-c4-blue-dark'
}

export default function CardFilial({ filial }: CardFilialProps) {
  return (
    <a
      href={`?filial=${encodeURIComponent(filial.id)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ver localização e detalhes da unidade ${filial.cidade}, ${filial.uf}`}
      className={`card group block border-t-4 transition-colors duration-200 hover:border-c4-red hover:bg-red-50/50 focus-visible:border-c4-red ${bordaTipo[filial.tipo]}`}
    >
      <div className="-mx-6 -mt-6 mb-5 h-44 overflow-hidden rounded-t-xl">
        <img
          src={filial.imagem}
          alt={`Unidade C4Xpress em ${filial.cidade}, ${filial.uf}`}
          className="block h-full w-full object-cover object-center"
          loading="lazy"
        />
      </div>
      <h3 className="font-bold text-lg text-slate-800 mb-2">
        {filial.cidade} / {filial.uf}
      </h3>
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold mb-3 ${corTipo[filial.tipo]}`}>
        {filial.tipo}
      </span>
      {filial.endereco && (
        <p className="text-sm text-slate-600 mb-1">{filial.endereco}</p>
      )}
      {filial.cep && (
        <p className="text-sm text-slate-500 mb-2">CEP: {filial.cep}</p>
      )}
      {filial.descricao && (
        <p className="text-sm text-slate-500 mb-2">{filial.descricao}</p>
      )}
      <p className="text-sm font-bold text-slate-800">
        {filial.telefone === '--' ? 'Telefone não informado' : `📞 ${filial.telefone}`}
      </p>
      <span className="mt-4 inline-block text-sm font-semibold text-c4-blue-dark transition-colors group-hover:text-c4-red">
        Ver localização e detalhes →
      </span>
    </a>
  )
}