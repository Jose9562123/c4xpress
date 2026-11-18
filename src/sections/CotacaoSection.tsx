import { useState, type FormEvent, type InputHTMLAttributes } from 'react'
import SectionTitle from '../components/SectionTitle'

const sswCollectionUrl = 'https://ssw.inf.br/2/coleta?sigla_emp=C4T'
const inputClass =
  'mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:border-c4-blue-light focus:outline-none focus:ring-2 focus:ring-c4-blue-light/20'

type FieldProps = {
  id: string
  label: string
  wrapperClassName?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'name'>

function Field({ id, label, wrapperClassName = '', ...inputProps }: FieldProps) {
  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input id={id} name={id} className={inputClass} {...inputProps} />
    </div>
  )
}

type TextareaProps = {
  id: string
  label: string
  rows?: number
  maxLength?: number
}

function Textarea({ id, label, rows = 3, maxLength }: TextareaProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        rows={rows}
        maxLength={maxLength}
        className={inputClass}
      />
    </div>
  )
}

function getField(formData: FormData, name: string) {
  return String(formData.get(name) ?? '').trim()
}

function getApiMessage(value: unknown, key: string) {
  if (typeof value === 'object' && value !== null && key in value) {
    const message = Reflect.get(value, key)
    if (typeof message === 'string') return message
  }
  return ''
}

