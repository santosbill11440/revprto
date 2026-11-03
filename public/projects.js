/* Daftar proyek. Untuk menambah proyek: salin satu blok { ... }, taruh gambar latar di assets/, lalu isi image.
   type dipakai sebagai filter. link boleh dikosongkan. Entri berstatus "Contoh" adalah placeholder, ganti kapan saja. */
window.PROJECTS = [
  { title: "Situs portofolio ini", type: "Web", status: "Selesai", image: "assets/valley.jpg",
    desc: "Situs berhalaman terpisah dengan tema, aksen warna, dan penilaian pengunjung lewat fungsi Netlify.",
    stack: ["HTML", "CSS", "JavaScript", "Netlify"], link: "" },
  { title: "Analisis data publik Indonesia", type: "Data", status: "Contoh", image: "assets/swing.jpg",
    desc: "Eksplorasi dataset terbuka dengan Pandas dan visualisasi. Ganti dengan proyek analisis pertama Anda.",
    stack: ["Python", "Pandas", "Matplotlib"], link: "" },
  { title: "Model prediksi sederhana", type: "ML", status: "Contoh", image: "assets/sakura.jpg",
    desc: "Regresi linear dengan scikit-learn, lengkap dengan evaluasi model dan catatan kesalahan.",
    stack: ["Python", "scikit-learn"], link: "" },
  { title: "Dashboard visualisasi", type: "Data", status: "Contoh", image: "assets/lake.jpg",
    desc: "Dashboard interaktif untuk membaca tren dari satu dataset pilihan.",
    stack: ["Python", "Plotly"], link: "" },
  { title: "Catatan belajar statistika", type: "Web", status: "Contoh", image: "assets/sky.jpg",
    desc: "Kumpulan catatan dan ringkasan materi statistika yang bisa dicari.",
    stack: ["HTML", "JavaScript"], link: "" },
  { title: "Latihan SQL harian", type: "Data", status: "Contoh", image: "assets/valley.jpg",
    desc: "Repositori soal dan jawaban SQL berjenjang dari dasar sampai join dan window function.",
    stack: ["SQL", "SQLite"], link: "" }
];
