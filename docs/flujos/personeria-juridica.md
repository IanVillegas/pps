# Personería jurídica

Estado: personerías jurídicas del paso 10 implementadas con servicios simulados; las sociedades tienen su [propia página](sociedades.md). Revisión: 27 de octubre de 2026.
Código: `c789b079859bd590e4180cb0ac3ae08fec58b781`. Seguimiento: DEC-016A; documentación: DOC-012.

## Propósito y alcance

`/mi-declaracion/10`, titulado «Personería jurídica», recoge las personerías jurídicas que posee la persona. La pantalla tiene dos bloques en la misma tarjeta: la tabla «Si posee usted alguna personería jurídica, por favor especifique.», que describe esta página, y la tabla «Si usted forma parte en alguna sociedad, por favor especifique.», descrita en [sociedades](sociedades.md). Cada una guarda sus filas bajo su propia clave del borrador (`legalEntities` y `societies`) y ninguna modifica a la otra.

La tabla muestra nombre, cédula jurídica, objetivo, plazo y acciones, con el título del diseño. Puede quedar vacía sin impedir continuar; el paso no registra una función de validación.

## Captura

El diálogo «Datos de la personería jurídica» utiliza tamaño `lg`, con dos columnas (nombre y cédula; objetivo y plazo). Los cuatro campos son obligatorios.

| Campo | Clave | Regla vigente |
| --- | --- | --- |
| Nombre | `name` | Texto, hasta 120 caracteres. |
| Cédula jurídica | `legalId` | Texto, hasta 20 caracteres. No tiene formato definido: acepta letras, números y guiones. |
| Objetivo | `purpose` | Texto, hasta 200 caracteres. |
| Plazo | `term` | **Solo dígitos**, hasta cuatro. Es un número; su unidad (años, meses) no está definida y no se escribe. |

Los textos formados solo por espacios se consideran vacíos y los valores se guardan sin espacios externos. No se detectan personerías duplicadas. Aplican las [operaciones comunes](registros-patrimoniales.md), incluida la confirmación antes de eliminar. Las filas se guardan en el borrador bajo `legalEntities`.

## Continuidad

Referencias: `src/components/Pages/Declaration/LegalEntities/LegalEntities.tsx`, `src/components/Organisms/LegalEntityDialog/LegalEntityDialog.tsx`, `src/types/LegalEntity.types.ts` y `fieldLimits.ts`.

Pendiente de confirmar: formato de la cédula jurídica, unidad del plazo y criterio de duplicados. Los asuntos de las sociedades se tratan en [su página](sociedades.md). Evidencia en [validación](../06-validacion-y-calidad.md).
