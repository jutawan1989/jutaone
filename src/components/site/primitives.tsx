import type { ReactNode } from "react";

export const LOGIN_URL = "https://members.jutaone.biz/login";

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto w-full max-w-6xl px-5 py-16 sm:py-24 ${className}`}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
      ) : null}
      {title ? (
        <h2 className="max-w-3xl text-2xl font-bold uppercase leading-tight sm:text-4xl">
          {title}
        </h2>
      ) : null}
      {subtitle ? (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {subtitle}
        </p>
      ) : null}
      {children ? <div className="mt-10">{children}</div> : null}
    </section>
  );
}

export function GoldButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`btn-gold inline-flex items-center justify-center rounded-full px-7 py-3 text-sm uppercase ${className}`}
    >
      {children}
    </a>
  );
}

export function SilverButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`btn-outline-silver inline-flex items-center justify-center rounded-full px-7 py-3 text-sm uppercase ${className}`}
    >
      {children}
    </a>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`panel p-6 sm:p-7 ${className}`}>{children}</div>;
}

export function SimLabel({ children = "Simulasi" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
      {children}
    </span>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  suffix,
  step = 1,
  min = 0,
  labelMinHeight = false,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  step?: number;
  min?: number;
  labelMinHeight?: boolean;
}) {
  return (
    <label className="block">
      <span className={`mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground ${labelMinHeight ? "min-h-8" : ""}`}>
        {label}
      </span>
      <div className="flex items-center gap-2 rounded-xl border border-input bg-background/60 px-4 py-3">
        <input
          type="number"
          value={value}
          min={min}
          step={step}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full bg-transparent text-base font-semibold text-foreground outline-none"
        />
        {suffix ? (
          <span className="shrink-0 text-xs font-semibold uppercase text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  );
}

export const idr = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));

export const num = (n: number, digits = 0) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: digits }).format(n);
