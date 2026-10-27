# DEC-016A Personerías (paso 10, primera parte)

Implementada y validada el 2026-10-20. El bloque de sociedades se implementó el 2026-10-21 en [DEC-016B](DEC-016B-sociedades.md).

> **Actualización 2026-10-21**: «Plazo» es un **número** (en las capturas del sistema original se ve, por ejemplo, 3): el campo pasa a aceptar solo dígitos (hasta 4); su unidad sigue sin definirse (D-21, resuelta en parte). Ver [AJUSTES-oldemar](AJUSTES-oldemar-2026-10-21.md).

## Alcance

El paso 10 de Figma (nodo 43121:2464, «Personería jurídica») dibuja dos bloques en una misma tarjeta: «Si posee usted alguna personería jurídica, por favor especifique.» y «Si usted forma parte en alguna sociedad, por favor especifique.». Esta tarea implementa **solo el primero**; el bloque de sociedades (modal con cargo y campos condicionales, nodo 43121:2392) es DEC-016B y se agregará debajo en la misma pantalla. DEC-016B **queda en pausa (D-22)**: el usuario solicitó al negocio la lista de datos que maneja la tabla de sociedades y se retoma cuando la reciba.

## Implementación

- **Paso** `src/components/Pages/Declaration/LegalEntities/LegalEntities.tsx`, registrado como paso 10 en `stepDefinitions.tsx`, **sin `validate`**: la tabla puede quedar vacía y aun así continuar (D-16).
- **Tabla** con `RecordsTable` (alta, edición y retiro), en el orden de Figma: Nombre, Cédula jurídica, Objetivo, Plazo y Acciones. Título: «Si posee usted alguna personería jurídica, por favor especifique.». Vacía muestra «No existen registros» y la acción «Agregar nuevo». Cada cambio se guarda en el borrador al instante y avisa con un toast (D-11).
- **Modal** `src/components/Organisms/LegalEntityDialog/LegalEntityDialog.tsx` (nodo Figma 43121:2440, «Datos de la personería jurídica», 805 px → `AppDialog` tamaño `lg`), dos columnas: Nombre | Cédula jurídica; Objetivo | Plazo. Los cuatro campos son obligatorios (todos llevan asterisco en Figma) y un texto formado solo por espacios cuenta como vacío; se guardan sin espacios externos. «Agregar» al crear y «Guardar» al editar (Figma solo dibuja el alta). Cancelar, la X y Escape no alteran la fila.
- **Tipos** `src/types/LegalEntity.types.ts`: `LegalEntityItem {id, name, legalId, purpose, term}`; las filas se guardan en el borrador bajo `legalEntities`. La sección de sociedades usará otra clave del mismo paso.
- **Límites nuevos** en `src/utils/fieldLimits.ts` (D-17, valores simbólicos): `legalEntityPurpose = 200` y `legalEntityTerm = 60`; el nombre usa `personName` (120) y la cédula `idNumber` (20).

## Decisiones

- **Sin formato de cédula jurídica**: Figma solo dice «Cédula jurídica *». No se inventa una máscara ni una longitud (3-101-XXXXXX u otra): es texto obligatorio con el límite de `idNumber`. Se confirmará con el negocio.
- **«Plazo» es texto libre**: Figma lo dibuja como campo de texto («Escribe aquí»), no como fecha ni lista, y no dice si es una duración («99 años»), una fecha o «indefinido». Se deja como **duda abierta D-21** (`preparacion-tecnica-visual.md`), igual que «Periodo» en tarjetas (D-20).
- **Sin duplicados**: no se detecta la misma cédula jurídica repetida; Figma no lo pide.
- **Sin precargas**: no hay datos de ejemplo; la tabla parte vacía.

## Validación

- `check-types`, `lint` y 318 pruebas: OK (12 nuevas: 4 de validación del modal y 8 del paso — tabla vacía con su acción, listado en las columnas del diseño, modal con sus cuatro campos, errores por campo al enviar vacío, alta con recorte de espacios y aviso, cancelar sin alterar, editar con datos precargados, retirar con aviso —).
- V3 en navegador (sesión local de prueba): la pantalla coincide con el primer bloque de Figma y el modal con el diseño; el envío vacío marca los cuatro errores y enfoca el primer campo; se agregó «Inversiones Mora S.A.» / «3-101-123456» / «Alquiler de locales comerciales» / «99 años» con Enter, apareció el toast «Guardado satisfactoriamente» y el wizard **no avanzó** de paso. Sin errores de consola.

## Diferencias y pendientes contra Figma

- Falta el bloque de sociedades (DEC-016B, en pausa por D-22), que Figma dibuja debajo con su propio «Agregar nuevo» y «No existen registros.»; mientras tanto la pantalla muestra solo las personerías, sin un botón «Agregar nuevo» de sociedades que no haría nada.
- Figma dibuja la separación vertical entre filas del modal en unos 108 px; la rejilla común de los modales de DecPat (créditos, tarjetas y esta) usa una separación algo menor (≈94 px) para dejar sitio a los mensajes de error.
- Figma dibuja «No existen registros.» con punto final; se usa el texto estándar de la tabla, sin punto (igual que el resto de los pasos).
- Eliminar no pide confirmación, mismo criterio que el resto de las tablas.
- El borde rojo exterior de la pantalla de Figma es una anotación del usuario (D-15) y no se replica.
