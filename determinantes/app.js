"use strict";
(() => {
  const $ = (id) => document.getElementById(id);
  const CATS = {
    art: ["Artículos", "🏷️"], dem: ["Demostrativos", "📍"], pos: ["Posesivos", "🎒"],
    num: ["Numerales", "🔢"], ind: ["Indefinidos", "🧺"],
    int: ["Interrogativos y exclamativos", "❓"], rel: ["Relativos", "🔗"],
  };
  const CODIGOS = { AD: ["art", "determinado"], AI: ["art", "indeterminado"], DE: ["dem"], PO: ["pos"], NC: ["num", "cardinal"], NO: ["num", "ordinal"], IN: ["ind"], IE: ["int"], RE: ["rel"] };
  const CLAVES = Object.keys(CATS);
  const FRASES = (window.DET_FRASES || []).map((frase, id) => {
    const tokens = [];
    const patron = /\[([^\]]+)\]\{([A-Z]+)(?:\|([^}]+))?\}|([\p{L}\p{M}]+)|([^\p{L}\p{M}\[]+)|(\[)/gu;
    for (const marca of frase.matchAll(patron)) {
      const datos = marca[2] ? CODIGOS[marca[2]] : null;
      tokens.push({ texto: marca[1] || marca[4] || marca[5] || marca[6], palabra: !!(marca[1] || marca[4]), cat: datos && datos[0], sub: datos && datos[1], nota: marca[3] });
    }
    return { id, tokens };
  });
  const azar = (lista) => lista[Math.floor(Math.random() * lista.length)];
  function el(tag, clase, texto) {
    const nodo = document.createElement(tag);
    if (clase) nodo.className = clase;
    if (texto != null) nodo.textContent = texto;
    return nodo;
  }
  function leer(clave, defecto) { try { return JSON.parse(localStorage.getItem(clave)) ?? defecto; } catch (error) { return defecto; } }
  function guardar(clave, valor) { try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (error) { return; } }
  let hist = leer("det_hist", {}), tema = "todo", rondas = 10, juego = null;
  if (!hist || typeof hist !== "object" || Array.isArray(hist)) hist = {};
  function nivel(clave) {
    const respuestas = Array.isArray(hist[clave]) ? hist[clave] : [];
    if (respuestas.length < 6) return { estado: "nuevo", texto: `${respuestas.length}/6`, peso: 1.4 };
    const porcentaje = Math.round(respuestas.reduce((suma, valor) => suma + valor, 0) * 100 / respuestas.length);
    if (porcentaje < 60) return { estado: "flojo", texto: `${porcentaje}%`, peso: 3 };
    if (porcentaje < 80) return { estado: "mejorando", texto: `${porcentaje}%`, peso: 1.6 };
    return { estado: "dominado", texto: `${porcentaje}%`, peso: 0.6 };
  }
  function elegirCategoria() {
    if (tema !== "todo") return tema;
    let numero = Math.random() * CLAVES.reduce((suma, clave) => suma + nivel(clave).peso, 0);
    for (const clave of CLAVES) { numero -= nivel(clave).peso; if (numero <= 0) return clave; }
    return CLAVES[CLAVES.length - 1];
  }
  function elegirFrase(cat) {
    const disponibles = FRASES.filter((frase) => frase.tokens.some((token) => token.cat === cat));
    const nuevas = disponibles.filter((frase) => !juego.usadas.has(frase.id));
    const frase = azar(nuevas.length ? nuevas : disponibles);
    if (frase) juego.usadas.add(frase.id);
    return frase;
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
  function hud() {
    $("hudRonda").textContent = `${juego.ronda}/${rondas}`;
    $("hudPuntos").textContent = juego.puntos;
    $("hudRacha").textContent = juego.racha;
    $("progressBar").style.width = `${(juego.ronda - (juego.comprobado ? 0 : 1)) * 100 / rondas}%`;
  }
  function elegirTema(clave) {
    tema = clave;
    document.querySelectorAll(".tema").forEach((boton) => {
      const seleccionado = boton.dataset.topic === tema;
      boton.classList.toggle("sel", seleccionado);
      boton.setAttribute("aria-pressed", String(seleccionado));
    });
    pintarRecord();
  }
  function pintarRecord() {
    const record = leer(`det_record_${tema}_${rondas}`, 0);
    $("record").textContent = record ? `🎖️ Tu récord: ${record} puntos` : "";
  }
  function pintarProgreso() {
    const panel = $("progreso");
    panel.replaceChildren();
    panel.hidden = !CLAVES.some((clave) => Array.isArray(hist[clave]) && hist[clave].length);
    if (panel.hidden) return;
    const detalles = el("details"), cuerpo = el("div", "prog-cuerpo"), filas = el("div", "prog-filas");
    const flojos = CLAVES.filter((clave) => nivel(clave).estado === "flojo");
    cuerpo.append(el("p", `prog-reco ${flojos.length ? "hay" : "nada"}`, flojos.length ? `💡 Te recomendamos practicar: ${flojos.map((clave) => CATS[clave][0].toLowerCase()).join(", ")}.` : "🌟 ¡Vas genial! Sigue practicando."));
    CLAVES.forEach((clave) => {
      const actual = nivel(clave), fila = el("button", `prog-fila e-${actual.estado}`);
      fila.type = "button";
      fila.append(el("span", "pf-nombre", `${CATS[clave][1]} ${CATS[clave][0]}`), el("span", "pf-pct", actual.texto), el("span", "pf-estado", { nuevo: "Pocos datos", flojo: "¡A practicar!", mejorando: "Mejorando", dominado: "¡Dominado!" }[actual.estado]));
      fila.addEventListener("click", () => { elegirTema(clave); $("temas").scrollIntoView({ behavior: "smooth" }); });
      filas.append(fila);
    });
    const borrar = el("button", "btn-link", "🗑️ Borrar estadísticas");
    borrar.type = "button";
    borrar.addEventListener("click", () => { if (confirm("¿Seguro que quieres borrar todas las estadísticas guardadas?")) { hist = {}; guardar("det_hist", hist); pintarProgreso(); } });
    cuerpo.append(filas, el("p", "prog-nota", "Según tus últimas 40 respuestas de cada tipo. En «Todo mezclado» practicarás más lo que te cuesta."), borrar);
    detalles.append(el("summary", "prog-tit", "📊 Tu progreso"), cuerpo);
    panel.append(detalles);
  }
  function inicio() { pantalla("inicio"); pintarRecord(); pintarProgreso(); }
  function empezar() {
    juego = { ronda: 0, puntos: 0, racha: 0, mejorRacha: 0, perfectas: 0, usadas: new Set(), ultimoModo: null, stats: {}, comprobado: false };
    pantalla("juego"); siguiente();
  }
  function pintarFrase(frase, interactiva, foco) {
    const caja = $("frase");
    caja.replaceChildren();
    frase.tokens.forEach((token, indice) => {
      if (!token.palabra) { caja.append(document.createTextNode(token.texto)); return; }
      const palabra = el(interactiva ? "button" : "span", "w", token.texto);
      if (indice === foco) palabra.classList.add("foco");
      if (interactiva) {
        palabra.type = "button"; palabra.classList.add("clic"); palabra.setAttribute("aria-pressed", "false");
        palabra.addEventListener("click", () => {
          if (juego.comprobado) return;
          const marcada = juego.ej.seleccion.has(indice);
          if (marcada) juego.ej.seleccion.delete(indice); else juego.ej.seleccion.add(indice);
          palabra.setAttribute("aria-pressed", String(!marcada));
          $("btnComprobar").disabled = juego.ej.seleccion.size === 0;
        });
      }
      token.elemento = palabra; caja.append(palabra);
    });
  }
  function pintarOpciones(lista) {
    const contenedor = el("div", "opciones");
    lista.forEach(([valor, texto]) => {
      const boton = el("button", "opcion", texto); boton.type = "button"; boton.setAttribute("aria-pressed", "false");
      boton.addEventListener("click", () => {
        if (juego.comprobado) return;
        contenedor.querySelectorAll("button").forEach((otro) => { otro.classList.remove("sel"); otro.setAttribute("aria-pressed", "false"); });
        boton.classList.add("sel"); boton.setAttribute("aria-pressed", "true"); juego.ej.respuesta = valor; $("btnComprobar").disabled = false;
      });
      contenedor.append(boton);
    });
    $("zonaExtra").append(contenedor);
  }
  function pintarClasificacion(ej) {
    $("frase").hidden = true;
    const grupo = el("div", "clasificacion");
    ej.items.forEach((item, indice) => {
      const fila = el("div", "clasificacion-fila"), etiqueta = el("label");
      const frase = item.frase.tokens.map((token) => token.texto).join("");
      const seleccion = el("select");
      seleccion.id = `clasificacion-${indice}`;
      etiqueta.htmlFor = seleccion.id;
      etiqueta.textContent = `${frase} ¿Qué tipo es «${item.token.texto}»?`;
      seleccion.append(el("option", null, "Elige un tipo"));
      seleccion.firstChild.value = "";
      CLAVES.forEach((clave) => { const opcion = el("option", null, CATS[clave][0]); opcion.value = clave; seleccion.append(opcion); });
      seleccion.addEventListener("change", () => { $("btnComprobar").disabled = ej.items.some((otro) => !otro.control.value); });
      item.control = seleccion;
      fila.append(etiqueta, seleccion); grupo.append(fila);
    });
    $("zonaExtra").append(grupo);
  }
  function siguiente() {
    if (juego.ronda >= rondas) return terminar();
    juego.ronda++; juego.comprobado = false;
    const cat = elegirCategoria(), frase = elegirFrase(cat);
    if (!frase) { $("instruccion").textContent = "No hay frases disponibles para esta misión."; $("btnComprobar").disabled = true; return; }
    const posibles = ["selecciona"];
    if (cat === "art" || cat === "num") posibles.push("subtipo");
    if (tema === "todo") posibles.push("tipo", "clasifica");
    const modos = posibles.filter((modo) => modo !== juego.ultimoModo), modo = azar(modos.length ? modos : posibles);
    juego.ultimoModo = modo;
    const indice = frase.tokens.findIndex((token) => token.cat === cat), token = frase.tokens[indice];
    juego.ej = { cat, frase, modo, indice, token, seleccion: new Set(), respuesta: null };
    $("zonaExtra").replaceChildren(); $("frase").hidden = false; $("feedback").hidden = true; $("btnComprobar").hidden = false; $("btnComprobar").disabled = true; $("btnSiguiente").hidden = true;
    $("modo").className = `modo m-${modo === "selecciona" ? "selecciona" : "quepalabra"}`;
    $("modo").textContent = { selecciona: "🔍 Busca y selecciona", tipo: "🤔 ¿Qué tipo es?", subtipo: "🗂️ Clasifica", clasifica: "🗂️ Gran clasificación" }[modo];
    if (modo === "selecciona") {
      $("instruccion").textContent = `Selecciona todos los ${CATS[cat][0].toLowerCase()} de la frase.${cat === "art" ? " En «al» y «del», marca la palabra completa." : ""}`;
      pintarFrase(frase, true, null);
    } else if (modo === "clasifica") {
      const otras = CLAVES.filter((clave) => clave !== cat).sort(() => Math.random() - 0.5).slice(0, 2);
      juego.ej.items = [cat, ...otras].map((clave, posicion) => {
        const elegida = posicion === 0 ? frase : elegirFrase(clave);
        return { cat: clave, frase: elegida, token: elegida.tokens.find((palabra) => palabra.cat === clave) };
      });
      $("instruccion").textContent = "Elige el tipo de cada determinante.";
      pintarClasificacion(juego.ej);
    } else {
      const pregunta = token.nota && /^(al|del)$/i.test(token.texto) ? `contiene «${token.texto}»` : `es «${token.texto}»`;
      $("instruccion").textContent = modo === "tipo" ? `¿Qué tipo de determinante ${pregunta} en esta frase?` : `¿Qué tipo de ${cat === "art" ? "artículo" : "numeral"} ${pregunta}?`;
      pintarFrase(frase, false, indice);
      const lista = modo === "tipo" ? CLAVES.map((clave) => [clave, CATS[clave][0]]) : cat === "art" ? [["determinado", "Determinado"], ["indeterminado", "Indeterminado"]] : [["cardinal", "Cardinal"], ["ordinal", "Ordinal"]];
      pintarOpciones(lista);
    }
    hud();
  }
  function anotar(cat, acierto) {
    if (!Array.isArray(hist[cat])) hist[cat] = [];
    hist[cat].push(acierto ? 1 : 0); hist[cat] = hist[cat].slice(-40);
    if (!juego.stats[cat]) juego.stats[cat] = { ok: 0, total: 0 };
    juego.stats[cat].total++; if (acierto) juego.stats[cat].ok++;
  }
  function comprobar() {
    if (!juego || juego.comprobado) return;
    juego.comprobado = true;
    const ej = juego.ej;
    let aciertos = 0, errores = 0, omitidos = 0;
    if (ej.modo === "selecciona") {
      ej.frase.tokens.forEach((token, indice) => {
        if (!token.palabra) return;
        const marcada = ej.seleccion.has(indice), correcta = token.cat === ej.cat;
        token.elemento.disabled = true;
        if (marcada && correcta) { aciertos++; token.elemento.classList.add("ok"); anotar(ej.cat, true); }
        else if (marcada) { errores++; token.elemento.classList.add("ko"); anotar(ej.cat, false); }
        else if (correcta) { omitidos++; token.elemento.classList.add("miss"); anotar(ej.cat, false); }
      });
    } else if (ej.modo === "clasifica") {
      ej.items.forEach((item) => {
        const acierto = item.control.value === item.cat;
        if (acierto) aciertos++; else errores++;
        anotar(item.cat, acierto);
        item.control.disabled = true;
        item.control.classList.add(acierto ? "respuesta-ok" : "respuesta-ko");
      });
    } else {
      const correcta = ej.modo === "tipo" ? ej.cat : ej.token.sub, acierto = ej.respuesta === correcta;
      if (acierto) aciertos++; else errores++;
      anotar(ej.cat, acierto); ej.token.elemento.classList.remove("foco"); ej.token.elemento.classList.add(acierto ? "ok" : "ko");
      $("zonaExtra").querySelectorAll("button").forEach((boton) => { boton.disabled = true; });
    }
    guardar("det_hist", hist);
    const perfecto = errores === 0 && omitidos === 0 && aciertos > 0, anterior = juego.puntos;
    juego.puntos = Math.max(0, juego.puntos + aciertos * 10 - errores * 3 + (perfecto ? 5 : 0));
    juego.racha = perfecto ? juego.racha + 1 : 0; juego.mejorRacha = Math.max(juego.mejorRacha, juego.racha); if (perfecto) juego.perfectas++;
    const feedback = $("feedback"); feedback.className = `feedback ${perfecto ? "perfecto" : aciertos ? "casi" : "mal"}`;
    feedback.replaceChildren(el("div", "fb-head", perfecto ? "🎉 ¡Perfecto!" : "💡 Revisa la corrección"), el("div", "fb-stats", `✅ ${aciertos} aciertos · ❌ ${errores} errores${omitidos ? ` · ⚠️ ${omitidos} sin marcar` : ""} · ${juego.puntos - anterior >= 0 ? "+" : ""}${juego.puntos - anterior} puntos`));
    const solucion = ej.modo === "clasifica" ? ej.items.map((item) => `«${item.token.texto}»: ${CATS[item.cat][0].toLowerCase()}`).join("; ") : ej.modo === "selecciona" ? ej.frase.tokens.filter((token) => token.cat === ej.cat).map((token) => `«${token.texto}»${token.sub ? ` (${token.sub})` : ""}`).join(", ") : `«${ej.token.texto}»: ${ej.token.sub || CATS[ej.cat][0].toLowerCase()}`;
    feedback.append(el("p", null, `Respuesta: ${solucion}.`));
    const notas = ej.modo === "clasifica" ? ej.items.map((item) => item.token.nota).filter(Boolean) : ej.modo === "selecciona" ? ej.frase.tokens.filter((token) => token.cat === ej.cat && token.nota).map((token) => token.nota) : [ej.token.nota].filter(Boolean);
    notas.forEach((nota) => feedback.append(el("p", null, `💡 ${nota}`)));
    feedback.hidden = false; $("btnComprobar").hidden = true;
    $("btnSiguiente").textContent = juego.ronda === rondas ? "Ver resultados 🏁" : "Siguiente frase →"; $("btnSiguiente").hidden = false; $("btnSiguiente").focus(); hud();
  }
  function terminar() {
    pantalla("fin");
    const clave = `det_record_${tema}_${rondas}`, record = leer(clave, 0), nuevo = juego.puntos > record;
    if (nuevo) guardar(clave, juego.puntos);
    const fin = $("fin");
    fin.replaceChildren(el("div", "trofeo", "🏆"), el("h2", null, "¡Misión completada!"), el("div", "gran-puntos", String(juego.puntos)), el("p", null, `puntos · ${tema === "todo" ? "Todo mezclado" : CATS[tema][0]} · ${rondas} rondas`), el("p", "record", nuevo ? "🎖️ ¡Nuevo récord!" : `Tu récord: ${record} puntos`), el("p", null, `${juego.perfectas}/${rondas} rondas perfectas · 🔥 Mejor racha: ${juego.mejorRacha}`));
    const resumen = el("div", "barras"), botones = el("div", "fin-botones");
    CLAVES.filter((cat) => juego.stats[cat]).forEach((cat) => resumen.append(el("p", null, `${CATS[cat][1]} ${CATS[cat][0]}: ${juego.stats[cat].ok}/${juego.stats[cat].total} aciertos`)));
    const repetir = el("button", "btn primary big", "🔄 Jugar otra vez"), cambiar = el("button", "btn secondary big", "🎯 Cambiar de misión");
    repetir.type = cambiar.type = "button"; repetir.addEventListener("click", empezar); cambiar.addEventListener("click", inicio); botones.append(repetir, cambiar); fin.append(resumen, botones);
  }
  document.querySelectorAll(".tema").forEach((boton) => boton.addEventListener("click", () => elegirTema(boton.dataset.topic)));
  document.querySelectorAll(".ronda-btn").forEach((boton) => boton.addEventListener("click", () => {
    rondas = Number(boton.dataset.rondas);
    document.querySelectorAll(".ronda-btn").forEach((otro) => { const seleccionado = otro === boton; otro.classList.toggle("sel", seleccionado); otro.setAttribute("aria-pressed", String(seleccionado)); }); pintarRecord();
  }));
  $("btnEmpezar").addEventListener("click", empezar); $("btnComprobar").addEventListener("click", comprobar); $("btnSiguiente").addEventListener("click", siguiente);
  $("btnSalir").addEventListener("click", () => { if ($("pantallaFin").hidden && !confirm("¿Quieres salir de la partida?")) return; inicio(); });
  const dialogo = $("chuleta");
  $("btnChuleta").addEventListener("click", () => dialogo.showModal()); $("btnCerrarChuleta").addEventListener("click", () => dialogo.close());
  dialogo.addEventListener("click", (evento) => { if (evento.target === dialogo) dialogo.close(); });
  pintarRecord(); pintarProgreso();
})();