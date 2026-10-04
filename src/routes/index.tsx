import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Header } from "@/components/site/Header";
import { MarketAnalyst } from "@/components/site/MarketAnalyst";
import { EarthHero } from "@/components/site/EarthHero";
import {
  AffiliateCalculator,
  EtaSimulator,
  MetalCalculator,
  TrendChart,
} from "@/components/site/Calculators";
import {
  Card,
  GoldButton,
  LOGIN_URL,
  Section,
  SilverButton,
  SimLabel,
  idr,
} from "@/components/site/primitives";

const LOGO_URL = "/logo-jutaone-mark.png";


function AdsterraBanner() {
  useEffect(() => {
    const bannerHost = document.getElementById("adsterra-banner-300x250-jutaone");
    if (!bannerHost) return;

    bannerHost.innerHTML = "";

    const bannerOptions = document.createElement("script");
    bannerOptions.text = [
      "var atOptions = {",
      "'key' : 'dd858710f3683f83b56510194e12be28',",
      "'format' : 'iframe',",
      "'height' : 250,",
      "'width' : 300,",
      "'params' : {}",
      "};",
    ].join("\n");
    bannerHost.appendChild(bannerOptions);

    const bannerScript = document.createElement("script");
    bannerScript.src = "https://bauval.org/22/dd858710f3683f83b56510194e12be28";
    bannerHost.appendChild(bannerScript);

    return () => {
      bannerHost.innerHTML = "";
    };
  }, []);

  return (
    <div
      id="adsterra-banner-300x250-jutaone"
      className="flex min-h-[250px] min-w-[300px] items-center justify-center overflow-hidden"
    />
  );
}


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JUTAONE — Masa Depan Kekayaan Anda Dimulai Di Sini" },
      {
        name: "description",
        content:
          "Ekosistem digital JUTAONE: kecerdasan buatan, Gold & Silver Intelligence, simulasi ETA Future Value dan program afiliasi hingga 20 level. Bersama menuju kesuksesan.",
      },
      { property: "og:title", content: "JUTAONE — Bersama Menuju Kesuksesan" },
      {
        property: "og:description",
        content:
          "Jelajahi ekosistem AI, analisis emas dan perak, potensi nilai masa depan ETA serta peluang afiliasi JUTAONE.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://jutaone.biz/og-jutaone.png" },
      { property: "og:image:alt", content: "JUTAONE — Bersama Menuju Kesuksesan" },
      { property: "og:url", content: "https://jutaone.biz/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://jutaone.biz/og-jutaone.png" },
    ],
  }),
  component: Index,
});

const KEUNGGULAN = [
  {
    title: "Informasi Pasar Global",
    desc: "Ringkasan perkembangan ekonomi dan pasar global yang disusun agar mudah dipahami.",
  },
  {
    title: "Analisis Berbasis AI",
    desc: "Kecerdasan buatan membantu merangkum tren dan menyusun wawasan berbasis data.",
  },
  {
    title: "Gold Intelligence",
    desc: "Pemantauan harga emas, tren dan indikator teknis dalam satu tampilan premium.",
  },
  {
    title: "Silver Intelligence",
    desc: "Analisis perak, volatilitas serta perbandingan rasio emas dan perak.",
  },
  {
    title: "ETA Future Value",
    desc: "Konsep Estimate Time Arrive dengan simulasi nilai masa depan yang transparan.",
  },
  {
    title: "Program Afiliasi",
    desc: "Struktur hingga 20 level untuk membangun jaringan secara bertahap dan sehat.",
  },
];

const FAQ = [
  {
    q: "Apa itu JUTAONE?",
    a: "JUTAONE adalah ekosistem digital yang menggabungkan kecerdasan buatan, analisis emas dan perak, konsep ETA Future Value serta program afiliasi dalam satu platform berbahasa Indonesia.",
  },
  {
    q: "Apa itu Gold Intelligence?",
    a: "Gold Intelligence adalah bagian yang menampilkan pemantauan harga emas dalam Rupiah, tren harian hingga tahunan, indikator teknis serta kalkulator nilai emas. Selama data langsung belum terhubung, tampilan diberi label simulasi.",
  },
  {
    q: "Apa itu Silver Intelligence?",
    a: "Silver Intelligence menyajikan analisis perak: pergerakan harga, volatilitas, serta perbandingan antara emas dan perak, dilengkapi kalkulator nilai perak.",
  },
  {
    q: "Apa itu ETA?",
    a: "ETA adalah singkatan dari Estimate Time Arrive, satuan digital di dalam ekosistem JUTAONE. Setiap pembelian PIN Rp10.000 memberikan 1.000.000 ETA.",
  },
  {
    q: "Mengapa ETA dikunci selama 365 hari?",
    a: "ETA hasil pembelian PIN dikunci selama 365 hari sejak diperoleh. Masa kunci ini merupakan bagian dari ketentuan program.",
  },
  {
    q: "Apakah simulasi Future Value merupakan jaminan?",
    a: "Tidak. Semua angka Future Value adalah ilustrasi matematis untuk membantu pemahaman konsep. JUTAONE tidak menjanjikan keuntungan dan tidak menetapkan harga pasar ETA.",
  },
  {
    q: "Bagaimana program afiliasi bekerja?",
    a: "Program afiliasi mencakup hingga 20 level dengan kadar komisi L1 50%, L2 5%, L3 3%, L4 2% dan L5 sampai L20 masing-masing 1%, dihitung dari penjualan PIN yang memenuhi syarat tanpa komisi ganda.",
  },
  {
    q: "Bagaimana cara bergabung?",
    a: "Tekan tombol GABUNG SEKARANG di halaman ini, lalu selesaikan pendaftaran Anda di portal anggota JUTAONE.",
  },
];

