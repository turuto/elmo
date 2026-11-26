"use strict";
(function () {
  /* ================= Configuración ================= */
  const OPCIONES_RONDAS = [5, 10, 15, 20, 30];
  const PTS_OK = 10, PTS_MAL = -3, PTS_PERFECTO = 5;

  const CATS = {
    adv:  { nombre: "Adverbio",     plural: "adverbios",      icono: "🧭" },
    prep: { nombre: "Preposición",  plural: "preposiciones",  icono: "🔗" },
    conj: { nombre: "Conjunción",   plural: "conjunciones",   icono: "🤝" },
    int:  { nombre: "Interjección", plural: "interjecciones", icono: "😮" },
  };
  const ORDEN_CATS = ["adv", "prep", "conj", "int"];
  const SUBS = { L: "lugar", T: "tiempo", M: "modo", C: "cantidad", A: "afirmación", N: "negación", D: "duda" };
  const SUB_ICONO = { L: "📍", T: "⏰", M: "🎨", C: "⚖️" };
  const SUBS_CLASIF = ["L", "T", "M", "C"];
  const CODIGO_A_CAT = { L: "adv", T: "adv", M: "adv", C: "adv", A: "adv", N: "adv", D: "adv", P: "prep", Y: "conj", I: "int", X: null };
  const MODOS = {
    selecciona:   "🔍 Busca y selecciona",
    quepalabra:   "🤔 ¿Qué palabra es?",
    clasificaAdv: "🧺 Clasifica los adverbios",
    granClasif:   "🗂️ Gran clasificación",
  };
  const TEMAS = { todo: "Todo mezclado", adv: "Adverbios", prep: "Preposiciones", conj: "Conjunciones", int: "Interjecciones" };

  /* ================= Utilidades ================= */
  const $ = (id) => document.getElementById(id);
  const azar = (a) => a[Math.floor(Math.random() * a.length)];
  const barajar = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function el(tag, cls, texto) { const e = document.createElement(tag); if (cls) e.className = cls; if (texto != null) e.textContent = texto; return e; }
  const plural = (n, s, p) => n + " " + (n === 1 ? s : p);

  /* ================= Lectura de frases ================= */
  function parsear(src) {
    const tokens = [];
    const re = /\[([^\]]+)\]\{([A-Z])(?:\|([^}]*))?\}/g;
    let ultimo = 0, m;
    const textoPlano = (s) => {
      s.split(/([\p{L}\p{M}]+)/u).forEach((p) => {
        if (!p) return;
        const esPalabra = /^[\p{L}\p{M}]+$/u.test(p);
        tokens.push({ texto: p, palabra: esPalabra, cat: null, sub: null, trampa: false, nota: null });
      });
    };
    while ((m = re.exec(src))) {
      textoPlano(src.slice(ultimo, m.index));
      const cod = m[2];
      if (!(cod in CODIGO_A_CAT)) console.warn("Código desconocido", cod, "en:", src);
      tokens.push({
        texto: m[1], palabra: true, cat: CODIGO_A_CAT[cod] || null,
        sub: SUBS[cod] ? cod : null, trampa: cod === "X", nota: m[3] || null,
      });
      ultimo = re.lastIndex;
    }
    textoPlano(src.slice(ultimo));
    tokens.forEach((t, i) => (t.i = i));
    return tokens;
  }
  const FRASES = (window.FRASES_RAW || []).map((s, id) => ({ id, tokens: parsear(s) }));

  function etiqueta(t) {
    if (t.trampa) return "otra clase";
    if (t.cat === "adv") return "adv. " + SUBS[t.sub];
    return { prep: "preposición", conj: "conjunción", int: "interjección" }[t.cat];
  }

  /* ================= Confeti ================= */
  const cv = $("confeti"), cx = cv.getContext("2d");
  let piezas = [], animando = false;
  function confeti(n = 140) {
    cv.width = innerWidth; cv.height = innerHeight;
    const colores = ["#facc15", "#22d3ee", "#4ade80", "#f472b6", "#a78bfa", "#fb923c", "#60a5fa"];
    for (let i = 0; i < n; i++) {
      piezas.push({
        x: innerWidth / 2 + (Math.random() - 0.5) * 300, y: innerHeight * 0.35,
        vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 15 - 5,
        r: Math.random() * 7 + 4, c: azar(colores), rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, vida: 0,
      });
    }
    if (!animando) { animando = true; requestAnimationFrame(paso); }
  }
  function paso() {
    cx.clearRect(0, 0, cv.width, cv.height);
    piezas.forEach((p) => {
      p.vy += 0.4; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vida++;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillStyle = p.c;
      cx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); cx.restore();
    });
    piezas = piezas.filter((p) => p.y < cv.height + 30 && p.vida < 260);
    if (piezas.length) requestAnimationFrame(paso);
    else { animando = false; cx.clearRect(0, 0, cv.width, cv.height); }
  }

  /* ================= Estadísticas guardadas (localStorage) =================
     Para cada categoría y tipo de adverbio guardamos las últimas HIST_MAX
     respuestas (1 = acierto, 0 = fallo). Así el porcentaje refleja el nivel
     actual y mejora cuando el niño practica. */
  const HIST_MAX = 40;      // respuestas recientes que se tienen en cuenta
  const HIST_MIN = 6;       // mínimo de respuestas para dar una valoración
  const UMBRAL_FLOJO = 60;  // < 60 %  → necesita práctica
  const UMBRAL_BIEN = 80;   // >= 80 % → dominado
  const CLAVES_PROGRESO = [
    { clave: "adv", nombre: "Adverbios", icono: "🧭", tema: "adv" },
    { clave: "adv-L", nombre: "Adv. de lugar", icono: "📍", tema: "adv", sub: true },
    { clave: "adv-T", nombre: "Adv. de tiempo", icono: "⏰", tema: "adv", sub: true },
    { clave: "adv-M", nombre: "Adv. de modo", icono: "🎨", tema: "adv", sub: true },
    { clave: "adv-C", nombre: "Adv. de cantidad", icono: "⚖️", tema: "adv", sub: true },
    { clave: "prep", nombre: "Preposiciones", icono: "🔗", tema: "prep" },
    { clave: "conj", nombre: "Conjunciones", icono: "🤝", tema: "conj" },
    { clave: "int", nombre: "Interjecciones", icono: "😮", tema: "int" },
  ];
  let HIST = cargarHist();
  function cargarHist() {
    try { const h = JSON.parse(localStorage.getItem("pi_hist")); return h && typeof h === "object" ? h : {}; }
    catch (e) { return {}; }
  }
  function guardarHist() { try { localStorage.setItem("pi_hist", JSON.stringify(HIST)); } catch (e) { /* nada */ } }
  function empujar(clave, ok) {
    const h = (HIST[clave] = HIST[clave] || []);
    h.push(ok ? 1 : 0);
    if (h.length > HIST_MAX) h.splice(0, h.length - HIST_MAX);
  }
  // Registra una respuesta en la partida actual y en el historial guardado
  function anotar(cat, sub, ok) {
    S.stats[cat][ok ? "ok" : "mal"]++;
    empujar(cat, ok);
    if (sub && SUBS_CLASIF.includes(sub)) empujar("adv-" + sub, ok);
  }
  function nivelDe(clave) {
    const h = HIST[clave] || [];
    if (h.length < HIST_MIN) return { n: h.length, pct: null, estado: "nuevo" };
    const pct = Math.round((h.reduce((a, b) => a + b, 0) / h.length) * 100);
    return { n: h.length, pct, estado: pct < UMBRAL_FLOJO ? "flojo" : pct < UMBRAL_BIEN ? "mejorando" : "dominado" };
  }
  // Peso para elegir preguntas en «Todo mezclado»: lo flojo sale mucho más
  function peso(clave) {
    return { flojo: 3, mejorando: 1.6, nuevo: 1.4, dominado: 0.6 }[nivelDe(clave).estado];
  }
  function azarPonderado(lista, fnPeso) {
    const pesos = lista.map(fnPeso), total = pesos.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < lista.length; i++) { r -= pesos[i]; if (r <= 0) return lista[i]; }
    return lista[lista.length - 1];
  }
  const algunSubFlojo = () => SUBS_CLASIF.some((s) => nivelDe("adv-" + s).estado === "flojo");

  const ESTADOS = {
    flojo: { txt: "¡A practicar!", icono: "⚠️" },
    mejorando: { txt: "Mejorando", icono: "📈" },
    dominado: { txt: "¡Dominado!", icono: "⭐" },
    nuevo: { txt: "Pocos datos", icono: "🆕" },
  };

  function pintarProgreso() {
    // 1) Insignias en las tarjetas de tema
    document.querySelectorAll(".tema").forEach((b) => {
      b.classList.remove("practicar");
      b.querySelectorAll(".insignia,.cinta").forEach((x) => x.remove());
      const t = b.dataset.topic;
      if (t === "todo") return;
      const nv = nivelDe(t);
      // un tema también necesita práctica si alguno de sus tipos (adverbios) va flojo
      const subFlojo = t === "adv" && CLAVES_PROGRESO.some((c) => c.sub && nivelDe(c.clave).estado === "flojo");
      if (nv.estado === "flojo" || subFlojo) {
        b.classList.add("practicar");
        b.append(el("span", "cinta", "¡A practicar!"));
      }
    });

    // 2) Panel «Tu progreso»
    const panel = $("progreso");
    const hayDatos = CLAVES_PROGRESO.some((c) => (HIST[c.clave] || []).length > 0);
    panel.hidden = !hayDatos;
    if (!hayDatos) return;
    const flojos = CLAVES_PROGRESO.filter((c) => nivelDe(c.clave).estado === "flojo");
    const filas = CLAVES_PROGRESO.map((c) => {
      const nv = nivelDe(c.clave), e = ESTADOS[nv.estado];
      const ancho = nv.pct === null ? 0 : nv.pct;
      return `<button class="prog-fila e-${nv.estado}${c.sub ? " es-sub" : ""}" data-tema="${c.tema}" title="Practicar ${c.nombre.toLowerCase()}">` +
        `<span class="pf-nombre">${c.icono} ${c.nombre}</span>` +
        `<span class="pf-barra"><span style="width:${ancho}%"></span></span>` +
        `<span class="pf-pct">${nv.pct === null ? nv.n + "/" + HIST_MIN : nv.pct + "%"}</span>` +
        `<span class="pf-estado">${e.icono} ${e.txt}</span></button>`;
    }).join("");
    // Recomendación agrupada: «adverbios (sobre todo de lugar y modo)», «preposiciones»…
    const unir = (l) => (l.length > 1 ? l.slice(0, -1).join(", ") + " y " + l[l.length - 1] : l[0]);
    const subsFlojos = flojos.filter((c) => c.sub).map((c) => c.nombre.replace("Adv. de ", ""));
    const nombresFlojos = [];
    if (flojos.some((c) => c.clave === "adv") || subsFlojos.length)
      nombresFlojos.push(`<b>adverbios</b>${subsFlojos.length ? ` (sobre todo de ${unir(subsFlojos)})` : ""}`);
    flojos.filter((c) => !c.sub && c.clave !== "adv").forEach((c) => nombresFlojos.push(`<b>${c.nombre.toLowerCase()}</b>`));
    const recomendacion = flojos.length
      ? `💡 Te recomendamos practicar: ${unir(nombresFlojos)}.`
      : "🌟 ¡Vas genial! No hay nada flojo por ahora. ¡Sigue así!";
    const abierto = panel.querySelector("details")?.open || false; // conservar si estaba abierto
    const resumen = flojos.length
      ? `<span class="prog-chip hay">⚠️ ${nombresFlojos.length} ${nombresFlojos.length === 1 ? "tema" : "temas"} para practicar</span>`
      : `<span class="prog-chip nada">🌟 ¡Vas genial!</span>`;
    panel.innerHTML =
      `<details${abierto ? " open" : ""}><summary><span class="prog-tit">📊 Tu progreso</span>${resumen}<span class="prog-flecha">▾</span></summary>` +
      `<div class="prog-cuerpo">` +
      `<p class="prog-reco ${flojos.length ? "hay" : "nada"}">${recomendacion}</p>` +
      `<div class="prog-filas">${filas}</div>` +
      `<p class="prog-nota">Según tus últimas ${HIST_MAX} respuestas de cada tipo. En «Todo mezclado» saldrán más preguntas de lo que tienes más flojo. Haz clic en una fila para elegir ese tema.</p>` +
      `<button class="btn-link" id="btnBorrarStats">🗑️ Borrar estadísticas</button></div></details>`;
    panel.querySelectorAll(".prog-fila").forEach((f) => f.addEventListener("click", () => elegirTema(f.dataset.tema, true)));
    $("btnBorrarStats").addEventListener("click", () => {
      if (!confirm("¿Seguro que quieres borrar todas las estadísticas guardadas?")) return;
      HIST = {};
      guardarHist();
      pintarProgreso();
    });
  }

  /* ================= Estado ================= */
  let temaElegido = "todo";
  let rondasElegidas = 10;
  let S = null;

  function nuevaPartida() {
    S = {
      tema: temaElegido, rondas: rondasElegidas, ronda: 0, puntos: 0, racha: 0, mejorRacha: 0, perfectas: 0,
      usadas: new Set(), ultimoModo: null, ex: null, comprobado: false,
      stats: { adv: { ok: 0, mal: 0 }, prep: { ok: 0, mal: 0 }, conj: { ok: 0, mal: 0 }, int: { ok: 0, mal: 0 } },
    };
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
    $("btnApps").hidden = nombre === "juego"; // no salir a mitad de partida
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function actualizarHud() {
    $("hudRonda").textContent = Math.max(S.ronda, 1) + "/" + S.rondas;
    $("hudPuntos").textContent = S.puntos;
    $("hudRacha").textContent = S.racha;
    $("progressBar").style.width = ((S.ronda - (S.comprobado ? 0 : 1)) / S.rondas) * 100 + "%";
  }

  function elegirFrase(filtro) {
    const c = FRASES.filter(filtro);
    if (!c.length) return null;
    const nuevas = c.filter((f) => !S.usadas.has(f.id));
    const f = azar(nuevas.length ? nuevas : c);
    S.usadas.add(f.id);
    return f;
  }

  function modosDisponibles() {
    const m = ["selecciona", "quepalabra"];
    if (S.tema === "todo" || S.tema === "adv") m.push("clasificaAdv");
    if (S.tema === "todo") m.push("granClasif");
    return m;
  }

  /* ================= Constructores de ejercicios ================= */
  const CONSTRUIR = {
    selecciona() {
      const cats = S.tema === "todo" ? ORDEN_CATS : [S.tema];
      const cat = azarPonderado(cats, peso);
      const f = elegirFrase((fr) => fr.tokens.some((t) => t.cat === cat));
      if (!f) return null;
      let sub = null;
      if (cat === "adv" && Math.random() < (algunSubFlojo() ? 0.6 : 0.35)) {
        const subs = [...new Set(f.tokens.filter((t) => t.cat === "adv" && SUBS_CLASIF.includes(t.sub)).map((t) => t.sub))];
        if (subs.length) sub = azarPonderado(subs, (s) => peso("adv-" + s));
      }
      return { modo: "selecciona", frase: f, cat, sub, sel: new Set(), esObjetivo: (t) => t.cat === cat && (!sub || t.sub === sub) };
    },

    quepalabra() {
      let f = null, tok = null;
      if (Math.random() < 0.2) {
        f = elegirFrase((fr) => fr.tokens.some((t) => t.trampa));
        if (f) tok = azar(f.tokens.filter((t) => t.trampa));
      }
      if (!tok) {
        const cat = S.tema !== "todo" && Math.random() < 0.75 ? S.tema : azarPonderado(ORDEN_CATS, peso);
        f = elegirFrase((fr) => fr.tokens.some((t) => t.cat === cat));
        if (!f) return null;
        tok = azar(f.tokens.filter((t) => t.cat === cat));
      }
      return { modo: "quepalabra", frase: f, tok, respuesta: null };
    },

    clasificaAdv() {
      const f = elegirFrase((fr) => {
        const advs = fr.tokens.filter((t) => t.cat === "adv");
        return advs.length >= 2 && advs.every((t) => SUBS_CLASIF.includes(t.sub));
      });
      if (!f) return null;
      const chips = barajar(f.tokens.filter((t) => t.cat === "adv")).map((t, k) => ({ id: k, tok: t, sitio: null }));
      const pozos = SUBS_CLASIF.map((s) => ({ clave: s, texto: SUBS[s][0].toUpperCase() + SUBS[s].slice(1), icono: SUB_ICONO[s], cls: "p-" + s }));
      return { modo: "clasificaAdv", frase: f, chips, pozos, correcta: (t) => t.sub, nombreDe: (k) => "adv. " + SUBS[k] };
    },

    granClasif() {
      const f = elegirFrase((fr) => {
        const inv = fr.tokens.filter((t) => t.cat);
        return inv.length >= 3 && new Set(inv.map((t) => t.cat)).size >= 2;
      });
      if (!f) return null;
      const chips = barajar(f.tokens.filter((t) => t.cat)).map((t, k) => ({ id: k, tok: t, sitio: null }));
      const pozos = ORDEN_CATS.map((c) => ({ clave: c, texto: CATS[c].plural[0].toUpperCase() + CATS[c].plural.slice(1), icono: CATS[c].icono, cls: "p-" + c }));
      return { modo: "granClasif", frase: f, chips, pozos, correcta: (t) => t.cat, nombreDe: (k) => CATS[k].nombre.toLowerCase() };
    },
  };

  function siguienteRonda() {
    if (S.ronda >= S.rondas) return fin();
    S.ronda++;
    S.comprobado = false;
    let modos = barajar(modosDisponibles());
    // si algún tipo de adverbio va flojo, más ejercicios de clasificar adverbios
    if (modos.includes("clasificaAdv") && algunSubFlojo() && Math.random() < 0.35)
      modos = ["clasificaAdv", ...modos.filter((m) => m !== "clasificaAdv")];
    if (modos.length > 1 && modos[0] === S.ultimoModo) modos.push(modos.shift());
    let ex = null;
    for (const m of modos) { ex = CONSTRUIR[m](); if (ex) break; }
    S.ex = ex;
    S.ultimoModo = ex.modo;

    const card = $("cardJuego");
    card.style.animation = "none"; void card.offsetWidth; card.style.animation = "";
    $("feedback").hidden = true;
    $("feedback").innerHTML = "";
    $("zonaExtra").innerHTML = "";
    $("btnComprobar").hidden = false;
    $("btnComprobar").disabled = true;
    $("btnSiguiente").hidden = true;
    const modo = $("modo");
    modo.className = "modo m-" + ex.modo;
    modo.textContent = MODOS[ex.modo];
    PINTAR[ex.modo](ex);
    actualizarHud();
  }

  /* ================= Pintar frase ================= */
  function pintarFrase(ex, { clicable = false, foco = null, marcadas = null } = {}) {
    const caja = $("frase");
    caja.innerHTML = "";
    ex.spans = new Map();
    ex.signos = [];
    ex.frase.tokens.forEach((t) => {
      if (!t.palabra) {
        // los signos de puntuación van en su propia caja para quedar alineados con las palabras
        t.texto.split(/(\s+)/).forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { caja.append(document.createTextNode(p)); return; }
          const s = el("span", "w punt");
          s.append(el("span", "tx", p));
          ex.signos.push(s);
          caja.append(s);
        });
        return;
      }
      const w = el("span", "w");
      w.append(el("span", "tx", t.texto));
      if (foco === t.i) w.classList.add("foco");
      if (marcadas && marcadas.has(t.i)) w.classList.add("marca");
      if (clicable) {
        w.classList.add("clic");
        w.tabIndex = 0;
        w.setAttribute("role", "button");
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

  // solo: si se indica, únicamente se etiqueta esa palabra (las demás quedan sin etiqueta)
  function mostrarEtiquetas(ex, solo = null) {
    ex.signos.forEach((s) => { if (!s.querySelector(".lab")) s.prepend(el("span", "lab hueco", "·")); });
    ex.frase.tokens.forEach((t) => {
      const w = ex.spans.get(t.i);
      if (!w || w.querySelector(".lab")) return;
      if ((!t.cat && !t.trampa) || (solo !== null && t.i !== solo)) {
        // etiqueta invisible para que todas las palabras queden alineadas
        const hueco = el("span", "lab hueco", "·");
        w.prepend(hueco);
        return;
      }
      w.prepend(el("span", "lab c-" + (t.trampa ? "otra" : t.cat), etiqueta(t)));
    });
  }

  /* ================= Pintar cada modo ================= */
  const PINTAR = {
    selecciona(ex) {
      const que = ex.sub ? `adverbios de ${SUBS[ex.sub]}` : CATS[ex.cat].plural;
      $("instruccion").innerHTML =
        `Haz clic en <b>todos</b> los <span class="objetivo obj-${ex.cat}">${CATS[ex.cat].icono} ${que}</span> de la frase. ` +
        `<small style="color:var(--ink-soft)">(Otro clic para desmarcar)</small>`;
      pintarFrase(ex, { clicable: true });
    },

    quepalabra(ex) {
      $("instruccion").innerHTML = `¿Qué clase de palabra es <span class="objetivo obj-int" style="background:#f97316">«${ex.tok.texto}»</span> en esta frase?`;
      pintarFrase(ex, { foco: ex.tok.i });
      const cont = el("div", "opciones");
      const ops = ORDEN_CATS.map((c) => ({ clave: c, texto: CATS[c].nombre, icono: CATS[c].icono }))
        .concat([{ clave: "otra", texto: "Otra clase", icono: "🚫" }]);
      ex.botones = {};
      ops.forEach((o) => {
        const b = el("button", "opcion o-" + o.clave);
        b.append(el("span", "oi", o.icono), el("span", null, o.texto));
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
    },

    clasificaAdv(ex) {
      $("instruccion").innerHTML = `Arrastra cada <span class="objetivo obj-adv">🧭 adverbio</span> a su caja. <small style="color:var(--ink-soft)">(También puedes hacer clic en la palabra y luego en la caja)</small>`;
      pintarArrastre(ex);
    },

    granClasif(ex) {
      $("instruccion").innerHTML = `Arrastra cada <b>palabra invariable</b> a su categoría. <small style="color:var(--ink-soft)">(También puedes hacer clic en la palabra y luego en la caja)</small>`;
      pintarArrastre(ex);
    },
  };

  /* ================= Arrastrar y soltar ================= */
  function pintarArrastre(ex) {
    pintarFrase(ex, { marcadas: new Set(ex.chips.map((c) => c.tok.i)) });
    const z = $("zonaExtra");
    const banco = el("div", "banco");
    banco.dataset.zona = "__banco";
    ex.bancoEl = banco;
    ex.cogido = null;

    ex.chips.forEach((c) => {
      const ch = el("div", "chip", c.tok.texto);
      ch.draggable = true;
      c.el = ch;
      ch.addEventListener("dragstart", (e) => {
        if (S.comprobado) { e.preventDefault(); return; }
        e.dataTransfer.setData("text/plain", String(c.id));
        e.dataTransfer.effectAllowed = "move";
        ch.classList.add("arrastrando");
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

    const pozos = el("div", "pozos");
    ex.pozos.forEach((p) => {
      const d = el("div", "pozo " + p.cls);
      d.dataset.zona = p.clave;
      const h = el("div", "pozo-h");
      h.append(el("span", "pi", p.icono), document.createTextNode(p.texto));
      const b = el("div", "pozo-b");
      d.append(h, b);
      p.cuerpo = b;
      pozos.append(d);
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
    const destino = zona === "__banco" ? ex.bancoEl : ex.pozos.find((p) => p.clave === zona).cuerpo;
    destino.append(c.el);
    c.el.classList.remove("cogido");
    ex.cogido = null;
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
        const w = ex.spans.get(t.i);
        const marcada = ex.sel.has(t.i), obj = ex.esObjetivo(t);
        w.classList.remove("sel", "clic");
        w.removeAttribute("tabindex");
        if (marcada && obj) { ok++; w.classList.add("ok"); anotar(ex.cat, ex.sub, true); }
        else if (marcada && !obj) { mal++; w.classList.add("ko"); anotar(ex.cat, ex.sub, false); }
        else if (!marcada && obj) { omit++; w.classList.add("miss"); anotar(ex.cat, ex.sub, false); }
      });
      mostrarEtiquetas(ex);
      return { ok, mal, omit, leyenda: true };
    },

    quepalabra(ex) {
      const correcta = ex.tok.trampa ? "otra" : ex.tok.cat;
      const acierto = ex.respuesta === correcta;
      Object.values(ex.botones).forEach((b) => (b.disabled = true));
      ex.botones[ex.respuesta].classList.remove("sel");
      ex.botones[correcta].classList.add("ok");
      if (!acierto) ex.botones[ex.respuesta].classList.add("ko");
      const w = ex.spans.get(ex.tok.i);
      w.classList.remove("foco");
      w.classList.add(acierto ? "ok" : "ko");
      if (ex.tok.cat) anotar(ex.tok.cat, null, acierto);
      mostrarEtiquetas(ex, ex.tok.i); // solo se etiqueta la palabra preguntada
      let extra = null;
      if (ex.tok.cat === "adv") extra = `«${ex.tok.texto}» es un adverbio de ${SUBS[ex.tok.sub]}.`;
      else if (ex.tok.cat) extra = `«${ex.tok.texto}» es una ${CATS[ex.tok.cat].nombre.toLowerCase()}.`;
      return { ok: acierto ? 1 : 0, mal: acierto ? 0 : 1, omit: 0, extra, soloNota: ex.tok };
    },

    clasificaAdv(ex) { return comprobarArrastre(ex); },
    granClasif(ex) { return comprobarArrastre(ex); },
  };

  function comprobarArrastre(ex) {
    let ok = 0, mal = 0;
    if (ex.cogido) ex.cogido.el.classList.remove("cogido");
    ex.chips.forEach((c) => {
      const buena = ex.correcta(c.tok);
      c.el.draggable = false;
      const sub = ex.modo === "clasificaAdv" ? c.tok.sub : null; // solo aquí se evalúa el tipo de adverbio
      if (c.sitio === buena) { ok++; c.el.classList.add("ok"); anotar(c.tok.cat, sub, true); }
      else {
        mal++; c.el.classList.add("ko"); anotar(c.tok.cat, sub, false);
        c.el.append(el("span", "correccion", "→ " + ex.nombreDe(buena)));
      }
    });
    mostrarEtiquetas(ex);
    return { ok, mal, omit: 0 };
  }

  function comprobar() {
    if (!S || S.comprobado) return;
    const ex = S.ex;
    S.comprobado = true;
    const r = COMPROBAR[ex.modo](ex);
    guardarHist();
    const perfecto = r.mal === 0 && r.omit === 0 && r.ok > 0;
    let pts = r.ok * PTS_OK + r.mal * PTS_MAL + (perfecto ? PTS_PERFECTO : 0);
    const antes = S.puntos;
    S.puntos = Math.max(0, S.puntos + pts);
    const real = S.puntos - antes;
    if (perfecto) { S.racha++; S.perfectas++; S.mejorRacha = Math.max(S.mejorRacha, S.racha); } else S.racha = 0;

    // Feedback
    const fb = $("feedback");
    const nivel = perfecto ? "perfecto" : r.ok > r.mal + r.omit ? "casi" : "mal";
    fb.className = "feedback " + nivel;
    const titulos = {
      perfecto: azar(["🎉 ¡Perfecto!", "🚀 ¡Increíble!", "🏆 ¡Eres un crack!", "⭐ ¡Brutal!", "🔥 ¡Imparable!"]),
      casi: azar(["👍 ¡Muy bien, pero revisa!", "💪 ¡Casi lo tienes!", "😎 ¡Buen intento!"]),
      mal: azar(["🤔 ¡Uy! Repasa la corrección", "💡 ¡A la próxima lo clavas!", "🧐 Mira bien las pistas"]),
    };
    const partes = [];
    partes.push(`✅ ${plural(r.ok, "acierto", "aciertos")}`);
    partes.push(`❌ ${plural(r.mal, "error", "errores")}`);
    if (ex.modo === "selecciona") partes.push(`⚠️ ${r.omit} sin marcar`);
    if (perfecto) partes.push("⭐ +5 de bonus");
    if (S.racha >= 2) partes.push(`🔥 ¡Racha de ${S.racha}!`);

    const notas = [];
    if (r.extra) notas.push(r.extra);
    if (r.soloNota) { if (r.soloNota.nota) notas.push(r.soloNota.nota); }
    else ex.frase.tokens.forEach((t) => { if (t.nota) notas.push(t.nota); });
    const notasUnicas = [...new Set(notas)];

    const clasePts = real > 0 ? "pos" : real < 0 ? "neg" : "cero";
    fb.innerHTML =
      `<div class="fb-top"><div class="fb-head">${titulos[nivel]}</div><div class="fb-pts ${clasePts}">${real > 0 ? "+" : ""}${real}</div></div>` +
      `<div class="fb-stats">${partes.join(" · ")}</div>` +
      (r.leyenda
        ? `<div class="leyenda"><span><i style="border-color:var(--ok);background:var(--ok-l)"></i>bien marcada</span>` +
          `<span><i style="border-color:var(--ko);background:var(--ko-l)"></i>no era</span>` +
          `<span><i style="border-color:var(--miss);background:var(--miss-l);border-style:dashed"></i>se te escapó</span></div>`
        : "") +
      (notasUnicas.length ? `<ul class="notas">${notasUnicas.map((n) => `<li>💡 ${n}</li>`).join("")}</ul>` : "");
    fb.hidden = false;

    if (perfecto) confeti(S.racha >= 3 ? 220 : 120);

    animarPuntos(real);
    $("btnComprobar").hidden = true;
    const sig = $("btnSiguiente");
    sig.textContent = S.ronda >= S.rondas ? "Ver resultados 🏁" : "Siguiente frase →";
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
    pill.append(f);
    setTimeout(() => f.remove(), 1400);
  }

  /* ================= Fin de partida ================= */
  function leerRecord(t, n) { try { return +localStorage.getItem("pi_record_" + t + "_" + n) || 0; } catch (e) { return 0; } }
  function guardarRecord(t, n, v) { try { localStorage.setItem("pi_record_" + t + "_" + n, v); } catch (e) { /* nada */ } }

  function fin() {
    pantalla("fin");
    const rec = leerRecord(S.tema, S.rondas);
    const nuevo = S.puntos > rec;
    if (nuevo) guardarRecord(S.tema, S.rondas, S.puntos);
    const colores = { adv: "var(--adv)", prep: "var(--prep)", conj: "var(--conj)", int: "var(--int)" };

    let peor = null, peorPct = 101;
    const barras = ORDEN_CATS.filter((c) => S.stats[c].ok + S.stats[c].mal > 0).map((c) => {
      const s = S.stats[c], tot = s.ok + s.mal, pct = Math.round((s.ok / tot) * 100);
      if (pct < peorPct) { peorPct = pct; peor = c; }
      return `<div class="barra"><div class="bl"><span>${CATS[c].icono} ${CATS[c].plural[0].toUpperCase() + CATS[c].plural.slice(1)}</span><span>${pct}% (${s.ok}/${tot})</span></div>` +
        `<div class="bt"><div class="bf" data-w="${pct}" style="background:${colores[c]}"></div></div></div>`;
    }).join("");

    const ratio = S.perfectas / S.rondas;
    const trofeo = ratio >= 0.8 ? "🏆" : ratio >= 0.5 ? "🥇" : ratio >= 0.3 ? "🥈" : "🚀";
    const consejo = peor && peorPct < 80
      ? `💡 Consejo: repasa las <b>${CATS[peor].plural}</b> en la chuleta 📖 y vuelve a intentarlo.`
      : "🌟 ¡Dominas las palabras invariables! Prueba otra misión.";

    $("fin").innerHTML =
      `<div class="trofeo">${trofeo}</div><h2>¡Misión completada!</h2>` +
      `<div class="gran-puntos">${S.puntos}</div><div style="font-weight:800;color:var(--ink-soft)">puntos · ${TEMAS[S.tema]} · ${S.rondas} rondas</div>` +
      (nuevo ? `<div style="margin-top:12px"><span class="nuevo-record">🎖️ ¡NUEVO RÉCORD!</span></div>` : `<p style="font-weight:700;color:var(--ink-soft)">Tu récord: ${rec} puntos</p>`) +
      `<div class="fin-datos"><div><b>${S.perfectas}/${S.rondas}</b>frases perfectas</div><div><b>🔥 ${S.mejorRacha}</b>mejor racha</div></div>` +
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
  document.querySelectorAll(".ronda-btn").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".ronda-btn").forEach((x) => x.classList.remove("sel"));
      b.classList.add("sel");
      rondasElegidas = +b.dataset.rondas;
      pintarRecord();
    });
  });
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
