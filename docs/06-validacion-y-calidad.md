# Validación y calidad

Estado: evidencia histórica identificada y ejecución actual sobre la rama documentacion. Revisión: 27 de octubre de 2026.

El proyecto dispone de pruebas de componentes, servicios y hooks. Desde el 27 de octubre de 2026 Jest ya no excluye `src/sad-aml-shared`: los componentes genéricos agregados por DecPat se prueban junto a su código y corren con el resto. Los componentes heredados de la biblioteca no tienen, en general, pruebas propias; no asumir cobertura completa.

| Evidencia | Origen y alcance |
| --- | --- |
| Tipos, lint y 282 pruebas satisfactorias | Reportado en `tasks/DEC-014-creditos.md`, 13 de octubre de 2026. Resultado histórico, no reejecutado para esta documentación. |
| Revisión de pantalla y modal de créditos en navegador | Reportada en el mismo registro, con alta de crédito, notificación y totales por moneda. |
| Aviso del selector compartido en pruebas | El registro de créditos menciona transición de no controlado a controlado; requiere revisión antes del cierre. |

Para futuros registros, indicar fecha, versión revisada, comando o escenario, resultado y limitaciones. Verificar tipos y pruebas según el cambio; compilar cuando afecte rutas, pantallas o estilos globales. La revisión visual debe cubrir escritorio y tablet, navegación por teclado, errores y estados vacíos o de carga.

Antes de la entrega, ejecutar las validaciones sobre la versión consolidada y conservar el resultado real. Confirmar que el comando de lint configurado es compatible con el entorno; no declarar éxito por la sola existencia del script.

La elaboración de estas páginas no valida nuevamente el funcionamiento, la accesibilidad completa ni la seguridad del sistema. La evidencia final debe corresponder al contenido efectivamente entregado.

## Revisión de acceso y navegación — DOC-002

Fecha: 14 de octubre de 2026. Código revisado: `9384bcd911d610c821da7c9c3c03e5a469984672`, rama `documentacion`. En esta tarea se modificó únicamente documentación.

Se ejecutaron las pruebas existentes de autenticación simulada, formulario de acceso, retroalimentación de acceso, contenedor interno, inicio y contactos:

```text
npm.cmd run test -- --runInBand --runTestsByPath src/services/AuthService.test.ts src/components/Pages/Login/Login.test.tsx src/components/Pages/Login/LoginFeedback.test.tsx src/components/Templates/AppShell/AppShell.test.tsx src/components/Pages/Home/Home.test.tsx src/components/Organisms/HelpDialog/HelpDialog.test.tsx
```

Resultado: seis suites y 27 pruebas satisfactorias. Incluyen validaciones del formulario, recuerdo de usuario, respuestas simuladas, bloqueo local, envíos concurrentes, menú compacto, salida, ayuda y error recuperable. Este resultado corresponde a una ejecución actual, independiente de la evidencia histórica de créditos.

No se ejecutó una compilación ni una revisión nueva en navegador o Figma por tratarse de un cambio documental. Tampoco se añadió cobertura para `AuthenticatedShell`: su comportamiento se describió mediante lectura del código. Las pruebas seleccionadas no acreditan integración institucional ni accesibilidad completa.

## Declaración y borrador — DOC-003

Fecha: 14 de octubre de 2026. Código revisado: `875867890e6e48ce97668b7a0019cc8255a8f3a6`, rama `documentacion`. Cambios exclusivamente documentales.

```text
npm.cmd run test -- --runInBand --runTestsByPath src/components/Pages/Declaration/DeclarationWizard/DeclarationWizard.test.tsx src/services/DeclarationService.test.ts src/components/Molecules/DeclarationStepper/DeclarationStepper.test.tsx src/components/Organisms/DeclarationIntroDialog/DeclarationIntroDialog.test.tsx
```

Resultado actual: cuatro suites y 24 pruebas satisfactorias. Cubren navegación libre, validación y foco del contenedor, conservación y limpieza del borrador, suscripciones, teclado del indicador e introducción. Las pruebas del contenedor incluyen definiciones de prueba; no acreditan todas las reglas de las secciones de captura.

No se ejecutó build, revisión en navegador ni comparación nueva con Figma. La redirección de rutas inválidas se describió por lectura de la página; no se ejercitó mediante estas suites. No se modificaron componentes ni comentarios de código.

## Datos generales y núcleo familiar — DOC-004

Fecha: 14 de octubre de 2026. Código revisado: `bda881c3316f635e2c0579c040b2dca1395d7f7a`, rama `documentacion`. Cambios exclusivamente documentales.

