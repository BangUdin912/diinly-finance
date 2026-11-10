# DiinLy Finance

Aplikasi mandiri untuk mengelola keuangan pribadi Nur Khoerudin.

## Fitur
- Login sederhana menggunakan nama pengguna sebelum membuka aplikasi.
- Akun keuangan: Bank dan E-wallet, termasuk pilihan bank BCA, BRI, Mandiri, BNI, BSI, Seabank serta e-wallet Dana, Ovo, Gopay, Shopeepay.
- CRUD pemasukan, pengeluaran, transfer, anggaran bulanan, dan target tabungan.
- Kategori pinjam uang ke teman, teman pinjam uang kita, dan pengembalian pinjaman.
- Pie chart pemasukan dan pengeluaran per kategori.
- Laporan bulanan, grafik enam bulan, ekspor Excel, PDF, CSV, dan backup JSON.
- Data keuangan disimpan pada LocalStorage terpisah dari aplikasi DiinLy utama.

## Menjalankan di Windows
Ekstrak ZIP, lalu klik dua kali `DiinLy.bat` atau buka `index.html`.

## Login dan penyimpanan
Login ini hanya meminta nama pengguna (tanpa password), sesuai alur login ringan dari aplikasi DiinLy sebelumnya. Ini bukan autentikasi keamanan dan tidak melindungi data dari orang lain yang dapat memakai browser/perangkat yang sama. Data disimpan lokal pada browser dan tidak tersinkronisasi antarperangkat.

Aplikasi menggunakan penyimpanan terpisah (`DiinLy_Finance_data_v1`) agar data aplikasi utama tidak tertimpa. Saat pertama dibuka, data lama dari DiinLy akan dibaca sebagai sumber awal jika data Finance belum tersedia; setelah itu perubahan disimpan pada ruang Finance tersendiri.
