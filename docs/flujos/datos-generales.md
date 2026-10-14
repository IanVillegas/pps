# Datos generales

Estado: paso 1 implementado con catálogos de demostración; reglas institucionales pendientes de confirmación.
Revisión: 14 de octubre de 2026. Código de referencia: `bda881c3316f635e2c0579c040b2dca1395d7f7a`.
Seguimiento local: DEC-007.

## Propósito y uso

La sección `/mi-declaracion/1` recoge información personal, académica, de contacto y laboral. Los once campos son obligatorios. Los valores proceden del borrador actual, sin consulta de un perfil institucional; la pantalla permite editarlos.

Cada cambio actualiza los valores del paso en memoria y conserva los otros campos. «Continuar» verifica que todos tengan contenido y, si no hay errores, abre núcleo familiar. El indicador permite saltar a otras secciones sin ejecutar esa validación, según el [flujo de declaración](declaracion-y-borrador.md).

## Campos

| Etiqueta | Clave | Control y límite actual |
| --- | --- | --- |
| Nombre y apellidos | `fullName` | Texto, 120 caracteres. |
| Estado civil | `maritalStatus` | Lista de opciones. |
| Cédula | `idNumber` | Texto con sugerencia de teclado numérico, 20 caracteres. |
| Último grado académico obtenido | `lastAcademicDegree` | Texto libre, 120 caracteres. |
| Edad en años cumplidos | `age` | Texto con sugerencia de teclado numérico, 3 caracteres. |
| Carrera | `career` | Texto libre, 120 caracteres. |
| Teléfono habitación | `homePhone` | Texto con sugerencia de teclado numérico, 20 caracteres. |
| Agencia | `agency` | Lista de opciones. |
| Teléfono celular | `cellPhone` | Texto con sugerencia de teclado numérico, 20 caracteres. |
| Oficina para la que labora | `office` | Texto libre, 120 caracteres. |
| Dirección actual (exacta) | `address` | Texto de varias líneas, 500 caracteres. |

Los límites proceden de `FIELD_MAX_LENGTH` y son provisionales. Estado civil y agencia consumen listas estáticas de `CatalogService`; las agencias se identifican como datos de demostración. Grado académico y oficina son texto libre, no catálogos.

## Validación y límites

`validatePersonalData` considera ausente un campo vacío o formado únicamente por espacios. Devuelve un mensaje por campo; el contenedor presenta los errores y busca enfocar el primer control inválido. La validación utiliza el texto sin espacios externos para comprobar presencia, pero no normaliza los valores guardados.

La sugerencia de teclado numérico no impide escribir letras. Actualmente no se verifican formato de cédula o teléfono, rango o contenido numérico de edad, ni pertenencia de los valores seleccionados al catálogo mediante la función de validación. La interfaz ofrece las opciones disponibles, pero las comprobaciones definitivas deben acordarse y aplicarse también en la integración real.

El tipo `PersonalDataValues` permite campos opcionales para representar captura incompleta; esa condición del tipo no cambia la obligatoriedad al continuar. No existe en esta pantalla un guardado a servidor ni una acción independiente «Guardar».

## Mantenimiento y continuidad

| Archivo | Responsabilidad |
| --- | --- |
| `src/components/Pages/Declaration/PersonalData/PersonalData.tsx` | Campos, actualización y función de validación. |
| `src/components/Pages/Declaration/PersonalData/PersonalData.module.scss` | Distribución visual del formulario. |
| `src/types/PersonalData.types.ts` | Nombres de campos y contrato del paso. |
| `src/services/CatalogService.ts` | Opciones de estado civil y agencia. |
| `src/utils/fieldLimits.ts` | Máximos de caracteres. |

Confirmar formatos, rangos, catálogos y límites con el equipo receptor. Definir si el perfil institucional precargará datos y cuáles serán editables. Si cambian nombres de campos o tipos, revisar el contrato del borrador y sus pruebas.

Se revisaron código y pruebas existentes, sin nueva comparación con Figma ni inspección visual. La obligatoriedad de dirección y el uso de texto libre para grado académico y oficina reflejan el código vigente; mantenerlos como puntos de comprobación en la entrega. Evidencia en [validación y calidad](../06-validacion-y-calidad.md).
