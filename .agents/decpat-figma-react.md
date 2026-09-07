# DecPat Figma React

Esta guia aplica cuando un agente implemente, ajuste o revise interfaz React en DecPat Cloud. Su objetivo es mantener la linea visual del Figma y del Design System GM, sin bloquear el avance cuando todavia falten librerias internas.

## Fuentes visuales

- Flujo DecPat / Mutual en linea:
  https://www.figma.com/design/pVGHV6WqzhsvQZ3goaRYnE/Mutual-en-l%C3%ADnea---Compartido--Copia-?node-id=43121-438
- Design System GM, componentes como botones, inputs y controles:
  https://www.figma.com/design/9kPyFvx98Nm6zcVICW2erz/Design-System-GM--Copia-?node-id=21-30
- Design System GM, documentacion de estilos, colores y fundamentos:
  https://www.figma.com/design/9kPyFvx98Nm6zcVICW2erz/Design-System-GM--Copia-?node-id=0-1

Cuando la tarea sea visual, consulta primero el nodo de Figma relevante y usa el Design System GM para confirmar tokens, variantes, estados y comportamiento esperado.

## Prioridad de implementacion

1. Usa componentes oficiales de `sad-aml-shared` cuando esten disponibles en esta copia local.
2. Si un componente existe en `sad-aml-shared`, no crees una version local duplicada.
3. Si el componente no existe en `sad-aml-shared` pero si aparece en Figma, crea un componente local propio dentro de `src/components`, siguiendo Atomic Design y las convenciones del proyecto.
4. Si `sad-aml-shared` no esta disponible, esta vacio o no expone el componente requerido, crea una alternativa local autosuficiente y dejala estructurada para poder reemplazarla luego por el componente oficial.

De momento se sabe que `sad-aml-shared` incluye botones, pero no se conoce aun el inventario completo de la biblioteca.

## Uso de Figma

- Traduce la intencion visual de Figma a React mantenible; no copies jerarquias de capas, grupos o posiciones absolutas de forma literal.
- Respeta colores, tipografia, spacing, radios, sombras, estados, densidad visual y responsive del Design System GM cuando esten definidos.
- Usa Figma para validar estados esperados: default, hover, focus, disabled, loading, error y success cuando apliquen.
- Si hay conflicto entre el flujo DecPat y el Design System GM, prioriza el Design System GM para componentes base y el flujo DecPat para composicion de pantalla.
- Registra en el cierre de tarea cualquier diferencia conocida contra Figma.

## Componentes locales provisionales

Cuando sea necesario crear un componente local porque no esta en `sad-aml-shared`:

- Ubicalo en `src/components` siguiendo la estructura existente del proyecto.
- Mantiene una API simple y cercana a lo que probablemente exponga el componente oficial.
- Evita acoplarlo a una sola pantalla si el patron se repite en Figma.
- Usa estilos y tokens locales del proyecto antes de introducir valores hardcodeados.
- No importes ni inicialices recursos corporativos que no esten presentes en esta copia local.

## Validacion esperada

Ejecuta validaciones razonables segun el cambio:

- `npm run check-types` para cambios TypeScript.
- `npm run test` para logica o componentes cubiertos por pruebas.
- `npm run build` cuando cambien pantallas, rutas, estilos globales o configuracion Next.js.
- Revision visual contra Figma cuando la tarea sea de interfaz.

Si una validacion no se puede ejecutar, indica el motivo en el cierre de la tarea.

## Cierre de tareas

Al cerrar una implementacion visual, incluye:

- Codigo y nombre de la tarea.
- Que se implemento.
- Archivos modificados o creados.
- Orden recomendado para copiar al repositorio real.
- Validaciones ejecutadas y resultado.
- Riesgos, pendientes o diferencias conocidas contra Figma.
- Mensaje de commit sugerido en espanol con Conventional Commits.
