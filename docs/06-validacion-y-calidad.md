# Validación y calidad

Estado: evidencia histórica identificada; revisión documental inicial. Revisión: 14 de octubre de 2026.

El proyecto dispone de pruebas de componentes, servicios y hooks. Las pruebas alojadas bajo `src/sad-aml-shared` están excluidas de Jest según el README; algunos componentes compartidos se prueban desde DecPat. No asumir cobertura completa de la biblioteca.

| Evidencia | Origen y alcance |
| --- | --- |
| Tipos, lint y 282 pruebas satisfactorias | Reportado en `tasks/DEC-014-creditos.md`, 13 de octubre de 2026. Resultado histórico, no reejecutado para esta documentación. |
| Revisión de pantalla y modal de créditos en navegador | Reportada en el mismo registro, con alta de crédito, notificación y totales por moneda. |
| Aviso del selector compartido en pruebas | El registro de créditos menciona transición de no controlado a controlado; requiere revisión antes del cierre. |

Para futuros registros, indicar fecha, versión revisada, comando o escenario, resultado y limitaciones. Verificar tipos y pruebas según el cambio; compilar cuando afecte rutas, pantallas o estilos globales. La revisión visual debe cubrir escritorio y tablet, navegación por teclado, errores y estados vacíos o de carga.

Antes de la entrega, ejecutar las validaciones sobre la versión consolidada y conservar el resultado real. Confirmar que el comando de lint configurado es compatible con el entorno; no declarar éxito por la sola existencia del script.

La elaboración de estas páginas no valida nuevamente el funcionamiento, la accesibilidad completa ni la seguridad del sistema. La evidencia final debe corresponder al contenido efectivamente entregado.
