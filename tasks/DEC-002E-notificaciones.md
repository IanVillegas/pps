# DEC-002E Notificaciones (toasts)

Implementada y validada el 2026-09-28; rehecha el mismo día contra el nodo Figma real. Commit a cargo del usuario.

## Corrección de rumbo

La primera versión envolvía `Notification` de sad-aml-shared con textos inventados, porque se creyó que Figma no traía un toast. Sí lo trae: nodo **43250:8104 («Toasts»)**, dado por el usuario. Se rehízo contra ese diseño y **los toasts de ese nodo son el patrón para toda alerta del sistema**.

## Implementación

- **Proveedor y hook** `src/components/Organisms/Notification/NotificationProvider.tsx`: `NotificationProvider` (montado en `AppShell`, así que solo existe con sesión) y `useNotification()`, que expone `notify({ kind, message })`. `kind` es `success`, `error` o `warning`. Un aviso a la vez, arriba a la derecha; uno nuevo reemplaza al anterior y reinicia su autocierre.
- **Aspecto** (`NotificationProvider.module.scss`, `ToastIcon.tsx`): 540×82, radio 12, sombra Elevation-3, una línea de texto Poppins Medium 16 px blanca, icono de 50 px (aro blanco al 50 % + círculo del color + símbolo, con los paths exportados de Figma) y cierre de 20 px arriba a la derecha. Colores: éxito `#25CF7E`, error `#D23D3D`, advertencia `#F5CB5C`.
- **Textos** (`TOAST_MESSAGES`): «Guardado satisfactoriamente», «La solicitud no fue procesada. Inténtelo de nuevo» y «Error al procesar la solicitud. Inténtelo de nuevo», tomados de Figma con la tilde de «Inténtelo» que el diseño omite. `removed` («Eliminado satisfactoriamente») **no está en Figma**: es una propuesta pendiente de aprobación.
- **Duración** (propuesta, Figma solo define el aspecto): éxito 4 s, advertencia 6 s, error hasta que la persona lo cierre. Radix pausa el temporizador con el mouse o el foco encima.
- **Accesibilidad**: Radix Toast anuncia el aviso a lectores de pantalla; el botón de cerrar tiene nombre («Cerrar notificación»); también cierra con Escape o gesto.

## Por qué no se usa `Notification` de sad-aml-shared

Existe, pero no coincide con el diseño de DecPat: usa título + descripción (Figma es una sola línea), otros colores (éxito `#1A9359` vs `#25CF7E`, advertencia `#FFCF4D` vs `#F5CB5C`), otra disposición y arrastra defectos ya inventariados (ancho inline inválido, autocierre en 0 ms cuando se pasa 0). Se usa `@radix-ui/react-toast` directamente, la misma librería en la que shared se basa. Shared **no se modificó**.

## Validación

- `check-types`, `lint` y 95 pruebas: OK. Siete pruebas del proveedor: sin aviso al inicio, éxito con autocierre, error persistente hasta cerrarlo, advertencia que dura más que un éxito, reemplazo del aviso anterior, nombre accesible del botón y error claro fuera del proveedor.
- **Sin verificación en navegador (V3):** ninguna pantalla dispara todavía un aviso; se compara contra Figma con el primer uso real (DEC-008B).

## Diferencias y pendientes

- El aviso amarillo de Figma trae un texto de error; se conserva como ejemplo, pero una advertencia real necesita su propio texto.
- Duraciones y texto de «eliminado» pendientes de aprobación.
- Ancho fijo de 540 px (como Figma); en pantallas angostas queda limitado a `100vw`.
