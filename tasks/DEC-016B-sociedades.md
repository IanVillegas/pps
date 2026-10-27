# DEC-016B Sociedades (paso 10, segunda parte)

Implementada y validada el 2026-10-21.

## Alcance

Segundo bloque del paso 10 de Figma (nodo 43121:2464, «Personería jurídica»): la tabla «Si usted forma parte en alguna sociedad, por favor especifique.», con su modal «Datos de la sociedad» (nodo 43121:2392). Estaba en pausa por D-22 (qué datos maneja la tabla). El usuario indicó el 2026-10-21 las columnas y su orden, con capturas del sistema original en Figma (nodos 43306:2214, tabla, y 43306:2215, modal).

## Implementación

- **Tabla** en `src/components/Pages/Declaration/LegalEntities/LegalEntities.tsx`, debajo de la de personerías (misma tarjeta, `gap` de 32 px). Columnas en el orden indicado: Nombre, Tipo de sociedad, Cargo, Plazo, Porcentaje de acciones, Monto de dieta, Tipo de poder, Límite suma y las acciones de editar y eliminar. Alta, edición y retiro (el retiro pide confirmación, DEC-002F); puede quedar vacía sin bloquear el avance (D-16) y cada cambio se guarda al instante (D-11) bajo la clave `societies` del borrador del paso.
- **Modal** `src/components/Organisms/SocietyDialog/SocietyDialog.tsx` (tamaño `lg`; Figma lo dibuja de 750 px). Distribución de Figma: Nombre | Cédula jurídica; Tipo de sociedad | Cargo; Plazo; y las cuatro preguntas «Si es…» a todo el ancho. «Agregar» al crear y «Guardar» al editar.
- **Tipos** `SocietyItem` y `SocietyItemData` en `src/types/LegalEntity.types.ts`; `LegalEntitiesValues` suma `societies`.
- **Catálogo** `SOCIETY_TYPE_OPTIONS` en `CatalogService.ts`: lista **provisional** (Sociedad anónima, Sociedad de responsabilidad limitada); «Sociedad anónima» es el único valor que muestra el sistema original.
- **Límites** (D-17, simbólicos): `societyRole` 60, `sharePercent` 6, `powerType` 60; Plazo reutiliza `legalEntityTerm` (4 dígitos).
- **Tabla compacta** (`dense` en `RecordsTable`): con nueve columnas la tabla se salía de la tarjeta y la columna de acciones quedaba oculta tras un scroll horizontal en pantallas de portátil (1024 px). La versión compacta usa letra de 12 px, menos espacio entre columnas y deja partir el texto en varias líneas; a 1024 px la tabla cabe completa, con la barra lateral abierta o cerrada, sin scroll. Si los montos son muy grandes o la ventana es más angosta, vuelve a aparecer el scroll horizontal. Solo la tabla de sociedades la usa.
- **`RecordsTable`** recibe `addAriaLabel` opcional: con dos tablas en la misma pantalla, el botón «Agregar nuevo» se anuncia como «Agregar nueva personería jurídica» y «Agregar nueva sociedad». El texto visible no cambia.

## Decisiones

- **Los nueve campos son obligatorios** (decisión del usuario, 2026-10-21): Figma pone asterisco a todos, incluidos los cuatro «Si es accionista / miembro de Junta Directiva / apoderado…». Quien no tiene ese cargo tendrá que escribir un valor igualmente; no se inventó una regla por cargo (D-28).
- **Porcentaje de acciones**: solo dígitos y un punto decimal, sin rango (el sistema original muestra `45`). No se limita a 100.
- **Monto de dieta y Límite de suma**: `MoneyInput` con el formato estándar (centavos, comas, dos decimales) y **sin ícono de moneda**, porque no se sabe en qué moneda están. La tabla los muestra con dos decimales (5,000.00 y 900.00, como el sistema original).
- **Plazo**: igual que en las personerías, un número sin unidad (D-21).
- **Cédula jurídica**: texto libre, sin formato.
- **Cabecera «Tipo de sociedad»**: el usuario escribió «Tipo de Solicitud»; se usó «Tipo de sociedad» porque así lo rotulan el modal de Figma y la tabla del sistema original. Confirmar si realmente se quería otro rótulo.
- Los encabezados van en minúscula después de la primera palabra («Porcentaje de acciones», «Monto de dieta», «Límite suma»), como el resto de las tablas del sistema; Figma los pone con mayúscula en cada palabra.

## Validación

- `tsc --noEmit` y `eslint src` sin errores; Jest: **60 suites y 421 pruebas satisfactorias** (12 nuevas: 4 de la validación del modal y 8 del paso, entre ellas columnas y orden, nueve campos, errores por campo, alta con formato de montos y filtro del plazo y el porcentaje, edición con datos precargados, cancelar y retiro con confirmación sin tocar las personerías).
- Navegador (sesión local de prueba, `localhost:3005`): las dos tablas con sus columnas; el modal coincide con Figma; se agregó «Sociedad A» (plazo «9a0» quedó en 90, dieta 500000 se ve 5,000.00, límite 90000 se ve 900.00), apareció el aviso «Guardado satisfactoriamente», la fila quedó en la tabla y el wizard **no avanzó** de paso. La captura se hizo en una ventana reducida; no se verificó píxel a píxel contra Figma. Sin errores de consola atribuibles (el único 404 vino de abrir una ruta inexistente a propósito).

## Diferencias y pendientes contra Figma

- Los cuatro campos «Si es…» son obligatorios aunque no apliquen a todos los cargos; si el negocio define reglas por cargo, se cambian en `validateSociety`.
- Catálogo de tipo de sociedad provisional; reemplazar en `CatalogService.ts`.
- La moneda de dieta y límite de suma no está definida (D-28); es la misma duda que la de los montos sin selector de moneda.
- El tamaño del modal es `lg` (805 px) y no 750 px; no se creó un tamaño nuevo solo para este modal.
- Figma dibuja el campo del límite de suma 2 px desplazado respecto de los demás; es un descuido del diseño y no se replica.
- Eliminar pide confirmación, a diferencia de lo que dibuja la captura original.
- El borde rojo exterior de la pantalla de Figma es una anotación del usuario (D-15) y no se replica.
