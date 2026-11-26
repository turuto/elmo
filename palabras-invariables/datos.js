/* =====================================================================
   FRASES PARA PRACTICAR LAS PALABRAS INVARIABLES
   ---------------------------------------------------------------------
   Formato:  [palabra]{CÓDIGO}      o   [palabra]{CÓDIGO|nota al corregir}

   Códigos de adverbio:  L = lugar      T = tiempo     M = modo
                         C = cantidad   A = afirmación N = negación
                         D = duda
   Otros códigos:        P = preposición
                         Y = conjunción
                         I = interjección
                         X = "trampa": palabra que parece invariable pero
                             NO lo es en esta frase (lleva siempre nota).

   Reglas importantes al añadir frases:
   1. Marca TODAS las palabras invariables de la frase; si se te olvida
      una, el juego la contará como error cuando el niño la marque.
   2. Las locuciones (varias palabras que funcionan como una) van juntas:
      [de repente]{M}
   3. «al» y «del» se marcan como preposición (contienen a / de).
   4. Evita palabras dudosas (que, como, cuando, donde, nunca, mientras...).
   ===================================================================== */

const N_AL  = "«al» = a + el: contiene la preposición «a».";
const N_DEL = "«del» = de + el: contiene la preposición «de».";
const N_E   = "Usamos «e» en lugar de «y» porque la palabra siguiente empieza por el sonido «i».";
const N_U   = "Usamos «u» en lugar de «o» porque la palabra siguiente empieza por el sonido «o».";
const N_SI  = "«si» sin tilde es una conjunción (indica condición). «sí» con tilde es un adverbio de afirmación.";
const N_SI2 = "«sí» con tilde es un adverbio de afirmación. «si» sin tilde es una conjunción.";

