# Navegación de la declaración y gestión del borrador

Estado: estructura implementada con borrador en memoria; persistencia y envío institucional pendientes.
Revisión: 14 de octubre de 2026. Código de referencia: `875867890e6e48ce97668b7a0019cc8255a8f3a6`.
Seguimiento local: DEC-006A y DEC-006B.

## Propósito y entrada

El formulario distribuye la declaración en doce secciones y conserva los valores capturados al navegar entre ellas. «Mi declaración» abre `/mi-declaracion/1`. Cada sección tiene una ruta `/mi-declaracion/{número}`, dentro del contenedor de sesión descrito en [navegación interna](navegacion-interna.md).

La ruta admite números correspondientes a los pasos configurados. Valores inexistentes, como `0`, `13` o `abc`, redirigen al primer paso. La comprobación de ruta no elimina el borrador. Si no existe sesión, se aplica además la redirección al acceso del contenedor interno.

## Introducción

Al entrar en cualquier paso, se abre un diálogo informativo mientras `introAcknowledged` sea falso. «Entendido», el icono de cierre y Escape ejecutan la misma acción: marcar la introducción como cerrada. El diálogo no vuelve a aparecer al cambiar de paso o regresar desde inicio mientras se conserve el borrador.

La marca indica que el diálogo se cerró; no acredita lectura, aceptación legal ni envío de una declaración. Se elimina con el borrador al cerrar sesión o recargar. El texto de periodicidad proviene del diseño y requiere confirmación institucional antes de la entrega.

## Navegación y validación

| Acción | Comportamiento vigente |
| --- | --- |
| Seleccionar un número del indicador | Abre ese paso sin validar el actual. Todos los pasos configurados son alcanzables. |
| Seleccionar el número actual | No solicita una nueva navegación. |
| Regresar | Abre el paso anterior sin validar. Está deshabilitado en el primero. |
| Continuar | Valida el paso actual si tiene una función registrada; si no hay errores, abre el siguiente. En el último paso se rotula «Terminar» y ejecuta la acción `onFinish` del paso (en el paso 12 abre el [juramento](juramento-y-cierre.md)); si el paso no la define, permanece deshabilitado. |
| Visitar un paso sin contenido | Muestra «El contenido de este paso aún no está disponible». Sin validación registrada, permite continuar, salvo en el último si no define `onFinish`. |

El indicador distingue únicamente el paso actual. No muestra pasos completados ni calcula un porcentaje de avance. Haber visitado una sección o guardar valores no implica que esté completa.

Actualmente los pasos 1, 3 y 11 registran validación en el contenedor. Los demás pasos implementados con tablas pueden quedar sin filas; sus diálogos validan los registros al agregarlos o editarlos. Las reglas de cada sección se documentarán por separado.

Cuando «Continuar» encuentra errores, permanece en el paso, muestra un aviso con `role="alert"` e intenta enfocar el primer campo marcado con `aria-invalid="true"`. Mientras haya errores activos, los cambios vuelven a evaluar la validación. Cambiar de paso reinicia el estado local de errores, pero conserva los valores; regresar no restaura los mensajes anteriores.

El último paso abre el [juramento](juramento-y-cierre.md) con «Terminar» y lo guarda con un servicio simulado; guardar no constituye un envío institucional. La estructura actual tampoco realiza una validación conjunta de las doce secciones. Cada definición de paso admite también `ownActions` (el paso decide si muestra los botones del contenedor) y `onFinish` (acción del último paso).

## Conservación de datos

`DeclarationService` mantiene un único borrador de demostración en memoria, compuesto por la marca de introducción y un conjunto de valores por número de paso. `useDeclaration` permite a los componentes consultar ese estado y actualizarlo.

Cada llamada a `onChange` del contenido guarda los valores del paso inmediatamente en ese estado local, aunque estén incompletos o sean inválidos. El guardado reemplaza el conjunto completo de valores de ese paso y conserva los otros pasos; quien lo invoca debe incluir los campos que necesite mantener. No realiza una petición de red ni comprueba reglas de negocio.