const SASARAN = [
  { label: "Rp100 Juta", desc: "Sasaran awal untuk membangun disiplin dan konsistensi." },
  { label: "Rp1 Miliar", desc: "Sasaran menengah dengan jaringan yang mulai stabil." },
  { label: "Rp10 Miliar", desc: "Sasaran lanjutan yang menuntut skala dan kepemimpinan." },
  { label: "Rp1 Triliun", desc: "Sasaran visioner jangka panjang, bukan jaminan kekayaan." },
];

function Index() {
  return (
    <div id="atas" className="min-h-screen">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-gold">
              Bersama Menuju Kesuksesan
            </p>
            <h1 className="mt-5 text-3xl font-bold uppercase leading-tight sm:text-5xl">
              Masa Depan <span className="text-gold-gradient">Kekayaan Anda</span> Dimulai Di Sini
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Jelajahi ekosistem kecerdasan buatan, analisis emas dan perak, potensi nilai masa depan
              ETA serta peluang pertumbuhan melalui program afiliasi JUTAONE.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <GoldButton href={LOGIN_URL}>Gabung Sekarang</GoldButton>
              <SilverButton href={LOGIN_URL}>Lihat Peluang</SilverButton>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                { k: "20", v: "Level Afiliasi" },
                { k: "1 Jt", v: "ETA per PIN" },
                { k: "365", v: "Hari Kunci" },
              ].map((s) => (
                <div key={s.v}>
                  <p className="font-display text-2xl font-bold text-gold-gradient">{s.k}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    {s.v}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex h-[460px] min-h-[400px] items-center justify-center">
            <EarthHero />
          </div>
        </div>
        <div className="hairline mx-auto max-w-6xl" />
      </section>

      {/* TENTANG */}
      <Section
        id="tentang"
        eyebrow="Tentang JUTAONE"
        title="Satu Ekosistem, Banyak Peluang"
        subtitle="JUTAONE menyatukan kecerdasan buatan, analisis emas dan perak, simulasi ETA serta program afiliasi dalam satu platform yang dirancang agar mudah dipahami oleh masyarakat Indonesia."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <h3 className="text-lg font-bold uppercase text-gold">Visi</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Menjadi ekosistem kecerdasan emas dan perak yang tepercaya di Indonesia, tempat setiap
              orang dapat memahami pasar dengan bahasa yang sederhana dan mengambil keputusan secara
              lebih bijak.
            </p>
          </Card>
          <Card>
            <h3 className="text-lg font-bold uppercase text-silver">Misi</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>• Menyajikan informasi pasar yang jelas, jujur dan mudah dipahami.</li>
              <li>• Memanfaatkan kecerdasan buatan untuk merangkum tren dan data.</li>
              <li>• Mendidik anggota mengenai emas, perak dan konsep nilai masa depan.</li>
              <li>• Membangun komunitas yang tumbuh bersama melalui program afiliasi sehat.</li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* AI */}
      <Section
        id="ai"
        eyebrow="AI Intelligence"
        title="Kecerdasan Buatan Sebagai Pemandu Pasar"
        subtitle="Modul AI JUTAONE dirancang untuk merangkum tren pasar, menyusun ringkasan ekonomi serta membandingkan pergerakan emas dan perak dalam bahasa yang sederhana."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Ringkasan Ekonomi",
              d: "Rangkuman peristiwa ekonomi penting yang berpotensi mempengaruhi logam mulia.",
            },
            {
              t: "Analisis Tren",
              d: "Pembacaan arah pergerakan jangka pendek hingga jangka panjang secara terstruktur.",
            },
            {
              t: "Perbandingan Emas & Perak",
              d: "Melihat hubungan kedua logam mulia untuk memahami konteks pasar.",
            },
          ].map((c) => (
            <Card key={c.t}>
              <h3 className="text-base font-bold uppercase">{c.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
            </Card>
          ))}
        </div>
        <MarketAnalyst />
      </Section>

      {/* ADSTERRA */}
      <section aria-label="Iklan" className="border-y border-border/60 bg-background/30">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Iklan
          </p>
          <div className="mt-5 flex min-h-[250px] w-full items-center justify-center">
            <AdsterraBanner />
          </div>
        </div>
      </section>

      {/* EMAS */}
      <Section
        id="emas"
        eyebrow="Gold Intelligence"
        title="Pantau Emas Dengan Lebih Tenang"
        subtitle="Tren harian, mingguan, bulanan dan tahunan beserta indikator teknis disajikan dalam satu tampilan. Selama data langsung belum tersedia, seluruh grafik diberi label simulasi."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold uppercase">Tren Harga Emas (IDR)</h3>
              <SimLabel />
            </div>
            <TrendChart color="gold" seed={2} />
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              {["Rerata Bergerak", "RSI", "Level Sokongan"].map((i) => (
                <div key={i} className="rounded-lg border border-border bg-background/40 px-3 py-2">
                  <p className="font-semibold text-silver">{i}</p>
                  <p className="mt-1 text-muted-foreground">Tersedia di portal</p>
                </div>
              ))}
            </div>
          </Card>
          <MetalCalculator metal="Emas" defaultPrice={1_500_000} accent="gold" />
        </div>
      </Section>

      {/* PERAK */}
      <Section
        id="perak"
        eyebrow="Silver Intelligence"
        title="Perak: Peluang Dengan Karakter Berbeda"
        subtitle="Perak bergerak lebih fluktuatif daripada emas. JUTAONE membantu Anda memahami volatilitas serta hubungan rasio emas dan perak."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold uppercase">Tren Harga Perak (IDR)</h3>
              <SimLabel />
            </div>
            <TrendChart color="silver" seed={5} />
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-border bg-background/40 px-3 py-2">
                <p className="font-semibold text-silver">Volatilitas</p>
                <p className="mt-1 text-muted-foreground">Umumnya lebih tinggi dari emas</p>
              </div>
              <div className="rounded-lg border border-border bg-background/40 px-3 py-2">
                <p className="font-semibold text-silver">Rasio Emas–Perak</p>
                <p className="mt-1 text-muted-foreground">Dipantau di portal anggota</p>
              </div>
            </div>
          </Card>
          <MetalCalculator metal="Perak" defaultPrice={18_000} accent="silver" />
        </div>
      </Section>

      {/* ETA */}
      <Section
        id="eta"
        eyebrow="ETA Future Value"
        title="1 Juta ETA Hari Ini, Bagaimana Potensinya Di Masa Depan?"
        subtitle="Pembelian PIN sebesar Rp10.000 memberikan 1.000.000 ETA yang dikunci selama 365 hari. ETA adalah singkatan dari Estimate Time Arrive, sebuah satuan digital di dalam ekosistem JUTAONE."
      >
        <EtaSimulator />
      </Section>

      {/* AFILIASI */}
      <Section
        id="afiliasi"
        eyebrow="Affiliate Growth"
        title="Bangun Jaringan, Kembangkan Peluang"
        subtitle="Program afiliasi JUTAONE mencakup hingga 20 level. Kadar komisi: L1 50%, L2 5%, L3 3%, L4 2% serta L5 sampai L20 masing-masing 1%, dihitung dari penjualan PIN yang memenuhi syarat."
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Card>
            <h3 className="text-lg font-bold uppercase">Struktur Jaringan</h3>
            <div className="mt-6 space-y-3">
              {[1, 2, 3, 4].map((lvl) => (
                <div key={lvl} className="flex items-center gap-3">
                  <span className="w-10 shrink-0 text-xs font-bold text-gold">L{lvl}</span>
                  <div className="flex flex-1 gap-1.5">
                    {Array.from({ length: lvl * 2 }).map((_, i) => (
                      <span
                        key={i}
                        className="h-2.5 flex-1 rounded-full bg-gold/70"
                        style={{ opacity: 1 - lvl * 0.12 }}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-3">
                <span className="w-10 shrink-0 text-xs font-bold text-silver">L5+</span>
                <div className="flex flex-1 gap-1.5">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className="h-2.5 flex-1 rounded-full bg-silver/40" />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              Visual ini menggambarkan struktur jaringan secara umum, bukan jumlah anggota nyata.
              Komisi tidak dihitung dua kali untuk penjualan yang sama.
            </p>
            <div className="mt-8 flex min-h-[250px] items-center justify-center border-t border-border/60 pt-6">
              <div className="flex flex-col items-center">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Iklan
                </p>
                <AdsterraBanner />
              </div>
            </div>
          </Card>
          <AffiliateCalculator />
        </div>
      </Section>

      {/* BILLIONAIRE POTENTIAL */}
      <Section
        id="potensi"
        eyebrow="Billionaire Potential"
        title="Sejauh Mana Visi Anda Untuk Masa Depan?"
        subtitle="Tetapkan sasaran Anda sendiri. Angka berikut adalah sasaran simulasi untuk membantu perencanaan, bukan jaminan kekayaan."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SASARAN.map((s) => (
            <Card key={s.label}>
              <SimLabel>Sasaran</SimLabel>
              <p className="mt-4 font-display text-2xl font-bold text-gold-gradient">{s.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* KEUNGGULAN */}
      <Section
        id="keunggulan"
        eyebrow="Keunggulan JUTAONE"
        title="Enam Alasan Memulai Bersama Kami"
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {KEUNGGULAN.map((k) => (
            <Card key={k.title}>
              <h3 className="text-base font-bold uppercase text-gold">{k.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{k.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* PAKET */}
      <Section
        id="paket"
        eyebrow="Paket & Pembelian PIN"
        title="Pilih Paket Dan Mulai Perjalanan Anda"
        subtitle="Saat ini hanya tersedia satu paket resmi yang telah dikonfirmasi. Kami tidak menampilkan paket lain agar informasi tetap akurat."
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Card className="border-gold/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-xl font-bold uppercase text-gold-gradient">
                PIN JUTAONE
              </h3>
              <SimLabel>Paket Resmi</SimLabel>
            </div>
            <p className="mt-5 font-display text-4xl font-bold">{idr(10_000)}</p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li>• Memperoleh 1.000.000 ETA</li>
              <li>• ETA dikunci selama 365 hari</li>
              <li>• Akses portal anggota JUTAONE</li>
              <li>• Berhak mengikuti program afiliasi hingga 20 level</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <GoldButton href={LOGIN_URL}>Daftar & Beli PIN</GoldButton>
              <SilverButton href={LOGIN_URL}>Masuk</SilverButton>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              Pembelian diselesaikan di portal anggota resmi JUTAONE.
            </p>
          </Card>
          <Card>
            <h3 className="text-base font-bold uppercase">Catatan Penting</h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li>• Seluruh angka Future Value di halaman ini bersifat simulasi.</li>
              <li>• JUTAONE tidak menjanjikan keuntungan maupun pendapatan tetap.</li>
              <li>• ETA tidak diklaim didukung emas dan tidak dijanjikan likuiditasnya.</li>
              <li>• Keputusan membeli PIN sepenuhnya menjadi tanggung jawab pembeli.</li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" eyebrow="FAQ" title="Pertanyaan Yang Sering Diajukan">
        <div className="grid gap-4 md:grid-cols-2">
          {FAQ.map((f) => (
            <details key={f.q} className="panel group p-5">
              <summary className="cursor-pointer list-none text-sm font-bold uppercase text-silver marker:hidden">
                <span className="mr-2 text-gold">+</span>
                {f.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* PENUTUP */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="panel relative overflow-hidden px-6 py-14 text-center sm:px-12">
          <div className="absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl" aria-hidden />
          <p className="relative text-xs font-bold uppercase tracking-[0.35em] text-gold">
            Bersama Menuju Kesuksesan
          </p>
          <h2 className="relative mt-5 text-2xl font-bold uppercase sm:text-4xl">
            Masa Depan Dimulai Dengan <span className="text-gold-gradient">Langkah Pertama</span>
          </h2>
          <p className="relative mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Kenali lebih dekat ekosistem, teknologi dan peluang JUTAONE. Mulailah dengan satu langkah
            kecil hari ini, lalu tumbuh bersama komunitas kami.
          </p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-4">
            <GoldButton href={LOGIN_URL}>Gabung Sekarang</GoldButton>
            <SilverButton href={LOGIN_URL}>Masuk</SilverButton>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex min-w-0 items-center">
            <img
              src="/logo-jutaone-footer.svg"
              alt="JUTAONE — The Future of Gold & Silver Intelligence"
              className="h-auto w-full max-w-[420px] object-contain"
            />
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground sm:max-w-sm sm:text-right">
            Seluruh simulasi di situs ini bersifat ilustrasi dan bukan nasihat keuangan maupun janji
            keuntungan. © {new Date().getFullYear()} JUTAONE.
          </p>
        </div>
      </footer>    </div>
  );
}
