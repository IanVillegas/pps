# Contexto y alcance

Estado: documentación vigente de la versión revisada. Revisión: 27 de octubre de 2026.

DecPat Cloud proporciona el frontend de declaración patrimonial. El trabajo revisado comprende acceso, inicio informativo, navegación interna y desarrollo progresivo de un formulario de doce pasos. El objetivo de la documentación es permitir que el equipo interno comprenda, integre y continúe las funcionalidades construidas.

La implementación local contiene pantallas para los pasos 1 a 12, incluidas las personerías jurídicas y las sociedades del paso 10. Los servicios actuales simulan autenticación, datos y operaciones; la integración institucional permanece pendiente y está preparada, no realizada (ver [integración con el backend](09-integracion-con-el-backend.md)). El producto contiene además [código de demostración](10-codigo-de-demostracion.md) que debe retirarse antes de usarlo con información real. El alcance y lo que se verificó se resumen en la [entrega](11-entrega.md).

Los dispositivos previstos son computadoras de escritorio, laptops y tablets. Las referencias de revisión son 1366/1440 px y 768 px. Los teléfonos no forman parte del alcance soportado.

## Identificadores de seguimiento DEC

DEC es el prefijo local adoptado para identificar unidades de trabajo de DecPat. No corresponde a un código oficial de Grupo Mutual, un identificador generado por una herramienta institucional ni un requisito funcional.

La estructura es `DEC-NNN`, por ejemplo `DEC-014 Créditos`. El número identifica una unidad de trabajo, no necesariamente un paso del formulario: DEC-014 corresponde al paso 8. Letras como `DEC-009A` distinguen partes de una misma unidad; existen subdivisiones adicionales en el historial. Se conserva el identificador original para mantener la relación con los registros existentes.

El código debe acompañarse de un nombre funcional. Su presencia en documentación permite relacionar alcance, archivos y validaciones. El sistema funciona sin estos códigos en el código fuente. Su incorporación al proyecto institucional puede realizarse gradualmente en un registro de equivalencias; no exige restaurar los comentarios que fueron retirados.

| Referencia local | Unidad de trabajo |
| --- | --- |
| DEC-001 / DEC-002 | Fundaciones visuales y componentes base. |
| DEC-003 / DEC-004 | Acceso y estados de acceso. |
| DEC-005 / DEC-006 | Navegación interna, formulario por pasos y borrador. |
| DEC-007 / DEC-008 | Datos generales y núcleo familiar. |
| DEC-009 | Ingresos, egresos y adjuntos. |
| DEC-010 / DEC-011 | Bienes inmuebles y muebles. |
| DEC-012 / DEC-013 / DEC-014 / DEC-015 | Ahorro, cuentas corrientes, créditos y tarjetas de crédito. |
| DEC-016 / DEC-017 | Personería jurídica y sociedades, y datos judiciales. |
| DEC-018 | Cuestionario confidencial y juramento. |
| DEC-019 | Integración: contrato de API, cliente HTTP, catálogos asíncronos y recuperación ante fallos. |
| DEC-020 | Revisión visual y responsive, regresión y entrega. |

Fuente del registro: [seguimiento de tareas](../tasks/todo.md). La correspondencia con los archivos del proyecto institucional aún debe verificarse durante la transferencia.
