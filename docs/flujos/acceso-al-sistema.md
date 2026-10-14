# Acceso al sistema

Estado: interfaz implementada con autenticación simulada; integración institucional pendiente.
Revisión: 14 de octubre de 2026. Código de referencia: `9384bcd911d610c821da7c9c3c03e5a469984672`.
Seguimiento local: DEC-003 y DEC-004.

## Propósito y recorrido

La ruta `/` presenta el formulario de acceso. La persona ingresa usuario y contraseña y selecciona «Ingresar». Si el servicio devuelve éxito, se crea una sesión de demostración y se reemplaza la ruta por `/inicio`. El nombre mostrado en el encabezado corresponde al usuario ingresado; todavía no procede de un perfil institucional.

El formulario ofrece visualización de contraseña y la opción «Recordar mi usuario». La indicación para recuperar la contraseña remite a soporte interno; no existe un flujo de restablecimiento implementado.

## Campos y estados

| Elemento | Comportamiento actual |
| --- | --- |
| Usuario | Obligatorio, mínimo de cinco caracteres y máximo de 60. |
| Contraseña | Obligatoria, máximo de 100 caracteres. |
| Ingresar | Deshabilitado si falta alguno de los valores, durante el envío o mientras exista bloqueo temporal. Tener texto en ambos campos no sustituye la validación al enviar. |
| Validación | Los errores se muestran al interactuar con los campos y al enviar el formulario. |
| Carga | El botón muestra el estado de envío; una referencia adicional impide solicitudes simultáneas. |
| Credenciales incorrectas | Se abre un diálogo, se conserva el usuario y se limpia la contraseña. |
| Servicio no disponible | Se abre un diálogo de indisponibilidad y se limpia la contraseña; también aplica cuando la solicitud lanza una excepción. |
| Bloqueo temporal | Se impide el envío hasta el vencimiento recibido y se muestra el tiempo restante en minutos y segundos. Cerrar el diálogo mantiene el bloqueo. |

Los máximos de longitud proceden de `FIELD_MAX_LENGTH` y son provisionales. El mínimo de usuario refleja la implementación vigente; su aprobación institucional está pendiente junto con el contrato de autenticación.

Al cerrar el diálogo de retroalimentación, el formulario dirige el foco al campo de contraseña. El diálogo mantiene un título accesible incluso cuando se oculta visualmente. Estas medidas están presentes en el código; no constituyen una certificación integral de accesibilidad.

## Recordar usuario y duración de sesión

El nombre de usuario se guarda en `localStorage` bajo la clave `decpat.rememberedUsername` después de un acceso satisfactorio con la opción seleccionada. Al volver al formulario, se precarga y la opción aparece marcada. Un acceso satisfactorio sin seleccionarla elimina el valor recordado. Cambiar la casilla por sí solo no modifica el almacenamiento.

La contraseña no se guarda. Cerrar sesión conserva el nombre recordado, elimina la sesión de demostración y borra el borrador patrimonial. La sesión reside en memoria: recargar la página requiere ingresar nuevamente. El plazo de bloqueo también pertenece al estado local del formulario y no se conserva al recargar; su aplicación real corresponde al servicio institucional.

## Escenarios de demostración

Estos usuarios permiten verificar estados con una contraseña no vacía. El adaptador responde tras aproximadamente 600 ms y no consulta un servidor.

| Usuario | Respuesta simulada |
| --- | --- |
| `error.demo` | Credenciales incorrectas. |
| `bloqueo.demo` | Bloqueo hasta cinco minutos después de la respuesta. |
| `conexion.demo` | Servicio no disponible. |
| Otro usuario que cumpla la validación del formulario | Éxito si la contraseña contiene texto. |

El adaptador no cuenta intentos ni verifica credenciales institucionales. El mensaje «Excedió el número de intentos» representa un estado de interfaz; no demuestra una política de seguridad aplicada. Volver a enviar `bloqueo.demo` tras el vencimiento produce otro bloqueo simulado.

## Mantenimiento y continuidad

| Archivo | Responsabilidad |
| --- | --- |
| `src/app/page.tsx` | Publicar la pantalla de acceso. |
| `src/components/Pages/Login/Login.tsx` | Campos, validación, envío, bloqueo local y navegación. |
| `src/components/Organisms/LoginFeedback/LoginFeedback.tsx` | Mensajes y presentación del tiempo restante. |
| `src/services/AuthService.ts` | Resultado de acceso simulado y almacenamiento del usuario recordado. |
| `src/services/SessionService.ts` | Sesión en memoria y limpieza al salir. |
| `src/utils/fieldLimits.ts` | Límites provisionales de caracteres. |

Antes de integrar, acordar el mecanismo de sesión, contrato de autenticación, errores, vencimientos y reglas de campos. Revisar el comportamiento de recordar usuario en equipos compartidos y el procedimiento de recuperación de contraseña. La restricción visual de rutas internas debe complementarse con autorización en los servicios reales.

La revisión de esta tarea se limita a código y pruebas existentes. No se realizó una nueva comparación visual con Figma; las diferencias visuales siguen sujetas al registro histórico y a revisión de entrega. Consultar la [evidencia de validación](../06-validacion-y-calidad.md).
