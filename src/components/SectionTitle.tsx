interface SectionTitleProps {
  titulo: string
  subtitulo?: string
}

export default function SectionTitle({ titulo, subtitulo }: SectionTitleProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="section-title">{titulo}</h2>
      {subtitulo && <p className="text-slate-500 max-w-2xl mx-auto">{subtitulo}</p>}
      <div className="w-20 h-1 bg-c4-red mx-auto rounded mt-4"></div>
    </div>
  )
}