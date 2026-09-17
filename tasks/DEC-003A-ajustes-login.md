# DEC-003A Ajustes de validacion y presentacion del login

Fecha: 2026-09-16.

Estado al 2026-09-17: implementacion terminada y validada; pendiente de aprobacion para commit.

Solicitud del usuario basada en capturas de Mutual en Linea, posterior a DEC-003.

- Usuario requerido: "El usuario es requerido". Minimo de 5 caracteres: "El campo debe tener al menos 5 caracteres".
- Contrasena requerida: "La contraseña es requerida". La captura solo muestra minimo de longitud para usuario.
- Validacion al salir del campo; despues de tocarlo, se actualiza al escribir.
- Ingresar deshabilitado hasta que ambos campos contengan texto y durante el envio. La longitud del usuario se valida antes de invocar login.
- Errores de InputText e InputSecret a 4px del control, sin margenes de parrafo heredados.
- CTA con hover amarillo palido rgb(240, 220, 168), segun el CSS aportado por el usuario; texto oscuro, sin borde ni cambio de dimensiones y foco visible para teclado. Sustituye el hover gris de la primera correccion.
- Centro de ayuda eliminado por decision del usuario, aunque aparece en Figma.
- Recordar mi usuario centrado sobre Ingresar.

## Archivos y orden de copia

1. Shared: estilos de Atoms/InputText, Atoms/InputSecret y Atoms/Button.
2. DecPat: src/components/Pages/Login/Login.tsx y Login.module.scss.
3. Pruebas: src/components/Pages/Login/Login.test.tsx.
4. Documentacion: este archivo y tasks/todo.md.

## Validacion

- Jest: 4 suites, 20 pruebas aprobadas.
- Lint: sin errores ni advertencias.
- Build: aprobado durante la implementacion inicial; tras el ajuste responsive se verifico la compilacion de desarrollo en Chrome. No se repitio build con el servidor activo.
- TypeScript: aprobado al finalizar build. La primera ejecucion simultanea encontro tipos temporales de .next en regeneracion.
- Revision visual completada con Chrome automatizado y capturas, incluyendo errores visibles (ver viewports mas abajo). Las capturas y decisiones del usuario fueron la referencia de estos ajustes; no se verifico paridad nueva con Figma. Centro de ayuda se elimina expresamente por solicitud del usuario.

El hover cambia para todos los consumidores de la variante CTA compartida. No se implementan aun los errores de autenticacion ni el bloqueo de DEC-004.

Commit sugerido: `fix(login): ajusta validaciones, estados y responsive`

## Ajuste responsive (2026-09-17)

- Corregido desbordamiento reproducido en Chrome a 768px: el formulario terminaba en x=890.
- Entre 481 y 1100px se reserva 42% para la marca, con padding ajustado y titulo de 32px; el espacio restante contiene el formulario.
- Correccion tras revision del usuario: se conserva la curva blanca y las ondas rojas ocupan el canvas completo. Sus dimensiones mantienen la proporcion original de escritorio para evitar comprimir la M. Se ajusta la posicion de la curva para separar el texto blanco de los campos, con continuidad blanca al borde derecho.
- Archivo de implementacion: src/components/Pages/Login/Login.module.scss. Copiarlo despues de los estilos shared indicados arriba.
- Chrome automatizado: 768x1024, 1024x768, 912x1368, 1032x1376, 1366x768 y 1440x900, con errores requeridos visibles. Sin desbordamiento horizontal ni errores de ejecucion; formulario dentro del viewport en todos los casos. Captura de 768x1024 revisada visualmente.
- La comprobacion corresponde a viewports en Chrome, no a dispositivos fisicos.
- Compilacion de desarrollo correcta. No ejecutar build sobre .next mientras el servidor dev la utiliza: produjo un error de chunks en la validacion anterior.
