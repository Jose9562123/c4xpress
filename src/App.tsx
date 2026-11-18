import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSection from "./sections/HeroSection";
import QuemSomosSection from "./sections/QuemSomosSection";
import EstruturaSection from "./sections/EstruturaSection";
import ServicosSection from "./sections/ServicosSection";
import DepoimentosSection from "./sections/DepoimentosSection";
import BlogSection from "./sections/BlogSection";
import CotacaoSection from "./sections/CotacaoSection";
import ContatoSection from "./sections/ContatoSection";
import RastreamentoSection from "./sections/RastreamentoSection";
import VirtualAssistant from "./components/VirtualAssistant";
import BackToTop from "./components/BackToTop";
import FilialDetalhes from "./sections/FilialDetalhes";
import { filiais } from "./data/filiais";

export default function App() {
  const filialId = new URLSearchParams(window.location.search).get("filial");
  const filialSelecionada = filiais.find((filial) => filial.id === filialId);

  useEffect(() => {
    const handleHashClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (
        target.tagName === "A" &&
        target.getAttribute("href")?.startsWith("#")
      ) {
        const id = target.getAttribute("href")?.slice(1);
        if (id) {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            e.preventDefault();
          }
        }
      }
    };
    document.addEventListener("click", handleHashClick);
    return () => document.removeEventListener("click", handleHashClick);
  }, []);

  if (filialSelecionada) {
    return (
      <>
        <FilialDetalhes filial={filialSelecionada} />
        <BackToTop />
      </>
    );
  }

  if (window.location.pathname.replace(/\/+$/, "") === "/rastreamento") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-slate-50">
          <div className="bg-c4-blue-dark px-5 py-10 text-white sm:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-blue-200">
                C4 Xpress · Acompanhamento
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Rastreie sua carga
              </h1>
              <p className="mt-3 max-w-2xl text-blue-100">
                Consulte o histórico de movimentações usando o CPF ou CNPJ do destinatário.
              </p>
            </div>
          </div>
          <RastreamentoSection />
        </main>
        <Footer />
        <BackToTop />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <QuemSomosSection />
        <EstruturaSection />
        <ServicosSection />
        <DepoimentosSection />
        <BlogSection />
        <CotacaoSection />
        <ContatoSection />
      </main>
      <Footer />
      <VirtualAssistant />
      <BackToTop />
    </div>
  );
}
