---
name: decpat-figma-react
description: Implementa o revisa UI React de DecPat Cloud siguiendo Figma, el Design System GM y la prioridad de componentes de sad-aml-shared.
---

# DecPat Figma React

Usa esta skill cuando la tarea implique crear, modificar o revisar pantallas, componentes, estilos o comportamiento visual en React para DecPat Cloud.

Antes de actuar, lee la guia compartida del repositorio:

`../../../.agents/decpat-figma-react.md`

Puntos esenciales:

- El flujo DecPat en Figma define la composicion de pantallas.
- El Design System GM define componentes base, colores, estilos, variantes y estados.
- `sad-aml-shared` tiene prioridad sobre componentes locales cuando el componente exista y sea accesible.
- Si el componente no existe en `sad-aml-shared`, pero si existe en Figma, crea un componente local mantenible en `src/components`.
- Si `sad-aml-shared` aun no esta disponible o no se conoce su inventario completo, implementa alternativas locales provisionales y faciles de reemplazar.
- No inicialices ni dependas de recursos corporativos que no esten presentes en esta copia local.

En el cierre de cada tarea visual, reporta validaciones, diferencias conocidas contra Figma y el orden recomendado para copiar los cambios al repositorio real.
