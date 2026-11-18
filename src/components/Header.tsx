import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const isTrackingPage =
    window.location.pathname.replace(/\/+$/, "") === "/rastreamento";
  const sectionHref = (section: string) =>
    isTrackingPage ? `/#${section}` : `#${section}`;
  const trackingLinkClass = isTrackingPage
    ? "rounded-lg bg-blue-50 px-5 py-2 font-bold text-c4-blue-dark transition"
    : "hover:text-c4-blue-dark transition";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 py-2 flex items-center justify-between">
        <a
          href={isTrackingPage ? "/" : "#inicio"}
          className="flex items-center"
          aria-label="C4 Xpress - início"
        >
          <img
            src="/logo-topo.png"
            alt="C4 Xpress"
            className="h-30 w-36 object-contain"
          />
        </a>

        <nav className="hidden lg:flex items-center gap-4 text-sm font-medium">
          <a
            href={sectionHref("inicio")}
            className="hover:text-c4-blue-dark transition"
          >
            Início
          </a>
          <a
            href={sectionHref("quem-somos")}
            className="hover:text-c4-blue-dark transition"
          >
            Quem Somos
          </a>
          <a
            href={sectionHref("estrutura")}
            className="hover:text-c4-blue-dark transition"
          >
            Estrutura
          </a>
          <a
            href={sectionHref("servicos")}
            className="hover:text-c4-blue-dark transition"
          >
            Serviços
          </a>
          <a
            href="/rastreamento"
            className={trackingLinkClass}
            aria-current={isTrackingPage ? "page" : undefined}
          >
            Rastrear carga
          </a>
          <a
            href={sectionHref("blog")}
            className="hover:text-c4-blue-dark transition"
          >
            Blog
          </a>
          <a
            href={sectionHref("contato")}
            className="hover:text-c4-blue-dark transition"
          >
            Contato
          </a>
        </nav>

        <a
          href={sectionHref("cotacao")}
          className="btn-primary hidden text-sm lg:block"
        >
          FAÇA SUA COTAÇÃO
        </a>

        <button
          type="button"
          className="text-2xl text-c4-blue-dark lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {isOpen && (
        <div className="bg-white border-t px-4 pb-4 lg:hidden">
          <nav
            id="mobile-navigation"
            className="flex flex-col gap-3 text-sm font-medium"
          >
            <a
              href={sectionHref("inicio")}
              className="py-2"
              onClick={() => setIsOpen(false)}
            >
              Início
            </a>
            <a
              href={sectionHref("quem-somos")}
              className="py-2"
              onClick={() => setIsOpen(false)}
            >
              Quem Somos
            </a>
            <a
              href={sectionHref("estrutura")}
              className="py-2"
              onClick={() => setIsOpen(false)}
            >
              Estrutura
            </a>
            <a
              href={sectionHref("servicos")}
              className="py-2"
              onClick={() => setIsOpen(false)}
            >
              Serviços
            </a>
            <a
              href="/rastreamento"
              className={`py-2 ${isTrackingPage ? "font-bold text-c4-blue-dark" : ""}`}
              onClick={() => setIsOpen(false)}
              aria-current={isTrackingPage ? "page" : undefined}
            >
              Rastrear carga
            </a>
            <a
              href={sectionHref("blog")}
              className="py-2"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </a>
            <a
              href={sectionHref("contato")}
              className="py-2"
              onClick={() => setIsOpen(false)}
            >
              Contato
            </a>
            <a
              href={sectionHref("cotacao")}
              className="btn-primary text-center mt-2"
              onClick={() => setIsOpen(false)}
            >
              FAÇA SUA COTAÇÃO
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
