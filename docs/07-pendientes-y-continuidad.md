# Pendientes y continuidad

Estado: recomendaciones para la transferencia. Revisión: 27 de octubre de 2026.

| Prioridad propuesta | Trabajo | Criterio de cierre |
| --- | --- | --- |
| Alta | Retirar o reemplazar el [código de demostración](10-codigo-de-demostracion.md) | Ningún servicio `[SIMULADO]` ni usuario de prueba permanece en un entorno con datos reales. |
| Alta | Cerrar los asuntos de negocio de sociedades, tarjetas, personerías y datos judiciales | Respuestas del negocio incorporadas (catálogo de tipos de sociedad, reglas por cargo, rango del año de la tarjeta, unidad del plazo, detalle judicial). |
| Alta | Integrar autenticación, persistencia y servicios reales | Contratos confirmados y escenarios de éxito y error verificados; los servicios `[SIMULADO]` reemplazados (ver [integración](09-integracion-con-el-backend.md)). |
| Alta | Confirmar catálogos, cálculos y reglas de negocio | Sustitución de datos sintéticos y supuestos aprobada por el equipo. |
| Alta | Comparar copia local y proyecto institucional | Registro de archivos transferidos, diferencias y validaciones en destino. |
| Media | Revisar comentarios existentes | Texto orientado a mantenimiento humano, conservando contratos y restricciones útiles. |
| Media | Completar fichas de componentes | Propiedades, ejemplos, estados y límites verificados. |
| Media | Completar la auditoría de accesibilidad y la comparación con Figma | Lector de pantalla, contraste, recorrido solo con teclado y comparación pantalla por pantalla contra el diseño; probar además en otros navegadores. |
| Media | Revisar avisos y diferencias conocidas | Resolución o aceptación explícita de cada asunto vigente. |

Estas prioridades son una propuesta documental; los responsables y fechas deben acordarse con el equipo interno.

## Pendientes de acceso y navegación

Identificados por revisión de código el 14 de octubre de 2026, referencia `9384bcd911d610c821da7c9c3c03e5a469984672`:

- Confirmar contrato de autenticación, sesión y bloqueo en servidor; la demostración no cuenta intentos y pierde el bloqueo al recargar.
- Confirmar límites y reglas de usuario y contraseña, procedimiento de recuperación y uso de recordar usuario.
- Validar los contactos de ayuda y el texto informativo de inicio con el equipo interno.
- Definir alcance de Reportes, Declaraciones y Mantenimientos, actualmente deshabilitados.
- Decidir el tratamiento del estado de error de demostración: el botón se restringe a desarrollo, pero `?demo=error` no tiene esa restricción.
- Revisar comentarios históricos de login y layout; algunas explicaciones mezclan el proceso de implementación con el funcionamiento actual.

Detalles en [acceso](flujos/acceso-al-sistema.md) y [navegación](flujos/navegacion-interna.md). Estos puntos permanecen pendientes; no se modificó el comportamiento de la aplicación en esta tarea.

## Pendientes de declaración y borrador

Revisión del 14 de octubre de 2026, referencia `875867890e6e48ce97668b7a0019cc8255a8f3a6`:

- Acordar persistencia, recuperación, asociación al usuario y tratamiento de fallos o conflictos de guardado.
- Definir validación global y envío final: «Terminar» abre el juramento y lo guarda con un servicio simulado; falta el envío institucional y una validación conjunta de las doce secciones.
- Confirmar periodicidad y texto de introducción; cerrar el diálogo no representa aceptación formal.
- Definir si se requiere seguimiento de completitud; el indicador actual solo marca la sección visitada.
- Verificar rutas inválidas mediante pruebas específicas de la página: la lectura confirma su redirección, pero las pruebas seleccionadas del contenedor no ejercitan esa ruta.
- Completar revisión visual y de teclado sobre las rutas reales antes de la transferencia.

Detalles en [declaración y borrador](flujos/declaracion-y-borrador.md).

## Pendientes de datos generales y familia

Revisión del 14 de octubre de 2026, referencia `bda881c3316f635e2c0579c040b2dca1395d7f7a`:

- Confirmar formatos y límites de datos generales; actualmente se exige presencia y la sugerencia de teclado numérico no restringe caracteres.
- Definir precarga institucional y campos editables; sustituir catálogos de demostración por contratos confirmados.
- Confirmar el rango de edad de familiares. El equipo interno confirmó (21 de octubre de 2026) que **no** existe una validación entre la edad y la fecha de nacimiento: se capturan por separado.
- Acordar criterio de duplicados y política de eliminación, que hoy pide confirmación y no ofrece deshacer.
- Validar datos procedentes de API, incluyendo fechas y pertenencia a catálogos; las reglas actuales están orientadas a captura en interfaz.

Detalles en [datos generales](flujos/datos-generales.md) y [núcleo familiar](flujos/nucleo-familiar.md).

## Pendientes de ingresos, egresos y adjuntos

Revisión del 14 de octubre de 2026, referencia `78b3e72e6274248af2648ace1e567a5ceb9b2b4d`:

