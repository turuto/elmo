/* =====================================================================
   DATOS PARA PRACTICAR LOS ADJETIVOS
   =====================================================================

   1) FRASES  (window.ADJ_FRASES)
   ---------------------------------------------------------------------
   Formato:  [texto]{CÓDIGO}   o   [texto]{CÓDIGO|nota que se muestra al corregir}

   Códigos de grado:
     P   = positivo                         (alto)
     CS  = comparativo de superioridad      (más alto que)
     CI  = comparativo de inferioridad      (menos alto que)
     CG  = comparativo de igualdad          (tan alto como)
     SA  = superlativo absoluto             (altísimo, muy alto)
     SR  = superlativo relativo             (el más alto de)
   Añade «+» si es una forma irregular:      [mejor que]{CS+}  [pésimo]{SA+}
   X   = trampa: parece adjetivo pero no lo es aquí (lleva siempre nota).

   Reglas:
   - Marca TODOS los adjetivos calificativos de la frase.
   - El grupo completo va junto: [más alto que]{CS}, [la más alta de]{SR}.
   - Los determinantes (el, mi, este, unos...) NO se marcan.

   2) PREGUNTAS DE HUECO / ELECCIÓN  (APÓCOPE, TRANSFORMA, GÉNERO Y NÚMERO)
   ---------------------------------------------------------------------
   { f: "texto con ___ para el hueco (o una pregunta)",
     ops: ["CORRECTA", "incorrecta", ...],   ← la primera SIEMPRE es la correcta
     n: "nota que se muestra al corregir (opcional)",
     k: "clave de estadística (solo en TRANSFORMA)": P, CS, CI, CG, SA, SR, IR }
   ===================================================================== */

