# Entrega

Estado: borrador de la entrega revisable al 6 de noviembre de 2026; la aceptación por el equipo receptor está pendiente. Revisión: 27 de octubre de 2026.
Código: `c789b079859bd590e4180cb0ac3ae08fec58b781`. Seguimiento: DEC-020C; documentación: DOC-021.

## Qué se entrega

El frontend de la declaración patrimonial de Grupo Mutual: acceso, inicio, formulario de doce pasos con sus diálogos y tablas, cuestionario confidencial, juramento y cierre. Está construido con Next.js (App Router), React y TypeScript. **No incluye backend**: todo lo que haría una API está simulado y la integración está preparada, no realizada (ver [integración](09-integracion-con-el-backend.md)). Lo simulado está inventariado en [código de demostración](10-codigo-de-demostracion.md), que debe leerse antes de usar el sistema con información real.

La entrega comprende la carpeta completa del proyecto, incluida `src/sad-aml-shared` (ver más abajo), y la carpeta `tasks` con el historial de implementación y las decisiones.

## Cómo ejecutarlo

```bash
npm install
npm run dev          # http://localhost:3004
npm run test         # pruebas con Jest
npm run check-types  # tipos
npm run lint
npm run build        # compilación de producción
```

Node.js >=18.17.0 y npm >=9.8.0 según el README. Con `NEXT_PUBLIC_API_BASE_URL` vacía (valor por defecto) el sistema usa datos simulados. Para probar el recorrido completo basta cualquier usuario y contraseña no vacíos; los usuarios de prueba de errores están en el [inventario de demostración](10-codigo-de-demostracion.md).

## `sad-aml-shared` es propio de este sistema

La carpeta `src/sad-aml-shared` no se refresca desde el repositorio de Grupo Mutual ni la jalan otros proyectos: forma parte de este sistema y se entrega con él. Por eso sus modificaciones no requieren trasladarse a otro repositorio. Están marcadas con `!Modificado para DecPat` (`grep -rn "Modificado para DecPat" src/sad-aml-shared`), y el `README.md` de la carpeta resume lo que agregó DecPat.

Se mantiene el criterio del estándar de desarrollo: **todo componente genérico, sin lógica de negocio de DecPat, vive en `sad-aml-shared`**, con sus estilos y sus pruebas junto a cada componente (Jest ya no excluye esa carpeta). Quien quiera reutilizar lo construido para DecPat solo necesita copiar esa carpeta. Se agregaron: `Switch`, `CurrencyIcon`, `MoneyInput` (con `utils/helpers/money.ts`), `CurrencySelect`, `RadioGroup`, `FileUpload` (con `types/Attachment.types.ts`), `RetryNotice`, `AppDialog`, `ConfirmDeleteDialog` y `RecordsTable`; se rediseñó la lista del `Dropdown` y se corrigió `BreadCrumbs` para el App Router. Las pantallas importan desde los índices `@/components/Atoms`, `Molecules` y `Organisms`, que reexportan desde shared. Lo específico de DecPat (pantallas, diálogos de cada paso, servicios, `CurrencyTotals`, `DeclarationStepper`, `ConfirmSaveDialog` y los shells) permanece en `src/components`. Ver la [guía de componentes](03-guia-de-componentes.md).

## Verificaciones realizadas

| Verificación | Resultado | Fecha y procedimiento |
| --- | --- | --- |
| Tipos y lint | Sin errores | 27 de octubre de 2026: `npx tsc --noEmit` y `npx eslint src`. |
| Pruebas | 66 suites y 460 pruebas satisfactorias | 27 de octubre de 2026: `npx jest --runInBand`. |
| Compilación de producción | Compila las rutas `/`, `/inicio` y `/mi-declaracion/[paso]` | 27 de octubre de 2026: `next build` sobre una copia del proyecto, para no alterar los servidores de desarrollo. El único aviso proviene de Sass dentro de `sad-aml-shared` (división con `/`). |
| Recorrido en navegador | Acceso, bloqueo del paso 1, avance y salto entre pasos, y en el paso 12 «Terminar», «Guardar», confirmación y aviso final | 27 de octubre de 2026, servidor de desarrollo con el usuario de demostración. |
| Desbordes responsive | Sin desborde de página en los 12 pasos a 1440, 1366 y 768 px | 27 de octubre de 2026, medición con JavaScript en el navegador. Con 768 px los pasos 5, 6, 8 y 9 desplazan dentro de su tabla, por diseño. |

El detalle y las limitaciones están en [validación](06-validacion-y-calidad.md).

## Lo que no se verificó

- Auditoría de accesibilidad completa: lector de pantalla real y contraste de color.
- Comparación pantalla por pantalla, píxel a píxel, contra Figma.
- Recorrido completo del sistema solo con teclado.
- Navegadores distintos del usado para la revisión (por ejemplo Edge y Firefox).
- Teléfonos: fuera del alcance acordado.
- Integración con cualquier servicio institucional: no existe.

Los textos tomados del diseño conservan sus faltas de ortografía (por ejemplo «podran» y «sera» en la confirmación del cierre) hasta que el negocio los confirme.

## Asuntos de negocio abiertos

Ninguno bloquea el uso del sistema simulado, pero deben cerrarse para integrarlo: el rango del año de la tarjeta, la unidad del plazo y el formato de la cédula jurídica, el contenido del detalle judicial y la moneda de la pensión, el catálogo de tipos de sociedad con sus reglas por cargo, los catálogos oficiales, las fórmulas de los totales, y los acuerdos de la [deuda técnica de integración](07-pendientes-y-continuidad.md). Cada uno indica quién tiene la información.

## Documentos de apoyo

[Contexto y alcance](01-alcance-y-contexto.md), [arquitectura](02-arquitectura-y-estructura.md), [guía de componentes](03-guia-de-componentes.md), [flujos](04-flujos-implementados.md), [decisiones](05-decisiones-tecnicas.md), [validación](06-validacion-y-calidad.md), [continuidad](07-pendientes-y-continuidad.md), [contrato de API](08-contrato-api.md), [integración](09-integracion-con-el-backend.md) y [código de demostración](10-codigo-de-demostracion.md). La publicación en Confluence y la aceptación de la entrega requieren su propia confirmación, según las [reglas editoriales](reglas-documentacion.md).
