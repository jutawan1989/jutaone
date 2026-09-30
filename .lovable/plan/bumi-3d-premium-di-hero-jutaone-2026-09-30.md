# Bumi 3D Premium di Hero JUTAONE

## Ringkasan
Mengganti area gambar hero saat ini dengan Bumi 3D realistis yang berputar otomatis, tanpa mengubah teks, tombol, navigasi, bagian lain, atau identitas visual JUTAONE.

## Yang akan dibangun
- Bumi 3D responsif dengan tekstur benua dan samudra, lapisan awan, atmosfer biru, cahaya kota emas, bintang, serta orbit halus.
- Rotasi vertikal tepat satu putaran setiap 30 detik dan dimulai saat halaman dimuat.
- Logo resmi JUTAONE tetap diam sebagai lapisan depan; teks hero dan seluruh tata letak tetap seperti sekarang.
- Fallback statis memakai aset resmi JUTAONE bila WebGL tidak tersedia atau adegan gagal dimuat.
- Pengaturan hemat daya untuk seluler: rasio piksel dibatasi dan detail geometri disesuaikan.

## Teknis
- Three.js melalui React Three Fiber, dimuat hanya di browser agar tidak menimbulkan masalah saat halaman pertama dibuka.
- Tekstur Bumi disimpan lokal di proyek, bukan dipanggil dari situs luar saat pengunjung membuka halaman.
- Animasi menghormati preferensi pengurangan gerak; Bumi tetap terlihat tanpa rotasi bila animasi dinonaktifkan perangkat.
- Adegan diberi batas ukuran stabil agar tidak menggeser tata letak hero.

## Verifikasi
- Uji desktop dan seluler untuk proporsi, logo diam, serta tidak ada tumpang tindih.
- Pastikan putaran bergerak, semua aset mengembalikan status berhasil, dan fallback bekerja saat WebGL dimatikan.
- Pastikan halaman bebas error tampilan, konsol, dan pemuatan aset.
