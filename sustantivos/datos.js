/* =====================================================================
   DATOS PARA PRACTICAR LOS SUSTANTIVOS
   =====================================================================

   1) NOMBRES PARA CLASIFICAR  (window.SUST_NOMBRES)
   ---------------------------------------------------------------------
   [ "palabra", "clasificación", "nota opcional" ]

   La clasificación son 4 palabras, una de cada par, en este orden:
     comun | propio
     individual | colectivo
     concreto | abstracto
     contable | incontable      (pon «-» si no se aplica, p. ej. en nombres propios)

   2) NOMBRES COLECTIVOS  (window.SUST_COLECTIVOS)
   ---------------------------------------------------------------------
   [ "artículo y colectivo", "de qué es el conjunto", "otras respuestas válidas separadas por /" ]
   Al escribir no se tienen en cuenta mayúsculas ni tildes.
   ===================================================================== */

window.SUST_NOMBRES = [
  // --- Comunes, individuales, concretos, contables ---
  ["perro", "comun individual concreto contable"],
  ["mesa", "comun individual concreto contable"],
  ["libro", "comun individual concreto contable"],
  ["árbol", "comun individual concreto contable"],
  ["lápiz", "comun individual concreto contable"],
  ["niño", "comun individual concreto contable"],
  ["manzana", "comun individual concreto contable"],
  ["montaña", "comun individual concreto contable"],
  ["oveja", "comun individual concreto contable", "Una oveja es un solo animal: individual. Muchas ovejas juntas forman un rebaño (colectivo)."],
  ["abeja", "comun individual concreto contable"],
  ["isla", "comun individual concreto contable"],
  ["estrella", "comun individual concreto contable"],
  ["soldado", "comun individual concreto contable"],
  ["músico", "comun individual concreto contable"],

  // --- Concretos incontables ---
  ["agua", "comun individual concreto incontable", "«agua» no se cuenta con números (no decimos «tres aguas»): se mide, «tres vasos de agua»."],
  ["arena", "comun individual concreto incontable", "No decimos «dos arenas», sino «un puñado de arena»."],
  ["leche", "comun individual concreto incontable", "No decimos «tres leches», sino «tres litros de leche»."],
  ["arroz", "comun individual concreto incontable", "No decimos «cinco arroces», sino «un plato de arroz»."],
  ["harina", "comun individual concreto incontable"],
  ["aire", "comun individual concreto incontable", "No se ve, pero es materia que podemos notar: es concreto."],
  ["sal", "comun individual concreto incontable"],
  ["oro", "comun individual concreto incontable"],
  ["aceite", "comun individual concreto incontable"],
  ["dinero", "comun individual concreto incontable", "Contamos euros, pero no decimos «tres dineros»: «dinero» es incontable."],

  // --- Colectivos ---
  ["rebaño", "comun colectivo concreto contable", "«rebaño» en singular nombra un conjunto de ovejas: es colectivo. Y se puede contar: un rebaño, dos rebaños."],
  ["enjambre", "comun colectivo concreto contable", "Un enjambre es un conjunto de abejas."],
  ["bosque", "comun colectivo concreto contable", "Un bosque es un conjunto de árboles."],
  ["orquesta", "comun colectivo concreto contable", "Una orquesta es un conjunto de músicos."],
  ["ejército", "comun colectivo concreto contable", "Un ejército es un conjunto de soldados."],
  ["jauría", "comun colectivo concreto contable", "Una jauría es un conjunto de perros."],
  ["flota", "comun colectivo concreto contable", "Una flota es un conjunto de barcos."],
  ["archipiélago", "comun colectivo concreto contable", "Un archipiélago es un conjunto de islas."],
  ["constelación", "comun colectivo concreto contable", "Una constelación es un conjunto de estrellas."],
  ["manada", "comun colectivo concreto contable", "Una manada es un conjunto de animales, como lobos o elefantes."],
  ["bandada", "comun colectivo concreto contable", "Una bandada es un conjunto de pájaros."],
  ["cordillera", "comun colectivo concreto contable", "Una cordillera es un conjunto de montañas."],
  ["equipo", "comun colectivo concreto contable", "Un equipo es un conjunto de jugadores."],
  ["coro", "comun colectivo concreto contable", "Un coro es un conjunto de cantantes."],
  ["ramo", "comun colectivo concreto contable", "Un ramo es un conjunto de flores."],
  ["racimo", "comun colectivo concreto contable", "Un racimo es un conjunto de uvas."],
  ["baraja", "comun colectivo concreto contable", "Una baraja es un conjunto de cartas."],
  ["vajilla", "comun colectivo concreto contable", "Una vajilla es un conjunto de platos, tazas y fuentes."],

  // --- Abstractos contables ---
  ["idea", "comun individual abstracto contable", "Una idea no se puede ver ni tocar (abstracto), pero sí contar: una idea, dos ideas."],
  ["pensamiento", "comun individual abstracto contable", "No se puede tocar (abstracto), pero se puede contar: un pensamiento, muchos pensamientos."],
  ["deseo", "comun individual abstracto contable", "Abstracto, pero contable: pide tres deseos."],
  ["recuerdo", "comun individual abstracto contable", "Abstracto, pero contable: tengo muchos recuerdos."],
  ["opinión", "comun individual abstracto contable", "Abstracto, pero contable: dos opiniones distintas."],

  // --- Abstractos incontables ---
  ["paciencia", "comun individual abstracto incontable", "La paciencia es una cualidad: no se puede ver ni tocar (abstracto) ni contar (incontable)."],
  ["bondad", "comun individual abstracto incontable", "La bondad es una cualidad: abstracto e incontable."],
  ["valentía", "comun individual abstracto incontable"],
  ["tristeza", "comun individual abstracto incontable", "Es un sentimiento: no se puede tocar. Abstracto."],
  ["felicidad", "comun individual abstracto incontable"],
  ["libertad", "comun individual abstracto incontable"],
  ["sabiduría", "comun individual abstracto incontable"],
  ["belleza", "comun individual abstracto incontable"],
  ["honestidad", "comun individual abstracto incontable"],
  ["tranquilidad", "comun individual abstracto incontable"],

  // --- Propios ---
  ["Madrid", "propio individual concreto -", "Nombra una ciudad concreta y se escribe con mayúscula: es propio."],
  ["Lucía", "propio individual concreto -", "Nombra a una persona concreta: nombre propio, con mayúscula."],
  ["España", "propio individual concreto -"],
  ["Ebro", "propio individual concreto -", "Es el nombre de un río concreto: propio."],
  ["Teide", "propio individual concreto -", "Es el nombre de una montaña concreta: propio."],
  ["Atlántico", "propio individual concreto -"],
  ["Toby", "propio individual concreto -", "Los nombres de mascotas también son propios."],
  ["Sevilla", "propio individual concreto -"],
  ["Pablo", "propio individual concreto -"],
  ["Mediterráneo", "propio individual concreto -"],
];

