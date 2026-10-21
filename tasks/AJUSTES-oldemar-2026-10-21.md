# Ajustes sugeridos por Oldemar (2026-10-21 y 2026-10-21)

Cinco cambios indicados por el usuario, todos con su registro de validación. Los tres primeros son visuales sobre pantallas ya hechas; el último es una respuesta a una duda.

## 1. Adjuntos: solo PDF (respuesta a D-05)

El sistema solo recibirá **PDF** como adjuntos (paso 3). Cierra D-05: ya no hay conflicto con los ejemplos de Figma que mostraban imágenes. No requiere cambios de código: el selector ya acepta únicamente PDF de hasta 5 MB (DEC-009B).

## 2.4 Modal de confirmación al eliminar (todas las tablas)

Figma: nodo 43294:2166, «Modal confirmacion eliminacion» (640 px).

- **Nuevo** `src/components/Organisms/ConfirmDeleteDialog`: `AppDialog` tamaño `md`, icono de alerta rojo de 60 px, «¿Está seguro(a) que desea eliminar este registro del sistema?» (Poppins Regular 16 px, centrado) y los botones «Cancelar» y «Sí, eliminar». Como Figma no dibuja título, queda solo para lectores de pantalla («Eliminar registro»).
- **Dónde va**: dentro de `RecordsTable` (`src/components/Organisms/RecordsTable/RecordsTable.tsx`), el componente común de todas las tablas. El icono de eliminar ahora solo abre el modal y `onDelete` se llama **solo con «Sí, eliminar»**. Por eso aplica de una vez a todas las tablas que permiten eliminar: núcleo familiar, ingresos adicionales y egresos (paso 3), inmuebles, muebles, ahorro, cuentas corrientes, créditos, tarjetas y personerías. Cancelar, la X y Escape no eliminan nada. Una tabla sin `onDelete` no monta el modal.
- Antes la fila se retiraba al instante («Sin confirmación ni deshacer»); ese comportamiento queda reemplazado.

## 2.1 Paso 3, «Otros detalles»

Figma: nodo 43121:5334 (nueva versión).

- **Nueva disposición**, de arriba hacia abajo: las tres cifras (saldo mensual disponible y las dos razones), «¿Cómo califica su situación financiera?» con sus opciones, la descripción detallada y, al final, «¿Existen cambios en el periodo actual en su situación patrimonial?» con «Si»/«No». Antes esa pregunta iba a la derecha de las cifras, en una letra más pequeña; ahora va debajo y con el tamaño normal de las demás (se eliminó la opción `compact` de `RadioGroup`, que ya no usa nadie).
- **Campo nuevo**: un `Textarea` «Detalle los cambios en su situación patrimonial», opcional (sin asterisco). **Siempre visible**, pero solo se **habilita con la respuesta «Si»**: con «No» (o sin responder) queda deshabilitado y vacío (decisión del usuario, 2026-10-21, D-27). Al volver a «No» se **descarta del borrador** (no queda un texto que contradiga la respuesta). Se guarda bajo `patrimonialChangesDetail` y nunca bloquea el avance. La etiqueta sigue siendo provisional. El `Textarea` compartido gana el estilo `:disabled` (fondo gris, texto atenuado; marcado «Modificado para DecPat»).

## 2.2 y 2.3 Formato de montos y orden moneda → monto (pasos 6 y 7, y luego todos los demás)

Cambio de Oldemar: el monto se formatea **mientras se escribe** y es el estándar de Grupo Mutual.

- **`MoneyInput`** (`src/components/Molecules/MoneyInput`): muestra el monto con comas y siempre dos decimales; cada dígito entra por la derecha como centavos (`1` → 0.01, `12` → 0.12, `123` → 1.23, `1234` → 12.34, `12345` → 123.45, `123456` → 1,234.56…), de modo que siempre se controlan los decimales. Borrar quita el último dígito, y al quitar el último se vacía el campo. El placeholder es el ejemplo `0,000.00`, ya no «Escribe aquí». Solo cuentan los dígitos (las letras se ignoran) y se aceptan hasta 15 con los centavos; pegar un número también lo toma como centavos.
- **Icono de la moneda**: el campo lleva al inicio el icono de la moneda elegida (₡ o $, los de Figma, `Atoms/CurrencyIcon`). Mientras no hay moneda el espacio queda reservado, de modo que el campo no «salta» al elegirla.
- **`CurrencySelect`** (`src/components/Molecules/CurrencySelect`): el selector de moneda con el icono en cada opción y en la moneda elegida.
- **Orden**: en los modales de ahorro (paso 6) y cuentas corrientes (paso 7) la **moneda va antes que el monto** (en ahorro, en la misma columna, Moneda arriba y Monto debajo; en cuentas corrientes, Entidad → Moneda → Saldo actual).
- **Formato guardado**: el monto se guarda como texto decimal con dos decimales (`"1234.56"`, sin errores de punto flotante). Un monto entero anterior (`"1500000"`) se lee como 1,500,000.00. Las tablas muestran los montos con dos decimales (`123,456.00`); los totales ya usaban dos decimales. Se quitó la validación «Escriba solo números» de estos dos campos: el campo ya no admite otra cosa, y lo único que puede faltar es escribirlo (se acepta 0.00).
- **Extensión compartida**: `InputText` (sad-aml-shared) gana la propiedad opcional `startAdornment`, un icono dentro del campo al inicio (marcada «Modificado para DecPat», como la del tooltip).
- Los totales por moneda de créditos y tarjetas (`CurrencyTotals`) ahora usan el mismo `CurrencyIcon` de 20 px de Figma en lugar del círculo rojo con el símbolo.

