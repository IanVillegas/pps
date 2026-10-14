# Documentación de DecPat Cloud

Versión de trabajo. Fecha de corte: 14 de octubre de 2026.

Esta documentación prepara la transferencia del trabajo al equipo interno y atiende los entregables de documentación técnica, guía de componentes y recomendaciones de continuidad. Describe la copia local revisada; no certifica el contenido del repositorio institucional ni una entrega a producción.

| Documento | Contenido |
| --- | --- |
| [Contexto y alcance](01-alcance-y-contexto.md) | Propósito, alcance actual y seguimiento del trabajo. |
| [Arquitectura](02-arquitectura-y-estructura.md) | Organización del frontend, configuración y servicios. |
| [Guía de componentes](03-guia-de-componentes.md) | Inventario inicial y criterios de uso. |
| [Flujos](04-flujos-implementados.md) | Funcionalidades disponibles y límites de la demostración. |
| [Decisiones](05-decisiones-tecnicas.md) | Criterios que orientan el mantenimiento. |
| [Validación](06-validacion-y-calidad.md) | Evidencia disponible y verificaciones de entrega. |
| [Continuidad](07-pendientes-y-continuidad.md) | Trabajo pendiente y orden de transferencia. |
| [Reglas editoriales](reglas-documentacion.md) | Actualización, lenguaje y publicación en Confluence. |

Los registros de [tasks](../tasks/todo.md) conservan el historial de implementación. Las páginas de esta carpeta presentan el estado vigente con lenguaje orientado al equipo receptor. No se requiere duplicar todo el historial por tarea.

Los primeros bloques detallados son [acceso al sistema](flujos/acceso-al-sistema.md) y [navegación interna e inicio](flujos/navegacion-interna.md). Para Confluence pueden publicarse como páginas hijas de «Flujos implementados». Cada bloque registra el commit revisado para facilitar su actualización después de incorporar cambios de `main`.

También se documentó [navegación de la declaración y gestión del borrador](flujos/declaracion-y-borrador.md), incluyendo el contrato para incorporar nuevas secciones. El detalle de los campos y reglas de cada paso se ampliará progresivamente.

Para Confluence se propone una página principal «DecPat Cloud — documentación técnica» con las siete páginas de contenido como hijas. Antes de publicar, revisar enlaces, ejemplos, pendientes y correspondencia con la versión efectivamente transferida. Las rutas relativas de Markdown deberán convertirse en enlaces de Confluence o referencias al repositorio institucional.
