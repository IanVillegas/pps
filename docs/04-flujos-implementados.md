# Flujos implementados

Estado: frontend en desarrollo con servicios simulados. Revisión: 14 de octubre de 2026.

El acceso está compuesto por la pantalla de login y sus estados de retroalimentación. La sesión actual es una demostración en memoria; no autoriza servicios institucionales. La ruta `/inicio` contiene la pantalla informativa. La ruta `/mi-declaracion/[paso]` presenta el formulario progresivo.

## Flujos documentados en detalle

| Documento | Alcance revisado |
| --- | --- |
| [Acceso al sistema](flujos/acceso-al-sistema.md) | Validación, estados, bloqueo simulado, usuario recordado y sesión. |
| [Navegación interna e inicio](flujos/navegacion-interna.md) | Rutas internas, encabezado, menú compacto, ayuda y estado de error de demostración. |
| [Declaración y borrador](flujos/declaracion-y-borrador.md) | Navegación libre, validación al continuar, introducción y conservación local de datos. |
| [Datos generales](flujos/datos-generales.md) | Once campos, catálogos y validación de presencia del paso 1. |
| [Núcleo familiar](flujos/nucleo-familiar.md) | Alta, edición, retiro, fechas y detección de duplicados del paso 2. |
| [Ingresos y egresos](flujos/ingresos-y-egresos.md) | Planilla, registros, preguntas y resumen financiero del paso 3. |
| [Adjuntos de ingresos](flujos/adjuntos-de-ingresos.md) | Límites, estados, miniaturas y conservación de nombres de documentos. |
| [Bienes inmuebles](flujos/bienes-inmuebles.md) | Campos, valor de mercado y propiedades del paso 4. |
| [Bienes muebles](flujos/bienes-muebles.md) | Campos, catálogo de marcas y límites del paso 5. |
| [Cuentas de ahorro](flujos/cuentas-de-ahorro.md) | Cuentas y saldos por moneda del paso 6. |
| [Cuentas corrientes](flujos/cuentas-corrientes.md) | Precarga, montos agregados y saldos del paso 7. |
| [Créditos](flujos/creditos.md) | Préstamos, fechas, saldos y cuotas del paso 8. |

Los pasos 4 a 8 se revisaron contra `343c313c503bd25c652236b319c6e3874efeb8d4`. Sus operaciones repetidas se reúnen en [registros patrimoniales](flujos/registros-patrimoniales.md).

Ingresos, egresos y adjuntos se revisaron contra `78b3e72e6274248af2648ace1e567a5ceb9b2b4d`.

Acceso y navegación interna se revisaron contra el commit `9384bcd911d610c821da7c9c3c03e5a469984672`; declaración y borrador, contra `875867890e6e48ce97668b7a0019cc8255a8f3a6`; datos generales y familia, contra `bda881c3316f635e2c0579c040b2dca1395d7f7a`. Los pasos 1 a 8 cuentan con páginas de detalle; los pasos 9 a 12 continúan pendientes de implementación.

## Declaración patrimonial

| Paso | Contenido disponible |
| --- | --- |
| 1 | Datos generales y validación de campos. |
| 2 | Registros del núcleo familiar. |
| 3 | Planilla, ingresos adicionales, adjuntos, egresos y otros detalles. |
| 4 | Bienes inmuebles. |
| 5 | Bienes muebles. |
| 6 | Ahorro y totales por moneda. |
| 7 | Cuentas corrientes y datos simulados de cuentas de Grupo Mutual. |
| 8 | Créditos y totales de saldos y cuotas por moneda. |
| 9–12 | Contenido pendiente: tarjetas, personería jurídica, datos judiciales y cuestionario final. |

El registro actual asigna validación al paso 1 y al paso 3. Los demás pasos implementados con tablas permiten continuar sin registros; sus diálogos aplican sus propias validaciones. Esta descripción refleja el comportamiento vigente y debe contrastarse con las reglas institucionales al integrar el backend.

Los cambios del formulario se conservan en el borrador de memoria. El cierre de sesión elimina ese borrador y una recarga pierde la información. La persistencia institucional y el envío final requieren implementación posterior.

`AttachmentService` simula progreso y resultados de carga. No transfiere archivos a un servidor. Un nombre que contenga «error» permite reproducir un fallo en la demostración. La vista previa de PDF utiliza `pdfjs-dist`, según el registro de adjuntos; la carga real requiere un contrato separado.

Fuentes: rutas de `src/app`, `stepDefinitions.tsx`, `declarationSteps.ts`, `DeclarationService.ts`, `AttachmentService.ts` y [registro de tareas](../tasks/todo.md).
