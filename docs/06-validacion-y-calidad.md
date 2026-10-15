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
