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

## Transferencia recomendada

1. Comparar el estado actual del proyecto institucional con esta copia y seleccionar la unidad funcional que se transferirá.
2. Transferir tokens y cambios de componentes compartidos a su ubicación correspondiente.
3. Transferir tipos, utilidades, servicios y hooks requeridos.
4. Transferir composiciones, pantallas, rutas y assets asociados.
5. Transferir pruebas y configuración necesaria; ajustar imports y dependencias conforme al entorno receptor.
6. Ejecutar validaciones en destino y actualizar esta documentación con el alcance realmente incorporado.

El registro de equivalencias puede utilizar las columnas: referencia DEC, nombre funcional, archivos locales, archivos en destino, estado de transferencia, fecha y validación. La primera comparación está pendiente: estos documentos no confirman qué cambios ya están en la computadora de Grupo Mutual.

Antes del cierre del proyecto, publicar el contenido revisado en Confluence, entregar la guía de componentes y presentar los pendientes con su responsable y criterio de cierre. Registrar la aceptación de la transferencia por el equipo interno.