```text
npm.cmd run test -- --runInBand --runTestsByPath src/components/Pages/Declaration/PersonalData/PersonalData.test.tsx src/components/Pages/Declaration/Family/Family.test.tsx src/components/Organisms/FamilyDialog/FamilyDialog.test.tsx
```

Resultado actual: tres suites y 26 pruebas satisfactorias. Cubren campos obligatorios, límites de entrada, tipos de controles, conservación de campos al cambiar, errores accesibles, tabla vacía, edición, cancelación, retiro y validación de familiares, incluyendo duplicados y ausencia de comparación edad-fecha.

No se ejecutó build ni nueva revisión en navegador o Figma. Las pruebas seleccionadas no acreditan reglas institucionales, persistencia a servidor ni cobertura integral del selector de fecha. Los campos, catálogos y supuestos se documentaron mediante lectura del código vigente.

## Ingresos, egresos y adjuntos — DOC-005

Fecha: 14 de octubre de 2026. Código revisado: `78b3e72e6274248af2648ace1e567a5ceb9b2b4d`, rama `documentacion`. Cambios exclusivamente documentales. Es evidencia histórica: las rutas de prueba son las de esa fecha y varios componentes (por ejemplo `FileUpload` y `RecordsTable`) se movieron después a `src/sad-aml-shared`.

```text
npm.cmd run test -- --runInBand --runTestsByPath src/components/Pages/Declaration/IncomeExpenses/IncomeExpenses.test.tsx src/components/Organisms/IncomeDialog/IncomeDialog.test.tsx src/components/Organisms/ExpenseDialog/ExpenseDialog.test.tsx src/components/Molecules/FileUpload/FileUpload.test.tsx src/utils/hooks/useAttachments.test.ts src/utils/hooks/useFinancialSummary.test.ts src/services/FinancialSummaryService.test.ts
```

Resultado actual: siete suites y 59 pruebas satisfactorias. Incluyen operaciones de registros, campos obligatorios, preguntas del paso, carga y error de planilla, actualización de resumen, fórmulas simuladas, selección de archivos, límites, estados, retiro y reintento.

Durante las pruebas de la pantalla apareció el aviso de Radix «Select is changing from uncontrolled to controlled», ya identificado en evidencia histórica. No impidió el éxito de las pruebas y queda pendiente de revisión del selector compartido.

No se ejecutó build ni nueva revisión de navegador o Figma. Las pruebas del hook de adjuntos sustituyen la generación de miniaturas; no acreditan renderizado real de PDF ni carga o almacenamiento en servidor. No se modificó código de aplicación.

## Pasos 4 a 8 — DOC-006 a DOC-010

Fecha: 14 de octubre de 2026. Código revisado: `343c313c503bd25c652236b319c6e3874efeb8d4`, rama `documentacion`. Cambios exclusivamente documentales.

Se ejecutó `npm.cmd run test -- --runInBand --runTestsByPath` con los siguientes archivos:

| Bloque | Archivos de prueba |
| --- | --- |
| DOC-006 Inmuebles | `src/components/Pages/Declaration/RealEstate/RealEstate.test.tsx`, `src/components/Organisms/RealEstateDialog/RealEstateDialog.test.tsx`. |
| DOC-007 Muebles | `src/components/Pages/Declaration/MovableAssets/MovableAssets.test.tsx`, `src/components/Organisms/MovableAssetDialog/MovableAssetDialog.test.tsx`. |
| DOC-008 Ahorro | `src/components/Pages/Declaration/Savings/Savings.test.tsx`, `src/components/Organisms/SavingsDialog/SavingsDialog.test.tsx`, `src/services/SavingsTotalsService.test.ts`, `src/utils/hooks/useSavingsTotals.test.ts`. |
| DOC-009 Corrientes | `src/components/Pages/Declaration/CurrentAccounts/CurrentAccounts.test.tsx`, `src/components/Organisms/CurrentAccountDialog/CurrentAccountDialog.test.tsx`, `src/services/CurrentAccountsService.test.ts`, `src/utils/hooks/useCurrentAccounts.test.ts`. |
| DOC-010 Créditos | `src/components/Pages/Declaration/Credits/Credits.test.tsx`, `src/components/Organisms/CreditDialog/CreditDialog.test.tsx`, `src/services/CreditsTotalsService.test.ts`, `src/utils/hooks/useCreditsTotals.test.ts`. |