window.ADJ_FRASES = [
  `Mi hermano es [más alto que]{CS} yo.`,
  `Este examen ha sido [menos difícil que]{CI} el de ayer.`,
  `Lucía es [tan rápida como]{CG} su prima.`,
  `La película fue [divertidísima]{SA}.`,
  `El guepardo es el animal [más rápido de]{SR} la sabana.`,
  `Hoy hace un día [muy soleado]{SA|«muy» + adjetivo también forma el superlativo absoluto: muy soleado = soleadísimo.}.`,
  `Tengo un perro [pequeño]{P} y [juguetón]{P}.`,
  `Marta es [la más alta de]{SR} la clase.`,
  `Mi abuela hace unas tartas [buenísimas]{SA}.`,
  `Este helado está [mejor que]{CS+|«mejor» es el comparativo irregular de «bueno»: significa «más bueno».} el de ayer.`,
  `Mi bici es [peor que]{CS+|«peor» es el comparativo irregular de «malo»: significa «más malo».} la tuya.`,
  `Este problema es [mayor que]{CS+|«mayor» es el comparativo irregular de «grande»: significa «más grande».} el otro.`,
  `La hormiga es [menor que]{CS+|«menor» es el comparativo irregular de «pequeño». Significa «más pequeño», por eso es de SUPERIORIDAD, no de inferioridad.} la abeja.`,
  `Fue una idea [pésima]{SA+|«pésimo» es el superlativo culto de «malo»: significa «malísimo».}.`,
  `Sacó la nota [máxima]{SA+|«máximo» es el superlativo culto de «grande»: significa «grandísimo».}.`,
  `El hotel era [óptimo]{SA+|«óptimo» es el superlativo culto de «bueno»: significa «buenísimo».} para descansar.`,
  `El ruido de la calle era [mínimo]{SA+|«mínimo» es el superlativo culto de «pequeño»: significa «pequeñísimo».}.`,
  `Ana es [la mejor de]{SR+|«la mejor de» es un superlativo relativo con la forma irregular «mejor».} su equipo.`,
  `Ese chiste es [el peor de]{SR+|«el peor de» es un superlativo relativo con la forma irregular «peor».} todos.`,
  `El agua del río estaba [fría]{P} y [transparente]{P}.`,
  `Pablo es [tan simpático como]{CG} su padre.`,
  `El tren es [menos rápido que]{CI} el avión.`,
  `La jirafa es el animal [más alto del]{SR|«del» = de + el. El superlativo relativo compara con un grupo: el más alto DEL mundo.} mundo.`,
  `Mi gato es [listísimo]{SA}.`,
  `Las montañas estaban [muy nevadas]{SA|«muy» + adjetivo forma el superlativo absoluto.}.`,
  `El chocolate está [tan rico como]{CG} el turrón.`,
  `Este sofá es [menos cómodo que]{CI} la cama.`,
  `Mi mochila es [más pesada que]{CS} la tuya.`,
  `La sopa estaba [calentísima]{SA}.`,
  `Tengo unos zapatos [nuevos]{P} y [cómodos]{P}.`,
  `El examen de Lengua fue [el menos difícil de]{SR|«el menos… de» también es superlativo relativo (de inferioridad).} todos.`,
  `Juan es [menos hablador que]{CI} su hermano.`,
  `Este libro es [interesantísimo]{SA}.`,
  `El cielo está [gris]{P} y el mar está [revuelto]{P}.`,
  `Mi profesora es [amable]{P} y [paciente]{P}.`,
  `Aquel edificio es [altísimo]{SA}.`,
  `El elefante es [más pesado que]{CS} el rinoceronte.`,
  `La clase de hoy ha sido [tan aburrida como]{CG} la de ayer.`,
  `Mi primo es [el más gracioso de]{SR} la familia.`,
  `Esa camiseta [roja]{P} es [preciosa]{P}.`,
  `La tortuga es [muy lenta]{SA|«muy» + adjetivo forma el superlativo absoluto.}.`,
  `El verano es [más caluroso que]{CS} la primavera.`,
  `Este camino es [menos peligroso que]{CI} el otro.`,
  `Tus dibujos son [tan bonitos como]{CG} los de Marta.`,
  `Fue el día [más feliz de]{SR} mi vida.`,
  `La mesa es [grande]{P}, pero la silla es [pequeña]{P}.`,
  `El perro de Luis es [muy obediente]{SA|«muy» + adjetivo forma el superlativo absoluto.}.`,
  `Mi abuelo es [sabio]{P} y [generoso]{P}.`,
  `El parque está [limpísimo]{SA}.`,
  `Nuestro equipo [joven]{P} jugó [mejor]{X|Aquí «mejor» acompaña al verbo «jugó»: es un adverbio, no un adjetivo.} que nunca.`,
  `Necesito [más]{X|Aquí «más» acompaña al sustantivo «agua»: no forma un comparativo de adjetivo.} agua [fresca]{P}.`,
  `El niño [pequeño]{P} corre [muy]{X|Aquí «muy» acompaña al adverbio «deprisa», no a un adjetivo.} deprisa.`,
  `Dejé la caja [bajo]{X|Aquí «bajo» es una preposición (= debajo de), no un adjetivo.} la mesa [blanca]{P}.`,
  `Hoy estoy [cansado]{P} y me encuentro [peor]{X|Aquí «peor» acompaña al verbo «me encuentro»: es un adverbio.} que ayer.`,
  `Este pastel está [riquísimo]{SA}.`,
  `Los leones son [fuertes]{P} y [valientes]{P}.`,
  `El Everest es la montaña [más alta del]{SR} mundo.`,
  `Mi hermano [pequeño]{P} es [menos ordenado que]{CI} yo.`,
  `La sandía es [más grande que]{CS} el melón.`,
  `Esta carretera es [estrechísima]{SA}.`,
  `Hoy estoy [tan contento como]{CG} ayer.`,
  `El mar estaba [tranquilo]{P} y el cielo, [despejado]{P}.`,
];