- Confirmar planilla, fórmulas, moneda, decimales, redondeo y límites de montos con el backend.
- Resolver la justificación de egresos registrada en el historial de Figma y validar textos y obligatoriedad de preguntas y respaldo documental.
- Definir tratamiento de cifras desactualizadas y recuperación de errores al refrescar el resumen.
- Integrar documentos recuperables: hoy solo se guardan nombres y la carga es simulada.
- Acordar límites y aviso por exceso de archivos, eliminación, cancelación y limpieza de cargas cuyo formulario se descarta.
- Confirmar validación de archivos en servidor y acceso a documentos por usuario.

Detalles en [ingresos y egresos](flujos/ingresos-y-egresos.md) y [adjuntos](flujos/adjuntos-de-ingresos.md).

## Pendientes de los pasos 4 a 8

Revisión: 14 de octubre de 2026, código `343c313c503bd25c652236b319c6e3874efeb8d4`.

| Bloque | Confirmaciones necesarias |
| --- | --- |
| Inmuebles | Formato de finca, moneda del valor, destino y duplicados. |
| Muebles | Catálogo de marcas, campos según tipo de bien, ayuda de descripción y nombre accesible de tabla. |
| Ahorro | Cuentas incluidas, identificación, titularidad, catálogos y precisión de saldos. |
| Corrientes | Precarga por usuario, fecha de saldos, identificación de montos agregados y prevención de doble contabilización. |
| Créditos | Fechas, relaciones entre importes, duplicados y relación con cuotas declaradas como egresos. |
| Común | Persistencia, identificadores de servidor, validación de catálogos, límites y tratamiento de totales desactualizados. |

Las páginas específicas conservan sus diferencias históricas contra diseño. La revisión visual actual y la corrección del aviso del selector compartido siguen pendientes.

## Pendientes de tarjetas de crédito

Revisión: 20 de octubre de 2026, código `779fd7ad2b39796d3d2466f0ddb9ac44298f9193`.

- Confirmar si el periodo de la tarjeta (el año, con cuatro dígitos) debe limitarse a un rango de años; hoy no se limita.
- Confirmar si «Últimos 4 # de operación» identifica la tarjeta o una operación y si debe evitarse su repetición.
- Acordar reglas de saldo frente a límite, vencimiento, duplicados, moneda de cada columna, catálogos y precisión.
- Decidir si la tabla de once columnas debe ajustarse sin desplazamiento horizontal en 1280 px, como la dibuja el diseño, y completar la revisión en tablet.
- Definir la relación entre las cuotas de tarjetas, las de créditos y las declaradas como egresos del paso 3.
- Cuando exista la API real, unificar los hooks `useSavingsTotals`, `useCreditsTotals` y `useCreditCardsTotals` en uno genérico: hoy repiten la misma lógica de solicitud y descarte de respuestas anteriores.

Detalle en [tarjetas de crédito](flujos/tarjetas-de-credito.md).

## Pendientes de los pasos 10 a 12

Revisión: 27 de octubre de 2026, código `c789b079859bd590e4180cb0ac3ae08fec58b781`.

| Bloque | Confirmaciones necesarias |
| --- | --- |
| Personería jurídica | Formato de la cédula jurídica, unidad del plazo (hoy solo un número), criterio de duplicados. |
| Sociedades (paso 10) | Implementada. Falta el catálogo real de tipos de sociedad (hoy provisional), si el cargo determina qué campos aplican (hoy los nueve son obligatorios), los catálogos de cargo y tipo de poder (hoy texto libre) y la moneda de la dieta y del límite de suma. |
| Datos judiciales | Qué debe escribirse en el detalle de juicios y embargos, si es obligatorio y su longitud; moneda del monto de la pensión. |
| Cuestionario confidencial | Receptor, canal, permisos, momento del envío y acuse (hoy no se envía nada). |
| Juramento y cierre | Evidencia de aceptación, versión del texto, secuencia de finalización, si la declaración queda en solo lectura y la ortografía del texto de la confirmación. |

Detalles en [personería jurídica](flujos/personeria-juridica.md), [sociedades](flujos/sociedades.md), [datos judiciales](flujos/datos-judiciales.md), [cuestionario confidencial](flujos/cuestionario-confidencial.md) y [juramento y cierre](flujos/juramento-y-cierre.md).

## Pendientes de montos y moneda

- Confirmar la moneda de los montos que no tienen selector: ingresos y egresos (hoy se muestran con el ícono del colón por los totales del paso), inmuebles, muebles y la pensión alimenticia (sin ícono). Si alguno necesita selector de moneda, es un cambio local a su diálogo.
- Confirmar reglas de redondeo y precisión (D-10). El frontend guarda los montos como texto decimal con dos decimales.

Detalles en [montos y moneda](flujos/montos-y-moneda.md).

## Deuda técnica de integración

