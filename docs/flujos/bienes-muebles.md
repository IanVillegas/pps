# Bienes muebles

Estado: paso 5 implementado con registros locales. Revisión: 14 de octubre de 2026.
Código: `343c313c503bd25c652236b319c6e3874efeb8d4`. Seguimiento: DEC-011; documentación: DOC-007.

## Propósito y captura

`/mi-declaracion/5` presenta tipo, marca, placa, año, valor, descripción y observación. El diálogo «Datos del bien mueble» utiliza tamaño `lg`. Todos sus campos son obligatorios.

| Campo | Clave | Regla y máximo vigente |
| --- | --- | --- |
| Tipo de bien mueble | `type` | Selección de catálogo de demostración. |
| Marca del bien mueble | `brand` | Selección de catálogo de demostración. |
| Descripción | `description` | Texto, 200 caracteres; ayuda contextual «Modelo del bien mueble». |
| Número de placa | `plate` | Texto, 30 caracteres; sin patrón ni comprobación de unicidad. |
| Año | `year` | Solo dígitos, hasta cuatro caracteres. Sin mínimo, máximo ni exigencia de cuatro dígitos. |
| Valor de mercado | `marketValue` | Solo dígitos, 15 caracteres; sin selector de moneda. |
| Observación | `observation` | Texto de varias líneas, 500 caracteres. |

Los textos obligatorios rechazan valores formados solo por espacios y se guardan sin espacios externos. No se detectan duplicados. Aplican las [operaciones comunes](registros-patrimoniales.md); el borrador conserva filas bajo `items` y no existe total de bienes.

## Límites y continuidad

Los catálogos incluyen bienes que pueden no tener placa; sin embargo, la obligatoriedad actual no cambia según el tipo. La marca es una lista cerrada sin dependencia del tipo seleccionado. Confirmar si requiere texto libre o búsqueda, así como obligatoriedad condicional de placa, año y observación.

El nombre accesible actual de la tabla es «Vehículos que posee», aunque el catálogo es más amplio. El texto de ayuda de descripción requiere confirmación de negocio. Estos puntos se registran para continuidad sin cambiar la aplicación.

Referencias: `src/components/Pages/Declaration/MovableAssets/MovableAssets.tsx`, `src/components/Organisms/MovableAssetDialog/MovableAssetDialog.tsx`, `src/types/MovableAsset.types.ts`, `CatalogService.ts` y `fieldLimits.ts`.

La edición utiliza «Guardar» frente al alta documentada en el diseño. No se hizo una nueva comparación con Figma ni revisión visual; consultar [validación](../06-validacion-y-calidad.md).