/* ---------------- APÓCOPE ---------------- */
window.ADJ_APOCOPE = [
  { f: "Es un ___ amigo.", ops: ["buen", "bueno"], n: "Delante de un sustantivo masculino singular, «bueno» pierde la -o: buen amigo." },
  { f: "Mi amigo es muy ___.", ops: ["bueno", "buen"], n: "Aquí el adjetivo no va delante del sustantivo, así que no se acorta." },
  { f: "Hoy hace ___ tiempo.", ops: ["mal", "malo"], n: "Delante de un sustantivo masculino singular, «malo» se acorta: mal tiempo." },
  { f: "Ese chiste es ___.", ops: ["malo", "mal"], n: "No va delante de un sustantivo, así que no hay apócope." },
  { f: "Madrid es una ___ ciudad.", ops: ["gran", "grande"], n: "«grande» se convierte en «gran» delante de cualquier sustantivo singular, ¡también femenino!" },
  { f: "Vivimos en una casa ___.", ops: ["grande", "gran"], n: "Va detrás del sustantivo: no se acorta." },
  { f: "Fue un ___ partido.", ops: ["gran", "grande"], n: "Delante de un sustantivo singular: gran partido." },
  { f: "Mi abuela es una ___ cocinera.", ops: ["buena", "buen"], n: "«bueno» solo se acorta en masculino: buen cocinero, pero buena cocinera." },
  { f: "Llegó en ___ lugar.", ops: ["primer", "primero"], n: "Delante de un sustantivo masculino singular, «primero» se acorta: primer lugar." },
  { f: "Luis llegó el ___ a la meta.", ops: ["primero", "primer"], n: "Aquí no va delante de un sustantivo, por eso no se acorta." },
  { f: "Vivo en el ___ piso.", ops: ["tercer", "tercero"], n: "Delante de un sustantivo masculino singular, «tercero» se acorta: tercer piso." },
  { f: "Mi clase está en la ___ planta.", ops: ["tercera", "tercer"], n: "En femenino no hay apócope: la tercera planta." },
  { f: "El ___ día de clase estaba nervioso.", ops: ["primer", "primero"], n: "Delante de un sustantivo masculino singular: primer día." },
  { f: "La fiesta de ___ Juan es en junio.", ops: ["San", "Santo"], n: "«santo» se acorta en «san» delante del nombre: San Juan, San Pedro." },
  { f: "Mañana es el día de ___ Tomás.", ops: ["Santo", "San"], n: "¡Excepción! Delante de Tomás, Tomé, Domingo y Toribio se dice «Santo»." },
  { f: "Fue un ___ día para todos.", ops: ["mal", "malo"], n: "Delante de un sustantivo masculino singular: mal día." },
  { f: "Tuvimos muy ___ suerte.", ops: ["mala", "mal"], n: "«malo» solo se acorta en masculino: mal día, pero mala suerte." },
  { f: "Tiene un ___ corazón.", ops: ["gran", "grande"], n: "Delante de un sustantivo singular: gran corazón." },
  { f: "Los ___ amigos se ayudan.", ops: ["buenos", "buen"], n: "En plural no hay apócope: buenos amigos." },
  { f: "Es el ___ de la lista.", ops: ["tercero", "tercer"], n: "No va delante de un sustantivo: no se acorta." },
  { f: "Hicimos un ___ trabajo.", ops: ["buen", "bueno"], n: "Delante de un sustantivo masculino singular: buen trabajo." },
  { f: "Este es mi ___ examen del curso.", ops: ["primer", "primero"], n: "Delante de un sustantivo masculino singular: primer examen." },
  { f: "Es un ___ problema.", ops: ["gran", "grande"], n: "Delante de un sustantivo singular: gran problema." },
  { f: "Ese día fue ___ para el equipo.", ops: ["malo", "mal"], n: "No va delante de un sustantivo: no hay apócope." },
  { f: "Las ___ noticias vuelan.", ops: ["malas", "mal"], n: "En plural no hay apócope: malas noticias." },
  { f: "Las ___ ciudades tienen mucho tráfico.", ops: ["grandes", "gran"], n: "En plural no hay apócope: grandes ciudades." },
];

