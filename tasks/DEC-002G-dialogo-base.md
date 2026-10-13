# DEC-002G Diálogo estándar (AppDialog)

Implementada y validada el 2026-10-14.

## Por qué

Cada modal nuevo (Familia, Inmuebles, Muebles, Ingresos, Egresos, Ahorro, Cuentas corrientes, y antes Ayuda, Introducción y Error de inicio de sesión) traía su propia copia de estilos que reemplazaba el `Modal` compartido, con la X, el título, el pie de botones y la sombra repetidos. El usuario señaló que los modales son un estándar (misma X, mismo título, mismo tamaño de texto) y que lo único que cambia es el ancho. Además, el scroll quedaba **por fuera** de la tarjeta: la barra abarcaba todo el alto del modal y dejaba el lado derecho con esquinas cuadradas mientras el izquierdo las tenía redondeadas.

## Implementación

- **`src/components/Organisms/AppDialog/AppDialog.tsx`**: envuelve el `Modal` de `sad-aml-shared` y recibe `size`, `title`, `media` (icono o logo sobre el título), `description` (visible) o `srDescription` (solo lectores de pantalla), `footer` y el contenido como `children`. Un único `AppDialog.module.scss` concentra lo que antes se copiaba en diez archivos.
- **Escala de anchos** (los que ya dibujaba Figma): `sm` 575 px, `md` 640 px, `lg` 805 px y `xl` 891 px, cada uno con su margen lateral (57, 65, 57 y 62 px). Uso actual: `sm` Cuentas corrientes y Ayuda; `md` Introducción y Error de inicio de sesión; `lg` Familia, Inmuebles, Muebles y Ahorro; `xl` Ingresos adicionales y Egresos. El modal de sociedad del paso 10 (847 px en Figma, DEC-016B) queda por decidir entre `lg` y `xl`.
- **Estándar de cabecera y pie**: X de 30 px a 32 px del borde derecho, **alineada con el título**; título Work Sans 24 px / 600 centrado; área de contenido a 34 px bajo el título y hasta 40 px del borde inferior; botones de 205×48 px con 42 px entre ellos. La distancia al borde superior es una sola variable, `--dialog-top`, y vale **40 px** (X a 39 px): el modal con scroll de Figma (nodo 43277:5624) la dibuja a 77 px, pero el usuario pidió subir título y X porque quedaba mucho espacio arriba (2026-10-14). Antes de este modal estándar, la X y el título cambiaban de lugar según el modal.
- **Scroll por dentro** (mismo nodo): la tarjeta redondeada recorta el contenido (`overflow: hidden`) y el scroll vive en un área interior; la barra (6 px, gris-200, esquinas de 5 px) queda a 41 px del borde derecho, justo bajo la X, y se reserva su espacio (`scrollbar-gutter`) para que el contenido no se corra cuando aparece. Los botones van al final del área con scroll, como en Figma. En Firefox se usa `scrollbar-width: thin` (el `::-webkit-scrollbar` se ignora si se define también la propiedad estándar).
- **Recorte del pie (2026-10-14, reporte del usuario)**: el área con scroll terminaba justo en el borde inferior de los botones, así que cortaba su borde redondeado (con scroll) y la sombra amarilla que les cae debajo, de unos 28 px (sin scroll). Ahora el espacio de 40 px hasta el borde del modal se reparte en 8 px de margen más **32 px de relleno dentro del área con scroll**; el recorte ya no alcanza a los botones. Medido: botones a 40 px del borde del modal, con y sin scroll.
- **Migrados a `AppDialog`** los diez modales; cada uno conserva solo su contenido y sus reglas propias (rejilla del formulario, textos informativos). Los iconos de Ayuda (amarillo) y de Error (rojo) y el logo de Introducción pasan por `media`; el Error de credenciales incorrectas usa `hideTitle` (el título queda para lectores de pantalla, como antes).

## Cambio aparte: sin rango de años en bienes muebles

El rango 1900 hasta el año entrante que validaba «Año» en el modal de bienes muebles (DEC-011) **no salía de Figma ni de ninguna decisión**: lo agregué yo. Se quitó; queda «requerido» y «solo números» (más `maxLength` de 4). La prueba del rango se reemplazó por una que confirma que no hay límite.

## Validación

- `check-types`, `lint` y 259 pruebas: OK (9 nuevas de `AppDialog`: título y nombre accesible, contenido y pie dentro del mismo scroll, descripción solo para lectores de pantalla o visible, cierre con X y Escape, ancho por tamaño, título oculto, `media` y pie opcional).
- V3 en navegador: se vieron los modales de Error de inicio de sesión, Ayuda, Introducción e Ingresos adicionales. Con la ventana baja, Ingresos muestra la barra por dentro de la tarjeta, bajo la X, con las cuatro esquinas redondeadas. Medido en pantalla (modal de Introducción, con logo): X a 32 px del borde derecho y 39 px del superior, título a 40 px; en Ingresos, área de scroll a 40 px del fondo y barra de 6 px a 41 px del borde derecho.

## Pendientes

- Los modales de Familia, Inmuebles, Muebles, Ahorro, Egresos y Cuentas corrientes se verificaron por pruebas y por el modal de Ingresos (mismo contenedor); no se abrió cada uno en el navegador.
- Con el ancho de 700 px o menos los márgenes se reducen (24 px de lado, barra a 12 px del borde); sin revisión visual en tablet vertical.
- Decidir el tamaño del modal de sociedad (847 px) cuando llegue DEC-016B.
