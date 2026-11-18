import { useState } from "react";

type Reply = {
  text: string;
  action?: "rastreamento" | "cotacao";
};

type WhatsappContact = {
  numero: string;
  setor: string;
};

type BranchContacts = {
  cidade: string;
  telefones: WhatsappContact[];
};

const contatosWhatsApp: BranchContacts[] = [
  {
    cidade: "Maceió",
    telefones: [
      { numero: "82-35120512", setor: "GERAL" },
      { numero: "82-996531414", setor: "FINANCEIRO CONTAS A PAGAR" },
      { numero: "82-996415775", setor: "FINANCEIRO CONTAS A RECEBER/COBRANÇA/FATURAMENTO" },
      { numero: "82-996017129", setor: "EXPEDIÇÃO/CONTROLADORIA" }
    ]
  },
  {
    cidade: "Recife",
    telefones: [
      { numero: "82-996415678", setor: "GERAL" }
    ]
  },
  {
    cidade: "Caruaru",
    telefones: [
      { numero: "82-996415777", setor: "GERAL" }
    ]
  },
  {
    cidade: "Salvador",
    telefones: [
      { numero: "82-996415700", setor: "EXPEDIÇÃO/CONTROLADORIA" },
      { numero: "71-983434260", setor: "COMERCIAL" },
      { numero: "71-38388522", setor: "GERAL/FINANCEIRO/PAGAR/RECEBER" }
    ]
  },
  {
    cidade: "Aracaju",
    telefones: [
      { numero: "79-35120192", setor: "GERAL" },
      { numero: "79-981169737", setor: "GERAL" }
    ]
  },
  {
    cidade: "São Paulo",
    telefones: [
      { numero: "11-52000380", setor: "GERAL" }
    ]
  }
];

const replies: Record<string, Reply> = {
  rastreamento: {
    text: "Para acompanhar sua carga, consulte com o CPF ou CNPJ do destinatário na página de rastreamento.",
    action: "rastreamento"
  },
  cotacao: {
    text: "Posso ajudar com uma nova cotação. Conte para nossa equipe o tipo de carga, a origem e o destino.",
    action: "cotacao"
  },
  contato: {
    text: "Escolha a filial e o setor para continuar pelo WhatsApp."
  }
};

export default function VirtualAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [reply, setReply] = useState<Reply | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<BranchContacts | null>(null);

  function openContactOptions() {
    setReply(replies.contato);
    setSelectedBranch(null);
  }

  function resetConversation() {
    setReply(null);
    setSelectedBranch(null);
  }

  return (
    <div className="fixed bottom-3 right-3 z-50 sm:bottom-5 sm:right-5">
      {isOpen && (
        <section
          aria-label="Atendimento virtual com Juliana"
          className="mb-3 flex max-h-[calc(100dvh-6.5rem)] w-[min(360px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:mb-4"
        >
          <div className="shrink-0 bg-c4-blue-dark px-4 py-3 text-white sm:px-5 sm:py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src="/carlos-atendimento.png"
                  alt="Juliana, atendente virtual"
                  className="h-10 w-10 shrink-0 rounded-full border-2 border-white/70 object-cover sm:h-12 sm:w-12"
                />
                <div className="min-w-0">
                  <p className="font-bold">Juliana</p>
                  <p className="mt-1 truncate text-xs text-blue-100">
                    Atendimento virtual C4 Xpress
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Fechar atendente virtual"
                className="rounded p-1 text-xl leading-none hover:bg-white/10"
              >
                ×
              </button>
            </div>
          </div>

          <div className="min-h-0 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-5">
            <p className="max-w-[95%] rounded-2xl rounded-tl-sm bg-slate-100 p-3 text-sm leading-relaxed text-slate-700">
              Olá! Meu nome é Juliana. Como posso ajudar com o seu transporte?
            </p>
            {reply && (
              <div>
                <p className="rounded-2xl rounded-tl-sm bg-slate-100 p-3 text-sm leading-relaxed text-slate-700">
                  {reply.text}
                </p>
                {reply.action && (
                  <a
                    href={`#${reply.action}`}
                    onClick={() => setIsOpen(false)}
                    className="mt-2 inline-block text-sm font-bold text-c4-blue-dark underline"
                  >
                    {reply.action === "rastreamento"
                      ? "Ir para acompanhamento"
                      : "Solicitar cotação"}
                  </a>
                )}
              </div>
            )}
            {reply === replies.contato && (
              <div className="grid gap-2" aria-label="Escolha de filial e setor">
                {!selectedBranch ? (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Escolha a filial</p>
                    {contatosWhatsApp.map((branch) => (
                      <button
                        key={branch.cidade}
                        type="button"
                        onClick={() => setSelectedBranch(branch)}
                        className="assistant-option"
                      >
                        {branch.cidade}
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedBranch(null)}
                      className="w-fit text-sm font-semibold text-c4-blue-dark underline"
                    >
                      ← Escolher outra filial
                    </button>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Setores de {selectedBranch.cidade}
                    </p>
                    {selectedBranch.telefones.map((contact) => {
                      const phone = `55${contact.numero.replace(/\D/g, "")}`;
                      return (
                        <a
                          key={`${contact.numero}-${contact.setor}`}
                          href={`https://wa.me/${phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
                          className="assistant-option text-left"
                        >
                          {contact.setor}
                          <span className="mt-1 block text-xs font-normal text-slate-500">
                            {contact.numero}
                          </span>
                        </a>
                      );
                    })}
                  </>
                )}
              </div>
            )}
            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => {
                  setReply(replies.rastreamento);
                  setSelectedBranch(null);
                }}
                className="assistant-option"
              >
                Acompanhar uma carga
              </button>
              <button
                type="button"
                onClick={() => {
                  setReply(replies.cotacao);
                  setSelectedBranch(null);
                }}
                className="assistant-option"
              >
                Pedir uma cotação
              </button>
              <button
                type="button"
                onClick={openContactOptions}
                className="assistant-option"
              >
                Falar com a equipe
              </button>
              {reply && (
                <button type="button" onClick={resetConversation} className="text-sm text-slate-500 underline">
                  Voltar ao início
                </button>
              )}
            </div>
          </div>
          <p className="shrink-0 border-t border-slate-100 px-4 py-3 text-center text-xs text-slate-500 sm:px-5">
            Selecione uma filial e um setor para falar com nossa equipe pelo WhatsApp.
          </p>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={
          isOpen ? "Fechar atendente virtual" : "Abrir atendente virtual"
        }
        className="ml-auto flex items-center gap-2 whitespace-nowrap rounded-full bg-c4-red px-3 py-3 text-sm font-bold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 sm:gap-3 sm:px-5 sm:py-4 sm:text-base"
      >
        <img
          src="/carlos-atendimento.png"
          alt=""
          className="h-8 w-8 shrink-0 rounded-full border border-white/70 object-cover"
        />
        <span>Atendente Virtual</span>
      </button>
    </div>
  );
}
