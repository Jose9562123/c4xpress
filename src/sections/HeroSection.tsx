export default function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative isolate min-h-[620px] overflow-hidden bg-c4-blue-dark text-white"
    >
      <img
        src="/images/truck-highway.jpg"
        alt="Caminhão de carga em uma rodovia"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/20" />

      <div className="mx-auto flex min-h-[620px] max-w-7xl items-center px-5 py-20 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-c4-red" />
            Logística que move o seu negócio
          </span>
          <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            Experiência em <span className="text-red-400">transportar com excelência!</span>
          </h1>
          <p className="mb-9 max-w-2xl text-lg leading-relaxed text-slate-200 sm:text-xl">
            Transporte rodoviário de cargas e encomendas com agilidade,
            segurança e atendimento próximo em cada etapa. <br />
            Sua carga em boas mãos. Do início ao destino. 
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#cotacao" className="btn-primary text-center text-base">
              Solicitar coleta
            </a>
            <a
              href="/rastreamento"
              className="rounded-lg border border-white/50 px-6 py-3 text-center font-bold text-white transition hover:bg-white/10"
            >
              Acompanhar minha carga
            </a>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/20 pt-6 text-sm text-slate-200">
            <span>
              <strong className="text-white">Segurança</strong> em cada trajeto
            </span>
            <span>
              <strong className="text-white">Agilidade</strong> do embarque à
              entrega
            </span>
            <span>
              <strong className="text-white">Atendimento</strong> que acompanha
              você
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
