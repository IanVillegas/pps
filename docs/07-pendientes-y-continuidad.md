# Pendientes y continuidad

Estado: recomendaciones iniciales para transferencia. Revisión: 14 de octubre de 2026.

| Prioridad propuesta | Trabajo | Criterio de cierre |
| --- | --- | --- |
| Alta | Completar pasos 9 a 12 y envío final | Contenido, reglas, estados y validaciones acordados e implementados. |
| Alta | Integrar autenticación, persistencia y servicios reales | Contratos confirmados y escenarios de éxito y error verificados. |
| Alta | Confirmar catálogos, cálculos y reglas de negocio | Sustitución de datos sintéticos y supuestos aprobada por el equipo. |
| Alta | Comparar copia local y proyecto institucional | Registro de archivos transferidos, diferencias y validaciones en destino. |
| Media | Revisar comentarios existentes | Texto orientado a mantenimiento humano, conservando contratos y restricciones útiles. |
| Media | Completar fichas de componentes | Propiedades, ejemplos, estados y límites verificados. |
| Media | Consolidar revisión visual y de accesibilidad | Evidencia en escritorio y tablet, teclado, foco y errores. |
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
- Definir validación global y envío final: el último paso tiene «Continuar» deshabilitado y no existe envío en el contenedor actual.
- Confirmar periodicidad y texto de introducción; cerrar el diálogo no representa aceptación formal.
- Definir si se requiere seguimiento de completitud; el indicador actual solo marca la sección visitada.
- Verificar rutas inválidas mediante pruebas específicas de la página: la lectura confirma su redirección, pero las pruebas seleccionadas del contenedor no ejercitan esa ruta.
- Completar revisión visual y de teclado sobre las rutas reales antes de la transferencia.

Detalles en [declaración y borrador](flujos/declaracion-y-borrador.md).

## Pendientes de datos generales y familia

Revisión del 14 de octubre de 2026, referencia `bda881c3316f635e2c0579c040b2dca1395d7f7a`:

- Confirmar formatos y límites de datos generales; actualmente se exige presencia y la sugerencia de teclado numérico no restringe caracteres.
- Definir precarga institucional y campos editables; sustituir catálogos de demostración por contratos confirmados.
- Confirmar rango de edad de familiares y si debe calcularse o contrastarse con la fecha de nacimiento.
- Acordar criterio de duplicados y política de eliminación, actualmente inmediata y sin deshacer.
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

Las páginas específicas conservan sus diferencias históricas contra diseño. La revisión visual actual y la corrección del aviso del selector compartido siguen pendientes. Los pasos 9 a 12 no tienen contenido registrado al corte; no se documentan como funcionalidades terminadas.

## Transferencia recomendada

1. Comparar el estado actual del proyecto institucional con esta copia y seleccionar la unidad funcional que se transferirá.
2. Transferir tokens y cambios de componentes compartidos a su ubicación correspondiente.
3. Transferir tipos, utilidades, servicios y hooks requeridos.
4. Transferir composiciones, pantallas, rutas y assets asociados.
5. Transferir pruebas y configuración necesaria; ajustar imports y dependencias conforme al entorno receptor.
6. Ejecutar validaciones en destino y actualizar esta documentación con el alcance realmente incorporado.

El registro de equivalencias puede utilizar las columnas: referencia DEC, nombre funcional, archivos locales, archivos en destino, estado de transferencia, fecha y validación. La primera comparación está pendiente: estos documentos no confirman qué cambios ya están en la computadora de Grupo Mutual.

Antes del cierre del proyecto, publicar el contenido revisado en Confluence, entregar la guía de componentes y presentar los pendientes con su responsable y criterio de cierre. Registrar la aceptación de la transferencia por el equipo interno.
