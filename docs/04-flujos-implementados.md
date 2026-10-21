# Flujos implementados

Estado: frontend en desarrollo con servicios simulados. Revisión: 21 de octubre de 2026.

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
| [Tarjetas de crédito](flujos/tarjetas-de-credito.md) | Tarjetas, saldos y cuotas en colones y dólares del paso 9. |
| [Personería jurídica](flujos/personeria-juridica.md) | Personerías jurídicas del paso 10 (sociedades pendientes). |
| [Datos judiciales](flujos/datos-judiciales.md) | Preguntas Sí/No y campos condicionales del paso 11. |
| [Cuestionario confidencial](flujos/cuestionario-confidencial.md) | Primera vista del paso 12 y separación del borrador patrimonial. |
| [Juramento y cierre](flujos/juramento-y-cierre.md) | Segunda vista del paso 12 y estados del guardado simulado. |
| [Montos y moneda](flujos/montos-y-moneda.md) | Formato estándar de montos y moneda en todas las pantallas. |

Los pasos 4 a 8 se revisaron contra `343c313c503bd25c652236b319c6e3874efeb8d4`. Sus operaciones repetidas se reúnen en [registros patrimoniales](flujos/registros-patrimoniales.md).

Los pasos 10 a 12 y los ajustes de octubre (montos, moneda, «Otros detalles» y confirmación al eliminar) se revisaron contra `17a0ad9f2cdc42bc8c44265dbb4be85bbbc5ada2`, rama `main`.

El paso 9 se revisó contra `779fd7ad2b39796d3d2466f0ddb9ac44298f9193`, rama `main`.

Ingresos, egresos y adjuntos se revisaron contra `78b3e72e6274248af2648ace1e567a5ceb9b2b4d`.

Acceso y navegación interna se revisaron contra el commit `9384bcd911d610c821da7c9c3c03e5a469984672`; declaración y borrador, contra `875867890e6e48ce97668b7a0019cc8255a8f3a6`; datos generales y familia, contra `bda881c3316f635e2c0579c040b2dca1395d7f7a`. Los pasos 1 a 12 cuentan con páginas de detalle; del paso 10 solo está implementada la parte de personerías jurídicas.

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
| 9 | Tarjetas de crédito y totales de saldos y cuotas por moneda. |
| 10 | Personerías jurídicas; la tabla de sociedades está pendiente. |
| 11 | Datos judiciales con preguntas Sí/No y campos condicionales. |
| 12 | Cuestionario confidencial y juramento con guardado simulado. |

El registro actual asigna validación a los pasos 1, 3 y 11. Los demás pasos implementados con tablas permiten continuar sin registros; sus diálogos aplican sus propias validaciones. Esta descripción refleja el comportamiento vigente y debe contrastarse con las reglas institucionales al integrar el backend.

Los cambios del formulario se conservan en el borrador de memoria, salvo las respuestas del cuestionario confidencial y el estado del guardado, que tienen servicios propios y también se borran al cerrar sesión. El cierre de sesión elimina ese borrador y una recarga pierde la información. La persistencia institucional y el envío final requieren implementación posterior.

`AttachmentService` simula progreso y resultados de carga. No transfiere archivos a un servidor. Un nombre que contenga «error» permite reproducir un fallo en la demostración. La vista previa de PDF utiliza `pdfjs-dist`, según el registro de adjuntos; la carga real requiere un contrato separado.

Fuentes: rutas de `src/app`, `stepDefinitions.tsx`, `declarationSteps.ts`, `DeclarationService.ts`, `AttachmentService.ts` y [registro de tareas](../tasks/todo.md).
