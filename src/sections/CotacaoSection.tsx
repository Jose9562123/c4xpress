import { useState } from 'react'
import SectionTitle from '../components/SectionTitle'

export default function CotacaoSection() {
  const [status, setStatus] = useState('')

  return (
    <section id="cotacao" className="py-20 px-4 bg-slate-100">
      <div className="max-w-2xl mx-auto">
        <SectionTitle
          titulo="Solicite sua Cotação"
          subtitulo="Preencha os dados para validar sua solicitação"
        />

        <form
          className="space-y-4 bg-white p-8 rounded-xl shadow-sm"
          onSubmit={(event) => {
            event.preventDefault()
            setStatus('Dados validados neste navegador, mas ainda não enviados. Entre em contato por telefone ou e-mail para solicitar sua cotação.')
          }}
        >
          <div>
            <label htmlFor="cotacao-nome" className="block text-sm font-medium text-slate-700 mb-1">Nome completo</label>
            <input
              id="cotacao-nome"
              name="nome"
              type="text"
              autoComplete="name"
              required
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-c4-blue-light"
            />
          </div>
          <div>
            <label htmlFor="cotacao-telefone" className="block text-sm font-medium text-slate-700 mb-1">Telefone com WhatsApp</label>
            <input
              id="cotacao-telefone"
              name="telefone"
              type="tel"
              autoComplete="tel"
              required
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-c4-blue-light"
            />
          </div>
          <div>
            <label htmlFor="cotacao-email" className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
            <input
              id="cotacao-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-c4-blue-light"
            />
          </div>
          <div>
            <label htmlFor="cotacao-servico" className="block text-sm font-medium text-slate-700 mb-1">Tipo de serviço</label>
            <select
              id="cotacao-servico"
              name="servico"
              required
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-c4-blue-light text-slate-600"
            >
              <option value="">Selecione o tipo de serviço</option>
              <option value="encomendas">Transporte de Encomendas</option>
              <option value="cargas">Transporte de Cargas</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div>
            <label htmlFor="cotacao-detalhes" className="block text-sm font-medium text-slate-700 mb-1">
              Detalhes da solicitação
            </label>
            <textarea
              id="cotacao-detalhes"
              name="detalhes"
              rows={4}
              required
              placeholder="Descreva o que precisa transportar — tipo de mercadoria, origem e destino"
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-c4-blue-light"
            ></textarea>
          </div>
          <button type="submit" className="btn-primary w-full">
            Validar dados
          </button>
          {status && <p className="text-sm text-slate-600" role="status">{status}</p>}
        </form>
      </div>
    </section>
  )
}