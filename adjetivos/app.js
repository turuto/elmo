"use strict";
(function () {
  /* ================= Configuración ================= */
  const PTS_OK = 10, PTS_MAL = -3, PTS_PERFECTO = 5;
  const PREFIJO = "adj_"; // claves de localStorage de esta app

  const GRADOS = ["P", "CS", "CI", "CG", "SA", "SR"];
  const NOMBRE_GRADO = {
    P: "positivo", CS: "comparativo de superioridad", CI: "comparativo de inferioridad",
    CG: "comparativo de igualdad", SA: "superlativo absoluto", SR: "superlativo relativo",
  };
  const CORTO = { P: "positivo", CS: "comp. superioridad", CI: "comp. inferioridad", CG: "comp. igualdad", SA: "sup. absoluto", SR: "sup. relativo" };

  // Claves de estadística
  const CLAVES = [
    { clave: "ID", nombre: "¿Es adjetivo?", icono: "🔍", tema: "id" },
    { clave: "P", nombre: "Positivo", icono: "📶", tema: "gr", sub: true },
    { clave: "CS", nombre: "Comp. de superioridad", icono: "⬆️", tema: "gr", sub: true },
    { clave: "CI", nombre: "Comp. de inferioridad", icono: "⬇️", tema: "gr", sub: true },
    { clave: "CG", nombre: "Comp. de igualdad", icono: "🟰", tema: "gr", sub: true },
    { clave: "SA", nombre: "Superlativo absoluto", icono: "🚀", tema: "gr", sub: true },
    { clave: "SR", nombre: "Superlativo relativo", icono: "🏆", tema: "gr", sub: true },
    { clave: "IR", nombre: "Formas irregulares", icono: "⭐", tema: "gr", sub: true },
    { clave: "AP", nombre: "Apócope", icono: "✂️", tema: "ap" },
    { clave: "GN", nombre: "Género y número", icono: "👫", tema: "gn" },
  ];
  const NOMBRE_CLAVE = Object.fromEntries(CLAVES.map((c) => [c.clave, c]));
  const TEMAS = { todo: "Todo mezclado", id: "¿Es adjetivo?", gr: "Grados", ap: "Apócope", gn: "Género y número" };
  const CLAVES_TEMA = {
    todo: CLAVES.map((c) => c.clave),
    id: ["ID"], gr: ["P", "CS", "CI", "CG", "SA", "SR", "IR"], ap: ["AP"], gn: ["GN"],
  };
  const MODOS = {
    selecciona: "🔍 Busca y selecciona",
    esadj: "🤔 ¿Es adjetivo?",
    quegrado: "📶 ¿En qué grado está?",
    clasifica: "🗂️ Clasifica los grados",
    transforma: "🔁 Transforma",
    apocope: "✂️ Apócope",
    genero: "👫 Género y número",
  };
  function modosDe(clave) {
    if (clave === "ID") return ["selecciona", "esadj"];
    if (clave === "IR") return ["quegrado", "transforma"];
    if (clave === "AP") return ["apocope"];
    if (clave === "GN") return ["genero"];
    return ["selecciona", "quegrado", "clasifica", "transforma"];
  }

  /* ================= Utilidades ================= */
  const $ = (id) => document.getElementById(id);
  const azar = (a) => a[Math.floor(Math.random() * a.length)];
  const barajar = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function el(tag, cls, texto) { const e = document.createElement(tag); if (cls) e.className = cls; if (texto != null) e.textContent = texto; return e; }
  const plural = (n, s, p) => n + " " + (n === 1 ? s : p);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ================= Lectura de frases ================= */
  function parsear(src) {
    const tokens = [];
    const re = /\[([^\]]+)\]\{([A-Z]{1,2})(\+?)(?:\|([^}]*))?\}/g;
    let ultimo = 0, m;
    const textoPlano = (s) => {
      s.split(/([\p{L}\p{M}]+)/u).forEach((p) => {
        if (!p) return;
        tokens.push({ texto: p, palabra: /^[\p{L}\p{M}]+$/u.test(p), adj: false, grado: null, irr: false, trampa: false, nota: null });
      });
    };
    while ((m = re.exec(src))) {
      textoPlano(src.slice(ultimo, m.index));
      const cod = m[2];
      if (cod !== "X" && !GRADOS.includes(cod)) console.warn("Código desconocido", cod, "en:", src);
      tokens.push({
        texto: m[1], palabra: true, adj: cod !== "X", grado: cod === "X" ? null : cod,
        irr: m[3] === "+", trampa: cod === "X", nota: m[4] || null,
      });
      ultimo = re.lastIndex;
    }
    textoPlano(src.slice(ultimo));
    tokens.forEach((t, i) => (t.i = i));
    return tokens;
  }
  const FRASES = (window.ADJ_FRASES || []).map((s, id) => ({ id, tokens: parsear(s) }));
  const TODOS_ADJ = FRASES.flatMap((f) => f.tokens.filter((t) => t.adj));

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
    if (!clave) return;
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
      if (CLAVES_TEMA[t].some((k) => nivelDe(k).estado === "flojo")) {
        b.classList.add("practicar");
        b.append(el("span", "cinta", "¡A practicar!"));
      }
    });
    const panel = $("progreso");
    const hayDatos = CLAVES.some((c) => (HIST[c.clave] || []).length > 0);
    panel.hidden = !hayDatos;
    if (!hayDatos) return;
    const flojos = CLAVES.filter((c) => nivelDe(c.clave).estado === "flojo");
    const filas = CLAVES.map((c) => {
      const nv = nivelDe(c.clave), e = ESTADOS[nv.estado];
      return `<button class="prog-fila e-${nv.estado}${c.sub ? " es-sub" : ""}" data-tema="${c.tema}">` +
        `<span class="pf-nombre">${c.icono} ${c.nombre}</span>` +
        `<span class="pf-barra"><span style="width:${nv.pct || 0}%"></span></span>` +
        `<span class="pf-pct">${nv.pct === null ? nv.n + "/" + HIST_MIN : nv.pct + "%"}</span>` +
        `<span class="pf-estado">${e.icono} ${e.txt}</span></button>`;
    }).join("");
    const unir = (l) => (l.length > 1 ? l.slice(0, -1).join(", ") + " y " + l[l.length - 1] : l[0]);
    const nombres = flojos.map((c) => `<b>${c.nombre.toLowerCase()}</b>`);
    const reco = flojos.length ? `💡 Te recomendamos practicar: ${unir(nombres)}.` : "🌟 ¡Vas genial! No hay nada flojo por ahora. ¡Sigue así!";
    const abierto = panel.querySelector("details")?.open || false;
    const resumen = flojos.length
      ? `<span class="prog-chip hay">⚠️ ${flojos.length} ${flojos.length === 1 ? "punto" : "puntos"} para practicar</span>`
      : `<span class="prog-chip nada">🌟 ¡Vas genial!</span>`;
    panel.innerHTML =
      `<details${abierto ? " open" : ""}><summary><span class="prog-tit">📊 Tu progreso</span>${resumen}<span class="prog-flecha">▾</span></summary>` +
      `<div class="prog-cuerpo"><p class="prog-reco ${flojos.length ? "hay" : "nada"}">${reco}</p>` +
      `<div class="prog-filas">${filas}</div>` +
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
    pantalla("juego");
    actualizarHud();
    siguienteRonda();
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
  // Elige un elemento evitando repetir los ya usados en la partida
  function elegirSinRepetir(lista, prefijo) {
    if (!lista.length) return null;
    const nuevos = lista.filter((x) => !S.usadas.has(prefijo + x.id));
    const x = azar(nuevos.length ? nuevos : lista);
    S.usadas.add(prefijo + x.id);
    return x;
  }

  /* ================= Constructores de ejercicios ================= */
  const CONSTRUIR = {
    selecciona(clave) {
      if (clave === "ID") {
        const f = elegirSinRepetir(FRASES.filter((fr) => fr.tokens.some((t) => t.adj)), "f");
        return { modo: "selecciona", frase: f, clave: "ID", sel: new Set(), esObjetivo: (t) => t.adj };
      }
      const f = elegirSinRepetir(FRASES.filter((fr) => fr.tokens.some((t) => t.grado === clave)), "f");
      if (!f) return null;
      return { modo: "selecciona", frase: f, clave, sel: new Set(), esObjetivo: (t) => t.grado === clave };
    },

    esadj() {
      const r = Math.random();
      let f = null, tok = null;
      if (r < 0.2) {
        f = elegirSinRepetir(FRASES.filter((fr) => fr.tokens.some((t) => t.trampa)), "f");
        tok = f && azar(f.tokens.filter((t) => t.trampa));
      } else if (r < 0.6) {
        f = elegirSinRepetir(FRASES.filter((fr) => fr.tokens.some((t) => t.adj && !t.texto.includes(" "))), "f");
        tok = f && azar(f.tokens.filter((t) => t.adj && !t.texto.includes(" ")));
      } else {
        const ok = (t) => t.palabra && !t.adj && !t.trampa && t.texto.length >= 4;
        f = elegirSinRepetir(FRASES.filter((fr) => fr.tokens.some(ok)), "f");
        tok = f && azar(f.tokens.filter(ok));
      }
      if (!tok) return null;
      return { modo: "esadj", frase: f, tok, clave: "ID", correcta: tok.adj ? "si" : "no" };
    },

    quegrado(clave) {
      const ok = clave === "IR" ? (t) => t.irr : (t) => t.grado === clave;
      const f = elegirSinRepetir(FRASES.filter((fr) => fr.tokens.some(ok)), "f");
      if (!f) return null;
      const tok = azar(f.tokens.filter(ok));
      return { modo: "quegrado", frase: f, tok, clave: tok.grado, correcta: tok.grado };
    },

    clasifica(clave) {
      let variante = "pcs";
      if (["CS", "CI", "CG"].includes(clave) && Math.random() < 0.65) variante = "comp";
      if (["SA", "SR"].includes(clave) && Math.random() < 0.65) variante = "sup";
      const V = {
        pcs: { pozos: [["P", "Positivo", "📶"], ["C", "Comparativo", "⚖️"], ["S", "Superlativo", "🚀"]], caja: (g) => (g === "P" ? "P" : g[0] === "C" ? "C" : "S"), n: 2 },
        comp: { pozos: [["CS", "Superioridad", "⬆️"], ["CI", "Inferioridad", "⬇️"], ["CG", "Igualdad", "🟰"]], caja: (g) => (["CS", "CI", "CG"].includes(g) ? g : null), n: 2 },
        sup: { pozos: [["SA", "Absoluto", "🚀"], ["SR", "Relativo", "🏆"]], caja: (g) => (["SA", "SR"].includes(g) ? g : null), n: 3 },
      }[variante];
      const vistos = new Set();
      let chips = [];
      V.pozos.forEach(([k]) => {
        const cand = barajar(TODOS_ADJ.filter((t) => V.caja(t.grado) === k));
        let n = 0;
        for (const t of cand) {
          const txt = t.texto.toLowerCase();
          if (vistos.has(txt)) continue;
          vistos.add(txt); chips.push(t); if (++n >= V.n) break;
        }
      });
      chips = barajar(chips).map((t, i) => ({ id: i, tok: t, sitio: null }));
      const pozos = V.pozos.map(([k, texto, icono]) => ({ clave: k, texto, icono, cls: "p-" + k }));
      const titulos = { pcs: "positivo, comparativo o superlativo", comp: "¿qué tipo de comparativo?", sup: "¿superlativo absoluto o relativo?" };
      return { modo: "clasifica", variante, titulo: titulos[variante], chips, pozos, correcta: (t) => V.caja(t.grado),
        nombreDe: (k) => V.pozos.find((p) => p[0] === k)[1].toLowerCase() };
    },

    transforma(clave) {
      const lista = (window.ADJ_TRANSFORMA || []).map((x, id) => ({ ...x, id })).filter((x) => x.k === clave);
      const it = elegirSinRepetir(lista, "t");
      return it ? { modo: "transforma", item: it, clave: it.k } : null;
    },
    apocope() {
      const it = elegirSinRepetir((window.ADJ_APOCOPE || []).map((x, id) => ({ ...x, id })), "a");
      return it ? { modo: "apocope", item: it, clave: "AP" } : null;
    },
    genero() {
      const it = elegirSinRepetir((window.ADJ_GENERO || []).map((x, id) => ({ ...x, id })), "g");
      return it ? { modo: "genero", item: it, clave: "GN" } : null;
    },
  };

  function siguienteRonda() {
    if (S.ronda >= S.rondas) return fin();
    S.ronda++;
    S.comprobado = false;
    let ex = null;
    for (let intento = 0; intento < 12 && !ex; intento++) {
      const clave = azarPonderado(CLAVES_TEMA[S.tema], peso); // lo flojo sale más
      let modos = modosDe(clave);
      if (modos.length > 1 && intento < 6) modos = modos.filter((m) => m !== S.ultimoModo);
      ex = CONSTRUIR[azar(modos)](clave);
    }
    S.ex = ex;
    S.ultimoModo = ex.modo;

    const card = $("cardJuego");
    card.style.animation = "none"; void card.offsetWidth; card.style.animation = "";
    $("feedback").hidden = true; $("feedback").innerHTML = "";
    $("zonaExtra").innerHTML = "";
    $("frase").hidden = false; $("frase").classList.remove("pregunta");
    $("btnComprobar").hidden = false; $("btnComprobar").disabled = true;
    $("btnSiguiente").hidden = true;
    const modo = $("modo");
    modo.className = "modo m-" + ex.modo;
    modo.textContent = MODOS[ex.modo];
    PINTAR[ex.modo](ex);
    actualizarHud();
  }

  /* ================= Pintar frase ================= */
  function pintarFrase(ex, { clicable = false, foco = null } = {}) {
    const caja = $("frase");
    caja.innerHTML = "";
    ex.spans = new Map();
    ex.signos = [];
    ex.frase.tokens.forEach((t) => {
      if (!t.palabra) {
        t.texto.split(/(\s+)/).forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { caja.append(document.createTextNode(p)); return; }
          const s = el("span", "w punt"); s.append(el("span", "tx", p)); ex.signos.push(s); caja.append(s);
        });
        return;
      }
      const w = el("span", "w");
      w.append(el("span", "tx", t.texto));
      if (foco === t.i) w.classList.add("foco");
      if (clicable) {
        w.classList.add("clic"); w.tabIndex = 0; w.setAttribute("role", "button");
        const alternar = () => {
          if (S.comprobado) return;
          if (ex.sel.has(t.i)) { ex.sel.delete(t.i); w.classList.remove("sel"); }
          else { ex.sel.add(t.i); w.classList.add("sel"); }
          $("btnComprobar").disabled = ex.sel.size === 0;
        };
        w.addEventListener("click", alternar);
        w.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); alternar(); } });
      }
      ex.spans.set(t.i, w);
      caja.append(w);
    });
  }
  function mostrarEtiquetas(ex, solo = null) {
    ex.signos.forEach((s) => { if (!s.querySelector(".lab")) s.prepend(el("span", "lab hueco", "·")); });
    ex.frase.tokens.forEach((t) => {
      const w = ex.spans.get(t.i);
      if (!w || w.querySelector(".lab")) return;
      if ((!t.adj && !t.trampa) || (solo !== null && t.i !== solo)) { w.prepend(el("span", "lab hueco", "·")); return; }
      if (t.trampa) w.prepend(el("span", "lab c-otra", "no es adjetivo"));
      else w.prepend(el("span", "lab g-" + t.grado, CORTO[t.grado] + (t.irr ? " ⭐" : "")));
    });
  }

  /* ================= Opciones (botones) ================= */
  function pintarOpciones(ex, ops, { textos = false } = {}) {
    const cont = el("div", "opciones n" + Math.min(ops.length, 6) + (textos ? " textos" : ""));
    if (ops.length === 6) cont.style.gridTemplateColumns = "repeat(3,1fr)";
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

  /* ================= Pintar cada modo ================= */
  const PINTAR = {
    selecciona(ex) {
      const que = ex.clave === "ID"
        ? `<span class="objetivo obj-adj">🔍 adjetivos</span>`
        : `adjetivos en grado <span class="objetivo obj-${ex.clave}">${NOMBRE_GRADO[ex.clave]}</span>`;
      $("instruccion").innerHTML = `Haz clic en <b>todos</b> los ${que} de la frase. <small style="color:var(--ink-soft)">(Otro clic para desmarcar)</small>`;
      pintarFrase(ex, { clicable: true });
    },
    esadj(ex) {
      $("instruccion").innerHTML = `En esta frase, ¿<span class="objetivo" style="background:#f97316">«${esc(ex.tok.texto)}»</span> es un adjetivo?`;
      pintarFrase(ex, { foco: ex.tok.i });
      pintarOpciones(ex, [
        { clave: "si", texto: "Sí, es adjetivo", icono: "✅", cls: "si" },
        { clave: "no", texto: "No es adjetivo", icono: "❌", cls: "no" },
      ]);
    },
    quegrado(ex) {
      $("instruccion").innerHTML = `¿En qué grado está <span class="objetivo" style="background:#f97316">«${esc(ex.tok.texto)}»</span>?`;
      pintarFrase(ex, { foco: ex.tok.i });
      const iconos = { P: "📶", CS: "⬆️", CI: "⬇️", CG: "🟰", SA: "🚀", SR: "🏆" };
      pintarOpciones(ex, GRADOS.map((g) => ({ clave: g, texto: NOMBRE_GRADO[g][0].toUpperCase() + NOMBRE_GRADO[g].slice(1), icono: iconos[g], cls: g })));
    },
    clasifica(ex) {
      $("instruccion").innerHTML = `Arrastra cada adjetivo a su caja: <b>${ex.titulo}</b> <small style="color:var(--ink-soft)">(También puedes hacer clic en la palabra y luego en la caja)</small>`;
      $("frase").hidden = true;
      pintarArrastre(ex);
    },
    transforma(ex) { pintarHueco(ex, "Elige la respuesta correcta:"); },
    apocope(ex) { pintarHueco(ex, "✂️ ¿Qué forma va en el hueco? Fíjate si va <b>delante</b> de un sustantivo <b>singular</b>."); },
    genero(ex) { pintarHueco(ex, ex.item.f.includes("___") ? "👫 Elige la forma que <b>concuerda</b> con el sustantivo:" : "Elige la respuesta correcta:"); },
  };

  function pintarHueco(ex, instruccion) {
    $("instruccion").innerHTML = instruccion;
    const caja = $("frase");
    caja.classList.add("pregunta");
    caja.innerHTML = "";
    const partes = ex.item.f.split("___");
    partes.forEach((p, i) => {
      caja.append(document.createTextNode(p));
      if (i < partes.length - 1) { ex.huecoEl = el("span", "hueco-resp", "?"); caja.append(ex.huecoEl); }
    });
    ex.correcta = "0";
    const ops = barajar(ex.item.ops.map((t, i) => ({ clave: String(i), texto: t })));
    pintarOpciones(ex, ops, { textos: true });
  }

  /* ================= Arrastrar y soltar ================= */
  function pintarArrastre(ex) {
    const z = $("zonaExtra");
    const banco = el("div", "banco");
    banco.dataset.zona = "__banco";
    ex.bancoEl = banco; ex.cogido = null;
    ex.chips.forEach((c) => {
      const ch = el("div", "chip", c.tok.texto);
      ch.draggable = true; c.el = ch;
      ch.addEventListener("dragstart", (e) => {
        if (S.comprobado) { e.preventDefault(); return; }
        e.dataTransfer.setData("text/plain", String(c.id)); e.dataTransfer.effectAllowed = "move"; ch.classList.add("arrastrando");
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
        const c = ex.chips.find((x) => String(x.id) === e.dataTransfer.getData("text/plain"));
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
    selecciona(ex) {
      let ok = 0, mal = 0, omit = 0;
      ex.frase.tokens.forEach((t) => {
        if (!t.palabra) return;
        const w = ex.spans.get(t.i), marcada = ex.sel.has(t.i), obj = ex.esObjetivo(t);
        w.classList.remove("sel", "clic"); w.removeAttribute("tabindex");
        if (marcada && obj) { ok++; w.classList.add("ok"); anotar(ex.clave, true); }
        else if (marcada && !obj) { mal++; w.classList.add("ko"); anotar(ex.clave, false); }
        else if (!marcada && obj) { omit++; w.classList.add("miss"); anotar(ex.clave, false); }
      });
      mostrarEtiquetas(ex);
      const notas = ex.frase.tokens.filter((t) => t.nota && (ex.esObjetivo(t) || ex.sel.has(t.i) || t.trampa)).map((t) => t.nota);
      return { ok, mal, omit, leyenda: true, notas };
    },
    esadj(ex) {
      const acierto = corregirOpciones(ex);
      const w = ex.spans.get(ex.tok.i);
      w.classList.remove("foco"); w.classList.add(acierto ? "ok" : "ko");
      anotar("ID", acierto);
      mostrarEtiquetas(ex, ex.tok.i);
      const t = ex.tok, notas = [];
      if (t.nota) notas.push(t.nota);
      else if (t.adj) notas.push(`«${t.texto}» es un adjetivo: dice cómo es o cómo está el sustantivo.`);
      else notas.push(`«${t.texto}» no es un adjetivo.`);
      return { ok: acierto ? 1 : 0, mal: acierto ? 0 : 1, omit: 0, notas };
    },
    quegrado(ex) {
      const acierto = corregirOpciones(ex);
      const w = ex.spans.get(ex.tok.i);
      w.classList.remove("foco"); w.classList.add(acierto ? "ok" : "ko");
      anotar(ex.tok.grado, acierto);
      if (ex.tok.irr) anotar("IR", acierto);
      mostrarEtiquetas(ex, ex.tok.i);
      const notas = [`«${ex.tok.texto}» está en grado ${NOMBRE_GRADO[ex.tok.grado]}.`];
      if (ex.tok.nota) notas.push(ex.tok.nota);
      return { ok: acierto ? 1 : 0, mal: acierto ? 0 : 1, omit: 0, notas };
    },
    clasifica(ex) {
      let ok = 0, mal = 0;
      if (ex.cogido) ex.cogido.el.classList.remove("cogido");
      const notas = [];
      ex.chips.forEach((c) => {
        const buena = ex.correcta(c.tok);
        c.el.draggable = false;
        const bien = c.sitio === buena;
        anotar(c.tok.grado, bien);
        if (bien) { ok++; c.el.classList.add("ok"); }
        else {
          mal++; c.el.classList.add("ko");
          c.el.append(el("span", "correccion", "→ " + ex.nombreDe(buena)));
          if (c.tok.nota) notas.push(c.tok.nota);
        }
      });
      return { ok, mal, omit: 0, notas };
    },
    transforma(ex) { return comprobarHueco(ex); },
    apocope(ex) { return comprobarHueco(ex); },
    genero(ex) { return comprobarHueco(ex); },
  };
  function comprobarHueco(ex) {
    const acierto = corregirOpciones(ex);
    anotar(ex.clave, acierto);
    if (ex.huecoEl) { ex.huecoEl.textContent = ex.item.ops[0]; ex.huecoEl.classList.add(acierto ? "ok" : "ko"); }
    const notas = [];
    if (!ex.huecoEl && !acierto) notas.push(`La respuesta correcta es: «${ex.item.ops[0]}».`);
    if (ex.item.n) notas.push(ex.item.n);
    return { ok: acierto ? 1 : 0, mal: acierto ? 0 : 1, omit: 0, notas };
  }

  function comprobar() {
    if (!S || S.comprobado) return;
    const ex = S.ex;
    S.comprobado = true;
    const r = COMPROBAR[ex.modo](ex);
    guardarHist();
    const perfecto = r.mal === 0 && r.omit === 0 && r.ok > 0;
    const pts = r.ok * PTS_OK + r.mal * PTS_MAL + (perfecto ? PTS_PERFECTO : 0);
    const antes = S.puntos;
    S.puntos = Math.max(0, S.puntos + pts);
    const real = S.puntos - antes;
    if (perfecto) { S.racha++; S.perfectas++; S.mejorRacha = Math.max(S.mejorRacha, S.racha); } else S.racha = 0;

    const fb = $("feedback");
    const nivel = perfecto ? "perfecto" : r.ok > r.mal + r.omit ? "casi" : "mal";
    fb.className = "feedback " + nivel;
    const titulos = {
      perfecto: azar(["🎉 ¡Perfecto!", "🚀 ¡Increíble!", "🏆 ¡Eres un crack!", "⭐ ¡Brutal!", "🔥 ¡Imparable!"]),
      casi: azar(["👍 ¡Muy bien, pero revisa!", "💪 ¡Casi lo tienes!", "😎 ¡Buen intento!"]),
      mal: azar(["🤔 ¡Uy! Repasa la corrección", "💡 ¡A la próxima lo clavas!", "🧐 Mira bien las pistas"]),
    };
    const partes = [`✅ ${plural(r.ok, "acierto", "aciertos")}`, `❌ ${plural(r.mal, "error", "errores")}`];
    if (ex.modo === "selecciona") partes.push(`⚠️ ${r.omit} sin marcar`);
    if (perfecto) partes.push("⭐ +5 de bonus");
    if (S.racha >= 2) partes.push(`🔥 ¡Racha de ${S.racha}!`);
    const notas = [...new Set(r.notas || [])];
    const clasePts = real > 0 ? "pos" : real < 0 ? "neg" : "cero";
    fb.innerHTML =
      `<div class="fb-top"><div class="fb-head">${titulos[nivel]}</div><div class="fb-pts ${clasePts}">${real > 0 ? "+" : ""}${real}</div></div>` +
      `<div class="fb-stats">${partes.join(" · ")}</div>` +
      (r.leyenda
        ? `<div class="leyenda"><span><i style="border-color:var(--ok);background:var(--ok-l)"></i>bien marcada</span>` +
          `<span><i style="border-color:var(--ko);background:var(--ko-l)"></i>no era</span>` +
          `<span><i style="border-color:var(--miss);background:var(--miss-l);border-style:dashed"></i>se te escapó</span></div>`
        : "") +
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
      : "🌟 ¡Dominas los adjetivos! Prueba otra misión.";
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