El sistema no se conecta a un backend en este alcance, pero debe quedar preparado: integrar una API debe significar implementar un adaptador, no modificar las pantallas. El [contrato de API](08-contrato-api.md) es la propuesta del frontend. **Estado de la preparación (27 de octubre de 2026):** están implementados, probados y documentados el cliente único con interruptor entre datos simulados y reales, los catálogos pedidos de forma asíncrona, la recuperación ante fallos (reintento de cifras y catálogos, aviso al salir con datos, `401` como sesión vencida) y el mapa de lo simulado. **No** se hicieron, con su justificación en [integración con el backend](09-integracion-con-el-backend.md), las firmas definitivas de los servicios, el guardado por acción en el adaptador ni los adaptadores reales: dependen de contratos que no existen. No incluye soporte para casos que el contrato no fija (versionado, reintentos, formato de errores del servidor).

La siguiente deuda permanece abierta por falta de información; cada punto se cierra cuando se tenga el dato.

| Deuda | Información que falta | Quién la tiene | Qué toca en el código | Referencia |
| --- | --- | --- | --- | --- |
| Autenticación, sesión, bloqueo y vencimiento | Contrato de acceso, política de intentos, duración de la sesión | Backend y seguridad | `AuthService`, `SessionService` | Contrato, sección 3 |
| Versionado y concurrencia de registros | Estrategia (versión, ETag u otra) | Backend | Adaptador de guardado por acción | Contrato, sección 2 |
| Datos precargados | Planilla, cuentas de Grupo Mutual y, tal vez, datos personales; cuáles son de solo lectura | Backend y Talento Humano | `FinancialSummaryService`, `CurrentAccountsService`, paso 1 | Contrato, secciones 5 y 6 |
| Catálogos oficiales | Listas reales y tratamiento de valores retirados | Negocio y backend | `CatalogService` | Contrato, sección 4 |
| Fórmulas y redondeo de los totales | Fórmulas oficiales, redondeo, denominador cero, tratamiento de la planilla | Negocio y backend | Servicios de totales | Contrato, sección 6 |
| Moneda de montos sin selector | Moneda de ingresos y egresos, inmuebles, muebles y pensión | Negocio | `MoneyInput` con `currency={null}` en inmuebles, muebles y pensión | [Montos y moneda](flujos/montos-y-moneda.md) |
| Reglas de validación del servidor | Duplicados, rangos de fechas, formato de cédulas, unidad del plazo, límites reales de campos | Negocio y backend | `fieldLimits.ts`, validaciones de los diálogos | Contrato, sección 9 |
| Cuestionario confidencial | Receptor, canal, permisos, momento del envío y acuse | Negocio y backend | `ConfidentialReportService` | Contrato, sección 8.1 |
| Juramento y finalización | Texto y versión, evidencia de aceptación, secuencia, qué ocurre tras guardar | Negocio y backend | `FinalizationService`, `Completion` | Contrato, sección 8.2 |
| Tabla de sociedades (paso 10) | Catálogo real de tipos de sociedad, reglas por cargo y moneda de dieta y límite de suma | Negocio | `CatalogService`, `validateSociety` | [Sociedades](flujos/sociedades.md) |
| Adjuntos reales | Límite de cantidad por ingreso, limpieza de adjuntos huérfanos, acceso | Backend | `AttachmentService`, `useAttachments` | Contrato, sección 7 |
| Contenido de los detalles judiciales | Qué se escribe en el detalle de juicios y embargos | Negocio | `JudicialData` | [Datos judiciales](flujos/datos-judiciales.md) |

## Transferencia recomendada

`src/sad-aml-shared` es propio de este sistema y se entrega con él, así que la transferencia no exige trasladar cambios de componentes compartidos a otro repositorio. Un orden razonable:

1. Comparar el estado actual del proyecto institucional con esta copia y seleccionar la unidad funcional que se transferirá.
2. Transferir `src/sad-aml-shared` completa (tokens, componentes genéricos con sus pruebas, utilidades y tipos). Es la carpeta que se copia para reutilizar lo construido.
3. Transferir tipos, utilidades, servicios y hooks requeridos, conservando las marcas `[SIMULADO]` e `[INTEGRACION]`.
4. Transferir composiciones, pantallas, rutas y assets asociados.
5. Transferir pruebas y configuración necesaria (incluido `jest.config.ts`, que ya no excluye `sad-aml-shared`); ajustar imports y dependencias conforme al entorno receptor.
6. Retirar el [código de demostración](10-codigo-de-demostracion.md) en los entornos con datos reales.
7. Ejecutar validaciones en destino y actualizar esta documentación con el alcance realmente incorporado.

El registro de equivalencias puede utilizar las columnas: referencia DEC, nombre funcional, archivos locales, archivos en destino, estado de transferencia, fecha y validación. La primera comparación está pendiente: estos documentos no confirman qué cambios ya están en la computadora de Grupo Mutual.

Antes del cierre del proyecto, publicar el contenido revisado en Confluence, entregar la guía de componentes y presentar los pendientes con su responsable y criterio de cierre. Registrar la aceptación de la transferencia por el equipo interno.
