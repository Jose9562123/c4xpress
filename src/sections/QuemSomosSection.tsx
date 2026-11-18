import SectionTitle from '../components/SectionTitle'

export default function QuemSomosSection() {
  return (
    <section id="quem-somos" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionTitle titulo="Quem Somos" />

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              A <strong className="text-c4-blue-dark">C4 Xpress</strong> é uma empresa de transporte e logística que busca atuar com agilidade, segurança e excelência. Surgimos para atender as demandas de transporte de cargas e encomendas urgentes em geral, buscando oferecer as melhores soluções para a necessidade dos clientes.
            </p>
            <p>
              Efetuamos o transporte rodoviário de cargas em geral, prestando serviços de <strong>Transporte e Logística Inbound e Outbound</strong>, integrando as operações de coletas e entregas das cargas transportadas, sempre aplicando a logística adequada a cada serviço contratado e disponibilizando aos nossos clientes o serviço de <strong>Diligenciamento de suas cargas</strong>.
            </p>
            <p className="font-semibold text-c4-blue-dark italic">
              Possuímos uma equipe de colaboradores, com profissionais experientes e capacitados assegurando a prestação dos serviços com eficiência, rapidez e segurança.
            </p>
          </div>

          <div className="space-y-6">
            <article className="card flex items-start gap-4 border-l-4 border-c4-red p-5 sm:p-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-50 text-c4-red">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8.5" />
                  <circle cx="12" cy="12" r="4.5" />
                  <path d="M12 12 20.5 3.5M16 3.5h4.5V8" />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-c4-red">MISSÃO</h3>
                <p className="text-sm leading-relaxed text-slate-600">
                Oferecer soluções integradas de transporte, armazenamento e logística, através de uma equipe de profissionais capacitados, com qualidade, segurança e rapidez.
                </p>
              </div>
            </article>
            <article className="card flex items-start gap-4 border-l-4 border-c4-blue-light p-5 sm:p-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-c4-blue-light">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                  <circle cx="12" cy="12" r="2.8" />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-c4-blue-light">VISÃO</h3>
                <p className="text-sm leading-relaxed text-slate-600">
                Ser referência nacional no segmento de transporte, armazenamento e logística de mercadorias, abrangendo todos os estados do nordeste.
                </p>
              </div>
            </article>
            <article className="card flex items-start gap-4 border-l-4 border-c4-blue-dark p-5 sm:p-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-c4-blue-dark">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2.8 20 6v5.3c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3.2Z" />
                  <path d="m8.5 12 2.3 2.3 4.8-4.8" />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-c4-blue-dark">VALORES</h3>
                <p className="text-sm leading-relaxed text-slate-600">
                Ética • Transparência • Humildade • Dedicação • Inovação • Comprometimento • Credibilidade
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}