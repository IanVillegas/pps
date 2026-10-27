# Código de demostración dentro del producto

Estado: vigente en la versión revisada; debe retirarse o reemplazarse al integrar el backend. Revisión: 27 de octubre de 2026.
Código: `c789b079859bd590e4180cb0ac3ae08fec58b781`. Seguimiento: DEC-020C; documentación: DOC-020.

## Advertencia para quien reciba el sistema

El código fuente que se entrega contiene **código de prueba**, no solo datos de ejemplo. Ninguno de los elementos de esta página es un mecanismo de seguridad ni una regla de negocio. Su propósito es permitir que el sistema se recorra completo y que se puedan reproducir estados de error sin un backend. Antes de cualquier uso con información real deben **retirarse o reemplazarse**.

Lo que una persona **no debe suponer** a partir de este sistema, porque hoy no ocurre ninguna de estas cosas:

- que su declaración quedó registrada;
- que su información fue enviada a algún lugar, incluidas las respuestas del cuestionario confidencial;
- que su sesión es segura o que su identidad fue verificada.

## Inventario

La mayoría de los elementos se reconoce buscando `[SIMULADO]` (ver [integración](09-integracion-con-el-backend.md)).

| Elemento | Ubicación | Qué hace hoy | Qué hacer al integrar |
| --- | --- | --- | --- |
| **Acceso sin verificación real** | `src/services/AuthService.ts`, `src/services/SessionService.ts` | Cualquier usuario y contraseña **no vacíos** inician sesión; no se consulta ningún servicio. La sesión vive en memoria y termina al recargar la página. | Reemplazar por el acceso real. No debe quedar este adaptador en un entorno con datos reales. |
| **Usuarios de prueba del acceso** | `AuthService.ts` | `error.demo` simula credenciales incorrectas, `bloqueo.demo` el bloqueo por intentos y `conexion.demo` una falla de conexión. | Eliminar: el servidor decide esos estados. |
| **Usuario de prueba del cierre** | `src/services/FinalizationService.ts` | El usuario `cierre.error` hace fallar el guardado final. | Eliminar. |
| **Adjuntos de prueba** | `src/services/AttachmentService.ts` | Un archivo cuyo nombre contiene «error» falla al subir. Ningún archivo se sube de verdad. | Reemplazar por la subida real. |
| **Estado de error de la pantalla de inicio** | `src/components/Pages/Home/Home.tsx` | El botón «Simular error (solo desarrollo)» aparece únicamente cuando `NODE_ENV` no es `production`. **El parámetro `/inicio?demo=error` no tiene esa restricción** y muestra el estado de error también en producción. | Eliminar el botón, el parámetro y el estado de demostración. |
| **Cifras de planilla y totales inventados** | `FinancialSummaryService.ts`, `SavingsTotalsService.ts`, `CurrentAccountsService.ts`, `CreditsTotalsService.ts`, `CreditCardsTotalsService.ts` | Salario bruto y neto de ejemplo y totales calculados en el navegador con fórmulas **provisionales**, que no son reglas de negocio. `CurrentAccountsService` incluye una cuenta de Grupo Mutual de ejemplo. | El backend calcula y entrega estas cifras; borrar las fórmulas. |
| **Catálogos inventados** | `src/services/CatalogService.ts` | Listas de ejemplo («Agencia 1 (mock)», «Banco 1 (mock)», tipos de sociedad provisionales…). | Reemplazar por los catálogos oficiales; la carga desde la API ya existe. |
| **Borrador y respuestas en memoria** | `DeclarationService.ts`, `ConfidentialReportService.ts` | Lo que se escribe vive solo en memoria y se pierde al recargar o cerrar sesión. El cuestionario confidencial **no se envía a ningún lugar**. | Reemplazar por el guardado por acción y por el canal definido para el cuestionario. |
| **Guardado final simulado** | `FinalizationService.ts` | «Guardar» en el juramento espera unos 800 ms y muestra «Guardado satisfactoriamente»; no se registra la firma ni se envía la declaración. | Reemplazar por la finalización real. |

## Lo que no es código de demostración

El nombre de usuario recordado con «Recordar mi usuario» se guarda en `localStorage` (clave `decpat.rememberedUsername`); es una función real y no almacena la contraseña ni información patrimonial. La política sobre su uso queda por confirmar con el equipo de seguridad (ver [acceso al sistema](flujos/acceso-al-sistema.md)).

## Lista de retiro antes de un entorno con datos reales

1. Reemplazar `AuthService` y `SessionService`; eliminar `error.demo`, `bloqueo.demo` y `conexion.demo`.
2. Reemplazar `FinalizationService`; eliminar `cierre.error`.
3. Reemplazar `AttachmentService`; eliminar el fallo por nombre de archivo.
4. Eliminar el botón, el parámetro `?demo=error` y el estado de error de demostración de `Home.tsx`.
5. Reemplazar los servicios de totales y retirar las fórmulas provisionales y los datos de planilla y cuentas de ejemplo.
6. Sustituir las listas de `CatalogService.ts` por los catálogos oficiales.
7. Reemplazar `DeclarationService` y `ConfidentialReportService`.
8. Comprobar con `grep -rn "\[SIMULADO\]" src` que no queda ningún servicio de demostración.

Fuentes: los archivos indicados en cada fila y `src/services/README.md`.