## Extensión a todos los montos (D-26 resuelta, 2026-10-21)

El usuario confirmó que el formato **aplica a todo campo que pida un monto**, no solo a los pasos 6 y 7. Se convirtieron a `MoneyInput`:

| Pantalla | Campos | Moneda del icono |
| --- | --- | --- |
| Paso 3, ingresos adicionales y egresos | Monto | Colones (los totales del mismo paso se muestran en ₡; los modales no tienen selector de moneda). |
| Paso 4, inmuebles | Valor de mercado | Sin icono (el paso no tiene moneda; ver «Moneda sin definir»). |
| Paso 5, muebles | Valor de mercado | Sin icono. |
| Paso 8, créditos | Monto inicial, Saldo actual, Monto cuota | La que se elija en «Moneda», que ahora va **antes** de los montos (Entidad → Tipo; **Moneda** → Número de préstamo; montos → Fecha). |
| Paso 9, tarjetas | Límite de tarjeta | La de la tarjeta («Moneda»). |
| Paso 9, tarjetas | Saldo y Cuota en colones / en dólares | Siempre ₡ en las de colones y $ en las de dólares. |
| Paso 11, datos judiciales | Monto que cancela por mes | Sin icono. |

`MoneyInput` acepta `currency={null}` para los montos que no tienen una moneda concreta: no dibuja el icono ni reserva su espacio. En todos, el valor se guarda como texto decimal con dos decimales y los montos enteros anteriores se leen como unidades enteras; las validaciones «Escriba solo números» desaparecen porque el campo ya no admite otra cosa.

## Otras respuestas del usuario (2026-10-21)

- **D-20, «Periodo» de la tarjeta**: es el **año**. Revisando las capturas del sistema original, solo muestra y pide el año, no una fecha completa. El campo ahora es numérico de cuatro dígitos (placeholder `AAAA`), con el error «Escriba el año con 4 dígitos»; no se inventa un rango de años.
- **D-21, «Plazo» de la personería**: es un **número** (en las capturas originales se ve, por ejemplo, un 3). El campo pasa a ser solo dígitos (hasta 4); su unidad (años, meses…) no está definida y no se escribe. Sigue sin definirse un formato para la cédula jurídica (texto libre).
- **D-19, edad contra fecha de nacimiento**: **no** hay esa validación; queda como está (ambos campos se guardan por separado).
- **D-23, datos judiciales**: el usuario pidió identificar el paso: es el **paso 11, «Datos judiciales»** (nodos Figma 43121:1791 y 43121:2088). Siguen abiertas dos dudas: qué se escribe en el campo de detalle de juicios penales, civiles y embargos, y la moneda del «Monto que cancela por mes».

## Moneda sin definir

Los montos que no tienen selector de moneda (inmuebles, muebles y la pensión) se formatean igual pero **sin icono**, porque no hay una moneda definida para ellos. Si deben ser colones, o llevar un selector de moneda como en créditos y tarjetas, hay que indicarlo.

## Validación

- Tipos, lint y 409 pruebas: OK (37 más que las 372 anteriores: pruebas del modal de eliminar en `RecordsTable` y de los diez pasos que eliminan; del orden y campo condicional de «Otros detalles»; de `MoneyInput`, de las utilidades de monto y de los modales de ahorro y cuentas corrientes, que ahora cubren digitación por centavos, borrar, tope de 15 dígitos, placeholder, icono, orden moneda → monto y datos anteriores).
- V3 en navegador (sesión local de prueba): el modal de ahorro muestra Moneda sobre Monto; las opciones de moneda llevan su icono; al elegir Colones el icono aparece en el selector y al inicio del monto, y escribir `12345600` muestra `123,456.00`; la cuenta guardada aparece en la tabla con `123,456.00`; el icono de eliminar abre el modal de confirmación con el aspecto de Figma y «Sí, eliminar» retira la fila. «Otros detalles» se comprobó por el DOM (orden correcto y campo de detalle con «Si»); la captura de ese tramo salió en negro y no se pudo mostrar.
