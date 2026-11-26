"use strict";

(() => {
  const grupos = [
    {
      frases: [
        "[el]{AD} gato", "[la]{AD} pelota", "[los]{AD} árboles", "[las]{AD} estrellas", "[el]{AD} cuaderno",
        "[un]{AI} perro", "[una]{AI} mochila", "[unos]{AI} lápices", "[unas]{AI} flores", "[una]{AI} bicicleta",
      ],
      moldes: [(frase) => `Vi ${frase} ayer.`, (frase) => `Encontré ${frase} aquí.`, (frase) => `Mira ${frase} ahora.`],
    },
    {
      frases: [
        "[este]{DE} libro", "[esta]{DE} casa", "[estos]{DE} zapatos", "[estas]{DE} fotos", "[ese]{DE} tren",
        "[esa]{DE} montaña", "[esos]{DE} pájaros", "[esas]{DE} nubes", "[aquel]{DE} castillo", "[aquellas]{DE} islas",
      ],
      moldes: [(frase) => `Vi ${frase} ayer.`, (frase) => `Recuerdo ${frase} bien.`, (frase) => `Mira ${frase} ahora.`],
    },
    {
      frases: [
        "[mi]{PO} hermano", "[tu]{PO} hermana", "[su]{PO} perro", "[mis]{PO} libros", "[tus]{PO} dibujos",
        "[sus]{PO} amigos", "[nuestro]{PO} equipo", "[nuestra]{PO} clase", "[vuestros]{PO} juegos", "[vuestras]{PO} bicicletas",
      ],
      moldes: [(frase) => `Vi ${frase} ayer.`, (frase) => `Recuerdo ${frase} bien.`, (frase) => `Mira ${frase} ahora.`],
    },
    {
      frases: [
        "[dos]{NC} gatos", "[tres]{NC} casas", "[cinco]{NC} estrellas", "[seis]{NC} globos", "[diez]{NC} libros",
        "[el]{AD} [primer]{NO} premio", "[el]{AD} [segundo]{NO} piso", "[el]{AD} [tercer]{NO} puesto", "[la]{AD} [cuarta]{NO} fila", "[la]{AD} [décima]{NO} página",
      ],
      moldes: [(frase) => `Vi ${frase} ayer.`, (frase) => `Recuerdo ${frase} bien.`, (frase) => `Mira ${frase} ahora.`],
    },
    {
      frases: [
        "[algunos]{IN} amigos", "[algunas]{IN} flores", "[muchos]{IN} pájaros", "[muchas]{IN} montañas", "[pocos]{IN} trenes",
        "[pocas]{IN} nubes", "[varios]{IN} libros", "[varias]{IN} estrellas", "[ciertos]{IN} lugares", "[otras]{IN} fotos",
      ],
      moldes: [(frase) => `Vi ${frase} ayer.`, (frase) => `Recuerdo ${frase} bien.`, (frase) => `Mira ${frase} ahora.`],
    },
    {
      frases: [
        "[qué]{IE} libro eligieron", "[qué]{IE} película prefieren", "[qué]{IE} camino tomaron", "[cuántos]{IE} niños llegaron", "[cuántas]{IE} flores compraron",
        "[cuánto]{IE} tiempo necesitan", "[cuánta]{IE} leche queda", "[cuántos]{IE} libros faltan", "[cuántas]{IE} páginas quedan", "[qué]{IE} canción cantaron",
      ],
      moldes: [(frase) => `¿Sabes ${frase}?`, (frase) => `¿Recuerdas ${frase}?`, (frase) => `Dime ${frase}.`],
    },
    {
      frases: [
        "[cuyo]{RE} hermano estudia música", "[cuya]{RE} hermana vive cerca", "[cuyos]{RE} amigos juegan aquí", "[cuyas]{RE} primas cantan bien", "[cuyo]{RE} perro duerme fuera",
        "[cuya]{RE} bicicleta brilla mucho", "[cuyos]{RE} abuelos viajan mañana", "[cuyas]{RE} hermanas dibujan bien", "[cuyo]{RE} gato salta alto", "[cuya]{RE} madre trabaja aquí",
      ],
      moldes: [(frase) => `Conocí a alguien ${frase}.`, (frase) => `Busco a alguien ${frase}.`, (frase) => `Recuerdo a alguien ${frase}.`],
    },
  ];

  window.DET_FRASES = grupos.flatMap(({ frases, moldes }) =>
    frases.flatMap((frase) => moldes.map((molde) => molde(frase)))
  );
  window.DET_FRASES.push(
    "¡[Qué]{IE} paisaje tan bonito!",
    "¡[Cuánta]{IE} gente ha venido!",
    "¡[Cuántos]{IE} libros tienes!",
    "¡[Cuántas]{IE} estrellas brillan [esta]{DE} noche!",
    "¡[Qué]{IE} sorpresa tan divertida!",
    "[La]{AD} niña juega en [el]{AD} parque.",
    "[Un]{AI} perro pequeño duerme en [la]{AD} alfombra.",
    "[Las]{AD} estrellas brillan sobre [los]{AD} tejados.",
    "[Unas]{AI} flores amarillas adornan [la]{AD} ventana.",
    "[El]{AD} abuelo preparó [una]{AI} merienda deliciosa.",
    "[Los]{AD} niños encontraron [un]{AI} mapa debajo de [la]{AD} mesa.",
    "[Una]{AI} mariposa entró por [la]{AD} puerta abierta.",
    "[El]{AD} gato de [la]{AD} vecina persigue a [un]{AI} ratón.",
    "[Las]{AD} abejas construyeron [unos]{AI} panales cerca [del]{AD|«Del» es la contracción de «de + el» y contiene el artículo «el».} árbol.",
    "[Mi]{PO} prima encontró [una]{AI} moneda en [el]{AD} bolsillo de [la]{AD} chaqueta.",
    "[Unos]{AI} músicos tocaron canciones alegres en [la]{AD} plaza.",
    "[La]{AD} profesora dejó [los]{AD} cuadernos encima de [una]{AI} silla.",
    "[El]{AD} viento movía [unas]{AI} hojas secas por [el]{AD} camino.",
    "[Los]{AD} exploradores descubrieron [una]{AI} cueva junto [al]{AD|«Al» es la contracción de «a + el» y contiene el artículo «el».} río.",
    "[Una]{AI} estrella fugaz cruzó [el]{AD} cielo durante [la]{AD} noche.",
    "[La]{AD} abuela guardaba [unos]{AI} botones antiguos en [una]{AI} caja de madera.",
    "[Los]{AD} jugadores dejaron [las]{AD} mochilas junto a [un]{AI} banco.",
    "[El]{AD|«Águila» es femenino: decimos «el águila blanca» por su a tónica inicial.} águila volaba sobre [una]{AI} montaña nevada.",
    "[La]{AD} médica explicó [el]{AD} problema a [unos]{AI} pacientes [del]{AD|«Del» es la contracción de «de + el» y contiene el artículo «el».} hospital.",
    "[Los]{AD} vecinos organizaron [una]{AI} fiesta en [el]{AD} patio de [las]{AD} viviendas."
  );
})();