# Reglas de documentación

## Audiencia y redacción

El contenido se dirige al equipo interno que mantendrá el sistema. Utilizar español formal, frases directas y términos técnicos acompañados de su propósito. Explicar qué hace una funcionalidad, cómo se utiliza, por qué existe una restricción y qué necesita continuidad. Incluir código únicamente cuando facilite el uso o la integración.

Evitar instrucciones dirigidas a asistentes, relatos de conversaciones, referencias a prompts y expresiones personales. Una decisión vigente debe describirse por su justificación y consecuencia, sin narrar los intentos anteriores de implementación.

## Estado y evidencia

Cada página debe indicar su estado cuando corresponda y su fecha de revisión. Distinguir funcionalidad implementada con servicios simulados, integración pendiente y comportamiento confirmado por el equipo. No presentar datos sintéticos como información institucional ni reglas provisionales como requisitos aprobados.

Los bloques revisados en detalle deben registrar el commit de referencia del código. Después de incorporar cambios de `main`, revisar el diff de las áreas documentadas respecto a esa referencia, actualizar las páginas afectadas y renovar su fecha y referencia cuando se haya verificado el contenido. Una página sin cambios funcionales también puede conservar su referencia anterior hasta la siguiente revisión.

Para afirmar un comportamiento, verificar el código y registrar su ubicación. Para afirmar una validación, indicar fecha, comando o procedimiento, resultado y origen de la evidencia. Los resultados históricos deben identificarse como tales; no equivalen a una ejecución actual. Cuando no exista evidencia suficiente, escribir «pendiente de confirmar».

## Actualización durante el desarrollo

Al cerrar una tarea:

1. Actualizar alcance y flujos si cambia una funcionalidad visible.
2. Actualizar la guía cuando se agrega un componente o cambia su contrato de uso.
3. Registrar decisiones relevantes, diferencias visuales y supuestos pendientes.
4. Registrar validaciones ejecutadas y mantener los pendientes de continuidad.
5. Comprobar enlaces, ejemplos y coherencia entre documentación y código.

Los códigos DEC se utilizan en registros de seguimiento, conforme a su definición en [alcance](01-alcance-y-contexto.md). En títulos publicados debe aparecer primero un nombre funcional comprensible. No insertar códigos en comentarios, nombres de variables o interfaz solo para generar trazabilidad.

## Comentarios en el código

Los comentarios existentes se revisarán gradualmente en las áreas modificadas y mediante una revisión específica antes de la transferencia. Conservar los que expliquen contratos, restricciones, supuestos, accesibilidad o comportamientos que no resulten evidentes al leer el código. Eliminar o reformular instrucciones para asistentes, referencias a conversaciones y narraciones del proceso de trabajo.

Ejemplo adecuado: «El borrador se elimina al cerrar sesión para evitar que otro usuario del equipo consulte sus datos». Una referencia como «agregar aquí la próxima tarea DEC» pertenece al registro de trabajo, no al código publicado.

No agregar comentarios por rutina ni reescribir masivamente el código durante una tarea documental. No eliminar explicaciones útiles solo porque contengan una referencia de seguimiento: conservar el motivo técnico al reformularlas.

## Preparación del cierre

Antes de publicar en Confluence, fijar la versión entregada, actualizar la fecha de corte y comprobar el contenido contra el proyecto institucional. Revisar los pendientes con el equipo receptor y registrar responsable y prioridad cuando estén acordados. Consolidar estas páginas como documento técnico final, manteniendo la guía y continuidad como secciones identificables. La publicación y aceptación de la entrega requieren su propia confirmación; crear Markdown no acredita ese cierre.
