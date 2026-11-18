import { FormEvent, useEffect, useState } from 'react'

type Ocorrencia = {
  numeroFiscalColeta: string
  numeroPedido: string
  data: string
  hora: string
  cidade: string
  descricao: string
  detalhes: string
  remetente: string
  detalhesSsw?: { id: string; md: string } | null
  links?: { label: string; href: string }[] | null
}

type Rastreio = {
  status_atual: string
  remetente: string
  destinatario: string
  ocorrencias: Ocorrencia[]
}

type DetalheOcorrencia = {
  data: string
  hora: string
  unidade: string
  descricao: string
  detalhes: string
}

type DetalhesSsw = {
  remetente: string
  destinatario: string
  numeroFiscalColeta: string
  numeroPedido: string
  previsaoEntrega: string
  ocorrencias: DetalheOcorrencia[]
  links: { label: string; href: string }[]
}

type ApiError = {
  error?: string
}

function isValidCpf(value: string) {
  if (/^(\d)\1{10}$/.test(value)) return false
  const digits = value.split('').map(Number)
  const first = digits.slice(0, 9).reduce((sum, digit, index) => sum + digit * (10 - index), 0)
  const firstDigit = (first * 10) % 11 % 10
  const second = digits.slice(0, 10).reduce((sum, digit, index) => sum + digit * (11 - index), 0)
  const secondDigit = (second * 10) % 11 % 10
  return firstDigit === digits[9] && secondDigit === digits[10]
}