| Situación | Resultado |
| --- | --- |
| Ir a otro paso y volver mediante navegación interna | Se conservan los valores guardados. |
| Volver a inicio y reabrir la declaración sin recargar | Se conserva el borrador; el enlace del menú abre el paso 1. |
| Recargar la aplicación | Se pierde el borrador y la sesión de demostración. |
| Cerrar sesión | Se eliminan el borrador y la marca de introducción. |
| Abrir otra pestaña | No hay sincronización de borradores ni sesiones entre pestañas. |

El borrador no se almacena en `localStorage`, una base de datos o un servidor. Las notificaciones de guardado de las secciones deben interpretarse dentro de este alcance local. La recuperación después de una recarga requiere una integración posterior.

## Uso mediante teclado y presentación

El indicador se presenta como navegación «Pasos de la declaración». Cada botón se identifica por su número y el actual incluye `aria-current="step"`. El nombre de la sección se ofrece mediante ayuda contextual.

Las flechas izquierda y derecha mueven el foco entre botones sin cambiar de sección; Home y End lo llevan al primero y al último. El movimiento se detiene en los extremos. La activación del botón realiza la navegación. Los estilos definen foco visible y conectores flexibles para reducir el ancho del indicador en tablet.

Estas características se verificaron mediante código y pruebas seleccionadas. La revisión visual a 768 y 1366/1440 px y una evaluación completa de accesibilidad quedan pendientes para la versión de entrega.

## Incorporación de una sección

Los títulos, números e iconos se mantienen en `src/utils/declarationSteps.ts`. `stepDefinitions.tsx` asigna contenido y validación a esos números. Ambos registros deben coincidir.

El componente de contenido recibe `values`, `errors` y `onChange`. Si usa varias tarjetas, `cards: true` permite que reciba también `actions` y coloque los botones dentro de su composición. Sin esa opción, el contenedor presenta una tarjeta y coloca las acciones debajo del contenido. El contenido con varias tarjetas debe renderizar las acciones recibidas.

Una función `validate` devuelve errores por nombre de campo; un objeto vacío permite continuar. Omitirla equivale a permitir avanzar sin validación del contenedor. Al incorporar una sección, comprobar conservación de valores, errores, navegación y correspondencia entre nombres de campo y mensajes. Consultar la [guía de componentes](../03-guia-de-componentes.md).

## Archivos de referencia y continuidad

| Archivo | Responsabilidad |
| --- | --- |
| `src/app/(app)/mi-declaracion/[paso]/page.tsx` | Resolver y comprobar el número de paso. |
| `src/components/Pages/Declaration/DeclarationWizard/DeclarationWizard.tsx` | Coordinar indicador, validación, acciones e introducción. |
| `src/components/Pages/Declaration/DeclarationWizard/stepDefinitions.tsx` | Registrar contenido y reglas por sección. |
| `src/utils/declarationSteps.ts` | Definir títulos, números e iconos. |
| `src/components/Molecules/DeclarationStepper/DeclarationStepper.tsx` | Presentar navegación y manejo de teclado. |
| `src/components/Organisms/DeclarationIntroDialog/DeclarationIntroDialog.tsx` | Presentar la introducción. |
| `src/services/DeclarationService.ts` | Mantener, actualizar y limpiar el borrador local. |
| `src/utils/hooks/useDeclaration.ts` | Suscribir componentes al borrador. |
| `src/types/Declaration.types.ts` | Definir contratos de valores, errores y borrador. |

Antes de integrar persistencia, acordar identificación de la declaración, asociación al usuario, recuperación, errores de guardado y conflictos entre versiones. Definir también validación final, envío y comprobante, así como el significado de un estado «completado» si se incorpora. La sustitución del servicio puede requerir cambios en tipos, hooks, mensajes y pruebas.

La omisión del estado visual «Hecho» del diseño refleja el criterio actual de navegación libre y ausencia de seguimiento de completitud. No se hizo una nueva comparación con Figma en esta tarea. La [validación](../06-validacion-y-calidad.md) distingue pruebas actuales de evidencia histórica.
