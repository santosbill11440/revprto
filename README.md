# Portofolio Putra Izhar Gumilar

- public/ : situs statis (index.html, style.css, script.js, projects.js, assets/)
- netlify/functions/feedback.mjs : API penilaian di /api/feedback (Netlify Blobs)

## Deploy ulang setelah revisi
git add .
git commit -m "Revisi: halaman terpisah, pengaturan, proyek"
git push
Netlify membangun ulang otomatis dalam sekitar satu menit.

## Mengaktifkan login (sekali saja)
Netlify > Site configuration > Identity > Enable Identity. Di Registration preferences pilih Open atau Invite only.

## Menambah proyek
Buka public/projects.js, salin satu blok { ... }, isi title, type, status, desc, stack, link, dan image
(taruh gambar latar di public/assets/, misalnya assets/proyek-baru.jpg).

## Sebelum publish
Ganti email, GitHub, dan LinkedIn di public/index.html (halaman Kontak).
