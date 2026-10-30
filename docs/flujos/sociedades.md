# Sociedades

Estado: segundo bloque del paso 10 implementado con servicios simulados; el catálogo de tipos de sociedad es provisional. Revisión: 30 de octubre de 2026.
Código: `b4e1cdf61fc6209baf9cffb0e28829c44ec2d8b6`. Seguimiento: DEC-016B; documentación: DOC-018.

## Propósito y alcance

El paso 10 (`/mi-declaracion/10`, «Personería jurídica») presenta dos tablas en la misma tarjeta. La primera recoge las [personerías jurídicas](personeria-juridica.md); la segunda, titulada «Si usted forma parte en alguna sociedad, por favor especifique.», recoge las sociedades de las que la persona forma parte y los cargos o poderes que ejerce en ellas. Ambas pueden quedar vacías sin impedir continuar: el paso no registra una función de validación, y las reglas de cada registro se aplican en su diálogo.

Cada alta, edición o retiro se guarda en el borrador al instante, bajo la clave `societies` del paso (las personerías usan `legalEntities`). Una tabla no modifica a la otra.

## Tabla

Las columnas siguen el orden definido por el diseño: Nombre, Tipo de sociedad, Cargo, Plazo, Porcentaje de acciones, Monto de dieta, Tipo de poder, Límite suma y las acciones de editar y eliminar. Los montos se presentan con dos decimales. «Tipo de sociedad» muestra el texto del catálogo, no su valor interno.

Con nueve columnas la tabla no cabe en pantallas de portátil con la presentación estándar de `RecordsTable`. La tabla de sociedades utiliza su variante compacta (`dense`: letra de 12 px, menor espacio entre columnas y texto que puede partirse en varias líneas), con la que las nueve columnas caben completas, sin desplazamiento horizontal, a 1024 px con el menú lateral abierto o cerrado. Con una ventana más angosta o con montos muy grandes vuelve a aparecer el desplazamiento dentro de la propia tabla. El mensaje «No existen registros» conserva el tamaño y el espaciado de las demás tablas.

Como la pantalla tiene dos botones «Agregar nuevo», sus nombres accesibles se distinguen con `addAriaLabel` («Agregar nueva personería jurídica» y «Agregar nueva sociedad»); el texto visible no cambia.

## Captura

El diálogo «Datos de la sociedad» utiliza el tamaño `lg` de [AppDialog](../03-guia-de-componentes.md) (el diseño lo dibuja de 750 px; no se creó un tamaño nuevo para un solo diálogo). Presenta, en este orden, Nombre y Cédula jurídica; Tipo de sociedad y Cargo; Plazo; y las cuatro preguntas «Si es…» a todo el ancho. **Los nueve campos son obligatorios**: el diseño marca todos con asterisco, y el equipo confirmó que también lo son los cuatro que comienzan con «Si es…», aunque no apliquen a todos los cargos.

| Campo | Clave | Regla vigente |
| --- | --- | --- |
| Nombre de la sociedad | `name` | Texto, hasta 120 caracteres. |
| Cédula jurídica | `legalId` | Texto, hasta 20 caracteres. Sin formato definido. |
| Tipo de sociedad | `societyType` | Selección de un catálogo **provisional** (sociedad anónima y sociedad de responsabilidad limitada). |
| Cargo en la sociedad | `role` | Texto, hasta 60 caracteres. |
| Plazo | `term` | **Solo dígitos**, hasta cuatro; su unidad no está definida. |
| Porcentaje de acciones o participación | `sharePercent` | Dígitos y un único punto decimal, hasta seis caracteres. No se limita a 100. |
| Monto que percibe de dietas | `dietAmount` | Campo de monto con el [formato estándar](montos-y-moneda.md), **sin ícono de moneda** porque no se ha definido en cuál se expresa. |
| Tipo de poder | `powerType` | Texto, hasta 60 caracteres. |
| Límite de suma | `sumLimit` | Campo de monto, sin ícono de moneda. |

Los textos formados solo por espacios se consideran vacíos y los valores se guardan sin espacios externos; `0.00` es un monto válido. No se validan duplicados, el formato de la cédula ni reglas que dependan del cargo (por ejemplo, que el porcentaje solo aplique a los accionistas): ninguna de ellas está definida. Cancelar, la X y Escape descartan lo escrito sin modificar la fila.

## Continuidad

Referencias: `src/components/Pages/Declaration/LegalEntities/LegalEntities.tsx`, `src/components/Organisms/SocietyDialog/SocietyDialog.tsx`, `src/types/LegalEntity.types.ts` (`SocietyItem`), `src/services/CatalogService.ts` (`SOCIETY_TYPE_OPTIONS`) y `src/utils/fieldLimits.ts`. La variante compacta y el nombre accesible del botón están en `src/sad-aml-shared/components/Organisms/RecordsTable`.

Pendiente de confirmar con el negocio:

- El catálogo real de tipos de sociedad, que sustituye la lista provisional en `CatalogService.ts` sin modificar el diálogo; el catálogo se pide con el nombre `society-types` en el [contrato](../08-contrato-api.md).
- Si el cargo determina qué campos aplican (hoy los nueve son obligatorios para todos los cargos) y los catálogos de cargo y de tipo de poder, que hoy son texto libre.
- La moneda de la dieta y del límite de suma, el formato de la cédula jurídica y la unidad del plazo.

Evidencia en [validación](../06-validacion-y-calidad.md).
