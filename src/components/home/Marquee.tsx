import { getIcon } from "../../data/iconMap";
import { tools } from "./Toolkit";

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-7 pr-7 lg:gap-10 lg:pr-10" aria-hidden={hidden || undefined}>
      {tools.map((t) => {
        const Icon = getIcon(t.icon);
        return (
          <li key={t.name} title={t.name} className="flex items-center gap-3 whitespace-nowrap text-text-secondary transition-colors hover:text-text-primary">
            {Icon && <Icon size={22} aria-hidden />}
            <span className="hidden font-mono text-xs lg:inline">{t.name}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default function Marquee() {
  return (
    <section aria-label="Toolkit" className="border-t border-border-studio py-5 md:py-8">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 md:px-8">
        <p className="hidden shrink-0 font-mono text-xs uppercase tracking-widest text-text-secondary lg:block">Toolkit</p>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="marquee flex w-max">
            <Row />
            <Row hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
