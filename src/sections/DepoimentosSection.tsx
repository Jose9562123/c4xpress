import SectionTitle from '../components/SectionTitle'

export default function DepoimentosSection() {
  return (
    <section className="py-20 px-4 bg-slate-100">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          titulo="Depoimentos"
          subtitulo="O que dizem nossos parceiros"
        />

        <div className="card p-8 text-center text-slate-500">
          <p className="mb-4">
            Quer conhecer nossas soluções de transporte e logística? Fale com nossa equipe.
          </p>
        </div>
      </div>
    </section>
  )
}