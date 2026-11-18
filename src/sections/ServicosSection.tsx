import SectionTitle from '../components/SectionTitle'
import CardServico from '../components/CardServico'
import { servicos } from '../data/servicos'

export default function ServicosSection() {
  return (
    <section id="servicos" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionTitle titulo="Nossos Serviços" />

        <div className="grid md:grid-cols-2 gap-8">
          {servicos.map((servico) => (
            <CardServico key={servico.id} servico={servico} />
          ))}
        </div>
      </div>
    </section>
  )
}