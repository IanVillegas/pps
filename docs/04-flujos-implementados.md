# Flujos implementados

Estado: frontend en desarrollo con servicios simulados. Revisión: 14 de octubre de 2026.

El acceso está compuesto por la pantalla de login y sus estados de retroalimentación. La sesión actual es una demostración en memoria; no autoriza servicios institucionales. La ruta `/inicio` contiene la pantalla informativa. La ruta `/mi-declaracion/[paso]` presenta el formulario progresivo.

## Flujos documentados en detalle

| Documento | Alcance revisado |
| --- | --- |
| [Acceso al sistema](flujos/acceso-al-sistema.md) | Validación, estados, bloqueo simulado, usuario recordado y sesión. |
| [Navegación interna e inicio](flujos/navegacion-interna.md) | Rutas internas, encabezado, menú compacto, ayuda y estado de error de demostración. |

Estos dos bloques se revisaron contra el commit `9384bcd911d610c821da7c9c3c03e5a469984672`. El detalle de la declaración permanece como inventario inicial y se ampliará por bloques.

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