export default function CotacaoSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState<{ message: string; number: string } | null>(null)

  async function submitColeta(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setSuccess(null)

    const formData = new FormData(event.currentTarget)
    const payload = {
      cnpjRemetente: getField(formData, 'cnpjRemetente'),
      cnpjDestinatario: getField(formData, 'cnpjDestinatario'),
      numeroNF: getField(formData, 'numeroNF'),
      tipoPagamento: getField(formData, 'tipoPagamento'),
      enderecoEntrega: getField(formData, 'enderecoEntrega'),
      cepEntrega: getField(formData, 'cepEntrega'),
      solicitante: getField(formData, 'solicitante'),
      limiteColeta: getField(formData, 'limiteColeta'),
      quantidade: getField(formData, 'quantidade'),
      peso: getField(formData, 'peso'),
      observacao: getField(formData, 'observacao'),
      instrucao: getField(formData, 'instrucao'),
      cubagem: getField(formData, 'cubagem'),
      valorMerc: getField(formData, 'valorMerc'),
      especie: getField(formData, 'especie'),
      chaveNF: getField(formData, 'chaveNF'),
      nroPedido: getField(formData, 'nroPedido'),
      mercadoria: getField(formData, 'mercadoria'),
      cepEndColeta: getField(formData, 'cepEndColeta'),
      logradouroEndColeta: getField(formData, 'logradouroEndColeta'),
      numeroEndColeta: getField(formData, 'numeroEndColeta'),
      complementoEndColeta: getField(formData, 'complementoEndColeta'),
      bairroEndColeta: getField(formData, 'bairroEndColeta'),
      nomeRemetente: getField(formData, 'nomeRemetente'),
      reversa: formData.get('reversa') === 'S' ? 'S' : 'N',
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/coleta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result: unknown = await response.json()

      if (!response.ok) {
        throw new Error(
          getApiMessage(result, 'error') ||
            'Não foi possível registrar a coleta. Confira os dados e tente novamente.',
        )
      }

      setSuccess({
        message:
          getApiMessage(result, 'message') ||
          'Solicitação enviada ao SSW com sucesso.',
        number: getApiMessage(result, 'numeroColeta'),
      })
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível registrar a coleta. Tente novamente.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="cotacao" className="bg-slate-100 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionTitle
          titulo="Solicitação de coleta"
          subtitulo="Preencha os dados da carga e envie sua solicitação diretamente para a C4 Xpress pelo SSW."
        />

        <form
          onSubmit={submitColeta}
          className="space-y-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-8 lg:p-10"
        >
          <section aria-labelledby="coleta-origem-heading">
            <div className="mb-5 border-b border-slate-100 pb-3">
              <h3 id="coleta-origem-heading" className="text-xl font-extrabold text-c4-blue-dark">
                Solicitante e origem
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Informe quem solicita a coleta e o endereço de retirada.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="cnpjRemetente"
                label="CNPJ do remetente"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="00.000.000/0000-00"
                maxLength={18}
                required
              />
              <Field
                id="nomeRemetente"
                label="Nome do remetente"
                type="text"
                autoComplete="organization"
                maxLength={120}
                required
              />
              <Field
                id="solicitante"
                label="Nome do solicitante"
                type="text"
                autoComplete="name"
                maxLength={100}
                required
              />
              <Field
                id="cepEndColeta"
                label="CEP da coleta"
                type="text"
                inputMode="numeric"
                placeholder="00000-000"
                maxLength={9}
                required
              />
              <Field
                id="logradouroEndColeta"
                label="Endereço da coleta"
                type="text"
                autoComplete="street-address"
                maxLength={150}
                required
                wrapperClassName="sm:col-span-2"
              />
              <Field
                id="numeroEndColeta"
                label="Número"
                type="text"
                maxLength={20}
                required
              />
              <Field
                id="complementoEndColeta"
                label="Complemento"
                type="text"
                maxLength={100}
              />
              <Field
                id="bairroEndColeta"
                label="Bairro da coleta"
                type="text"
                autoComplete="address-level3"
                maxLength={100}
                required
                wrapperClassName="sm:col-span-2"
              />
            </div>
          </section>

          <section aria-labelledby="coleta-destino-heading">
            <div className="mb-5 border-b border-slate-100 pb-3">
              <h3 id="coleta-destino-heading" className="text-xl font-extrabold text-c4-blue-dark">
                Entrega e destinatário
              </h3>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="cnpjDestinatario"
                label="CNPJ do destinatário"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="00.000.000/0000-00"
                maxLength={18}
                required
              />
              <Field
                id="cepEntrega"
                label="CEP de entrega"
                type="text"
                inputMode="numeric"
                placeholder="00000-000"
                maxLength={9}
                required
              />
              <Field
                id="enderecoEntrega"
                label="Endereço completo para entrega"
                type="text"
                autoComplete="street-address"
                maxLength={500}
                required
                wrapperClassName="sm:col-span-2"
              />
              <fieldset className="sm:col-span-2">
                <legend className="text-sm font-semibold text-slate-700">
                  Frete pago
                </legend>
                <div className="mt-2 flex flex-wrap gap-3">
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 has-[:checked]:border-c4-blue-light has-[:checked]:bg-blue-50">
                    <input
                      type="radio"
                      name="tipoPagamento"
                      value="O"
                      required
                      className="accent-c4-blue-dark"
                    />
                    Na origem
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 has-[:checked]:border-c4-blue-light has-[:checked]:bg-blue-50">
                    <input
                      type="radio"
                      name="tipoPagamento"
                      value="D"
                      required
                      className="accent-c4-blue-dark"
                    />
                    No destino
                  </label>
                </div>
              </fieldset>
            </div>
          </section>

          <section aria-labelledby="coleta-carga-heading">
            <div className="mb-5 border-b border-slate-100 pb-3">
              <h3 id="coleta-carga-heading" className="text-xl font-extrabold text-c4-blue-dark">
                Dados da carga e agendamento
              </h3>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Field
                id="limiteColeta"
                label="Data e horário limite da coleta"
                type="datetime-local"
                required
                wrapperClassName="sm:col-span-2 lg:col-span-3"
              />
              <Field
                id="numeroNF"
                label="Número da nota fiscal"
                type="text"
                maxLength={40}
              />
              <Field
                id="chaveNF"
                label="Chave da nota fiscal"
                type="text"
                inputMode="numeric"
                maxLength={44}
              />
              <Field
                id="nroPedido"
                label="Número do pedido"
                type="text"
                maxLength={60}
              />
              <Field
                id="mercadoria"
                label="Descrição da mercadoria"
                type="text"
                maxLength={120}
                required
              />
              <Field
                id="quantidade"
                label="Quantidade de volumes"
                type="number"
                min="1"
                max="999999"
                step="1"
                required
              />
              <Field
                id="peso"
                label="Peso total (kg)"
                type="number"
                min="0.001"
                max="1000000000"
                step="0.001"
                required
              />
              <Field
                id="cubagem"
                label="Cubagem (m³)"
                type="number"
                min="0"
                max="1000000000"
                step="0.001"
              />
              <Field
                id="valorMerc"
                label="Valor da mercadoria (R$)"
                type="number"
                min="0"
                max="1000000000"
                step="0.01"
              />
              <Field
                id="especie"
                label="Espécie"
                type="text"
                maxLength={60}
              />
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 sm:col-span-2 lg:col-span-3">
                <input
                  type="checkbox"
                  name="reversa"
                  value="S"
                  className="h-4 w-4 rounded accent-c4-blue-dark"
                />
                Esta solicitação é uma coleta reversa
              </label>
            </div>
          </section>

          <section aria-labelledby="coleta-instrucoes-heading">
            <div className="mb-5 border-b border-slate-100 pb-3">
              <h3 id="coleta-instrucoes-heading" className="text-xl font-extrabold text-c4-blue-dark">
                Observações e instruções
              </h3>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Textarea id="observacao" label="Observações sobre a coleta" maxLength={1000} />
              <Textarea id="instrucao" label="Instruções para entrega" maxLength={1000} />
            </div>
          </section>

          <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
            <input
              type="checkbox"
              name="confirmacao"
              required
              className="mt-1 h-4 w-4 shrink-0 rounded accent-c4-blue-dark"
            />
            <span>
              Confirmo que os dados estão corretos e autorizo o envio desta
              solicitação de coleta para a C4 Xpress.
            </span>
          </label>

          {errorMessage && (
            <p
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
              role="alert"
            >
              {errorMessage}
            </p>
          )}
          {success && (
            <div
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
              role="status"
            >
              <p className="font-bold">{success.message}</p>
              {success.number && (
                <p className="mt-1">Número da coleta: {success.number}</p>
              )}
            </div>
          )}

          <div className="flex flex-col items-center gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
            <a
              href={sswCollectionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-sm font-semibold text-c4-blue-dark underline decoration-c4-blue-light underline-offset-4 hover:text-c4-red"
            >
              Abrir formulário de coleta do SSW
            </a>
            <button type="submit" className="btn-primary w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando solicitação...' : 'Solicitar coleta'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
