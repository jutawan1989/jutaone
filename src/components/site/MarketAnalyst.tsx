import { useState } from "react";
import { Card, GoldButton, LOGIN_URL, SimLabel } from "./primitives";

const instruments = [
  { value: "emas", label: "Emas (XAU/IDR)" },
  { value: "perak", label: "Perak (XAG/IDR)" },
  { value: "saham", label: "Saham" },
] as const;

const periods = [
  { value: "intraday", label: "Intraday" },
  { value: "harian", label: "Harian" },
  { value: "mingguan", label: "Mingguan" },
  { value: "bulanan", label: "Bulanan" },
] as const;

const analysisTypes = [
  { value: "teknikal", label: "Teknikal" },
  { value: "fundamental", label: "Fundamental" },
  { value: "risiko", label: "Risiko" },
  { value: "lengkap", label: "Analisis lengkap" },
] as const;

export function MarketAnalyst() {
  const [instrument, setInstrument] = useState<(typeof instruments)[number]["value"]>("emas");
  const [period, setPeriod] = useState<(typeof periods)[number]["value"]>("harian");
  const [analysisType, setAnalysisType] = useState<(typeof analysisTypes)[number]["value"]>("lengkap");

  const fieldClass =
    "mt-2 h-12 w-full rounded-xl border border-border bg-background/60 px-4 text-sm text-foreground outline-none transition-colors focus:border-gold";

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">JUTAONE AI</p>
          <h3 className="mt-2 text-xl font-bold uppercase">AI Market Analyst</h3>
        </div>
        <SimLabel>Pratinjau Modul</SimLabel>
      </div>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Siapkan analisis pasar berdasarkan instrumen, periode dan fokus yang Anda pilih. Hasil analisis
        perlu menggunakan data pasar bertanggal serta menjelaskan indikator, risiko dan keterbatasannya.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Instrumen
          <select className={fieldClass} value={instrument} onChange={(event) => setInstrument(event.target.value as typeof instrument)}>
            {instruments.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Periode analisis
          <select className={fieldClass} value={period} onChange={(event) => setPeriod(event.target.value as typeof period)}>
            {periods.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Fokus analisis
          <select className={fieldClass} value={analysisType} onChange={(event) => setAnalysisType(event.target.value as typeof analysisType)}>
            {analysisTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Ringkasan tren", detail: "Arah pergerakan dan perubahan harga" },
          { title: "Indikator teknikal", detail: "RSI, MA dan momentum jika datanya tersedia" },
          { title: "Faktor fundamental", detail: "Konteks ekonomi dan pemicu pasar" },
          { title: "Risiko & skenario", detail: "Kemungkinan skenario, bukan kepastian" },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-background/40 p-3">
            <p className="text-sm font-semibold text-silver">{item.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-xl border border-gold/30 bg-gold/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          <p className="font-semibold text-foreground">Pilihan Anda</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {instruments.find((item) => item.value === instrument)?.label} · {periods.find((item) => item.value === period)?.label} · {analysisTypes.find((item) => item.value === analysisType)?.label}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Modul analisis AI belum dihubungkan ke mesin AI pada laman ini.</p>
        </div>
        <GoldButton href={LOGIN_URL} className="shrink-0">Buka Portal Anggota</GoldButton>
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
        Informasi untuk edukasi. Analisis bukan nasihat investasi, sinyal transaksi atau jaminan hasil.
        Keputusan tetap perlu mempertimbangkan kondisi dan risiko masing-masing.
      </p>
    </Card>
  );
}
