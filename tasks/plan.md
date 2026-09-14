# Plan de desarrollo de DecPat Cloud

Fecha: 2026-09-10. Preparacion DEC-000.

Fuentes: [diagnostico](preparacion-tecnica-visual.md) y [tareas verificables](todo.md).
Objetivo: del 10 de septiembre al 6 de noviembre de 2026. Hito funcional al 31 de octubre; como cae sabado, proponer demostracion el viernes 30.

## Alcance

Frontend del declarante: acceso y errores, inicio y ayuda, shell, wizard de doce pasos, captura, edicion, adjuntos, calculos acordados, apartado confidencial separado, juramento y estados de envio. Trabajar con datos sinteticos hasta disponer de contratos. La integracion real depende de API, permisos y reglas; shared no sustituye esas dependencias.

Reportes, consulta administrativa de declaraciones, mantenimientos, backend, despliegue corporativo y firma digital requieren una estimacion aparte. En la pagina revisada solo hay entradas de menu para esos modulos administrativos, sin pantallas completas ni reglas verificadas.

## Capacidad

Conteo inclusivo de lunes a viernes, sin descontar feriados, ausencias ni reuniones:

| Fin         | Dias calendario | Lunes-viernes | Capacidad a 4-5 h/dia |
| ----------- | --------------- | ------------- | --------------------- |
| 31 octubre  | 52              | 37            | 148-185 h             |
| 6 noviembre | 58              | 42            | 168-210 h             |

Se corrige el conteo previo de 39/44 dias laborables. Dedicacion supuesta: 20-25 horas por semana completa. No equivale a horas realizadas; descontar otras obligaciones de la capacidad nominal.

Presupuesto objetivo: 190 h, con 170 h de tareas y 20 h de estabilizacion/reserva. Cabe en 210 h nominales. Con 168 h hay un deficit de 22 h: reducir alcance o mover una entrega. No inflar horas para cubrir dos meses; aprovechar avances tempranos para pruebas, accesibilidad, revision con usuarios y documentacion reales.

| Bloque                         | Horas objetivo |
| ------------------------------ | -------------- |
| DEC-000 Preparacion            | 10             |
| DEC-001 Fundaciones            | 10             |
| DEC-002 Componentes base       | 16             |
| DEC-003/004 Login y estados    | 12             |
| DEC-005 Shell e inicio         | 10             |
| DEC-006 Wizard                 | 10             |
| DEC-007 Paso 1                 | 6              |
| DEC-008 Paso 2                 | 7              |
| DEC-009 Paso 3 y adjuntos      | 16             |
| DEC-010 Paso 4                 | 6              |
| DEC-011 Paso 5                 | 6              |
| DEC-012 Paso 6                 | 6              |
| DEC-013 Paso 7                 | 5              |
| DEC-014 Paso 8                 | 7              |
| DEC-015 Paso 9                 | 7              |
| DEC-016 Paso 10                | 10             |
| DEC-017 Paso 11                | 5              |
| DEC-018 Paso 12 y cierre       | 10             |
| DEC-019 Integracion            | 11             |
| DEC-020 Estabilizacion/reserva | 20             |
| Total                          | 190            |

Son presupuestos iniciales, no garantia ni bitacora. Suponen asistencia durante el desarrollo, reutilizacion de patrones y respuestas oportunas a D-01 a D-15. Reestimar al terminar login y el primer paso con tabla/modal; no esperar al final para corregir desviaciones.

## Cronograma

Corregido el 2026-09-14 para calzar con las quincenas del cronograma de control (`Alcance_avance_intermedio_corregido.xlsx`). La version anterior dejaba DEC-006/007 (wizard y paso 1) para la semana del 28 de septiembre, un desfase de varios dias contra el compromiso de esa hoja para el 25/09 ("login, inicio informativo y acceso al paso 1 con validaciones"). Este ajuste adelanta esas tareas a costa de recargar la primera quincena.

| Periodo                 | Entrega                                                                          | Horas |
| ----------------------- | --------------------------------------------------------------------------------- | ----- |
| 10-13 septiembre        | DEC-000: inventario, brechas, contratos y backlog                                 | 10    |
| 14-25 septiembre        | DEC-001, DEC-002A-D, DEC-003/004, DEC-005, DEC-006, DEC-007: kit esencial, acceso, inicio y paso 1 | ~59   |
| 28 septiembre-9 octubre | DEC-002E/F (diferidas), DEC-008/009/010/011: familia, ingresos, adjuntos e inmuebles | ~40   |
| 12-23 octubre           | DEC-012/013/014/015/016A: ahorro, cuentas, creditos, tarjetas e inicio de sociedades | 30    |
| 26-30 octubre           | DEC-016B/017/018/019A: cierre de sociedades, judiciales, confidencialidad y recorrido integrado | 26    |
| 2-6 noviembre           | DEC-019B/020: recuperacion, regresion, responsive, evidencia y entrega            | 25    |

