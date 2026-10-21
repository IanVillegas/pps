# Personería jurídica

Estado: paso 10 implementado en su primera parte (personerías jurídicas); la tabla de sociedades está pendiente. Revisión: 21 de octubre de 2026.
Código: `17a0ad9f2cdc42bc8c44265dbb4be85bbbc5ada2`. Seguimiento: DEC-016A; documentación: DOC-012.

## Propósito y alcance

`/mi-declaracion/10`, titulado «Personería jurídica», recoge las personerías jurídicas que posee la persona. El diseño dibuja dos bloques en la misma tarjeta: la pregunta «Si posee usted alguna personería jurídica, por favor especifique.» y la pregunta «Si usted forma parte en alguna sociedad, por favor especifique.». Hoy solo existe el primero. El segundo (sociedades, con cargo y campos que dependen de él) no se implementó porque aún no se conoce qué datos maneja su tabla; se registra como deuda en [pendientes](../07-pendientes-y-continuidad.md). Por eso la pantalla no muestra un botón «Agregar nuevo» de sociedades.

La tabla muestra nombre, cédula jurídica, objetivo, plazo y acciones, con el título del diseño. Puede quedar vacía sin impedir continuar; el paso no registra una función de validación.

## Captura

El diálogo «Datos de la personería jurídica» utiliza tamaño `lg`, con dos columnas (nombre y cédula; objetivo y plazo). Los cuatro campos son obligatorios.

| Campo | Clave | Regla vigente |
| --- | --- | --- |
| Nombre | `name` | Texto, hasta 120 caracteres. |
| Cédula jurídica | `legalId` | Texto, hasta 20 caracteres. No tiene formato definido: acepta letras, números y guiones. |
| Objetivo | `purpose` | Texto, hasta 200 caracteres. |
| Plazo | `term` | **Solo dígitos**, hasta cuatro. Es un número; su unidad (años, meses) no está definida y no se escribe. |

Los textos formados solo por espacios se consideran vacíos y los valores se guardan sin espacios externos. No se detectan personerías duplicadas. Aplican las [operaciones comunes](registros-patrimoniales.md), incluida la confirmación antes de eliminar. Las filas se guardan en el borrador bajo `legalEntities`; la sección de sociedades usará otra clave del mismo paso.

## Continuidad

Referencias: `src/components/Pages/Declaration/LegalEntities/LegalEntities.tsx`, `src/components/Organisms/LegalEntityDialog/LegalEntityDialog.tsx`, `src/types/LegalEntity.types.ts` y `fieldLimits.ts`.

Pendiente de confirmar: formato de la cédula jurídica, unidad del plazo, criterio de duplicados y la información de la tabla de sociedades (D-22), que incluye cargo, tipo de sociedad, porcentaje, dietas, tipo de poder y límite de suma según su cargo. El modal de sociedad del diseño mide 750 px, entre los tamaños `md` y `lg` de [AppDialog](../03-guia-de-componentes.md); se decidirá al implementarlo. Evidencia en [validación](../06-validacion-y-calidad.md).