/* ---------------- TRANSFORMA (grados) ---------------- */
window.ADJ_TRANSFORMA = [
  { f: "¿Cuál es el superlativo absoluto de «fácil»?", ops: ["facilísimo", "más fácil", "fácilmente", "el más fácil"], k: "SA" },
  { f: "¿Cuál es el superlativo absoluto de «rápido»?", ops: ["rapidísimo", "más rápido", "rápidamente", "tan rápido"], k: "SA" },
  { f: "¿Cuál es el superlativo absoluto de «limpio»?", ops: ["limpísimo", "limpiísimo", "más limpio", "limpiamente"], k: "SA", n: "Se escribe con una sola i: limpísimo." },
  { f: "¿Cuál es el superlativo absoluto de «feliz»?", ops: ["felicísimo", "felizísimo", "más feliz", "felizmente"], k: "SA", n: "La z cambia a c delante de i: feliz → felicísimo." },
  { f: "¿Qué otra forma significa lo mismo que «muy alto»?", ops: ["altísimo", "más alto", "tan alto", "el más alto"], k: "SA", n: "«muy alto» y «altísimo» son superlativos absolutos." },
  { f: "¿Qué frase tiene un superlativo absoluto?", ops: ["La playa está limpísima.", "La playa está más limpia que ayer.", "La playa está tan limpia como el río.", "La playa es la más limpia de la costa."], k: "SA" },
  { f: "¿Qué frase tiene un superlativo relativo?", ops: ["Es el río más largo de España.", "Es un río larguísimo.", "Es un río muy largo.", "Es más largo que el Ebro."], k: "SR", n: "El superlativo relativo destaca algo dentro de un grupo: el más… de." },
  { f: "Completa con un superlativo relativo: «Pedro es ___ alto ___ la clase».", ops: ["el más … de", "más … que", "tan … como", "muy … de"], k: "SR" },
  { f: "Completa con un comparativo de igualdad: «Ana es ___ alta ___ Eva».", ops: ["tan … como", "más … que", "menos … que", "muy … de"], k: "CG" },
  { f: "¿Qué frase tiene un comparativo de igualdad?", ops: ["Mi gato es tan listo como el tuyo.", "Mi gato es listísimo.", "Mi gato es más listo que el tuyo.", "Mi gato es el más listo de todos."], k: "CG" },
  { f: "Completa con un comparativo de inferioridad: «El tren es ___ rápido ___ el avión».", ops: ["menos … que", "tan … como", "más … que", "el más … de"], k: "CI" },
  { f: "¿Qué frase tiene un comparativo de inferioridad?", ops: ["La silla es menos cómoda que el sofá.", "La silla es tan cómoda como el sofá.", "La silla es comodísima.", "La silla es más cómoda que el sofá."], k: "CI" },
  { f: "Completa con un comparativo de superioridad: «Mi perro es ___ grande ___ el tuyo».", ops: ["más … que", "tan … como", "menos … que", "muy … que"], k: "CS" },
  { f: "¿Qué frase tiene un comparativo de superioridad?", ops: ["Hoy hace más frío que ayer.", "Hoy hace un frío terrible.", "Hoy hace tanto frío como ayer.", "Hoy hace muchísimo frío."], k: "CS" },
  { f: "¿En qué grado está «verde» en «una manzana verde»?", ops: ["positivo", "comparativo", "superlativo absoluto", "superlativo relativo"], k: "P", n: "El grado positivo expresa la cualidad sin comparar ni intensificar." },
  { f: "¿Cuál es el grado positivo de «riquísimo»?", ops: ["rico", "riqueza", "más rico", "muy rico"], k: "P" },
  { f: "Comparativo de superioridad irregular de «bueno»:", ops: ["mejor", "peor", "óptimo", "mayor"], k: "IR" },
  { f: "Comparativo de superioridad irregular de «malo»:", ops: ["peor", "mejor", "pésimo", "menor"], k: "IR" },
  { f: "Comparativo de superioridad irregular de «grande»:", ops: ["mayor", "máximo", "menor", "mejor"], k: "IR" },
  { f: "Comparativo de superioridad irregular de «pequeño»:", ops: ["menor", "mínimo", "mayor", "peor"], k: "IR" },
  { f: "Superlativo culto (irregular) de «bueno»:", ops: ["óptimo", "mejor", "máximo", "pésimo"], k: "IR" },
  { f: "Superlativo culto (irregular) de «malo»:", ops: ["pésimo", "peor", "mínimo", "óptimo"], k: "IR" },
  { f: "Superlativo culto (irregular) de «grande»:", ops: ["máximo", "mayor", "mínimo", "óptimo"], k: "IR" },
  { f: "Superlativo culto (irregular) de «pequeño»:", ops: ["mínimo", "menor", "máximo", "pésimo"], k: "IR" },
  { f: "¿De qué adjetivo viene «mejor»?", ops: ["bueno", "malo", "grande", "pequeño"], k: "IR" },
  { f: "¿De qué adjetivo viene «pésimo»?", ops: ["malo", "bueno", "pequeño", "grande"], k: "IR" },
  { f: "«menor que» es un comparativo de…", ops: ["superioridad", "inferioridad", "igualdad"], k: "IR", n: "«menor» significa «más pequeño»: lleva «más» escondido, así que es de superioridad." },
];

