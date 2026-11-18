import { useEffect, useState } from "react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > 300);

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Voltar ao topo da página"
      className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full bg-c4-blue-dark px-4 py-3 font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-blue-900 focus-visible:outline sm:bottom-6 sm:left-6"
    >
      <span aria-hidden="true" className="text-xl leading-none">↑</span>
      <span>Voltar ao topo</span>
    </button>
  );
}