window.SUST_COLECTIVOS = [
  ["un rebaño", "ovejas"],
  ["un enjambre", "abejas"],
  ["una jauría", "perros"],
  ["una manada", "lobos"],
  ["una bandada", "pájaros"],
  ["un banco", "peces", "cardumen"],
  ["una piara", "cerdos"],
  ["una flota", "barcos", "armada"],
  ["un archipiélago", "islas"],
  ["una constelación", "estrellas"],
  ["una cordillera", "montañas", "sierra"],
  ["un bosque", "árboles", "arboleda"],
  ["un pinar", "pinos"],
  ["un olivar", "olivos"],
  ["un viñedo", "vides (cepas de uva)", "viña"],
  ["una alameda", "álamos"],
  ["un robledal", "robles", "robledo"],
  ["un naranjal", "naranjos"],
  ["un ejército", "soldados", "tropa"],
  ["una orquesta", "músicos", "banda"],
  ["un coro", "cantantes"],
  ["una tripulación", "marineros de un barco", "marineria"],
  ["un equipo", "jugadores"],
  ["el alumnado", "alumnos", "clase"],
  ["el profesorado", "profesores", "claustro"],
  ["un vecindario", "vecinos", "vecindad"],
  ["la clientela", "clientes"],
  ["el público", "espectadores", "audiencia"],
  ["una multitud", "muchas personas juntas", "muchedumbre/gente"],
  ["una vajilla", "platos y tazas"],
  ["una cubertería", "cubiertos"],
  ["el mobiliario", "muebles"],
  ["una dentadura", "dientes"],
  ["un abecedario", "letras", "alfabeto"],
  ["un racimo", "uvas"],
  ["un ramo", "flores"],
  ["una baraja", "cartas", "naipes"],
  ["una biblioteca", "libros"],
  ["un vocabulario", "palabras", "lexico"],
  ["un pelotón", "ciclistas en una carrera"],
  ["un cañaveral", "cañas"],
  ["un pedregal", "piedras"],
  ["una hojarasca", "hojas secas caídas"],
  ["una yeguada", "caballos y yeguas", "caballada/manada"],
];
