"use strict";
(function () {
  /* ================= Configuración ================= */
  const PTS_OK = 10, PTS_MAL = -3, PTS_PERFECTO = 5;
  const PREFIJO = "sust_"; // claves de localStorage de esta app

  const PARES = [
    { k: "CP", i: 0, vals: ["comun", "propio"], titulo: "común o propio", icono: "🏷️",
      pista: "Común: cualquiera de su clase (niño, río). Propio: uno en concreto, con mayúscula (Lucía, Ebro)." },
    { k: "IC", i: 1, vals: ["individual", "colectivo"], titulo: "individual o colectivo", icono: "🐑",
      pista: "Colectivo: en singular ya nombra un conjunto (un rebaño = muchas ovejas). Individual: nombra a uno solo." },
    { k: "CA", i: 2, vals: ["concreto", "abstracto"], titulo: "concreto o abstracto", icono: "💭",
      pista: "Concreto: se percibe con los sentidos (mesa, agua). Abstracto: ideas, sentimientos o cualidades (bondad, idea)." },
    { k: "CN", i: 3, vals: ["contable", "incontable"], titulo: "contable o incontable", icono: "🔢",
      pista: "Contable: se puede contar (dos libros). Incontable: no se cuenta, se mide (un vaso de agua, no «dos aguas»)." },
  ];
  const PAR = Object.fromEntries(PARES.map((p) => [p.k, p]));
  const NOMBRE_VAL = { comun: "Común", propio: "Propio", individual: "Individual", colectivo: "Colectivo", concreto: "Concreto", abstracto: "Abstracto", contable: "Contable", incontable: "Incontable" };
  const parDeVal = (v) => PARES.find((p) => p.vals.includes(v));

  const CLAVES = [
    { clave: "CP", nombre: "Común / propio", icono: "🏷️", tema: "cp" },
    { clave: "IC", nombre: "Individual / colectivo", icono: "🐑", tema: "ic" },
    { clave: "CA", nombre: "Concreto / abstracto", icono: "💭", tema: "ca" },
    { clave: "CN", nombre: "Contable / incontable", icono: "🔢", tema: "cn" },
    { clave: "VOC", nombre: "Vocabulario de colectivos", icono: "📚", tema: "voc" },
  ];
  const TEMAS = { todo: "Todo mezclado", cp: "Común / Propio", ic: "Individual / Colectivo", ca: "Concreto / Abstracto", cn: "Contable / Incontable", voc: "Colectivos" };
  const CLAVES_TEMA = { todo: ["CP", "IC", "CA", "CN", "VOC"], cp: ["CP"], ic: ["IC"], ca: ["CA"], cn: ["CN"], voc: ["VOC"] };
  const MODOS = {
    ficha: "🗂️ Clasifica la palabra",
    lineas: "✏️ Completa las fichas",
    rapida: "⚡ Pregunta rápida",
    par: "🧺 Separa en dos cajas",
    escribe: "⌨️ Escribe el colectivo",
    cual: "🤔 ¿Conjunto de qué?",
  };
  function modosDe(clave, tema) {
    if (clave === "VOC") return ["escribe", "escribe", "cual"];
    if (tema === "todo") return ["ficha", "lineas", "rapida", "par"];
    return ["rapida", "par", "rapida"];
  }

  /* ================= Utilidades ================= */
  const $ = (id) => document.getElementById(id);
  const azar = (a) => a[Math.floor(Math.random() * a.length)];
  const barajar = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function el(tag, cls, texto) { const e = document.createElement(tag); if (cls) e.className = cls; if (texto != null) e.textContent = texto; return e; }
  const plural = (n, s, p) => n + " " + (n === 1 ? s : p);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // Para comparar respuestas escritas sin tener en cuenta mayúsculas, tildes ni artículos
  const normalizar = (s) => String(s).toLowerCase().normalize("NFD").replace(/\p{M}/gu, "")
    .replace(/[^a-z\s]/g, " ").replace(/^\s*(un|una|el|la|los|las|unos|unas)\s+/, "").replace(/\s+/g, " ").trim();

  /* ================= Datos ================= */
  const NOMBRES = (window.SUST_NOMBRES || []).map(([p, clas, n], id) => {
    const v = clas.trim().split(/\s+/).map((x) => (x === "-" ? null : x));
    v.forEach((x, i) => { if (x && !PARES[i].vals.includes(x)) console.warn("Valor desconocido", x, "en", p); });
    return { id, p, v, n: n || null };
  });
  const paresDe = (nom) => PARES.filter((par) => nom.v[par.i]);
  const COLECTIVOS = (window.SUST_COLECTIVOS || []).map(([conArt, de, alt], id) => {
    const [art, ...resto] = conArt.split(" ");
    const c = resto.join(" ");
    return { id, art, c, de, validas: [c, ...(alt ? alt.split("/") : [])].map(normalizar), alt: alt ? alt.split("/") : [] };
  });

  /* ================= Confeti ================= */
  const cv = $("confeti"), cx = cv.getContext("2d");
  let piezas = [], animando = false;
  function confeti(n = 140) {
    cv.width = innerWidth; cv.height = innerHeight;
    const colores = ["#facc15", "#22d3ee", "#4ade80", "#f472b6", "#a78bfa", "#fb923c", "#60a5fa"];
    for (let i = 0; i < n; i++) {
      piezas.push({ x: innerWidth / 2 + (Math.random() - 0.5) * 300, y: innerHeight * 0.35, vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 15 - 5,
        r: Math.random() * 7 + 4, c: azar(colores), rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, vida: 0 });
    }
    if (!animando) { animando = true; requestAnimationFrame(paso); }
  }
  function paso() {
    cx.clearRect(0, 0, cv.width, cv.height);
    piezas.forEach((p) => {
      p.vy += 0.4; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vida++;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillStyle = p.c; cx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); cx.restore();
    });
    piezas = piezas.filter((p) => p.y < cv.height + 30 && p.vida < 260);
    if (piezas.length) requestAnimationFrame(paso);
    else { animando = false; cx.clearRect(0, 0, cv.width, cv.height); }
  }

  /* ================= Estadísticas guardadas ================= */
  const HIST_MAX = 40, HIST_MIN = 6, UMBRAL_FLOJO = 60, UMBRAL_BIEN = 80;
  let HIST = cargarHist();
  function cargarHist() {
    try { const h = JSON.parse(localStorage.getItem(PREFIJO + "hist")); return h && typeof h === "object" ? h : {}; }
    catch (e) { return {}; }
  }
  function guardarHist() { try { localStorage.setItem(PREFIJO + "hist", JSON.stringify(HIST)); } catch (e) { /* nada */ } }
  function anotar(clave, ok) {
    S.stats[clave] = S.stats[clave] || { ok: 0, mal: 0 };
    S.stats[clave][ok ? "ok" : "mal"]++;
    const h = (HIST[clave] = HIST[clave] || []);
    h.push(ok ? 1 : 0);
    if (h.length > HIST_MAX) h.splice(0, h.length - HIST_MAX);
  }
  function nivelDe(clave) {
    const h = HIST[clave] || [];
    if (h.length < HIST_MIN) return { n: h.length, pct: null, estado: "nuevo" };
    const pct = Math.round((h.reduce((a, b) => a + b, 0) / h.length) * 100);
    return { n: h.length, pct, estado: pct < UMBRAL_FLOJO ? "flojo" : pct < UMBRAL_BIEN ? "mejorando" : "dominado" };
  }
  const peso = (clave) => ({ flojo: 3, mejorando: 1.6, nuevo: 1.4, dominado: 0.6 }[nivelDe(clave).estado]);
  function azarPonderado(lista, fnPeso) {
    const pesos = lista.map(fnPeso), total = pesos.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < lista.length; i++) { r -= pesos[i]; if (r <= 0) return lista[i]; }
    return lista[lista.length - 1];
  }
  const ESTADOS = {
    flojo: { txt: "¡A practicar!", icono: "⚠️" }, mejorando: { txt: "Mejorando", icono: "📈" },
    dominado: { txt: "¡Dominado!", icono: "⭐" }, nuevo: { txt: "Pocos datos", icono: "🆕" },
  };
  function pintarProgreso() {
    document.querySelectorAll(".tema").forEach((b) => {
      b.classList.remove("practicar");
      b.querySelectorAll(".cinta").forEach((x) => x.remove());
      const t = b.dataset.topic;
      if (t === "todo") return;
      if (CLAVES_TEMA[t].some((k) => nivelDe(k).estado === "flojo")) { b.classList.add("practicar"); b.append(el("span", "cinta", "¡A practicar!")); }
    });
    const panel = $("progreso");
    const hayDatos = CLAVES.some((c) => (HIST[c.clave] || []).length > 0);
    panel.hidden = !hayDatos;
    if (!hayDatos) return;
    const flojos = CLAVES.filter((c) => nivelDe(c.clave).estado === "flojo");
    const filas = CLAVES.map((c) => {
      const nv = nivelDe(c.clave), e = ESTADOS[nv.estado];
      return `<button class="prog-fila e-${nv.estado}" data-tema="${c.tema}"><span class="pf-nombre">${c.icono} ${c.nombre}</span>` +
        `<span class="pf-barra"><span style="width:${nv.pct || 0}%"></span></span>` +
        `<span class="pf-pct">${nv.pct === null ? nv.n + "/" + HIST_MIN : nv.pct + "%"}</span><span class="pf-estado">${e.icono} ${e.txt}</span></button>`;
    }).join("");
    const unir = (l) => (l.length > 1 ? l.slice(0, -1).join(", ") + " y " + l[l.length - 1] : l[0]);
    const reco = flojos.length ? `💡 Te recomendamos practicar: ${unir(flojos.map((c) => `<b>${c.nombre.toLowerCase()}</b>`))}.` : "🌟 ¡Vas genial! No hay nada flojo por ahora. ¡Sigue así!";
    const abierto = panel.querySelector("details")?.open || false;
    const resumen = flojos.length
      ? `<span class="prog-chip hay">⚠️ ${flojos.length} ${flojos.length === 1 ? "punto" : "puntos"} para practicar</span>`
      : `<span class="prog-chip nada">🌟 ¡Vas genial!</span>`;
    panel.innerHTML =
      `<details${abierto ? " open" : ""}><summary><span class="prog-tit">📊 Tu progreso</span>${resumen}<span class="prog-flecha">▾</span></summary>` +
      `<div class="prog-cuerpo"><p class="prog-reco ${flojos.length ? "hay" : "nada"}">${reco}</p><div class="prog-filas">${filas}</div>` +
      `<p class="prog-nota">Según tus últimas ${HIST_MAX} respuestas de cada tipo. En «Todo mezclado» saldrán más preguntas de lo que tienes más flojo. Haz clic en una fila para elegir ese tema.</p>` +
      `<button class="btn-link" id="btnBorrarStats">🗑️ Borrar estadísticas</button></div></details>`;
    panel.querySelectorAll(".prog-fila").forEach((f) => f.addEventListener("click", () => elegirTema(f.dataset.tema, true)));
    $("btnBorrarStats").addEventListener("click", () => {
      if (!confirm("¿Seguro que quieres borrar todas las estadísticas guardadas?")) return;
      HIST = {}; guardarHist(); pintarProgreso();
    });
  }

  /* ================= Estado ================= */
  let temaElegido = "todo", rondasElegidas = 10, S = null;
  function nuevaPartida() {
    S = { tema: temaElegido, rondas: rondasElegidas, ronda: 0, puntos: 0, racha: 0, mejorRacha: 0, perfectas: 0,
      usadas: new Set(), ultimoModo: null, ex: null, comprobado: false, stats: {} };
    pantalla("juego"); actualizarHud(); siguienteRonda();
  }
  function pantalla(nombre) {
    $("pantallaInicio").hidden = nombre !== "inicio";
    $("pantallaJuego").hidden = nombre !== "juego";
    $("pantallaFin").hidden = nombre !== "fin";
    $("hud").hidden = nombre !== "juego";
    $("progress").hidden = nombre !== "juego";
    $("btnSalir").hidden = nombre === "inicio";
    $("btnApps").hidden = nombre === "juego";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function actualizarHud() {
    $("hudRonda").textContent = Math.max(S.ronda, 1) + "/" + S.rondas;
    $("hudPuntos").textContent = S.puntos;
    $("hudRacha").textContent = S.racha;
    $("progressBar").style.width = ((S.ronda - (S.comprobado ? 0 : 1)) / S.rondas) * 100 + "%";
  }
  function elegirSinRepetir(lista, prefijo) {
    if (!lista.length) return null;
    const nuevos = lista.filter((x) => !S.usadas.has(prefijo + x.id));
    const x = azar(nuevos.length ? nuevos : lista);
    S.usadas.add(prefijo + x.id);
    return x;
  }

  /* ================= Constructores de ejercicios ================= */
  const CONSTRUIR = {
    ficha() {
      const nombre = elegirSinRepetir(NOMBRES, "n");
      return { modo: "ficha", nombre, filas: paresDe(nombre).map((par) => ({ par, eleccion: null })) };
    },
    lineas() {
      const a = elegirSinRepetir(NOMBRES, "n");
      const b = elegirSinRepetir(NOMBRES.filter((x) => x.id !== a.id && !(a.v[0] === "propio" && x.v[0] === "propio")), "n");
      return { modo: "lineas", fichas: [a, b].map((nombre) => ({ nombre, slots: paresDe(nombre).map(() => null) })), cogida: null };
    },
    rapida(clave) {
      const par = PAR[clave];
      const lado = azar(par.vals);
      const nombre = elegirSinRepetir(NOMBRES.filter((x) => x.v[par.i] === lado), "n");
      return nombre ? { modo: "rapida", nombre, par, clave, correcta: lado } : null;
    },
    par(clave) {
      const par = PAR[clave];
      let elegidos = [];
      par.vals.forEach((v) => { elegidos = elegidos.concat(barajar(NOMBRES.filter((x) => x.v[par.i] === v)).slice(0, 3)); });
      const chips = barajar(elegidos).map((nombre, i) => ({ id: i, nombre, sitio: null }));
      const pozos = par.vals.map((v) => ({ clave: v, texto: NOMBRE_VAL[v], icono: par.icono, cls: "p-" + par.k }));
      return { modo: "par", par, clave, chips, pozos };
    },
    escribe() {
      const item = elegirSinRepetir(COLECTIVOS, "c");
      return { modo: "escribe", item, clave: "VOC", pista: false };
    },
    cual() {
      const item = elegirSinRepetir(COLECTIVOS, "c");
      const otros = barajar(COLECTIVOS.filter((x) => x.id !== item.id)).slice(0, 3).map((x) => x.de);
      return { modo: "cual", item, clave: "VOC", ops: [item.de, ...otros] };
    },
  };

  function siguienteRonda() {
    if (S.ronda >= S.rondas) return fin();
    S.ronda++;
    S.comprobado = false;
    let ex = null;
    for (let intento = 0; intento < 12 && !ex; intento++) {
      const clave = azarPonderado(CLAVES_TEMA[S.tema], peso); // lo flojo sale más
      let modos = modosDe(clave, S.tema);
      if (intento < 6 && modos.some((m) => m !== S.ultimoModo)) modos = modos.filter((m) => m !== S.ultimoModo);
      ex = CONSTRUIR[azar(modos)](clave);
    }
    S.ex = ex;
    S.ultimoModo = ex.modo;
    const card = $("cardJuego");
    card.style.animation = "none"; void card.offsetWidth; card.style.animation = "";
    $("feedback").hidden = true; $("feedback").innerHTML = "";
    $("zonaExtra").innerHTML = "";
    const fr = $("frase");
    fr.hidden = false; fr.className = "frase"; fr.innerHTML = "";
    $("btnComprobar").hidden = false; $("btnComprobar").disabled = true;
    $("btnSiguiente").hidden = true;
    const modo = $("modo");
    modo.className = "modo m-" + ex.modo;
    modo.textContent = MODOS[ex.modo];
    PINTAR[ex.modo](ex);
    actualizarHud();
  }

  /* ================= Opciones (botones) ================= */
  function pintarOpciones(ex, ops, { textos = false } = {}) {
    const cont = el("div", "opciones n" + ops.length + (textos ? " textos" : ""));
    ex.botones = {};
    ops.forEach((o) => {
      const b = el("button", "opcion o-" + (o.cls || "x"));
      if (o.icono) b.append(el("span", "oi", o.icono));
      b.append(el("span", "ot", o.texto));
      b.addEventListener("click", () => {
        if (S.comprobado) return;
        Object.values(ex.botones).forEach((x) => x.classList.remove("sel"));
        b.classList.add("sel");
        ex.respuesta = o.clave;
        $("btnComprobar").disabled = false;
      });
      ex.botones[o.clave] = b;
      cont.append(b);
    });
    $("zonaExtra").append(cont);
  }
  function corregirOpciones(ex) {
    const acierto = ex.respuesta === ex.correcta;
    Object.values(ex.botones).forEach((b) => (b.disabled = true));
    ex.botones[ex.respuesta].classList.remove("sel");
    ex.botones[ex.correcta].classList.add("ok");
    if (!acierto) ex.botones[ex.respuesta].classList.add("ko");
    return acierto;
  }
  function palabraGrande(texto, arrastrable) {
    const fr = $("frase");
    fr.classList.add("centro");
    const p = el("span", "palabra-grande" + (arrastrable ? "" : " fija"), texto);
    fr.append(p);
    return p;
  }

  /* ================= Pintar cada modo ================= */
  const PINTAR = {
    // --- Una misma palabra en una caja de cada par ---
    ficha(ex) {
      $("instruccion").innerHTML = "Arrastra la palabra a <b>una caja de cada fila</b>. <small style=\"color:var(--ink-soft)\">(También puedes hacer clic en la caja)</small>";
      const p = palabraGrande(ex.nombre.p, true);
      p.draggable = true;
      p.addEventListener("dragstart", (e) => { if (S.comprobado) { e.preventDefault(); return; } e.dataTransfer.setData("text/plain", "palabra"); });
      $("frase").append(el("span", "ayuda-drag", "👆 Puedes arrastrarla tantas veces como quieras"));
      const cont = el("div", "filas-par");
      ex.filas.forEach((fila) => {
        const row = el("div", "fila-par");
        fila.cajas = {};
        fila.par.vals.forEach((v, idx) => {
          const caja = el("div", "caja-par c-" + fila.par.k);
          caja.append(el("span", "cp-nombre", NOMBRE_VAL[v]));
          const poner = () => {
            if (S.comprobado) return;
            fila.eleccion = v;
            Object.entries(fila.cajas).forEach(([val, c]) => {
              c.classList.toggle("llena", val === v);
              c.querySelector(".copia")?.remove();
              if (val === v) c.append(el("span", "copia", ex.nombre.p));
            });
            $("btnComprobar").disabled = ex.filas.some((f) => !f.eleccion);
          };
          caja.addEventListener("click", poner);
          caja.addEventListener("dragover", (e) => { if (S.comprobado) return; e.preventDefault(); caja.classList.add("sobre"); });
          caja.addEventListener("dragleave", () => caja.classList.remove("sobre"));
          caja.addEventListener("drop", (e) => { e.preventDefault(); caja.classList.remove("sobre"); poner(); });
          fila.cajas[v] = caja;
          row.append(caja);
          if (idx === 0) row.append(el("span", "vs", "o"));
        });
        cont.append(row);
      });
      $("zonaExtra").append(cont);
    },

    // --- Etiquetas sobre líneas de puntos ---
    lineas(ex) {
      $("instruccion").innerHTML = "Arrastra sobre las <b>líneas de puntos</b> una etiqueta de <b>cada pareja</b> para cada palabra. <small style=\"color:var(--ink-soft)\">(O haz clic en la etiqueta y luego en la línea. Clic en una línea llena para vaciarla)</small>";
      $("frase").hidden = true;
      const paleta = el("div", "paleta");
      PARES.forEach((par) => par.vals.forEach((v) => {
        const e = el("span", "etq e-" + v, NOMBRE_VAL[v]);
        e.draggable = true;
        e.addEventListener("dragstart", (ev) => { if (S.comprobado) { ev.preventDefault(); return; } ev.dataTransfer.setData("text/plain", v); });
        e.addEventListener("click", () => {
          if (S.comprobado) return;
          paleta.querySelectorAll(".etq").forEach((x) => x.classList.remove("cogido"));
          if (ex.cogida === v) { ex.cogida = null; return; }
          ex.cogida = v; e.classList.add("cogido");
        });
        paleta.append(e);
      }));
      ex.paleta = paleta;
      const fichas = el("div", "fichas");
      ex.fichas.forEach((f) => {
        const row = el("div", "ficha-linea");
        row.append(el("span", "fl-palabra", f.nombre.p));
        f.slotEls = f.slots.map((_, i) => {
          const s = el("div", "slot");
          const poner = (v) => {
            f.slots[i] = v;
            s.innerHTML = "";
            if (v) s.append(el("span", "etq e-" + v, NOMBRE_VAL[v]));
            $("btnComprobar").disabled = ex.fichas.some((x) => x.slots.some((y) => !y));
          };
          s.addEventListener("click", () => {
            if (S.comprobado) return;
            if (ex.cogida) { poner(ex.cogida); ex.cogida = null; paleta.querySelectorAll(".etq").forEach((x) => x.classList.remove("cogido")); }
            else if (f.slots[i]) poner(null);
          });
          s.addEventListener("dragover", (e) => { if (S.comprobado) return; e.preventDefault(); s.classList.add("sobre"); });
          s.addEventListener("dragleave", () => s.classList.remove("sobre"));
          s.addEventListener("drop", (e) => { e.preventDefault(); s.classList.remove("sobre"); const v = e.dataTransfer.getData("text/plain"); if (NOMBRE_VAL[v]) poner(v); });
          row.append(s);
          return s;
        });
        f.rowEl = row;
        fichas.append(row);
      });
      $("zonaExtra").append(paleta, fichas);
    },

    rapida(ex) {
      const [a, b] = ex.par.vals;
      $("instruccion").innerHTML = `¿Es <b>${NOMBRE_VAL[a].toLowerCase()}</b> o <b>${NOMBRE_VAL[b].toLowerCase()}</b>?`;
      palabraGrande(ex.nombre.p, false);
      pintarOpciones(ex, ex.par.vals.map((v) => ({ clave: v, texto: NOMBRE_VAL[v], icono: ex.par.icono, cls: ex.par.k })));
    },

    par(ex) {
      $("instruccion").innerHTML = `Arrastra cada sustantivo a su caja: <b>${ex.par.titulo}</b>. <small style="color:var(--ink-soft)">(También puedes hacer clic en la palabra y luego en la caja)</small>`;
      $("frase").hidden = true;
      pintarArrastre(ex);
    },

    escribe(ex) {
      $("instruccion").innerHTML = "Escribe el <b>nombre colectivo</b>. <small style=\"color:var(--ink-soft)\">(No importan las mayúsculas ni las tildes)</small>";
      const fr = $("frase");
      fr.classList.add("pregunta", "centro");
      fr.innerHTML = `¿Cómo se llama un conjunto de <b>${esc(ex.item.de)}</b>?`;
      const r = el("div", "respuesta");
      const inp = el("input");
      inp.type = "text"; inp.placeholder = "Escribe aquí…"; inp.autocomplete = "off"; inp.spellcheck = false;
      inp.addEventListener("input", () => { $("btnComprobar").disabled = !inp.value.trim(); });
      inp.addEventListener("keydown", (e) => { if (e.key === "Enter" && inp.value.trim() && !S.comprobado) comprobar(); });
      const bp = el("button", "btn pista", "💡 Pista");
      const pt = el("p", "pista-txt");
      pt.hidden = true;
      bp.addEventListener("click", () => {
        ex.pista = true; bp.disabled = true;
        const c = ex.item.c;
        pt.textContent = `Empieza por «${c[0].toUpperCase()}» y tiene ${c.length} letras: ${c[0].toUpperCase()}${" _".repeat(c.length - 1)}  (con pista no hay bonus ⭐)`;
        pt.hidden = false; inp.focus();
      });
      r.append(inp, bp);
      ex.inp = inp; ex.btnPista = bp;
      $("zonaExtra").append(r, pt);
      setTimeout(() => inp.focus(), 50);
    },

    cual(ex) {
      $("instruccion").innerHTML = "Elige la respuesta correcta:";
      const fr = $("frase");
      fr.classList.add("pregunta", "centro");
      const art = ex.item.art[0].toUpperCase() + ex.item.art.slice(1);
      fr.innerHTML = `${esc(art)} <b>${esc(ex.item.c)}</b> es un conjunto de…`;
      ex.correcta = "0";
      pintarOpciones(ex, barajar(ex.ops.map((t, i) => ({ clave: String(i), texto: t }))), { textos: true });
    },
  };

  /* ================= Arrastrar y soltar (modo «par») ================= */
  function pintarArrastre(ex) {
    const z = $("zonaExtra");
    const banco = el("div", "banco");
    banco.dataset.zona = "__banco";
    ex.bancoEl = banco; ex.cogido = null;
    ex.chips.forEach((c) => {
      const ch = el("div", "chip", c.nombre.p);
      ch.draggable = true; c.el = ch;
      ch.addEventListener("dragstart", (e) => {
        if (S.comprobado) { e.preventDefault(); return; }
        e.dataTransfer.setData("text/plain", "chip:" + c.id); ch.classList.add("arrastrando");
      });
      ch.addEventListener("dragend", () => ch.classList.remove("arrastrando"));
      ch.addEventListener("click", (e) => {
        e.stopPropagation();
        if (S.comprobado) return;
        if (ex.cogido === c) { ch.classList.remove("cogido"); ex.cogido = null; return; }
        if (ex.cogido) ex.cogido.el.classList.remove("cogido");
        ex.cogido = c; ch.classList.add("cogido");
      });
      banco.append(ch);
    });
    const pozos = el("div", "pozos n" + ex.pozos.length);
    ex.pozos.forEach((p) => {
      const d = el("div", "pozo " + p.cls); d.dataset.zona = p.clave;
      const h = el("div", "pozo-h"); h.append(el("span", "pi", p.icono), document.createTextNode(p.texto));
      const b = el("div", "pozo-b"); d.append(h, b); p.cuerpo = b; pozos.append(d);
    });
    z.append(banco, pozos);
    [banco, ...pozos.children].forEach((zona) => {
      zona.addEventListener("dragover", (e) => { if (S.comprobado) return; e.preventDefault(); zona.classList.add("sobre"); });
      zona.addEventListener("dragleave", (e) => { if (!zona.contains(e.relatedTarget)) zona.classList.remove("sobre"); });
      zona.addEventListener("drop", (e) => {
        e.preventDefault(); zona.classList.remove("sobre");
        const c = ex.chips.find((x) => "chip:" + x.id === e.dataTransfer.getData("text/plain"));
        if (c) mover(ex, c, zona.dataset.zona);
      });
      zona.addEventListener("click", () => { if (ex.cogido && !S.comprobado) mover(ex, ex.cogido, zona.dataset.zona); });
    });
  }
  function mover(ex, c, zona) {
    c.sitio = zona === "__banco" ? null : zona;
    (zona === "__banco" ? ex.bancoEl : ex.pozos.find((p) => p.clave === zona).cuerpo).append(c.el);
    c.el.classList.remove("cogido"); ex.cogido = null;
    const quedan = ex.chips.some((x) => !x.sitio);
    ex.bancoEl.classList.toggle("vacio", !quedan);
    $("btnComprobar").disabled = quedan;
  }

  /* ================= Comprobar ================= */
  const COMPROBAR = {
    ficha(ex) {
      let ok = 0, mal = 0;
      const notas = [];
      ex.filas.forEach((fila) => {
        const buena = ex.nombre.v[fila.par.i];
        const bien = fila.eleccion === buena;
        anotar(fila.par.k, bien);
        fila.cajas[fila.eleccion].classList.add(bien ? "ok" : "ko");
        if (bien) ok++;
        else { mal++; fila.cajas[buena].classList.add("debia"); notas.push(fila.par.pista); }
      });
      if (ex.nombre.n) notas.unshift(ex.nombre.n);
      notas.unshift(`«${ex.nombre.p}» es: ${paresDe(ex.nombre).map((p) => NOMBRE_VAL[ex.nombre.v[p.i]].toLowerCase()).join(", ")}.`);
      return { ok, mal, notas };
    },
    lineas(ex) {
      let ok = 0, mal = 0;
      const notas = [];
      ex.paleta.querySelectorAll(".etq").forEach((x) => x.classList.remove("cogido"));
      ex.fichas.forEach((f) => {
        const vistos = new Set();
        f.slots.forEach((v, i) => {
          const par = parDeVal(v);
          const buena = f.nombre.v[par.i];
          const bien = buena === v && !vistos.has(par.k);
          vistos.add(par.k);
          f.slotEls[i].classList.add(bien ? "ok" : "ko");
        });
        paresDe(f.nombre).forEach((par) => {
          const puestos = f.slots.filter((v) => par.vals.includes(v));
          const bien = puestos.length === 1 && puestos[0] === f.nombre.v[par.i];
          anotar(par.k, bien);
          if (bien) ok++; else { mal++; notas.push(par.pista); }
        });
        f.rowEl.append(el("span", "fl-correcto", "✔ " + paresDe(f.nombre).map((p) => NOMBRE_VAL[f.nombre.v[p.i]].toLowerCase()).join(" · ")));
        if (f.nombre.n) notas.push(f.nombre.n);
        if (f.nombre.v[0] === "propio") notas.push(`«${f.nombre.p}» es un nombre propio: solo lleva 3 etiquetas (contable/incontable se usa con los nombres comunes).`);
      });
      return { ok, mal, notas };
    },
    rapida(ex) {
      const bien = corregirOpciones(ex);
      anotar(ex.par.k, bien);
      const notas = [`«${ex.nombre.p}» es ${NOMBRE_VAL[ex.correcta].toLowerCase()}.`];
      if (ex.nombre.n) notas.push(ex.nombre.n);
      if (!bien) notas.push(ex.par.pista);
      return { ok: bien ? 1 : 0, mal: bien ? 0 : 1, notas };
    },
    par(ex) {
      let ok = 0, mal = 0;
      const notas = [];
      if (ex.cogido) ex.cogido.el.classList.remove("cogido");
      ex.chips.forEach((c) => {
        const buena = c.nombre.v[ex.par.i];
        c.el.draggable = false;
        const bien = c.sitio === buena;
        anotar(ex.par.k, bien);
        if (bien) { ok++; c.el.classList.add("ok"); }
        else {
          mal++; c.el.classList.add("ko");
          c.el.append(el("span", "correccion", "→ " + NOMBRE_VAL[buena].toLowerCase()));
          if (c.nombre.n) notas.push(c.nombre.n);
        }
      });
      if (mal) notas.unshift(ex.par.pista);
      return { ok, mal, notas };
    },
    escribe(ex) {
      const escrito = ex.inp.value;
      const bien = ex.item.validas.includes(normalizar(escrito));
      ex.inp.disabled = true; ex.btnPista.disabled = true;
      ex.inp.classList.add(bien ? "ok" : "ko");
      anotar("VOC", bien);
      const notas = [];
      const todas = [ex.item.c, ...ex.item.alt];
      if (bien) {
        notas.push(`¡Sí! ${ex.item.art[0].toUpperCase() + ex.item.art.slice(1)} ${ex.item.c} es un conjunto de ${ex.item.de}.`);
        if (todas.length > 1) notas.push("También vale: " + todas.filter((t) => normalizar(t) !== normalizar(escrito)).join(", ") + ".");
      } else {
        notas.push(`La respuesta es «${ex.item.c}»${ex.item.alt.length ? " (también vale: " + ex.item.alt.join(", ") + ")" : ""}. Tú escribiste «${escrito.trim()}».`);
      }
      return { ok: bien ? 1 : 0, mal: bien ? 0 : 1, notas, sinBonus: ex.pista };
    },
    cual(ex) {
      const bien = corregirOpciones(ex);
      anotar("VOC", bien);
      return { ok: bien ? 1 : 0, mal: bien ? 0 : 1, notas: [`${ex.item.art[0].toUpperCase() + ex.item.art.slice(1)} ${ex.item.c} es un conjunto de ${ex.item.de}.`] };
    },
  };

  function comprobar() {
    if (!S || S.comprobado) return;
    const ex = S.ex;
    S.comprobado = true;
    const r = COMPROBAR[ex.modo](ex);
    guardarHist();
    const perfecto = r.mal === 0 && r.ok > 0;
    const bonus = perfecto && !r.sinBonus;
    const pts = r.ok * PTS_OK + r.mal * PTS_MAL + (bonus ? PTS_PERFECTO : 0);
    const antes = S.puntos;
    S.puntos = Math.max(0, S.puntos + pts);
    const real = S.puntos - antes;
    if (perfecto) { S.racha++; S.perfectas++; S.mejorRacha = Math.max(S.mejorRacha, S.racha); } else S.racha = 0;

    const fb = $("feedback");
    const nivel = perfecto ? "perfecto" : r.ok > r.mal ? "casi" : "mal";
    fb.className = "feedback " + nivel;
    const titulos = {
      perfecto: azar(["🎉 ¡Perfecto!", "🚀 ¡Increíble!", "🏆 ¡Eres un crack!", "⭐ ¡Brutal!", "🔥 ¡Imparable!"]),
      casi: azar(["👍 ¡Muy bien, pero revisa!", "💪 ¡Casi lo tienes!", "😎 ¡Buen intento!"]),
      mal: azar(["🤔 ¡Uy! Repasa la corrección", "💡 ¡A la próxima lo clavas!", "🧐 Mira bien las pistas"]),
    };
    const partes = [`✅ ${plural(r.ok, "acierto", "aciertos")}`, `❌ ${plural(r.mal, "error", "errores")}`];
    if (bonus) partes.push("⭐ +5 de bonus");
    if (S.racha >= 2) partes.push(`🔥 ¡Racha de ${S.racha}!`);
    const notas = [...new Set(r.notas || [])];
    const clasePts = real > 0 ? "pos" : real < 0 ? "neg" : "cero";
    fb.innerHTML =
      `<div class="fb-top"><div class="fb-head">${titulos[nivel]}</div><div class="fb-pts ${clasePts}">${real > 0 ? "+" : ""}${real}</div></div>` +
      `<div class="fb-stats">${partes.join(" · ")}</div>` +
      (notas.length ? `<ul class="notas">${notas.map((n) => `<li>💡 ${esc(n)}</li>`).join("")}</ul>` : "");
    fb.hidden = false;
    if (perfecto) confeti(S.racha >= 3 ? 220 : 120);
    animarPuntos(real);
    $("btnComprobar").hidden = true;
    const sig = $("btnSiguiente");
    sig.textContent = S.ronda >= S.rondas ? "Ver resultados 🏁" : "Siguiente →";
    sig.hidden = false;
    sig.focus({ preventScroll: true });
    actualizarHud();
    fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  function animarPuntos(pts) {
    const pill = $("pillPuntos");
    pill.classList.remove("bump"); void pill.offsetWidth; pill.classList.add("bump");
    if (pts === 0) return;
    const f = el("span", "flot " + (pts > 0 ? "pos" : "neg"), (pts > 0 ? "+" : "") + pts);
    pill.append(f); setTimeout(() => f.remove(), 1400);
  }

  /* ================= Fin de partida ================= */
  function leerRecord(t, n) { try { return +localStorage.getItem(PREFIJO + "record_" + t + "_" + n) || 0; } catch (e) { return 0; } }
  function guardarRecord(t, n, v) { try { localStorage.setItem(PREFIJO + "record_" + t + "_" + n, v); } catch (e) { /* nada */ } }
  function fin() {
    pantalla("fin");
    const rec = leerRecord(S.tema, S.rondas);
    const nuevo = S.puntos > rec;
    if (nuevo) guardarRecord(S.tema, S.rondas, S.puntos);
    let peor = null, peorPct = 101;
    const barras = CLAVES.filter((c) => S.stats[c.clave]).map((c) => {
      const s = S.stats[c.clave], tot = s.ok + s.mal, pct = Math.round((s.ok / tot) * 100);
      if (pct < peorPct) { peorPct = pct; peor = c; }
      const color = pct < UMBRAL_FLOJO ? "#ef4444" : pct < UMBRAL_BIEN ? "#f59e0b" : "#22c55e";
      return `<div class="barra"><div class="bl"><span>${c.icono} ${c.nombre}</span><span>${pct}% (${s.ok}/${tot})</span></div>` +
        `<div class="bt"><div class="bf" data-w="${pct}" style="background:${color}"></div></div></div>`;
    }).join("");
    const ratio = S.perfectas / S.rondas;
    const trofeo = ratio >= 0.8 ? "🏆" : ratio >= 0.5 ? "🥇" : ratio >= 0.3 ? "🥈" : "🚀";
    const consejo = peor && peorPct < UMBRAL_BIEN
      ? `💡 Consejo: repasa <b>${peor.nombre.toLowerCase()}</b> en la chuleta 📖 y vuelve a intentarlo.`
      : "🌟 ¡Dominas los sustantivos! Prueba otra misión.";
    $("fin").innerHTML =
      `<div class="trofeo">${trofeo}</div><h2>¡Misión completada!</h2>` +
      `<div class="gran-puntos">${S.puntos}</div><div style="font-weight:800;color:var(--ink-soft)">puntos · ${TEMAS[S.tema]} · ${S.rondas} rondas</div>` +
      (nuevo ? `<div style="margin-top:12px"><span class="nuevo-record">🎖️ ¡NUEVO RÉCORD!</span></div>` : `<p style="font-weight:700;color:var(--ink-soft)">Tu récord: ${rec} puntos</p>`) +
      `<div class="fin-datos"><div><b>${S.perfectas}/${S.rondas}</b>rondas perfectas</div><div><b>🔥 ${S.mejorRacha}</b>mejor racha</div></div>` +
      `<div class="barras">${barras}</div><p class="consejo">${consejo}</p>` +
      `<div class="fin-botones"><button class="btn primary big" id="btnOtraVez">🔄 Jugar otra vez</button><button class="btn secondary big" id="btnCambiar">🎯 Cambiar de misión</button></div>`;
    $("btnOtraVez").addEventListener("click", nuevaPartida);
    $("btnCambiar").addEventListener("click", irInicio);
    requestAnimationFrame(() => setTimeout(() => document.querySelectorAll(".bf").forEach((b) => (b.style.width = b.dataset.w + "%")), 100));
    if (nuevo || ratio >= 0.5) confeti(260);
  }

  /* ================= Inicio ================= */
  function pintarRecord() {
    const r = leerRecord(temaElegido, rondasElegidas);
    $("record").textContent = r ? `🎖️ Tu récord en «${TEMAS[temaElegido]}» con ${rondasElegidas} rondas: ${r} puntos` : "";
  }
  function irInicio() { pantalla("inicio"); pintarRecord(); pintarProgreso(); }
  function elegirTema(tema, desplazar) {
    document.querySelectorAll(".tema").forEach((x) => x.classList.toggle("sel", x.dataset.topic === tema));
    temaElegido = tema;
    pintarRecord();
    if (desplazar) $("temas").scrollIntoView({ behavior: "smooth", block: "center" });
  }
  document.querySelectorAll(".tema").forEach((b) => b.addEventListener("click", () => elegirTema(b.dataset.topic)));
  document.querySelectorAll(".ronda-btn").forEach((b) => b.addEventListener("click", () => {
    document.querySelectorAll(".ronda-btn").forEach((x) => x.classList.remove("sel"));
    b.classList.add("sel");
    rondasElegidas = +b.dataset.rondas;
    pintarRecord();
  }));
  $("btnEmpezar").addEventListener("click", nuevaPartida);
  $("btnComprobar").addEventListener("click", comprobar);
  $("btnSiguiente").addEventListener("click", siguienteRonda);
  $("btnSalir").addEventListener("click", () => {
    if (!$("pantallaJuego").hidden && !confirm("¿Seguro que quieres salir? Perderás la partida.")) return;
    irInicio();
  });
  const dlg = $("chuleta");
  $("btnChuleta").addEventListener("click", () => dlg.showModal());
  $("btnCerrarChuleta").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

  pintarRecord();
  pintarProgreso();
  window.addEventListener("resize", () => { cv.width = innerWidth; cv.height = innerHeight; });
})();
