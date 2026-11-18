import SectionTitle from '../components/SectionTitle'

export default function ContatoSection() {
  return (
    <section id="contato" className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <SectionTitle titulo="Contato" />

        <div className="space-y-4 text-slate-700">
          <p className="font-bold text-lg text-c4-blue-dark">Matriz — Maceió/AL</p>
          <p>Rua João José Pereira Filho, Lote 1129, Quadra 6, Galpão 8/9</p>
          <p>CEP: 57.081-000</p>
          <div className="mt-6 space-y-2">
            <p className="font-bold text-lg">📞 (82) 3512-0512</p>
            <p className="font-bold text-lg">📞 Filial SP: (11) 5200-0380</p>
          </div>
          <p className="mt-4 text-slate-500">contato@c4xpress.com.br</p>
        </div>
      </div>
    </section>
  )
}