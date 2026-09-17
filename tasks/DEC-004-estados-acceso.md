# DEC-004 Estados de acceso

Implementada y validada el 2026-09-17. Commit a cargo del usuario.

## Implementacion

- LoginFeedback reutiliza Modal y Button de shared para credenciales incorrectas, exceso de intentos y servicio no disponible.
- Figma consultado con get_design_context: archivo pVGHV6WqzhsvQZ3goaRYnE, nodos 43121:6960 y 43121:6970. Icono exportado desde Figma a public/login-alert.svg.
- Modal de 640x448px, con limites de viewport y scroll; tipografias y colores del proyecto.
- Contador calculado desde retryAt absoluto, no por decrementos; cerrar el modal conserva el bloqueo hasta vencer. El boton se habilita al vencer si ambos campos contienen texto.
- Usuario conservado y contrasena borrada ante fallos. Retorno de foco a contrasena al cerrar por Entendido, X o Escape.
- Guardia sincrona de solicitud pendiente para evitar envios simultaneos, incluyendo submits por teclado. Errores inesperados muestran mensaje generico sin detalles internos.

## Prueba manual

En http://localhost:3004, usar cualquier contrasena no vacia y uno de estos usuarios:

- error.demo: credenciales incorrectas.
- bloqueo.demo: bloqueo de cinco minutos desde la respuesta.
- conexion.demo: servicio no disponible.
- Otro usuario de cinco o mas caracteres: exito simulado.

Estos escenarios pertenecen exclusivamente al adaptador mock existente. No hay credenciales reales, endpoint nuevo ni autenticacion de produccion. Cada solicitud con bloqueo.demo simula un nuevo bloqueo. No se inventa un umbral de intentos: el backend debe definirlo y hacer cumplir la restriccion. El estado de presentacion no persiste al recargar.

## Archivos y orden de copia

1. Shared: src/sad-aml-shared/components/Organisms/Modal/Modal.tsx agrega onCloseAutoFocus opcional; conserva el comportamiento anterior por defecto.
2. Servicio: src/services/AuthService.ts y AuthService.test.ts.
3. Asset: public/login-alert.svg.
4. Organismo: src/components/Organisms/LoginFeedback/LoginFeedback.tsx y LoginFeedback.module.scss.
5. Pantalla y pruebas: src/components/Pages/Login/Login.tsx y LoginFeedback.test.tsx.
6. Documentacion: tasks/todo.md y este archivo.

## Validacion

- Jest: 6 suites, 26 pruebas aprobadas. Incluye fallo/reintento, envio doble, rechazo de promesa, vencimiento absoluto y escenarios del adaptador.
- TypeScript y lint: aprobados; build de produccion aprobado con el servidor dev detenido.
- Chrome: modales en 768x1024, 1366x768 y 1440x900, sin errores de consola o ejecucion. Dimensiones 640x448px. Captura del bloqueo comparada visualmente con Figma.
- Chrome con reloj controlado: Escape cierra, bloqueo sigue activo, vence tras cinco minutos, reintento disponible y foco vuelve a contrasena.
- Servidor dev reiniciado en puerto 3004 despues del build.

## Diferencias y pendientes

- Se omite el telefono ficticio ****-**** de Figma; se mantiene soporte interno.
- Se mantiene el overlay con desenfoque del Modal compartido y el hover aprobado en DEC-003A.
- Credenciales incorrectas tiene titulo accesible oculto; foco visible agregado al cierre. Servicio no disponible reutiliza esa composicion sin nodo propio.
- Pendiente D-08: integrar contrato real, vencimiento del servidor y politica de bloqueo; hasta entonces estos estados solo demuestran comportamiento de UI.
- La redireccion de exito a Inicio sigue pendiente de DEC-005B.

Commit sugerido: `feat(login): implementa estados de acceso y bloqueo temporal`
