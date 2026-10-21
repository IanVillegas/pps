# DEC-017 Datos judiciales (paso 11)

Implementada y validada el 2026-10-20.

## Implementación

- **Paso** `src/components/Pages/Declaration/JudicialData/JudicialData.tsx` (nodos Figma 43121:1791 y 43121:2088, «Datos judiciales»), registrado como paso 11 en `stepDefinitions.tsx` con `validate: validateJudicialData`.
- **Cuatro preguntas Sí/No** en el orden de Figma, cada una con su interruptor a la derecha y una línea fina entre ellas: «¿Ha estado implicado en juicios por la vía penal?», «…por la vía civil?», «¿Posee usted embargos?» y «¿Paga pensión alimenticia?». Se abre con todas en «No», como lo dibuja Figma, y sin campos.
- **Al responder «Sí»** aparecen sus campos: un campo de texto de 668 px para el detalle de los juicios y de los embargos (sin etiqueta ni asterisco en Figma) y, en la pensión, «¿A quién? *» y «Monto que cancela por mes *» (304 px cada uno, 60 px entre ellos).
- **Interruptor** `src/components/Atoms/Switch` (nodos Figma 43121:1816 y 43121:2128, componente «Switch»), exportado desde `@/components/Atoms`: pista de 41×24 px, gris-200 apagada y verde 2026 (#00998A) encendida, perilla blanca de 18 px, textos «No» y «Sí» en Poppins Medium 12 px a cada lado. Es **provisional**: `sad-aml-shared` no tiene un interruptor; cuando lo exponga se reemplaza sin tocar a quien lo usa (mismo criterio que `RadioGroup`). Usa `<button role="switch" aria-checked>`: se activa con clic, Espacio y Enter, y su nombre accesible es la pregunta (`aria-labelledby`); «No» y «Sí» son solo visuales.
- **Tipos** `src/types/JudicialData.types.ts` (`JudicialValues`) y límite simbólico `FIELD_MAX_LENGTH.judicialDetail = 300` (D-17); «¿A quién?» usa `personName` (120) y el monto `amount` (15 dígitos).

## Reglas de los campos condicionales

- **Obligatoriedad**: las preguntas siempre tienen respuesta («No» por omisión), así que con todo en «No» el paso es válido y se puede continuar. Solo la pensión exige campos, y **únicamente mientras está en «Sí»**: «¿A quién?» (texto, un nombre de solo espacios cuenta como vacío) y el monto (obligatorio, solo dígitos). El detalle de juicios y embargos no lleva asterisco en Figma y es **opcional**.
- **Apagar una pregunta descarta sus campos del borrador** (el detalle, o «¿A quién?» y el monto). Así no queda un dato que contradiga el «No» ni viaja al backend, y desaparecen los errores de campos que ya no se ven: tras un intento fallido de continuar, volver a «No» en la pensión limpia los errores y deja avanzar. Volver a encender la pregunta parte con los campos vacíos. Contrapartida: un clic accidental en «No» pierde lo escrito.
- Cambiar una pregunta no altera las respuestas de las demás.

## Decisiones y dudas abiertas

- **D-23 (abierta)**: Figma no dice **qué debe escribirse en el detalle** de juicios penales, civiles y embargos (¿expediente, juzgado, monto, descripción?), si es obligatorio ni cuánto debe medir; se dejó como texto libre opcional de hasta 300 caracteres. Tampoco dice **en qué moneda** es «Monto que cancela por mes»: se guarda solo como cifra en dígitos, sin moneda. Si el negocio necesita moneda o más estructura (varios juicios, expedientes) hay que ampliar el paso.
- **Etiquetas accesibles de los detalles**: como Figma no dibuja etiqueta, cada campo lleva una etiqueta solo para lectores de pantalla («Detalle de los juicios por la vía penal», «…vía civil», «Detalle de los embargos»), derivada de su pregunta.
- **Sin precargas**: no hay datos de ejemplo.

## Validación

- `check-types`, `lint` y 335 pruebas: OK (17 nuevas: 4 del interruptor, 4 de validación del paso y 9 del paso — cuatro preguntas en «No» y sin campos, detalle opcional de juicios y embargos, campos de la pensión con asterisco, solo dígitos en el monto, el detalle se descarta al volver a «No», parte vacío al reencender, la pensión descarta campos y errores al volver a «No», errores en los campos y se limpian al corregir, otras respuestas se conservan —).
- V3 en navegador (sesión local de prueba), por el DOM porque el panel quedó demasiado pequeño para capturas: con todo en «No» aparecen 4 interruptores y ningún campo; al encender la pensión aparecen sus dos campos; «Continuar» con la pensión vacía **no avanza**, muestra «Revise los campos marcados…» y los dos errores y enfoca «¿A quién?»; al apagar la pensión los errores desaparecen y «Continuar» lleva al paso 12. Medidas y estilos contra Figma: pista 41×24 con #00998A / #CED4DA, perilla de 18 px blanca desplazada 17 px, pregunta Work Sans SemiBold 18 px #343A40, detalle de 668 px y campos de pensión de 304 px, sin desbordamiento horizontal. El único error de consola es un 404 de un archivo de recarga en caliente del servidor de desarrollo, no de la aplicación.

## Diferencias y pendientes contra Figma

- Los campos de texto miden 48 px de alto (los de `InputText` compartido) y Figma los dibuja con 50 px, igual que en el resto de los pasos.
- Figma separa las preguntas con una línea de 861 px que termina antes del borde derecho de la tarjeta; aquí la línea ocupa todo el ancho útil de la tarjeta.
- Figma dibuja dos variantes de la pantalla (nodos 43121:1791 y 43121:2088) con unas pocas diferencias de posición (por ejemplo, los campos de la pensión a 379/743 px en una y a 452/845 px en la otra); se implementó la lógica común, con los campos alineados a la izquierda de la lista.
- No se hizo revisión visual con captura de pantalla ni en tablet.
- El borde rojo exterior que pueda aparecer en las pantallas de Figma es una anotación del usuario (D-15) y no se replica.
