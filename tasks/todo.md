# Tareas: selector de asignaturas

## Tarea 1: Crear el selector de asignaturas en la raíz y trasladar allí el catálogo de Lengua

**Descripción:** Convertir `index.html` en una portada con las seis asignaturas y conservar el catálogo actual de ejercicios como `lengua/index.html`. Enlazar Lengua al catálogo y mostrar las otras cinco asignaturas como deshabilitadas.

**Criterios de aceptación:**
- [x] La portada muestra Social (rojo), Naturales (verde), Lingua Galega (morado), Inglés (naranja), Matemáticas (azul) y Lengua (amarillo).
- [x] Solo Lengua permite navegar; las otras asignaturas tienen estado deshabilitado comprensible y no son activables con teclado o ratón.
- [x] El catálogo de Lengua conserva sus cuatro ejercicios y el resumen del progreso existente.
- [x] El progreso se conserva solo en `localStorage`; no se añaden cookies, analítica ni transmisión remota de datos de uso.

**Verificación:**
- [x] Revisar el flujo selector → Lengua y confirmar que las cuatro tarjetas de ejercicios y el progreso aparecen.
- [x] Comprobar la navegación y la legibilidad en escritorio y móvil.
- [x] Confirmar que no se han añadido cookies ni solicitudes de analítica; se conserva la carga actual de Google Fonts.

**Dependencias:** Ninguna.

**Archivos probables:** `index.html`, `lengua/index.html`.

**Alcance estimado:** Pequeño.

## Punto de control: navegación principal

- [x] La portada presenta seis asignaturas y solo Lengua está activa.
- [x] El catálogo trasladado conserva los enlaces y los indicadores de progreso.

## Tarea 2: Actualizar los enlaces de regreso de los cuatro ejercicios

**Descripción:** Cambiar los enlaces de navegación de cada ejercicio para que regresen a `lengua/index.html`, preservando el acceso al catálogo de ejercicios en el nuevo nivel intermedio.

**Criterios de aceptación:**
- [x] Adjetivos, Palabras invariables, Sustantivos y Determinantes regresan al catálogo de Lengua.
- [x] Desde el catálogo se puede volver al selector de asignaturas usando la navegación del navegador.

**Verificación:**
- [x] Recorrer selector → Lengua → cada ejercicio → Lengua y confirmar que las rutas cargan correctamente.
- [x] Validar en escritorio y móvil con un servidor HTTP estático local.

**Dependencias:** Tarea 1.

**Archivos probables:** `adjetivos/index.html`, `palabras-invariables/index.html`, `sustantivos/index.html`, `determinantes/index.html`.

**Alcance estimado:** Pequeño.

## Punto de control: flujo completo

- [x] Se completan las rutas de navegación del selector y los cuatro ejercicios.
- [x] Las opciones pendientes siguen deshabilitadas y accesibles.
- [x] No se han cambiado las claves ni los datos persistidos del progreso.
- [x] No se han añadido cookies, analítica ni envío remoto de datos de uso.
