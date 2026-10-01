import { useEffect, useMemo, useState } from "react";
import { Card, NumberField, SimLabel, idr, num } from "./primitives";

type Metal = "gold" | "silver";
type Range = "day" | "week" | "month" | "year";

type XausSpot = {
  xau?: { price?: number; currency?: string; unit?: string };
  updated_at?: string;
  price_as_of?: string;
  stale?: boolean;
  data_state?: { status?: string; as_of?: string; age_seconds?: number };
};

type XausHistory = {
  points?: Array<{ d?: string; c?: number; h?: number; l?: number }>;
};

type XausIntraday = {
  points?: Array<{ t?: string | number; p?: number }>;
  data_state?: { status?: string; as_of?: string; age_seconds?: number };
};

const API = "https://xaus.com/api/v1";

function formatTime(value?: string | number) {
  if (!value) return "Waktu tidak tersedia";
  const date = typeof value === "number" ? new Date(value > 1e12 ? value : value * 1000) : new Date(value);
  if (Number.isNaN(date.getTime())) return "Waktu tidak tersedia";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(date) + " WIB";
}

function GoldTrendChart({ color = "gold", seed = 1 }: { color?: Metal; seed?: number }) {
  const [range, setRange] = useState<Range>("day");
  const [spot, setSpot] = useState<number | null>(null);
  const [spotTime, setSpotTime] = useState<string | undefined>();
  const [stale, setStale] = useState(false);
  const [series, setSeries] = useState<Array<{ t: number; p: number }>>([]);
  const [status, setStatus] = useState<"loading" | "live" | "stale" | "error">("loading");

  useEffect(() => {
    if (color !== "gold") return;
    let cancelled = false;
    const loadSpot = async () => {
      try {
        const response = await fetch(`${API}/spot?currency=IDR&unit=gram&compact=1`, { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = (await response.json()) as XausSpot;
        const price = data.xau?.price;
        if (!Number.isFinite(price) || !price || data.xau?.currency !== "IDR" || data.xau?.unit !== "gram") {
          throw new Error("Respons harga emas IDR tidak valid");
        }
        if (cancelled) return;
        setSpot(price);
        setSpotTime(data.price_as_of ?? data.data_state?.as_of ?? data.updated_at);
        const isStale = Boolean(data.stale || data.data_state?.status === "stale");
        setStale(isStale);
        setStatus(isStale ? "stale" : "live");
      } catch {
        if (!cancelled) setStatus("error");
      }
    };
    void loadSpot();
    const timer = window.setInterval(() => void loadSpot(), 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [color]);

  useEffect(() => {
    if (color !== "gold") return;
    let cancelled = false;
    const loadSeries = async () => {
      try {
        let points: Array<{ t: number; p: number }> = [];
        if (range === "day") {
          const response = await fetch(`${API}/intraday?symbol=xau&hours=24`, { cache: "no-store" });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = (await response.json()) as XausIntraday;
          points = (data.points ?? []).flatMap((point) => {
            const t = typeof point.t === "number" ? (point.t > 1e12 ? point.t : point.t * 1000) : Date.parse(point.t ?? "");
            return Number.isFinite(t) && Number.isFinite(point.p) && point.p! > 0 ? [{ t, p: point.p! }] : [];
          });
        } else {
          const response = await fetch(`${API}/history`, { cache: "no-store" });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = (await response.json()) as XausHistory;
          const days = range === "week" ? 7 : range === "month" ? 30 : 365;
          const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
          points = (data.points ?? []).flatMap((point) => {
            const t = Date.parse(point.d ?? "");
            return Number.isFinite(t) && t >= cutoff && Number.isFinite(point.c) && point.c! > 0
              ? [{ t, p: point.c! }]
              : [];
          });
          // History is XAU/USD. Convert each point using the current published USD/IDR FX rate.
          const fxResponse = await fetch(`${API}/spot?currency=IDR&unit=gram&compact=1`, { cache: "no-store" });
          if (!fxResponse.ok) throw new Error(`HTTP ${fxResponse.status}`);
          const fxData = (await fxResponse.json()) as XausSpot & { spot_usd_oz?: number; fx_rate?: number };
          const fxRate = fxData.fx_rate;
          if (!Number.isFinite(fxRate) || !fxRate || !Number.isFinite(fxData.spot_usd_oz) || !fxData.spot_usd_oz) {
            throw new Error("Kurs USD/IDR tidak tersedia");
          }
          const usdOzNow = fxData.spot_usd_oz;
          const currentIdrGram = fxData.xau?.price;
          const idrPerUsd = currentIdrGram && usdOzNow ? currentIdrGram * 31.1034768 / usdOzNow : fxRate;
          points = points.map((point) => ({ ...point, p: point.p * idrPerUsd }));
        }
        if (cancelled) return;
        setSeries(points.sort((a, b) => a.t - b.t));
      } catch {
        if (!cancelled) setSeries([]);
      }
    };
    void loadSeries();
    return () => {
      cancelled = true;
    };
  }, [color, range]);

  const stroke = color === "gold" ? "var(--gold)" : "var(--silver)";
  const visible = color === "gold" ? series : [];
  const min = visible.length ? Math.min(...visible.map((p) => p.p)) : 0;
  const max = visible.length ? Math.max(...visible.map((p) => p.p)) : 0;
  const span = max - min || Math.max(max * 0.01, 1);
  const chartPoints = visible.map((p, i) => ({
    x: visible.length === 1 ? 50 : (i / (visible.length - 1)) * 100,
    y: 70 - ((p.p - min) / span) * 55,
  }));
  const path = chartPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  const fillId = `fill-${color}-${seed}`;
  const labels: { value: Range; label: string }[] = [
    { value: "day", label: "Harian" },
    { value: "week", label: "Mingguan" },
    { value: "month", label: "Bulanan" },
    { value: "year", label: "Tahunan" },
  ];

  if (color !== "gold") {
    const points = Array.from({ length: 24 }, (_, i) => {
      const wave = Math.sin((i + seed * 3) / 3) * 12 + Math.sin((i + seed) / 1.7) * 5;
      return { x: ((i / 23) * 100).toFixed(2), y: (55 - i * 1.1 + wave).toFixed(2) };
    });
    const silverPath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    return (
      <svg viewBox="0 0 100 80" preserveAspectRatio="none" className="h-40 w-full">
        <defs><linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={stroke} stopOpacity="0.35" /><stop offset="100%" stopColor={stroke} stopOpacity="0" /></linearGradient></defs>
        {[20, 40, 60].map((y) => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="var(--border)" strokeWidth="0.3" />)}
        <path d={`${silverPath} L100,80 L0,80 Z`} fill={`url(#${fillId})`} />
        <path d={silverPath} fill="none" stroke={stroke} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      </svg>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${status === "live" ? "bg-emerald-400" : status === "stale" ? "bg-amber-400" : "bg-muted-foreground"}`} />
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            {status === "live" ? "LIVE" : status === "stale" ? "DATA TERAKHIR (KEDALUWARSA)" : status === "error" ? "DATA TIDAK TERSEDIA" : "MEMUAT DATA"}
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">Sumber: XAUS · IDR/gram</span>
      </div>
      <div className="mb-3">
        {spot !== null ? (
          <p className="font-display text-2xl font-bold text-gold-gradient">{idr(spot)} <span className="font-sans text-xs font-medium text-muted-foreground">/ gram</span></p>
        ) : (
          <p className="text-sm text-muted-foreground">{status === "error" ? "Harga emas langsung gagal dimuat." : "Mengambil harga emas langsung…"}</p>
        )}
        <p className="mt-1 text-[11px] text-muted-foreground">Data per: {formatTime(spotTime)}</p>
      </div>
      {visible.length > 0 ? (
        <svg viewBox="0 0 100 80" preserveAspectRatio="none" className="h-40 w-full" role="img" aria-label="Grafik harga emas aktual dalam Rupiah per gram">
          <defs><linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={stroke} stopOpacity="0.35" /><stop offset="100%" stopColor={stroke} stopOpacity="0" /></linearGradient></defs>
          {[20, 40, 60].map((y) => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="var(--border)" strokeWidth="0.3" />)}
          <path d={`${path} L100,80 L0,80 Z`} fill={`url(#${fillId})`} />
          <path d={path} fill="none" stroke={stroke} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        </svg>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
          {range === "day" ? "Belum ada siri intraday yang tersedia." : "Data sejarah untuk tempoh ini tidak tersedia."}
        </div>
      )}
      <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        {labels.map((item) => (
          <button key={item.value} type="button" onClick={() => setRange(item.value)} aria-pressed={range === item.value}
            className={`rounded-lg border py-2 transition-colors ${range === item.value ? "border-gold bg-gold/10 text-gold" : "border-border bg-background/40 hover:border-gold/50"}`}>
            {item.label}
          </button>
        ))}
      </div>
      {stale && <p className="mt-2 text-[11px] text-amber-400">API mengembalikan data terakhir yang tersedia; harga ini bukan bacaan baharu.</p>}
    </div>
  );
}

type SilverSpotResponse = {
  silver_usd_oz?: number | null;
  fx_rate?: number;
  updated_at?: string;
  data_state?: { status?: string; as_of?: string; age_seconds?: number };
};
type SilverChartResponse = {
  points?: Array<{ t?: number; c?: number }>;
  data_state?: { status?: string; as_of?: string; age_seconds?: number };
};

function SilverLiveChart() {
  const [range, setRange] = useState<Range>("day");
  const [spot, setSpot] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | undefined>();
  const [status, setStatus] = useState<"loading" | "live" | "stale" | "error">("loading");
  const [points, setPoints] = useState<Array<{ t: number; p: number }>>([]);
  const [seriesError, setSeriesError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch(`${API}/spot?currency=IDR&unit=gram&compact=1`, { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = (await response.json()) as SilverSpotResponse;
        if (!Number.isFinite(data.silver_usd_oz) || !data.silver_usd_oz || !Number.isFinite(data.fx_rate) || !data.fx_rate) {
          throw new Error("Harga perak atau kurs IDR tidak tersedia");
        }
        if (cancelled) return;
        setSpot((data.silver_usd_oz * data.fx_rate) / 31.1034768);
        setUpdatedAt(data.data_state?.as_of ?? data.updated_at);
        setStatus(data.data_state?.status === "stale" ? "stale" : "live");
      } catch {
        if (!cancelled) setStatus("error");
      }
    };
    void load();
    const timer = window.setInterval(() => void load(), 60_000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        let raw: Array<{ t?: number; p?: number }> = [];
        if (range === "day") {
          const response = await fetch(`${API}/intraday?symbol=xag&hours=24`, { cache: "no-store" });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = (await response.json()) as XausIntraday;
          raw = data.points ?? [];
        } else {
          const rangeMap: Record<Exclude<Range, "day">, string> = { week: "5d", month: "1mo", year: "1y" };
          const response = await fetch(`${API}/chart?symbol=silver&range=${rangeMap[range]}&interval=1d`, { cache: "no-store" });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = (await response.json()) as SilverChartResponse;
          raw = (data.points ?? []).map((p) => ({ t: p.t, p: p.c }));
        }
        const fxResponse = await fetch(`${API}/spot?currency=IDR&unit=gram&compact=1`, { cache: "no-store" });
        if (!fxResponse.ok) throw new Error(`HTTP ${fxResponse.status}`);
        const fx = (await fxResponse.json()) as SilverSpotResponse;
        if (!Number.isFinite(fx.fx_rate) || !fx.fx_rate) throw new Error("Kurs IDR tidak tersedia");
        const converted = raw.flatMap((p) => {
          const t = typeof p.t === "number" ? (p.t > 1e12 ? p.t : p.t * 1000) : NaN;
          return Number.isFinite(t) && Number.isFinite(p.p) && p.p! > 0
            ? [{ t, p: (p.p! * fx.fx_rate!) / 31.1034768 }]
            : [];
        }).sort((a, b) => a.t - b.t);
        if (cancelled) return;
        setPoints(converted);
        setSeriesError(false);
      } catch {
        if (!cancelled) { setPoints([]); setSeriesError(true); }
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [range]);

  const min = points.length ? Math.min(...points.map((p) => p.p)) : 0;
  const max = points.length ? Math.max(...points.map((p) => p.p)) : 0;
  const span = max - min || Math.max(max * 0.01, 1);
  const path = points.map((p, i) => {
    const x = points.length === 1 ? 50 : (i / (points.length - 1)) * 100;
    const y = 70 - ((p.p - min) / span) * 55;
    return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
  const fillId = "fill-silver-live";
  const labels: { value: Range; label: string }[] = [
    { value: "day", label: "Harian" }, { value: "week", label: "Mingguan" },
    { value: "month", label: "Bulanan" }, { value: "year", label: "Tahunan" },
  ];
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${status === "live" ? "bg-emerald-400" : status === "stale" ? "bg-amber-400" : "bg-muted-foreground"}`} />
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            {status === "live" ? "LIVE" : status === "stale" ? "DATA TERAKHIR (KEDALUWARSA)" : status === "error" ? "DATA TIDAK TERSEDIA" : "MEMUAT DATA"}
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">Sumber: XAUS · IDR/gram</span>
      </div>
      <div className="mb-3">
        {spot !== null ? <p className="font-display text-2xl font-bold text-silver-gradient">{idr(spot)} <span className="font-sans text-xs font-medium text-muted-foreground">/ gram</span></p> :
          <p className="text-sm text-muted-foreground">{status === "error" ? "Harga perak langsung gagal dimuat." : "Mengambil harga perak langsung…"}</p>}
        <p className="mt-1 text-[11px] text-muted-foreground">Data per: {formatTime(updatedAt)}</p>
      </div>
      {points.length ? (
        <svg viewBox="0 0 100 80" preserveAspectRatio="none" className="h-40 w-full" role="img" aria-label="Grafik harga perak aktual dalam Rupiah per gram">
          <defs><linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--silver)" stopOpacity="0.35" /><stop offset="100%" stopColor="var(--silver)" stopOpacity="0" /></linearGradient></defs>
          {[20, 40, 60].map((y) => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="var(--border)" strokeWidth="0.3" />)}
          <path d={`${path} L100,80 L0,80 Z`} fill={`url(#${fillId})`} />
          <path d={path} fill="none" stroke="var(--silver)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        </svg>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
          {seriesError ? "Data grafik perak tidak tersedia." : "Memuat data grafik perak…"}
        </div>
      )}
      <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        {labels.map((item) => <button key={item.value} type="button" onClick={() => setRange(item.value)} aria-pressed={range === item.value}
          className={`rounded-lg border py-2 transition-colors ${range === item.value ? "border-silver bg-silver/10 text-silver" : "border-border bg-background/40 hover:border-silver/50"}`}>{item.label}</button>)}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="rounded-lg border border-border bg-background/40 p-3"><span className="font-medium text-foreground">Volatilitas</span><p className="mt-1">Pergerakan berdasarkan data harga yang tersedia.</p></div>
        <div className="rounded-lg border border-border bg-background/40 p-3"><span className="font-medium text-foreground">Rasio Emas–Perak</span><p className="mt-1">Pantau di portal anggota.</p></div>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">Harga spot indikatif, bukan harga jual atau buyback. Data perak dikonversi dari USD/troy ounce ke IDR/gram menggunakan kurs USD/IDR terkini.</p>
    </div>
  );
}

export function TrendChart(props: { color?: Metal; seed?: number }) {
  return props.color === "silver" ? <SilverLiveChart /> : <GoldTrendChart {...props} />;
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

function compactIdNumber(value: number, currency = false) {
  if (!Number.isFinite(value)) return currency ? "Rp0" : "0";
  const abs = Math.abs(value);
  const units = [
    { value: 1_000_000_000_000, suffix: "T" },
    { value: 1_000_000_000, suffix: "M" },
    { value: 1_000_000, suffix: "Jt" },
    { value: 1_000, suffix: "K" },
  ];
  const unit = units.find((item) => abs >= item.value);
  if (!unit) return (currency ? "Rp" : "") + num(value, 0);
  const scaled = value / unit.value;
  const formatted = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: Math.abs(scaled) < 10 ? 2 : 1,
  }).format(scaled);
  return (currency ? "Rp" : "") + formatted + unit.suffix;
}

export function AffiliateCalculator() {
  const [pin, setPin] = useState(1_000);
  const [perLevel, setPerLevel] = useState(3);

  // Simulasi hirarki sempurna: setiap anggota menaja bilangan ahli yang sama.
  const rows = LEVELS.map((level, index) => {
    const members = Math.pow(Math.max(0, Math.floor(perLevel)), index + 1);
    return {
      ...level,
      members,
      commission: members * Math.max(0, pin) * level.rate,
    };
  });
  const totalMembers = rows.reduce((sum, row) => sum + row.members, 0);
  const totalBonus = rows.reduce((sum, row) => sum + row.commission, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold uppercase">Kalkulator Komisi Afiliasi</h3>
        <SimLabel />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Simulasikan hirarki sempurna: setiap anggota menaja jumlah ahli yang sama hingga 20 level.
        Bonus dihitung berdasarkan jumlah ahli pada setiap level, harga PIN, dan kadar komisi.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <NumberField label="Harga PIN (IDR)" value={pin} onChange={setPin} step={1000} suffix="IDR" labelMinHeight />
        <NumberField
          label="Jumlah ahli langsung per anggota"
          value={perLevel}
          onChange={setPerLevel}
          step={1}
          min={0}
          suffix="AHLI"
          labelMinHeight
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-background/50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Jumlah ahli hingga L20
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-silver sm:text-3xl">
            {compactIdNumber(totalMembers)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Tidak termasuk ahli yang membuat simulasi</p>
        </div>
        <div className="rounded-xl border border-border bg-background/50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Total bonus simulasi (L1–L20)
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-gold-gradient sm:text-3xl">
            {compactIdNumber(totalBonus, true)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Anggaran bonus berdasarkan hirarki sempurna</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {rows.map((row) => (
          <div
            key={row.level}
            className="rounded-lg border border-border bg-background/40 px-3 py-2 text-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-silver">{row.level}</span>
              <span className="text-gold">{num(row.rate * 100, 0)}%</span>
            </div>
            <p className="mt-1 text-muted-foreground">{compactIdNumber(row.members)} ahli</p>
            <p className="mt-1 break-words font-medium text-foreground">{compactIdNumber(row.commission, true)}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        Ini ialah simulasi matematik dengan andaian setiap ahli menaja jumlah yang sama dan setiap ahli
        membeli satu PIN yang layak. Struktur sebenar, syarat kelayakan, had pembayaran dan jualan
        sebenar boleh menyebabkan jumlah ahli serta bonus berbeza. Simulasi ini bukan jaminan pendapatan.
      </p>
    </Card>
  );
}