Resultado conjunto actual: 16 suites y 95 pruebas satisfactorias. Cubren tablas, diálogos, operaciones, validaciones y servicios y hooks de totales. Apareció el aviso conocido de Radix sobre transición del selector de no controlado a controlado; no impidió el éxito de las pruebas.

No se ejecutó build ni nueva revisión en navegador o Figma. Los resultados no acreditan API institucional, reglas de negocio aprobadas ni revisión integral de accesibilidad. Se comprobaron los enlaces relativos de la documentación y `git diff --check`.

## Tarjetas de crédito — DOC-011

Fecha: 20 de octubre de 2026. Código revisado: `779fd7ad2b39796d3d2466f0ddb9ac44298f9193`, rama `main`. Cambios documentales en la rama `documentacion`; esa rama no contiene todavía el código del paso 9, por lo que su contenido se verificó leyendo los archivos de `main`.

La evidencia corresponde a las validaciones ejecutadas sobre `main` al cerrar el paso 9, con el mismo contenido de código del commit de referencia. No se reejecutaron desde la rama `documentacion`.

```text
npx eslint src
npx tsc --noEmit
npx jest --runInBand
```

Resultado: sin errores de lint ni de tipos; 49 suites y 306 pruebas satisfactorias, de las cuales 24 son nuevas: validación del diálogo de tarjetas, servicio simulado de totales, hook de totales, componente `CurrencyTotals` y pantalla del paso. La pantalla se prueba con tabla vacía, listado con catálogos y fechas legibles, totales por moneda, guion y aviso cuando falla el servicio, campos y errores del diálogo, restricción a dígitos y máximo de cuatro en el número de operación, alta, edición, cancelación y retiro. Las pruebas del paso 8 siguen satisfactorias tras reemplazar su sección de totales por `CurrencyTotals`.

Revisión en navegador (servidor local, sesión de demostración): la pantalla y el diálogo se compararon con el diseño; se agregó una tarjeta en colones con límite 2,000,000, saldo 350,000, cuota 25,000, saldo y cuota en dólares 100 y 10, vencimiento 20/05/2028 y operación 1234. Se mostró la notificación de guardado y los totales pasaron de ₡ 0.00 y $ 0.00 a ₡ 350,000.00 y ₡ 25,000.00 en colones, y $ 100.00 y $ 10.00 en dólares. La consola no registró errores.

Persiste el aviso de Radix «Select is changing from uncontrolled to controlled» en las pruebas con listas desplegables; no impide su éxito. No se ejecutó build ni revisión en tablet, no se repitió la comparación con Figma después de la verificación inicial y las pruebas no acreditan reglas institucionales, integración con servicios reales ni accesibilidad completa.

## Pasos 10 a 12, ajustes de octubre y contrato — DOC-012 a DOC-017

Fecha: 21 de octubre de 2026. Código revisado: `17a0ad9f2cdc42bc8c44265dbb4be85bbbc5ada2` (rama `main`), incorporado a la rama `documentacion` mediante un merge. Cambios exclusivamente documentales en esta rama.

Se ejecutó sobre la rama `documentacion` ya con `main` incorporado:

```text
npx tsc --noEmit
npx eslint src
npx jest --runInBand
```

Resultado actual: sin errores de tipos ni de lint; **59 suites y 409 pruebas satisfactorias**. Incluyen las pruebas de los pasos 9 a 12 y de los ajustes: personerías, datos judiciales y el interruptor; el cuestionario confidencial (respuestas fuera del borrador, payload sin datos patrimoniales, borrado al cerrar sesión); el estado y el guardado del juramento (éxito solo tras la respuesta, envío repetido, error con reintento); el modal de confirmación al eliminar en las diez tablas; `MoneyInput`, `CurrencySelect` y las utilidades de monto; y el orden y el campo condicional de «Otros detalles».

Evidencia de revisión en navegador, registrada en los documentos de seguimiento al cerrar cada tarea (resultados históricos, no reejecutados): personerías (pantalla, modal, alta con envío por Enter); datos judiciales (comprobación por el DOM, estilos y bloqueo del avance); cuestionario confidencial y juramento (capturas del 21 de octubre en una ventana reducida); modal de eliminar y modal de ahorro con montos formateados (capturas). «Otros detalles» se comprobó por el DOM, sin captura.

Limitaciones: no se ejecutó compilación de producción ni revisión en tablet; varias revisiones visuales se hicieron en una ventana reducida y no contra el diseño píxel a píxel; las pruebas muestran todavía el aviso del selector compartido (transición de no controlado a controlado). Los resultados no acreditan integración con servicios institucionales ni accesibilidad completa. No se modificó código de aplicación en esta tarea.