/* ---------------- GÉNERO Y NÚMERO ---------------- */
window.ADJ_GENERO = [
  { f: "Las montañas son muy ___.", ops: ["altas", "altos", "alta", "alto"], n: "El adjetivo concuerda con «montañas»: femenino plural." },
  { f: "Mis zapatos ___ están en el armario.", ops: ["nuevos", "nuevas", "nuevo", "nueva"], n: "Concuerda con «zapatos»: masculino plural." },
  { f: "La niña está muy ___.", ops: ["contenta", "contento", "contentas", "contentos"], n: "Concuerda con «niña»: femenino singular." },
  { f: "Los perros parecen ___.", ops: ["cansados", "cansadas", "cansado", "cansada"], n: "Concuerda con «perros»: masculino plural." },
  { f: "Tengo dos gatas muy ___.", ops: ["cariñosas", "cariñosos", "cariñosa", "cariñoso"], n: "Concuerda con «gatas»: femenino plural." },
  { f: "Las ventanas están ___.", ops: ["abiertas", "abiertos", "abierta", "abierto"] },
  { f: "Los árboles del parque son ___.", ops: ["verdes", "verde"], n: "«verde» es de una terminación, pero sí cambia en plural: verdes." },
  { f: "Los niños están muy ___.", ops: ["felices", "feliz", "felizes"], n: "Plural de «feliz»: la z cambia a c → felices." },
  { f: "El coche y la moto son muy ___.", ops: ["rápidos", "rápidas", "rápido", "rápida"], n: "Si el adjetivo acompaña a un masculino y a un femenino a la vez, va en masculino plural." },
  { f: "La camiseta ___ es mía.", ops: ["roja", "rojo", "rojas", "rojos"] },
  { f: "«feliz» es un adjetivo de…", ops: ["una terminación", "dos terminaciones"], n: "Tiene la misma forma en masculino y femenino: niño feliz, niña feliz." },
  { f: "«alto» es un adjetivo de…", ops: ["dos terminaciones", "una terminación"], n: "Cambia en femenino: alto / alta." },
  { f: "«verde» es un adjetivo de…", ops: ["una terminación", "dos terminaciones"], n: "Coche verde, camisa verde: la misma forma." },
  { f: "«trabajador» es un adjetivo de…", ops: ["dos terminaciones", "una terminación"], n: "Tiene femenino: trabajador / trabajadora." },
  { f: "«amable» es un adjetivo de…", ops: ["una terminación", "dos terminaciones"] },
  { f: "«inteligente» es un adjetivo de…", ops: ["una terminación", "dos terminaciones"] },
  { f: "«español» es un adjetivo de…", ops: ["dos terminaciones", "una terminación"], n: "Tiene femenino: español / española." },
  { f: "«azul» es un adjetivo de…", ops: ["una terminación", "dos terminaciones"] },
  { f: "¿Qué género y número tiene «blancas»?", ops: ["femenino plural", "masculino plural", "femenino singular", "masculino singular"] },
  { f: "¿Qué género y número tiene «simpático»?", ops: ["masculino singular", "femenino singular", "masculino plural", "femenino plural"] },
  { f: "En «Los niños están felices», ¿qué género y número tiene «felices»?", ops: ["masculino plural", "femenino plural", "masculino singular", "femenino singular"], n: "«felices» vale para los dos géneros: aquí es masculino porque acompaña a «niños»." },
  { f: "En «unas casas grandes», ¿qué género y número tiene «grandes»?", ops: ["femenino plural", "masculino plural", "femenino singular", "masculino singular"], n: "«grandes» vale para los dos géneros: aquí es femenino porque acompaña a «casas»." },
  { f: "Mi tía es muy ___.", ops: ["trabajadora", "trabajador", "trabajadoras", "trabajadores"] },
  { f: "Compramos unos pantalones ___.", ops: ["azules", "azul", "azulas", "azulos"], n: "«azul» es de una terminación; en plural añade -es: azules." },
];
