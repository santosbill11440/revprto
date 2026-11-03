(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const D = { theme: "auto", accent: "sage", motion: "full", petals: "on", name: "" };
  let S = { ...D };
  try { S = { ...D, ...JSON.parse(localStorage.getItem("pig") || "{}") }; } catch {}
  const save = () => { try { localStorage.setItem("pig", JSON.stringify(S)); } catch {} };
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches || S.motion === "lite";
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* Pengaturan */
  function apply() {
    const dark = S.theme === "dark" || (S.theme === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
    root.dataset.theme = dark ? "dark" : "light"; root.dataset.accent = S.accent; root.dataset.motion = S.motion;
    $$("[data-set]").forEach(g => $$("button", g).forEach(b => b.setAttribute("aria-checked", String(S[g.dataset.set] === b.dataset.v))));
    $("#name").value = S.name; $("#hello").textContent = S.name ? `Selamat datang kembali, ${S.name}.` : "";
  }
  function set(k, v, e) {
    S[k] = v; save();
    if (k === "theme" && document.startViewTransition && !calm()) {
      const x = e ? e.clientX : innerWidth / 2, y = e ? e.clientY : innerHeight / 2;
      document.startViewTransition(apply).ready.then(() => root.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(150vmax at ${x}px ${y}px)`] },
        { duration: 700, easing: "cubic-bezier(.22,1,.36,1)", pseudoElement: "::view-transition-new(root)" }));
    } else apply();
    if (k === "petals" || k === "motion") petals();
  }
  $$("[data-set]").forEach(g => g.addEventListener("click", e => { const b = e.target.closest("button"); if (b) set(g.dataset.set, b.dataset.v, e); }));
  $("#savename").onclick = () => { S.name = $("#name").value.trim(); save(); apply(); $("#namemsg").textContent = S.name ? "Nama tersimpan." : "Nama dihapus."; };
  $("#reset").onclick = () => { S = { ...D }; try { localStorage.removeItem("pig"); } catch {} apply(); petals(); };
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => S.theme === "auto" && apply());

  /* Akun (Netlify Identity) */
  function paint(u) { $("#acc").textContent = u ? `Masuk sebagai ${u.email}` : "Belum masuk"; $("#in").hidden = !!u; $("#out").hidden = !u; }
  addEventListener("load", () => {
    const ni = window.netlifyIdentity;
    const need = () => { $("#accmsg").textContent = "Login aktif setelah situs di-deploy dan Identity diaktifkan di Netlify."; };
    if (!ni) { $("#login").onclick = $("#signup").onclick = need; return; }
    ni.on("init", paint); ni.on("login", u => { paint(u); ni.close(); }); ni.on("logout", () => paint(null)); ni.init();
    $("#login").onclick = () => ni.open("login"); $("#signup").onclick = () => ni.open("signup"); $("#logout").onclick = () => ni.logout();
  });

  /* Kelopak sakura */
  const cv = $("#petals"), cx = cv.getContext("2d"); let W, H, pet = [], raf = 0;
  const size = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
  const mk = () => ({ x: Math.random() * W, y: -20 - Math.random() * H, r: 5 + Math.random() * 6, v: .5 + Math.random() * .9, s: Math.random() * 6.28, w: .01 + Math.random() * .02, a: Math.random() * 6 });
  function draw() {
    cx.clearRect(0, 0, W, H);
    for (const p of pet) {
      p.y += p.v; p.s += p.w; p.a += .02; p.x += Math.sin(p.s) * .7 + .25;
      if (p.y > H + 20 || p.x > W + 20) Object.assign(p, mk(), { y: -20 });
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = "rgba(244,160,185,.65)";
      cx.beginPath(); cx.ellipse(0, 0, p.r, p.r * .55, 0, 0, 7); cx.fill(); cx.restore();
    }
    raf = requestAnimationFrame(draw);
  }
  function petals() {
    cancelAnimationFrame(raf); size(); cx.clearRect(0, 0, W, H);
    if (S.petals === "on" && !calm() && !document.hidden) { pet = Array.from({ length: 26 }, mk); raf = requestAnimationFrame(draw); }
  }
  addEventListener("resize", petals); document.addEventListener("visibilitychange", petals);

  /* Reveal, bar, penghitung */
  const count = el => {
    const to = +el.dataset.count; if (calm()) { el.textContent = to; return; }
    const t0 = performance.now();
    (function f(t) { const k = Math.min(1, (t - t0) / 1100); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); })(t0);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    $$(".bar i", e.target).forEach(b => b.style.width = b.dataset.w + "%");
    $$("[data-count]", e.target).forEach(count);
    io.unobserve(e.target);
  }), { threshold: .15 });

  /* Router berbasis hash: satu halaman per tampilan */
  const veil = $("#veil"); let cur = null, busy = false;
  const ids = $$(".page").map(p => p.id.slice(2));
  function show(id) {
    $$(".page").forEach(p => p.classList.remove("active"));
    const pg = $("#p-" + id); pg.classList.add("active"); scrollTo(0, 0);
    document.title = `${pg.dataset.title} | Putra Izhar Gumilar`;
    $$(".rail a:not(.logo)").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#/" + id));
    $$(".bar i", pg).forEach(b => b.style.width = 0);
    $$(".rise", pg).forEach(e => { e.classList.remove("in"); io.observe(e); });
    if (id === "beranda") setTimeout(() => $$(".hero .bar i").forEach(b => b.style.width = b.dataset.w + "%"), 900);
    cur = id;
  }
  async function route() {
    const r = location.hash.replace("#/", ""), id = ids.includes(r) ? r : "beranda";
    if (id === cur || busy) return;
    if (cur && !calm()) {
      busy = true; const o = { duration: 360, easing: "cubic-bezier(.65,0,.35,1)", fill: "forwards" };
      await veil.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], o).finished;
      show(id);
      await veil.animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], o).finished;
      busy = false; if (location.hash.replace("#/", "") !== id) route();
    } else show(id);
  }
  addEventListener("hashchange", route);

  /* Teks hero dipecah per huruf */
  const h1 = $("#h1"), txt = h1.textContent; h1.setAttribute("aria-label", txt);
  h1.innerHTML = [...txt].map((c, i) => c === " " ? " " : `<span class="ch" style="--c:${i}" aria-hidden="true">${esc(c)}</span>`).join("");

  /* Jam WIB */
  const tick = () => { $("#time").textContent = new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit" }).replace(".", ":"); };
  tick(); setInterval(tick, 30000);

  /* Efek pointer: paralaks blob, sorotan panel, miring kartu, tombol magnetis */
  const blob = $("#blob"), bimg = $(".blob-img");
  blob.addEventListener("pointermove", e => {
    if (calm()) return; const b = blob.getBoundingClientRect();
    bimg.style.transform = `translate(${((e.clientX - b.left) / b.width - .5) * -22}px,${((e.clientY - b.top) / b.height - .5) * -22}px)`;
  });
  document.addEventListener("pointermove", e => {
    if (calm()) return;
    const p = e.target.closest(".panel"); if (p) { const b = p.getBoundingClientRect(); p.style.setProperty("--mx", e.clientX - b.left + "px"); p.style.setProperty("--my", e.clientY - b.top + "px"); }
    const c = e.target.closest(".proj"); if (c) { const b = c.getBoundingClientRect(); c.style.setProperty("--ry", ((e.clientX - b.left) / b.width - .5) * 10 + "deg"); c.style.setProperty("--rx", ((e.clientY - b.top) / b.height - .5) * -10 + "deg"); }
    const m = e.target.closest(".btn"); if (m) { const b = m.getBoundingClientRect(); m.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * .15}px,${(e.clientY - b.top - b.height / 2) * .25}px)`; }
  });
  document.addEventListener("pointerout", e => {
    const c = e.target.closest(".proj"); if (c) { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); }
    const m = e.target.closest(".btn"); if (m) m.style.transform = "";
  });

  /* Proyek: dirender dari projects.js */
  const P = window.PROJECTS || [], grid = $("#grid"), dlg = $("#dlg");
  grid.innerHTML = P.map((p, i) => `<article class="proj" tabindex="0" role="button" data-i="${i}" data-t="${esc(p.type)}" style="--img:url('${esc(p.image)}');--n:${i}"><span class="badge">${esc(p.status)}</span><h3>${esc(p.title)}</h3><p>${esc(p.type)}</p></article>`).join("");
  $("#filters").innerHTML = ["Semua", ...new Set(P.map(p => p.type))].map((t, i) => `<button class="chip${i ? "" : " on"}" data-t="${esc(t)}">${esc(t)}</button>`).join("");
  $("#filters").onclick = e => {
    const b = e.target.closest(".chip"); if (!b) return;
    $$(".chip").forEach(x => x.classList.toggle("on", x === b));
    $$(".proj").forEach((c, n) => { const ok = b.dataset.t === "Semua" || c.dataset.t === b.dataset.t; c.hidden = !ok; c.style.setProperty("--n", n); c.style.animation = "none"; c.offsetWidth; c.style.animation = ""; });
  };
  const open = c => {
    const p = P[+c.dataset.i]; $("#dimg").style.backgroundImage = `url('${p.image}')`;
    $("#dt").textContent = p.title; $("#dd").textContent = p.desc; $("#ds").innerHTML = (p.stack || []).map(s => `<li>${esc(s)}</li>`).join("");
    const l = $("#dl"); l.hidden = !p.link; if (p.link) l.href = p.link; dlg.showModal();
  };
  grid.addEventListener("click", e => { const c = e.target.closest(".proj"); if (c) open(c); });
  grid.addEventListener("keydown", e => { const c = e.target.closest(".proj"); if (c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(c); } });
  $("#dx").onclick = () => dlg.close(); dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

  /* Penilaian */
  let score = 0; const stars = $("#stars"), msg = $("#msg");
  for (let i = 1; i <= 5; i++) {
    const b = Object.assign(document.createElement("button"), { type: "button", textContent: "\u2605" });
    b.setAttribute("role", "radio"); b.setAttribute("aria-label", i + " bintang");
    b.onclick = () => { score = i; $$("button", stars).forEach((x, n) => x.classList.toggle("on", n < i)); };
    stars.append(b);
  }
  const sum = d => d.count ? `Rata-rata ${d.average.toFixed(1)} dari 5 dari ${d.count} penilaian.` : "Belum ada penilaian. Jadilah yang pertama.";
  fetch("/api/feedback").then(r => r.json()).then(d => msg.textContent = sum(d)).catch(() => {});
  $("#send").onclick = async () => {
    if (!score) { msg.textContent = "Pilih jumlah bintang dulu."; return; }
    try {
      const r = await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating: score, comment: $("#comment").value.trim() }) });
      if (!r.ok) throw new Error(r.status);
      msg.textContent = "Terkirim. " + sum(await r.json()); $("#comment").value = "";
    } catch { msg.textContent = "Belum terkirim. Fitur ini aktif setelah situs di-deploy ke Netlify."; }
  };

  apply(); petals(); route();
})();