## Sociedades, integración, recuperación, revisión visual y entrega — DOC-018 a DOC-021

Fecha: 27 de octubre de 2026. Código revisado: `c789b079859bd590e4180cb0ac3ae08fec58b781` (rama `main`), incorporado a la rama `documentacion` mediante un merge. En esta rama solo cambia la documentación.

Se ejecutó sobre la rama `documentacion`, con `main` incorporado:

```text
npx tsc --noEmit
npx eslint src
npx jest --runInBand
```

Resultado actual: sin errores de tipos ni de lint; **66 suites y 460 pruebas satisfactorias**. Respecto de la ejecución anterior (59 suites y 409 pruebas) se agregaron, entre otras: la validación del diálogo de sociedades y la pantalla del paso 10 con sus dos tablas; el modal de confirmación del guardado final; el cliente HTTP (éxito, errores con el cuerpo común, `401`, red caída); los catálogos simulados y reales (carga en paralelo, error conservando lo que llegó, reintento y descarte de respuestas viejas); el bloqueo del paso 1 (desde el indicador y por dirección), el aviso al salir con datos y el paso 3 con el detalle solo con «Sí»; el reintento de cifras en el hook y en la pantalla de ahorro; el aviso `RetryNotice`; la guardia de ruta con sesión vencida (`401`); y las migas de pan de `AppShell`. Además corren dentro de `sad-aml-shared` diez archivos de prueba: ocho de los componentes y utilidades movidos y dos heredados (`Spinner` y `LoadingSpinner`).

Otras verificaciones del 27 de octubre de 2026:

| Verificación | Procedimiento y resultado |
| --- | --- |
| Compilación de producción | `next build` sobre una copia del proyecto, para no alterar los servidores de desarrollo. Compiló las rutas `/`, `/inicio` y `/mi-declaracion/[paso]` sin errores; el único aviso proviene de Sass dentro de `sad-aml-shared` (división con `/`). |
| Recorrido en navegador | Servidor de desarrollo y usuario de demostración: acceso; con el paso 1 vacío, «Paso 5» en el indicador no navega y muestra los 11 errores; con el paso 1 completo, «Continuar» llega al paso 2 y el indicador salta libremente hasta el 12; paso 3 con «No» por defecto y el detalle visible solo con «Sí»; en el paso 12, «Terminar», «Guardar», confirmación, indicador de carga, «Guardado satisfactoriamente» y botón «Guardado» deshabilitado, sin cambiar de ruta. |
| Desbordes responsive | Medición con JavaScript, recorriendo los doce pasos con el indicador. A 1440 y 1366 px no hubo desborde de página ni de tablas. A 768 px no hubo desborde de página; después de reducir el ancho mínimo de las tablas a 480 px desplazan dentro de su región los pasos 5, 6, 8 y 9. El diálogo de sociedades mide 720 px a 768 px y no corta ningún campo. A 1024 px la tabla de sociedades cabe completa con la variante compacta, con el menú abierto o cerrado. |
| Lista del `Dropdown` y migas de pan | Revisión visual en navegador a 1366 px: lista con panel, marca en la opción elegida y resaltado, también dentro de un diálogo (selector de moneda con íconos); migas «Regresar» e «Inicio / Mi declaración» en el encabezado de la declaración. |

Cambios del 29 de octubre de 2026 (código `b4e1cdf61fc6209baf9cffb0e28829c44ec2d8b6`): el botón «Agregar nuevo» con el diseño distintivo y la corrección del mensaje de tabla vacía en la tabla compacta. Revisión en navegador a 1366 px, en el paso 10: los estilos calculados coinciden con el diseño (contorno amarillo de 1 px, radio de 10 px, ícono de 20 px a 6 px del texto, texto de 18 px) y las dos filas vacías miden lo mismo (letra de 14 px y 53 px de alto). Pasan las pruebas de `RecordsTable` y de las pantallas de la declaración (15 suites y 193 pruebas); las pruebas no evalúan estilos.

Limitaciones: no hubo comparación píxel a píxel con Figma; la lista abierta del `Dropdown` no existe en el diseño; no se auditó la accesibilidad con un lector de pantalla ni se midió el contraste; no se recorrió el sistema completo solo con teclado; no se probó en navegadores distintos del usado en la revisión; los teléfonos están fuera del alcance. Persiste el aviso de Radix «Select is changing from uncontrolled to controlled» en las pruebas con listas desplegables; no impide su éxito. Los resultados no acreditan integración con servicios institucionales: ninguno existe.
