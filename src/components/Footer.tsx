export default function Footer() {
  return (
    <footer className="bg-c4-blue-dark text-white py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <img
          src="/logo-topo.png"
          alt="C4 Xpress"
          className="mx-auto mb-4 h-16 w-32 object-contain"
        />
        <p className="mb-2">Rua João José Pereira Filho, Lote 1129, Quadra 6, Galpão 8/9 — Maceió/AL — CEP: 57.081-000</p>
        <p className="mb-4">Matriz: (82) 3512-0512 | Filial SP: (11) 5200-0380</p>
        <p className="text-sm text-slate-400">© {new Date().getFullYear()} C4 Xpress. Todos os direitos reservados| Desenvolvido per José F Dev. </p>
      </div>
    </footer>
  )
}