No se programa trabajo obligatorio en fines de semana. El hito funcional no promete integracion empresarial si no se dispone de API.

### Riesgo de la quincena 14-25 septiembre

La capacidad nominal de dos semanas es 40-50 h (ver tabla de capacidad); el contenido movido a esa quincena suma ~59 h. Para intentar cumplir el 25/09:

- Diferir DEC-002E (Notificaciones) y DEC-002F (Tabla editable) a la quincena siguiente: `todo.md` ya los deja sin dependientes antes de DEC-008B, asi que no hay retrabajo.
- Trabajar en el extremo alto de la dedicacion supuesta (25 h/semana) durante estas dos semanas.
- Recortar el alcance de V3 en esta quincena a los viewports 1366 y 360 (no los cuatro completos); registrar la revision completa como pendiente para DEC-020A.
- Simplificar DEC-004 al caso de credenciales incorrectas; dejar el contador de bloqueo por exceso de intentos con una version minima y revisarlo en estabilizacion si el tiempo no alcanza.

Las quincenas de 12-23 y 26-30 de octubre quedan con holgura (30 y 26 h contra un presupuesto de 40 h cada una) precisamente para absorber lo que no se alcance a compensar aqui. Si al 22/09 DEC-006/007 no ha iniciado, registrar el pendiente y trasladarlo a la quincena siguiente sin sumar sus horas otra vez, igual que se hizo con ARQ.

## Arquitectura prevista

1. Conservar App Router y SCSS Modules. Definir basePath en DEC-001; rutas propuestas sin prefijo: /, /inicio y /mi-declaracion/[paso].
2. Seguir AGENTS recibido: componentes autosuficientes en src/components, shared como referencia auditada. Registrar cualquier decision posterior de depender directamente de shared.
3. Formularios por paso con React Hook Form y esquemas tipados; wizard programatico con configuracion y estado de borrador, sin generar todo el dominio desde configuracion opaca.
4. Servicios y adaptadores separados para autenticacion, catalogos, borrador, adjuntos y envio. Mocks sinteticos identificables; no activar endpoints empresariales por defecto.
5. Definir precision, redondeo y formulas antes de los calculos; totales CRC/USD separados. No convertir sin tipo de cambio acordado.
6. Apartado confidencial con estado, payload y persistencia separados; confirmar receptor/permisos antes de cualquier envio real. No guardar patrimonio real en localStorage.
7. Dialogos, campos y tabla compartidos entre pasos; extraer patrones cuando haya repeticion comprobada.

## Hitos

- Kit: tokens y estados default/focus/disabled/error/loading revisados.
- Acceso: exito/error/bloqueo simulados, ayuda y salida; no atribuir seguridad real al mock.
- Primer recorrido: datos personales, alta/edicion familiar, regreso sin perdida, teclado y pantalla estrecha.
- Financieros: adjuntos, tablas y calculos con casos limite y reglas acordadas.
- 30/31 octubre: recorrido 1-12 y cierre demostrable; API y mocks diferenciados; sin defectos que impidan completar el flujo.
- 6 noviembre: regresion, responsive, diferencias Figma y documentacion de traspaso.

## Dependencias y checkpoints

Durante septiembre definir autenticacion, catalogos, precarga y adjuntos. Resolver tarjetas antes de DEC-015 y confidencialidad antes de DEC-018. Las dudas concretas estan en D-01 a D-15 del diagnostico. Los checkpoints de todo.md verifican cada dos o tres tareas. Si falta API, describir entrega como frontend con simulacion, no sistema integrado.

Orden de traspaso: assets/tokens, controles, composiciones, tipos/servicios requeridos por cada pantalla, paginas/rutas, pruebas y documentos. Copiar tareas funcionales completas y revisar imports/basePath en destino. Este plan no autoriza operaciones sobre repositorios empresariales.

## Cierre DEC-000

Se documentaron inventario, plan y tareas, con linea base validada. No se implementaron pantallas ni cambiaron configuraciones. Commit sugerido, sin ejecutar: `docs(planificacion): documenta preparacion tecnica y visual de DecPat`.
