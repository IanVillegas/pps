# DEC-009A Planilla y cálculos (paso 3)

Implementada y validada el 2026-10-12.

## Decisión de partida: D-10, los cálculos los hace el backend

El 2026-10-12 el usuario confirmó que **el frontend no calcula**: salario, totales, saldo mensual y razones los entrega el backend, y la pantalla solo los muestra. Eso cambia lo que decía `todo.md` (fórmulas, redondeo y denominadores cero «documentados y probados» en `src/utils/financialCalculations.ts`) y lo que se había hablado el 2026-09-28 (total local mientras se escribe en el modal): ninguno de los dos modales de Figma muestra un total mientras se escribe, así que no hace falta un cálculo local y **no existe `financialCalculations.ts`**. D-10 deja de bloquear DEC-009A/C/D; lo que sigue pendiente es el contrato real del backend (D-08/D-09).

## Implementación

- **Paso** `src/components/Pages/Declaration/IncomeExpenses/IncomeExpenses.tsx` (nodo Figma 43121:5334), registrado como paso 3 en `stepDefinitions.tsx`. Esta tarea entrega la tarjeta «Ingresos planilla»: tabla de solo lectura con Salario bruto y Salario neto. Las otras secciones del paso las agregan DEC-009C y DEC-009D.
- **Backend simulado** `src/services/FinancialSummaryService.ts`: `fetchFinancialSummary(...)` devuelve `FinancialSummary` (salario bruto y neto, total de egresos, saldo mensual, razón gasto-ingreso y razón cuota de créditos-ingreso) con una espera de 250 ms, mismo patrón que `AuthService`/`AttachmentService`. Las fórmulas de adentro (ingreso total = salario neto + ingresos adicionales; saldo = ingreso total − egresos; razones con dos decimales; razón de cuotas = egresos de tipo «Cuotas de créditos» sobre ingreso total) son **provisionales y solo existen para que la pantalla tenga algo que mostrar**; al llegar la API real, este módulo es lo único que cambia. Los datos de planilla (1,500,000 bruto / 1,200,000 neto) son sintéticos (D-09).
- **Hook** `src/utils/hooks/useFinancialSummary.ts`: pide el resumen cada vez que cambian los ingresos adicionales o los egresos (D-11: cada alta, edición o retiro ya se guardó, así que el total oficial se refresca en cada cambio). Descarta respuestas viejas que lleguen tarde; si un refresco falla conserva la última cifra y la página avisa con el toast «La solicitud no fue procesada».
- **Tipos** `src/types/IncomeExpenses.types.ts` y **formato** en `src/utils/money.ts`: `formatAmount` ahora también acepta números; nuevos `formatCurrency` («₡ 1,897.45») y `formatPercent` («0.00 %»), tal como los dibuja Figma (formato literal, no regla de negocio).
- **RecordsTable** (DEC-002F) gana un `title` opcional (el título de sección a la izquierda de «Agregar nuevo», nodos 43121:5652/43121:5678). Sin `onAdd`/`onEdit`/`onDelete` la tabla es de solo lectura.

## Supuesto abierto: la planilla es de solo lectura

Figma dibuja «Salario bruto» y «Salario neto» como texto plano, sin lápiz ni campo. Se tomaron como datos que vienen precargados (D-09, origen de saldos). Si el negocio quiere que la persona los escriba, cambia el origen, no la pantalla.

## Validación

- `check-types`, `lint` y 195 pruebas: OK (40 nuevas en total para DEC-009A/C/D; las de esta tarea: 4 del servicio simulado — sin registros, suma de ingresos y egresos, redondeo a dos decimales y saldo negativo —, 3 del hook — carga, respuesta vieja descartada, fallo que conserva la última cifra — y 3 de la planilla en la página).
- V3 en navegador (sesión local de prueba): la planilla muestra 1,500,000 y 1,200,000; sin errores de consola.

## Diferencias y pendientes contra Figma

- En Figma cada bloque del paso (planilla + ingresos adicionales, egresos, otros detalles) es su propia tarjeta blanca; aquí van dentro de la tarjeta del wizard separados por una línea, porque el wizard ya pone una tarjeta alrededor de cada paso y anidar tarjetas con sombra se ve mal.
- Con ancho de tablet (768) las tablas hacen scroll horizontal dentro de sí mismas (`min-width: 560px` de `RecordsTable`, criterio de DEC-002F); incluso la de planilla, que tiene solo dos columnas.
- Las fórmulas del servicio simulado y los datos de planilla son de mentira (ver arriba).
