import { useState } from "react";
import { GoldButton, LOGIN_URL, useRegisterUrl } from "./primitives";

const NAV = [
  { href: "#tentang", label: "Tentang" },
  { href: "#ai", label: "AI" },
  { href: "#emas", label: "Emas" },
  { href: "#perak", label: "Perak" },
  { href: "#eta", label: "ETA" },
  { href: "#afiliasi", label: "Afiliasi" },
  { href: "#paket", label: "Paket" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  const registerUrl = useRegisterUrl();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 lg:flex lg:justify-between">
        <a href="#atas" className="flex min-w-0 items-center">
          <img
            src="/logo-jutaone-header.svg"
            alt="Logo resmi JUTAONE"
            className="h-12 w-auto max-w-[220px] shrink-0 object-contain"
          />
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative flex min-w-[58px] flex-col items-center justify-center gap-2 rounded-t-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground transition-all duration-200 hover:bg-gold/5 hover:text-gold after:absolute after:bottom-0 after:left-1/4 after:h-[2px] after:w-1/2 after:scale-x-0 after:bg-gold after:shadow-[0_0_10px_rgba(245,190,70,0.9)] after:transition-transform after:duration-200 hover:after:scale-x-100"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={LOGIN_URL}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold uppercase tracking-[0.15em] text-silver hover:text-gold"
          >
            Masuk
          </a>
          <GoldButton href={registerUrl} className="px-5 py-2 text-xs">
            Gabung Sekarang
          </GoldButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
          className="shrink-0 rounded-lg border border-input p-2 lg:hidden"
        >
          <span className="block h-0.5 w-5 bg-gold" />
          <span className="mt-1 block h-0.5 w-5 bg-gold" />
          <span className="mt-1 block h-0.5 w-5 bg-gold" />
        </button>
      </div>

      {open ? (
        <div className="border-t border-border px-5 py-4 lg:hidden">
          <div className="grid grid-cols-2 gap-3">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <GoldButton href={registerUrl}>Gabung Sekarang</GoldButton>
            <a
              href={LOGIN_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-outline-silver inline-flex items-center justify-center rounded-full px-7 py-3 text-sm uppercase"
            >
              Masuk
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
