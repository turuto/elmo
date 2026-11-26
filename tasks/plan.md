# Plan de implementación: selector de asignaturas

## Resumen

Añadir un nivel de selección de asignatura antes del catálogo actual de ejercicios. La portada mostrará seis asignaturas: Lengua estará activa y llevará al catálogo existente; Social, Naturales, Lingua Galega, Inglés y Matemáticas se mostrarán como opciones deshabilitadas. La selección de colores identificará cada asignatura.

## Decisiones de arquitectura

- La raíz (`index.html`) será el selector de asignaturas.
- El catálogo actual de cuatro ejercicios se conservará como la portada de Lengua en `lengua/index.html`; sus datos de progreso y claves de `localStorage` no se modificarán.
- Los ejercicios seguirán en sus directorios actuales. Sus enlaces de regreso apuntarán a la portada de Lengua, no al selector de asignaturas.
- La portada usará los colores indicados: Social rojo, Naturales verde, Lingua Galega morado, Inglés naranja, Matemáticas azul y Lengua amarillo.
- Las cinco asignaturas sin contenido serán controles deshabilitados, no enlaces que aparenten funcionar. Los ejercicios existentes conservarán sus identidades visuales propias.
- El progreso seguirá guardándose únicamente en `localStorage` del navegador; no se añadirán cookies, analítica, cuentas ni transmisión de datos de uso. Se mantendrá la carga actual de fuentes desde Google Fonts.
- Se mantendrán el HTML/CSS/JavaScript nativos, el contenido en español y el diseño adaptable existentes.

## Lista de tareas

### Fase 1: Establecer los dos niveles de navegación

- [x] Tarea 1: Crear el selector de asignaturas en la raíz y trasladar allí el catálogo de Lengua

### Punto de control: navegación principal

- [x] El selector ofrece seis asignaturas y solo Lengua permite continuar.
- [x] Lengua abre el catálogo actual, con los cuatro ejercicios y sus indicadores de progreso intactos.

### Fase 2: Integrar la navegación de los ejercicios

- [x] Tarea 2: Actualizar los enlaces de regreso de los cuatro ejercicios

### Punto de control: flujo completo

- [x] Se puede navegar desde el selector a Lengua, abrir cualquiera de los ejercicios y volver a Lengua.
- [x] Las opciones deshabilitadas no se pueden activar con ratón ni teclado.
- [x] El diseño es legible y usable en escritorio y móvil.

## Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Al trasladar el catálogo cambia la ruta de su página | Alto: los enlaces relativos o el acceso de regreso podrían fallar | Mantener los ejercicios en sus directorios actuales y ajustar explícitamente los enlaces relativos del catálogo y los ejercicios |
| Las opciones deshabilitadas parecen activas o no son accesibles | Medio: confusión y problemas de teclado/tecnologías de asistencia | Usar controles nativos deshabilitados, señal visual y texto de estado claro |
| Se pierde o altera el progreso existente al trasladar la portada | Alto: el usuario podría perder información | Conservar las claves `localStorage` y la lógica actual de resumen sin cambios |
| El uso de color dificulta distinguir asignaturas | Medio: baja legibilidad o barreras de percepción | Combinar el color con nombre, icono y estado textual; comprobar contraste y vista móvil |
| Se confunde el progreso local con seguimiento remoto | Medio: expectativas de privacidad incorrectas | Aclarar que el progreso permanece en el almacenamiento local del navegador y no añadir telemetría |

## Preguntas abiertas

- Enfoque confirmado: mantener Google Fonts y el progreso local; no añadir cookies ni analítica.
- Se asume que el amarillo identifica el nivel de Lengua y que se mantienen los estilos propios de cada ejercicio.
