# Navegación interna e inicio

Estado: estructura e inicio implementados con sesión de demostración.
Revisión: 27 de octubre de 2026 (estructura del 14 de octubre; migas de pan, del 27). Código de referencia: `9384bcd911d610c821da7c9c3c03e5a469984672` y `c789b079859bd590e4180cb0ac3ae08fec58b781`.
Seguimiento local: DEC-005A, DEC-005B, DEC-005C y DEC-020A.

## Acceso a las pantallas internas

Las rutas `/inicio` y `/mi-declaracion/[paso]` comparten el layout `src/app/(app)/layout.tsx`. El grupo `(app)` organiza archivos y no aparece en la URL. El layout raíz también envuelve las rutas internas; el contenedor con menú y encabezado se incorpora mediante el layout del grupo.

`AuthenticatedShell` consulta la sesión en memoria. Cuando no existe, no muestra el contenido interno y reemplaza la ruta por `/`. Cuando existe, entrega usuario y acción de salida a `AppShell`. Esta comprobación ocurre en el cliente y corresponde a la demostración; no sustituye la autorización del backend.

## Encabezado y menú

El encabezado muestra el nombre de la sesión y permite cerrar sesión mediante el menú de perfil. La salida elimina sesión y borrador y regresa a `/`. No elimina el usuario recordado del formulario de acceso.

| Opción | Estado y destino |
| --- | --- |
| Inicio | Disponible, `/inicio`. |
| Mi declaración | Disponible, `/mi-declaracion/1`; el enlace vuelve al primer paso. |
| Reportes | Visible y deshabilitada, sin ruta asociada. |
| Declaraciones | Visible y deshabilitada, sin ruta asociada. |
| Mantenimientos | Visible y deshabilitada, sin ruta asociada. |

El menú identifica la sección activa. Los logotipos enlazan al inicio. En un paso reconocido de la declaración, el encabezado del contenido utiliza el título e icono registrados en `declarationSteps.ts`; en otras pantallas utiliza «Declaración Patrimonial».

`AppShell` incorpora `NotificationProvider`, que permite a las pantallas internas comunicar resultados mediante notificaciones. La lógica específica del formulario por pasos se documentará en un bloque posterior.

## Migas de pan

Dentro de la declaración (`/mi-declaracion/…`) el encabezado muestra, a la izquierda, el botón «Regresar» y las migas «Inicio / Mi declaración», como en el diseño (nodo 43121:6538). «Regresar» y «Inicio» llevan a `/inicio`; «Mi declaración» es la pantalla actual y no es un enlace. En `/inicio` no se muestran, porque no hay una pantalla anterior. Las migas se definen en `AppShell` con el componente `BreadCrumbs` de `sad-aml-shared` (ver la [guía de componentes](../03-guia-de-componentes.md)), que se ajustó para el App Router.

## Menú expandido y compacto

Al montarse, el contenedor consulta un breakpoint de 1100 px: a ese ancho o por debajo, configura el menú compacto; por encima, expandido. La persona puede cambiarlo manualmente en ambos rangos. Esa elección se mantiene al navegar entre pantallas del grupo y se reajusta al cruzar el breakpoint.

El estado del menú no se guarda de forma permanente. En la vista compacta se conserva el nombre accesible de cada opción y los enlaces disponibles ofrecen ayuda contextual. El botón para expandir o colapsar informa su estado mediante `aria-expanded`.

El breakpoint debe mantenerse coordinado entre `AppShell.tsx`, `SideBar.module.scss` y `DashboardLayout.module.scss`. El alcance de dispositivos sigue siendo escritorio, laptop y tablet; 1100 px es un umbral de presentación, no una lista de dispositivos soportados.

## Inicio y contactos

La página de inicio muestra «Bienvenido a DecPat», una tarjeta informativa «¿Qué es?» y un bloque de ayuda. El texto es estático; no existe una consulta a un servicio de contenido. «Contactos» abre `HelpDialog`, con enlaces de correo y teléfono, y «Entendido» lo cierra.

El diálogo toma sus valores de `HELP_EMAIL` y `HELP_PHONE`. El código indica que provienen del diseño y requieren validación de negocio. En especial, el teléfono de muestra no debe tratarse como un contacto institucional confirmado. Antes de publicar, confirmar datos, responsable de atención y redacción con el equipo correspondiente.

## Estado de error de demostración

La página permite mostrar un estado recuperable con ilustración y el mensaje «Ha ocurrido un error». «Entendido» restaura el contenido normal; no vuelve a consultar datos porque la pantalla es estática.

En desarrollo aparece «Simular error (solo desarrollo)». También se activa el estado si la página se monta con `?demo=error`. El parámetro no está condicionado al modo de desarrollo, aunque el botón sí lo está. Escribir la URL directamente puede recargar la aplicación y perder la sesión; para una verificación reproducible en desarrollo conviene utilizar el botón después de ingresar.

Antes de la entrega, decidir si se conserva el mecanismo de demostración y cómo se representarán los fallos de servicios reales.

## Archivos de referencia

| Archivo | Responsabilidad |
| --- | --- |
| `src/app/(app)/layout.tsx` | Mantener el contenedor común de rutas internas. |
| `src/components/Templates/AuthenticatedShell/AuthenticatedShell.tsx` | Comprobar sesión y coordinar salida. |
| `src/components/Templates/AppShell/AppShell.tsx` | Componer encabezado, menú, título y notificaciones. |
| `src/sad-aml-shared/components/Organisms/SideBar/SideBar.tsx` | Opciones, estado compacto y nombres accesibles. |
| `src/sad-aml-shared/components/Organisms/Header/Header.tsx` | Presentar usuario y menú de perfil. |
| `src/components/Pages/Home/Home.tsx` | Contenido de inicio y demostración de error. |
| `src/components/Organisms/HelpDialog/HelpDialog.tsx` | Contactos de ayuda. |

La revisión se realizó sobre código y pruebas existentes, sin nueva inspección en navegador ni comparación con Figma. Confirmar en la versión de entrega el menú compacto a 768 px, la conservación del estado al navegar, el foco del menú de perfil y el diálogo de ayuda. Consultar la [evidencia de validación](../06-validacion-y-calidad.md).
