import SectionTitle from "../components/SectionTitle";
import CardFilial from "../components/CardFilial";
import { filiais } from "../data/filiais";

export default function EstruturaSection() {
  return (
    <section id="estrutura" className="py-20 px-4 bg-slate-100">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          titulo="Nossa Estrutura"
          subtitulo="Possuímos terminais próprios estrategicamente localizados, todos dotados de plataformas e equipados com empilhadeiras semiautomáticas para a melhor movimentação e distribuição das cargas."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filiais.map((filial) => (
            <CardFilial key={filial.id} filial={filial} />
          ))}
        </div>
      </div>
    </section>
  );
}