function isValidCnpj(value: string) {
  if (/^(\d)\1{13}$/.test(value)) return false
  const digit = (base: string, weights: number[]) => {
    const sum = base.split('').reduce((total, char, index) => total + Number(char) * weights[index], 0)
    const remainder = sum % 11
    return remainder < 2 ? 0 : 11 - remainder
  }
  const first = digit(value.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const second = digit(value.slice(0, 12) + first, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  return value.endsWith(`${first}${second}`)
}

function SswDetailsView({ details }: { details: DetalhesSsw }) {
  const summary = [
    ['Remetente', details.remetente],
    ['Destinatário', details.destinatario],
    ['Nº Fiscal/Coleta', details.numeroFiscalColeta],
    ['Nº Pedido', details.numeroPedido],
    ['Previsão de entrega', details.previsaoEntrega],
  ]

  return (
    <div className="space-y-5">
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
        {summary.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 font-medium text-slate-800">{value || '—'}</p>
          </div>
        ))}
      </div>

      {details.links.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-bold text-slate-700">Documentos da carga</p>
          <div className="flex flex-wrap gap-3">
            {details.links.map((link) => (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-c4-blue-dark underline transition hover:bg-blue-50"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="mb-3 text-lg font-bold text-c4-blue-dark">Histórico detalhado</h4>
        {details.ocorrencias.length > 0 ? (
          <div className="space-y-3">
            {details.ocorrencias.map((occurrence, index) => (
              <article
                key={`${occurrence.data}-${occurrence.hora}-${occurrence.unidade}-${index}`}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-bold text-c4-blue-dark">
                    {occurrence.data}{occurrence.hora ? ` · ${occurrence.hora}` : ''}
                  </p>
                  <p className="whitespace-pre-line text-sm font-medium text-slate-600">{occurrence.unidade}</p>
                </div>
                <p className="mt-3 font-bold uppercase text-c4-red">{occurrence.descricao}</p>
                {occurrence.detalhes && (
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                    {occurrence.detalhes}
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600">Não há movimentações detalhadas disponíveis.</p>
        )}
      </div>
    </div>
  )
}

function Timeline({
  occurrences,
  onShowDetails,
}: {
  occurrences: Ocorrencia[]
  onShowDetails: (id: string, md: string) => void
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="hidden grid-cols-[1fr_1.2fr_2fr] gap-4 bg-slate-500 px-4 py-3 text-xs font-bold uppercase tracking-wide text-white md:grid">
        <span>N Fiscal/Coleta · N Pedido</span>
        <span>Unidade · Data/hora</span>
        <span>Situação</span>
      </div>
      {occurrences.map((occurrence, index) => (
        <article
          key={`${occurrence.numeroFiscalColeta}-${occurrence.numeroPedido}-${occurrence.data}-${occurrence.hora}-${index}`}
          className="border-t border-slate-200 first:border-t-0 even:bg-slate-50"
        >
          {occurrence.remetente && (
            <p className="border-b border-slate-100 bg-slate-100 px-4 py-2 text-xs text-slate-600">
              <span className="font-semibold">Remetente:</span>{' '}
              <span className="font-medium text-c4-blue-dark">{occurrence.remetente}</span>
            </p>
          )}
          <div className="grid gap-4 px-4 py-4 md:grid-cols-[1fr_1.2fr_2fr]">
            <div className="grid grid-cols-2 gap-3 md:block">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 md:hidden">N Fiscal/Coleta</p>
                <p className="mt-1 font-semibold text-c4-blue-dark md:mt-0">{occurrence.numeroFiscalColeta || '—'}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 md:hidden">N Pedido</p>
                <p className="mt-1 font-semibold text-c4-blue-dark md:mt-2">{occurrence.numeroPedido || '—'}</p>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 md:hidden">Unidade · Data/hora</p>
              <p className="mt-1 font-medium text-slate-800 md:mt-0">{occurrence.cidade || 'Local não informado'}</p>
              <p className="mt-1 text-sm text-slate-500">{occurrence.data}{occurrence.hora ? ` ${occurrence.hora}` : ''}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 md:hidden">Situação</p>
              <p className="mt-1 font-bold uppercase text-c4-red md:mt-0">{occurrence.descricao}</p>
              {occurrence.detalhes && (
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-700">{occurrence.detalhes}</p>
              )}
              {(occurrence.detalhesSsw || (occurrence.links?.length ?? 0) > 0) && (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
                  {occurrence.detalhesSsw && (
                    <button
                      type="button"
                      onClick={() => {
                        const details = occurrence.detalhesSsw
                        if (details) onShowDetails(details.id, details.md)
                      }}
                      className="text-c4-blue-dark underline"
                    >
                      Mais detalhes
                    </button>
                  )}
                  {occurrence.links?.map((link) => (
                    <a
                      key={`${link.label}-${link.href}`}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-c4-blue-dark underline"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export default function RastreamentoSection() {
  const [documento, setDocumento] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [resultado, setResultado] = useState<Rastreio | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [detalheSelecionado, setDetalheSelecionado] = useState<DetalhesSsw | null>(null)
  const [erroDetalhes, setErroDetalhes] = useState('')
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false)

  useEffect(() => {
    if (!resultado) return

    function fecharComEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setResultado(null)
    }

    window.addEventListener('keydown', fecharComEscape)
    return () => window.removeEventListener('keydown', fecharComEscape)
  }, [resultado])

  async function consultar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')
    setResultado(null)
    setDetalheSelecionado(null)
    setErroDetalhes('')

    const digits = documento.replace(/\D/g, '')
    const valid = digits.length === 11 ? isValidCpf(digits) : digits.length === 14 && isValidCnpj(digits)
    if (!valid) {
      setErro('Confira o CPF ou CNPJ informado e tente novamente.')
      return
    }
    if (digits.length === 14 && !senha) {
      setErro('Informe a senha do destinatário para consultar o CNPJ.')
      return
    }

    setCarregando(true)
    try {
      const response = await fetch('/api/rastreio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documento: digits, senha: digits.length === 14 ? senha : '' }),
      })
      const body = await response.json() as Rastreio | ApiError
      if (!response.ok) {
        setErro((body as ApiError).error || 'Não foi possível consultar o rastreamento agora.')
        return
      }
      setResultado(body as Rastreio)
    } catch {
      setErro('Não foi possível conectar ao serviço de rastreamento. Tente novamente em instantes.')
    } finally {
      setCarregando(false)
    }
  }

  async function consultarDetalhes(id: string, md: string) {
    setDetalheSelecionado(null)
    setErroDetalhes('')
    setCarregandoDetalhes(true)
    try {
      const response = await fetch('/api/rastreio/detalhes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, md }),
      })
      const body = await response.json() as { details?: DetalhesSsw } & ApiError
      if (!response.ok) {
        setErroDetalhes(body.error || 'Não foi possível carregar os detalhes desta ocorrência.')
        return
      }
      if (!body.details || !Array.isArray(body.details.ocorrencias)) {
        setErroDetalhes('O SSW retornou detalhes em um formato inesperado.')
        return
      }
      setDetalheSelecionado(body.details)
    } catch {
      setErroDetalhes('Não foi possível conectar ao serviço de detalhes do SSW.')
    } finally {
      setCarregandoDetalhes(false)
    }
  }

  function atualizarDocumento(value: string) {
    setDocumento(value.replace(/\D/g, '').slice(0, 14))
    setErro('')
    setResultado(null)
    setDetalheSelecionado(null)
    setErroDetalhes('')
  }

  return (
    <section id="rastreamento" className="scroll-mt-24 bg-white px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div className="order-2 overflow-hidden rounded-3xl shadow-xl lg:order-1">
          <img
            src="/images/truck-logistics.jpg"
            alt="Caminhão de carga em operação"
            className="h-72 w-full object-cover sm:h-96"
            loading="lazy"
          />
        </div>

        <div className="order-1 lg:order-2">
          <span className="mb-3 block text-sm font-bold uppercase tracking-[0.18em] text-c4-red">
            Acompanhamento de cargas
          </span>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-c4-blue-dark sm:text-4xl">
            Saiba onde está sua carga
          </h2>
          <p className="mb-8 max-w-xl leading-relaxed text-slate-600">
            Consulte as movimentações mais recentes da sua entrega com o CPF ou CNPJ do destinatário.
          </p>

          <form className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-6" onSubmit={consultar}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="documento-rastreio" className="mb-2 block text-sm font-semibold text-slate-800">
                  CPF ou CNPJ do destinatário
                </label>
                <input
                  id="documento-rastreio"
                  name="documento"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  required
                  maxLength={14}
                  value={documento}
                  onChange={(event) => atualizarDocumento(event.target.value)}
                  placeholder="Digite os números do CPF ou CNPJ"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-c4-blue-light focus:ring-2 focus:ring-c4-blue-light/20"
                  aria-describedby="documento-ajuda"
                />
                <p id="documento-ajuda" className="mt-1 text-xs text-slate-500">O documento será enviado somente com números.</p>
              </div>
              {documento.length > 11 && (
                <div className="sm:col-span-2">
                  <label htmlFor="senha-rastreio" className="mb-2 block text-sm font-semibold text-slate-800">
                    Senha do destinatário <span className="font-normal text-slate-500">(se solicitada)</span>
                  </label>
                  <input
                    id="senha-rastreio"
                    name="senha"
                    type="password"
                    autoComplete="current-password"
                    maxLength={8}
                    value={senha}
                    onChange={(event) => {
                      setSenha(event.target.value)
                      setErro('')
                    }}
                    required
                    placeholder="Senha informada para consulta no SSW"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-c4-blue-light focus:ring-2 focus:ring-c4-blue-light/20"
                  />
                </div>
              )}
              <button type="submit" disabled={carregando} className="btn-secondary flex min-h-12 items-center justify-center gap-3 disabled:cursor-not-allowed disabled:opacity-70 sm:col-span-2">
                {carregando ? 'Buscando atualizações...' : 'Rastrear minha carga'}
              </button>
            </div>
          </form>

          {erro && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
              {erro}
            </div>
          )}

          <p className="mt-4 text-sm text-slate-500">
            Precisa de ajuda? <a className="font-semibold text-c4-blue-dark underline" href="/#contato">Fale com nossa equipe</a>.
          </p>
        </div>
      </div>

      {resultado && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 sm:p-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) setResultado(null)
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="resultado-rastreio-titulo"
            aria-live="polite"
            className="max-h-[90dvh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 bg-c4-blue-dark px-5 py-5 text-white sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">Destinatário</p>
                <p className="mt-1 font-semibold">{resultado.destinatario || documento}</p>
                <h3 id="resultado-rastreio-titulo" className="mt-1 text-xl font-extrabold">
                  {detalheSelecionado ? 'Detalhes da ocorrência' : resultado.status_atual}
                </h3>
                {!detalheSelecionado && (
                  <p className="mt-2 text-sm text-blue-100">
                    {resultado.ocorrencias.length} {resultado.ocorrencias.length === 1 ? 'registro encontrado' : 'registros encontrados'}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setResultado(null)}
                aria-label="Fechar resultado do rastreamento"
                className="shrink-0 rounded-lg px-3 py-1 text-2xl leading-none text-white transition hover:bg-white/10 focus-visible:outline-white"
              >
                ×
              </button>
            </div>
            <div className="p-4 sm:p-6">
              {detalheSelecionado ? (
                <>
                  <button
                    type="button"
                    onClick={() => setDetalheSelecionado(null)}
                    className="mb-4 text-sm font-semibold text-c4-blue-dark underline"
                  >
                    ← Voltar às ocorrências
                  </button>
                  <SswDetailsView details={detalheSelecionado} />
                </>
              ) : carregandoDetalhes ? (
                <p className="py-12 text-center text-sm text-slate-600" role="status">
                  Carregando detalhes da ocorrência...
                </p>
              ) : (
                <>
                  {erroDetalhes && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                      {erroDetalhes}
                    </div>
                  )}
                  {resultado.ocorrencias.length ? (
                    <Timeline occurrences={resultado.ocorrencias} onShowDetails={consultarDetalhes} />
                  ) : (
                    <p className="text-sm text-slate-600">Ainda não há movimentações disponíveis para esta carga.</p>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </section>
  )
}