window.FRASES_RAW = [
  // ---------- Mezcla general ----------
  `¡[Ay]{I}! [Mañana]{T} iremos [al]{P|${N_AL}} parque [con]{P} mis primos.`,
  `Mi gato duerme [siempre]{T} [debajo]{L} [de]{P} la cama.`,
  `Laura canta [muy]{C} [bien]{M} [y]{Y} baila [estupendamente]{M}.`,
  `[Ayer]{T} llovió [mucho]{C} [en]{P} Sevilla, [pero]{Y} [hoy]{T} hace sol.`,
  `Los niños corrían [deprisa]{M} [hacia]{P} la puerta.`,
  `[Aunque]{Y} estaba cansado, Pablo terminó los deberes [antes]{T} [de]{P} cenar.`,
  `¿Quieres té [o]{Y} café?`,
  `Compré siete [u]{Y|${N_U}} ocho manzanas [en]{P} el mercado.`,
  `Ana [e]{Y|${N_E}} Isabel viven [cerca]{L} [del]{P|${N_DEL}} colegio.`,
  `Mi hermana [no]{N} come carne [ni]{Y} pescado.`,
  `¡[Bravo]{I}! Has resuelto el problema [muy]{C} [rápidamente]{M}.`,
  `[Si]{Y|${N_SI}} estudias [bien]{M}, aprobarás el examen [sin]{P} problemas.`,
  `[Sí]{A|${N_SI2}}, mi abuela vendrá [a]{P} la fiesta [del]{P|${N_DEL}} sábado.`,
  `Quería ir [al]{P|${N_AL}} parque, [pero]{Y} empezó [a]{P} llover.`,
  `El perro se escondió [detrás]{L} [del]{P|${N_DEL}} sofá [porque]{Y} tenía miedo.`,
  `¡[Oh]{I}! [Allí]{L} hay una estrella fugaz.`,
  `Caminamos [despacio]{M} [por]{P} la orilla [del]{P|${N_DEL}} río.`,
  `El libro está [encima]{L} [de]{P} la mesa [y]{Y} el lápiz está [dentro]{L} [de]{P} la mochila.`,
  `[Durante]{P} el verano viajamos [a]{P} la playa [con]{P} mis abuelos.`,
  `[Quizás]{D} llueva [mañana]{T} [por]{P} la [tarde]{X|Aquí «tarde» es un sustantivo (la tarde): lleva artículo delante. No es adverbio.}.`,
  `Llegaste [demasiado]{C} [tarde]{T} [al]{P|${N_AL}} entrenamiento.`,
  `¡[Vaya]{I}! Se me ha olvidado el abrigo [en]{P} el autobús.`,
  `El gato saltó [sobre]{P} la valla [y]{Y} desapareció [entre]{P} los arbustos.`,
  `Mi hermano es [bastante]{C} alto, [pero]{Y} yo soy [más]{C} rápido.`,
  `[Según]{P} el profesor, el examen será [pronto]{T}.`,
  `Los alumnos esperaban [fuera]{L} [bajo]{P} la lluvia.`,
  `Un chico [bajo]{X|Aquí «bajo» es un adjetivo: describe cómo es el chico. Como preposición sería «bajo la mesa».} se sentó [delante]{L} [de]{P} mí.`,
  `El tren llegó [tarde]{T} [porque]{Y} había nieve [en]{P} las vías.`,
  `¡[Puaj]{I}! Esta sopa está [demasiado]{C} salada.`,
  `[Ahora]{T} [no]{N} puedo jugar; [luego]{T} te llamo.`,
  `Marta [también]{A} quiere venir [al]{P|${N_AL}} cine.`,
  `[A]{P} mí [tampoco]{N} me gusta el brócoli.`,
  `La biblioteca está [lejos]{L}, [pero]{Y} iremos andando.`,
  `Mi abuelo lee el periódico [tranquilamente]{M} [en]{P} el jardín.`,
  `[Desde]{P} mi ventana veo el mar [y]{Y} las montañas.`,
  `¡[Ojalá]{I} ganemos el partido [del]{P|${N_DEL}} domingo!`,
  `[No]{N} corras [tan]{C} [deprisa]{M} [por]{P} el pasillo.`,
  `El paquete llegará [entre]{P} el lunes [y]{Y} el martes.`,
  `Escribe [con]{P} bolígrafo azul, [no]{N} [con]{P} lápiz.`,
  `¡[Ah]{I}, [ya]{T} lo entiendo!`,
  `[Aquí]{L} [no]{N} se puede jugar [a]{P} la pelota.`,
  `El examen fue [muy]{C} fácil [y]{Y} lo terminé [pronto]{T}.`,
  `Iremos [a]{P} la piscina [si]{Y|${N_SI}} [no]{N} llueve.`,
  `[Probablemente]{D} lleguemos [tarde]{T} [a]{P} la cena.`,
  `La pelota rodó [hasta]{P} la portería [y]{Y} entró [suavemente]{M}.`,
  `¡[Eh]{I}! [No]{N} tires papeles [al]{P|${N_AL}} suelo.`,
  `Mi prima vive [allí]{L}, [enfrente]{L} [del]{P|${N_DEL}} museo.`,
  `El niño comió [poco]{C} [porque]{Y} [no]{N} tenía hambre.`,
  `[Tras]{P} la tormenta salió el arcoíris.`,
  `Luchamos [contra]{P} el equipo rival [y]{Y} jugamos [mal]{M}.`,
  `Se lo dije [claramente]{M}, [pero]{Y} [no]{N} me escuchó.`,
  `¡[Hala]{I}! ¡[Qué]{X|Aquí «qué» es un determinante exclamativo: acompaña al sustantivo «castillo».} castillo [tan]{C} grande!`,
  `Pon las botas [abajo]{L} [y]{Y} los abrigos [arriba]{L}.`,
  `[Ante]{P} el peligro, el capitán actuó [valientemente]{M}.`,
  `[Aunque]{Y} hacía frío, salimos [a]{P} pasear [temprano]{T}.`,
  `¿Has leído [ya]{T} el libro [de]{P} aventuras?`,
  `Estoy [casi]{C} listo; espérame [ahí]{L}.`,
  `¿Viene Juan [u]{Y|${N_U}} Óscar [a]{P} la excursión?`,
  `[Ni]{Y} Pedro [ni]{Y} Lucía han traído el balón.`,
  `Abrimos la puerta [mediante]{P} un código secreto.`,
  `El abuelo camina [lentamente]{M}, [pero]{Y} [sin]{P} parar.`,
  `¡[Ups]{I}! Se me ha caído el vaso [al]{P|${N_AL}} suelo.`,
  `[Anoche]{T} vimos una película [muy]{C} divertida [en]{P} casa.`,
  `Los peces nadan [alrededor]{L} [de]{P} la roca.`,
  `Habla [despacio]{M}, [porque]{Y} [no]{N} te entiendo [bien]{M}.`,
  `Me gusta [mucho]{C} leer cómics [antes]{T} [de]{P} dormir.`,
  `¡[Olé]{I}! Has bailado [estupendamente]{M}.`,
  `El ratón salió [de]{P} su agujero [y]{Y} corrió [hacia]{P} la cocina.`,
  `[Hoy]{T} [no]{N} hay clase [porque]{Y} es fiesta.`,
  `¡[Caramba]{I}! Has llegado [muy]{C} [pronto]{T}.`,
  `[Por]{P} la [mañana]{X|Aquí «mañana» es un sustantivo (la mañana): lleva artículo delante. No es adverbio.} desayuno [tranquilamente]{M} [en]{P} la cocina.`,
  `Llegaremos [hacia]{P} las cinco [o]{Y} las seis.`,
  `Vimos un barco [allá]{L} [a lo lejos]{L|«a lo lejos» es una locución adverbial: varias palabras que juntas funcionan como un adverbio de lugar.}.`,
  `[De repente]{M|«de repente» es una locución adverbial de modo: dos palabras que funcionan como un solo adverbio.}, se apagaron las luces [del]{P|${N_DEL}} teatro.`,
  `Vamos [al]{P|${N_AL}} cine [a menudo]{T|«a menudo» es una locución adverbial de tiempo: indica con qué frecuencia.}.`,

  // ---------- Frases con muchos adverbios (para clasificar) ----------
  `[Ayer]{T} jugamos [fuera]{L} [y]{Y} nos divertimos [muchísimo]{C}.`,
  `[Mañana]{T} saldremos [temprano]{T} [y]{Y} caminaremos [despacio]{M}.`,
  `El abuelo vive [cerca]{L} [y]{Y} nos visita [a menudo]{T|«a menudo» es una locución adverbial de tiempo: indica con qué frecuencia.}.`,
  `[Aquí]{L} se come [muy]{C} [bien]{M}.`,
  `[Ahora]{T} escribe [más]{C} [despacio]{M} [y]{Y} [mejor]{M}.`,
  `El gato está [arriba]{L} [y]{Y} el perro, [abajo]{L}; los dos duermen [tranquilamente]{M}.`,
  `Mi hermana estudia [poco]{C}, [pero]{Y} aprueba [siempre]{T}.`,
  `[Luego]{T} iremos [allí]{L} [en]{P} bicicleta.`,
  `El tren pasó [rápidamente]{M} [cerca]{L} [de]{P} nuestra casa.`,
  `[Pronto]{T} llegará el invierno [y]{Y} los días serán [más]{C} cortos.`,

  // ---------- Más preposiciones, conjunciones e interjecciones ----------
  `Caminé [desde]{P} la estación [hasta]{P} el hotel [sin]{P} descansar.`,
  `Mi casa está [entre]{P} la farmacia [y]{Y} la panadería.`,
  `Este regalo es [para]{P} mi madre.`,
  `Hablamos [sobre]{P} los dinosaurios [durante]{P} la clase [de]{P} Ciencias.`,
  `¡[Hola]{I}, Lucía! Te esperaba [aquí]{L}.`,
  `¡[Socorro]{I}! El gato se ha subido [al]{P|${N_AL}} tejado.`,
  `¡[Bah]{I}! [No]{N} me importa.`,
  `Iré [a]{P} la fiesta, [aunque]{Y} llegaré [tarde]{T}.`,
  `[Si]{Y|${N_SI}} terminas [pronto]{T}, jugaremos [al]{P|${N_AL}} fútbol.`,
  `Pedro [e]{Y|${N_E}} Inés juegan [al]{P|${N_AL}} ajedrez [con]{P} su tío.`,
  `[No]{N} salgas [sin]{P} abrigo [porque]{Y} hace frío.`,
  `¿Prefieres ir [en]{P} tren [o]{Y} [en]{P} autobús?`,
];
