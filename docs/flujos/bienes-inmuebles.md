# Bienes inmuebles

Estado: paso 4 implementado con registros locales. Revisión: 21 de octubre de 2026 (campos del 14 de octubre; formato de montos y eliminación, del 21).
Código: `343c313c503bd25c652236b319c6e3874efeb8d4` para los campos; `17a0ad9f2cdc42bc8c44265dbb4be85bbbc5ada2` para el formato de montos y la eliminación. Seguimiento: DEC-010; documentación: DOC-006.

## Propósito y captura

`/mi-declaracion/4` permite registrar las propiedades que posee la persona. La tabla presenta número de finca, ubicación, valor de mercado, destino y forma de adquisición, además de acciones. El diálogo «Datos del bien inmueble» utiliza tamaño `lg`.

| Campo | Clave | Regla y máximo vigente |
| --- | --- | --- |
| Número de finca | `fincaNumber` | Texto obligatorio, 30 caracteres; no exige un formato registral. |
| Ubicación | `location` | Texto obligatorio, 200 caracteres. |
| Valor de mercado | `marketValue` | Obligatorio. Se escribe con el formato de [montos y moneda](montos-y-moneda.md) (centavos, comas y dos decimales, hasta 15 dígitos con los centavos) y se guarda como texto decimal; sin ícono de moneda porque el paso no tiene selector. |
| Destino | `destination` | Selección obligatoria de catálogo de demostración. |
| Forma de adquisición | `acquisitionForm` | Texto obligatorio, 60 caracteres; ayuda con ejemplos de compra, donación y herencia. |

Los campos de texto no aceptan únicamente espacios y se guardan sin espacios externos. No hay comprobación de finca duplicada, consulta registral, selector de moneda ni total de propiedades. La tabla muestra el valor con separadores de miles y dos decimales y resuelve el destino mediante su etiqueta de catálogo.

Aplican las [operaciones comunes](registros-patrimoniales.md), incluyendo tabla vacía permitida y retiro con confirmación. El borrador almacena las filas bajo `properties`; los cambios dentro del diálogo se incorporan solo al guardar.

## Mantenimiento y continuidad

Referencias: `src/components/Pages/Declaration/RealEstate/RealEstate.tsx`, `src/components/Organisms/RealEstateDialog/RealEstateDialog.tsx`, `src/types/RealEstate.types.ts`, `CatalogService.ts` y `fieldLimits.ts`.

Confirmar formato e identificación de finca, moneda del valor de mercado, catálogos y criterio de duplicados. Los límites son provisionales. El uso de «Guardar» para editar amplía el alta descrita en el historial de diseño. No se hizo una nueva comparación con Figma ni revisión visual; consultar [validación](../06-validacion-y-calidad.md).
