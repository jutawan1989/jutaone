import { useState } from "react";
import { Card, NumberField, SimLabel, idr, num } from "./primitives";

export function TrendChart({ color = "gold", seed = 1 }: { color?: "gold" | "silver"; seed?: number }) {
  const points = Array.from({ length: 24 }, (_, i) => {
    const wave = Math.sin((i + seed * 3) / 3) * 12 + Math.sin((i + seed) / 1.7) * 5;
    return { x: (i / 23) * 100, y: 55 - i * 1.1 + wave };
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const stroke = color === "gold" ? "var(--gold)" : "var(--silver)";

  return (
    <svg viewBox="0 0 100 80" preserveAspectRatio="none" className="h-40 w-full">
      <defs>
        <linearGradient id={`fill-${color}-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[20, 40, 60].map((y) => (
        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="var(--border)" strokeWidth="0.3" />
      ))}
      <path d={`${path} L100,80 L0,80 Z`} fill={`url(#fill-${color}-${seed})`} />
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function MetalCalculator({
  metal,
  defaultPrice,
  accent,
}: {
  metal: "Emas" | "Perak";
  defaultPrice: number;
  accent: "gold" | "silver";
}) {
  const [gram, setGram] = useState(10);
  const [price, setPrice] = useState(defaultPrice);
  const total = gram * price;

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold uppercase">Kalkulator Nilai {metal}</h3>
        <SimLabel />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Masukkan berat dan harga acuan Anda sendiri. Nilai di bawah adalah hasil perhitungan
        simulasi, bukan harga pasar resmi.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <NumberField label="Berat (gram)" value={gram} onChange={setGram} suffix="gr" />
        <NumberField
          label={`Harga per gram (IDR)`}
          value={price}
          onChange={setPrice}
          step={1000}
          suffix="IDR"
        />
      </div>
      <div className="mt-6 rounded-xl border border-border bg-background/50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Estimasi nilai
        </p>
        <p
          className={`mt-2 font-display text-2xl font-bold sm:text-3xl ${
            accent === "gold" ? "text-gold-gradient" : "text-silver-gradient"
          }`}
        >
          {idr(total)}
        </p>
      </div>
    </Card>
  );
}

const ETA_PRICES = [0.01, 0.1, 1];

export function EtaSimulator() {
  const [eta, setEta] = useState(1_000_000);
  const base = eta * 0.01;

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold uppercase">Simulasi Future Value ETA</h3>
        <SimLabel />
      </div>
      <div className="mt-6 max-w-xs">
        <NumberField label="Jumlah ETA" value={eta} onChange={setEta} step={100_000} suffix="ETA" />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {ETA_PRICES.map((p) => {
          const value = eta * p;
          const multiple = base > 0 ? value / base : 0;
          return (
            <div key={p} className="rounded-xl border border-border bg-background/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Jika 1 ETA = Rp{num(p, 2)}
              </p>
              <p className="mt-2 font-display text-xl font-bold text-gold-gradient">{idr(value)}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {num(multiple)}x dibanding Rp0,01
              </p>
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        Angka di atas adalah ilustrasi matematis semata. JUTAONE tidak menjanjikan keuntungan, tidak
        menetapkan harga pasar ETA, dan tidak mengklaim ETA didukung emas atau memiliki likuiditas.
      </p>
    </Card>
  );
}

const LEVELS = [
  { level: "L1", rate: 0.5 },
  { level: "L2", rate: 0.05 },
  { level: "L3", rate: 0.03 },
  { level: "L4", rate: 0.02 },
  ...Array.from({ length: 16 }, (_, i) => ({ level: `L${i + 5}`, rate: 0.01 })),
];

export function AffiliateCalculator() {
  const [pin, setPin] = useState(10_000);
  const [perLevel, setPerLevel] = useState(5);

  const rows = LEVELS.map((l) => ({ ...l, commission: pin * l.rate * perLevel }));
  const total = rows.reduce((s, r) => s + r.commission, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold uppercase">Kalkulator Komisi Afiliasi</h3>
        <SimLabel />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Hitung komisi berdasarkan jumlah penjualan PIN yang memenuhi syarat dari anggota aktif di
        setiap level. Satu penjualan hanya dihitung satu kali per level.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <NumberField label="Harga PIN (IDR)" value={pin} onChange={setPin} step={1000} suffix="IDR" />
        <NumberField
          label="Penjualan PIN memenuhi syarat per level"
          value={perLevel}
          onChange={setPerLevel}
          suffix="PIN"
        />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-background/50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Total komisi simulasi (L1–L20)
        </p>
        <p className="mt-2 font-display text-2xl font-bold text-gold-gradient sm:text-3xl">
          {idr(total)}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {rows.map((r) => (
          <div
            key={r.level}
            className="rounded-lg border border-border bg-background/40 px-3 py-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-silver">{r.level}</span>
              <span className="text-gold">{num(r.rate * 100, 0)}%</span>
            </div>
            <p className="mt-1 text-muted-foreground">{idr(r.commission)}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-muted-foreground">
        Simulasi ini bukan janji pendapatan. Komisi nyata bergantung pada penjualan PIN yang sah dan
        status keaktifan anggota.
      </p>
    </Card>
  );
}
