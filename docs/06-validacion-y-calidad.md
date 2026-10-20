# Validación y calidad

Estado: evidencia histórica identificada; revisión documental inicial. Revisión: 14 de octubre de 2026.

El proyecto dispone de pruebas de componentes, servicios y hooks. Las pruebas alojadas bajo `src/sad-aml-shared` están excluidas de Jest según el README; algunos componentes compartidos se prueban desde DecPat. No asumir cobertura completa de la biblioteca.

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

Fecha: 14 de octubre de 2026. Código revisado: `78b3e72e6274248af2648ace1e567a5ceb9b2b4d`, rama `documentacion`. Cambios exclusivamente documentales.

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
