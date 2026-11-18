import type { Filial } from '../types'

interface FilialDetalhesProps {
  filial: Filial
}

export default function FilialDetalhes({ filial }: FilialDetalhesProps) {
  const localizacao = [
    filial.endereco,
    filial.cep,
    filial.cidade,
    filial.uf,
    'Brasil',
  ]
    .filter(Boolean)
    .join(', ')
  const mapaUrl = `https://www.google.com/maps?q=${encodeURIComponent(localizacao)}&output=embed`
  const mapaLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(localizacao)}`

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="mb-6 inline-block font-semibold text-c4-blue-dark hover:text-c4-red">
          ← Voltar ao site
        </a>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-64 bg-slate-200 sm:min-h-80">
              <img
                src={filial.imagem}
                alt={`Unidade C4Xpress em ${filial.cidade}, ${filial.uf}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div className="p-6 sm:p-8">
              <span className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold ${corTipo[filial.tipo]}`}>
                {filial.tipo}
              </span>
              <h1 className="mb-3 text-3xl font-extrabold text-c4-blue-dark">
                {filial.cidade} / {filial.uf}
              </h1>
              {filial.descricao && <p className="mb-6 text-slate-600">{filial.descricao}</p>}

              <h2 className="mb-2 font-bold text-slate-800">Endereço</h2>
              <p className="mb-1 text-sm text-slate-600">
                {filial.endereco ?? 'Endereço completo não informado.'}
              </p>
              {filial.cep && <p className="mb-5 text-sm text-slate-600">CEP: {filial.cep}</p>}

              <h2 className="mb-2 font-bold text-slate-800">Contato</h2>
              {filial.telefone === '--' ? (
                <p className="text-sm text-slate-600">Telefone não informado.</p>
              ) : (
                <a href={`tel:${filial.telefone.replace(/\D/g, '')}`} className="text-sm font-semibold text-c4-blue-dark hover:text-c4-red">
                  {filial.telefone}
                </a>
              )}
            </div>
          </div>

          <div className="border-t border-slate-200 p-4 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-c4-blue-dark">Localização</h2>
              <a
                href={mapaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-c4-red hover:underline"
              >
                Abrir no Google Maps
              </a>
            </div>
            <iframe
              title={`Mapa da unidade ${filial.cidade}, ${filial.uf}`}
              src={mapaUrl}
              className="h-72 w-full rounded-xl border-0 sm:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {!filial.endereco && (
              <p className="mt-2 text-xs text-slate-500">
                O mapa indica a cidade da filial. O endereço exato ainda não foi informado.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

const corTipo = {
  MATRIZ: 'bg-c4-red text-white',
  FILIAL: 'bg-c4-blue-dark text-white',
}
