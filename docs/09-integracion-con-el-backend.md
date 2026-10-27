# Integración con el backend y recuperación ante fallos

Estado: preparación del frontend implementada con servicios simulados; la integración real está pendiente de contratos. Revisión: 27 de octubre de 2026.
Código: `c789b079859bd590e4180cb0ac3ae08fec58b781`. Seguimiento: DEC-019A y DEC-019B; documentación: DOC-019.

## Propósito y alcance

El sistema no se conecta a ningún backend en este alcance: no existe un servicio que lo reciba ni un contrato confirmado. Lo que se hizo es **preparar el punto de integración**, de modo que conectar una API consista en implementar adaptadores y no en modificar las pantallas. Esta página describe lo que está preparado, cómo reconocerlo en el código, cómo se comporta el sistema ante fallos y, con su justificación, lo que se decidió no hacer. El [contrato de API](08-contrato-api.md) es la propuesta del frontend de lo que necesita del backend; la [página de código de demostración](10-codigo-de-demostracion.md) lista lo que debe retirarse al integrar.

## Cómo reconocer lo simulado y lo preparado

Todo servicio de demostración lleva `[SIMULADO]` en su primera línea y el código que ya está listo para la API real lleva `[INTEGRACION]`. Ambas marcas son buscables:

```bash
grep -rn "\[SIMULADO\]" src
grep -rn "\[INTEGRACION\]" src
```

`src/services/README.md` mantiene el mapa completo: qué hace hoy cada archivo, qué se hace con él al conectar el backend (reemplazarlo o borrarlo) y a qué sección del contrato corresponde. Un archivo `[SIMULADO]` se reemplaza por su adaptador real conservando lo que exporta (nombres y tipos), de modo que las pantallas que lo usan no cambian. Lo marcado `[INTEGRACION]` no se borra.

| Archivo | Marca | Qué hace hoy | Al conectar el backend |
| --- | --- | --- | --- |
| `src/services/api/apiClient.ts` | `[INTEGRACION]` | Cliente HTTP único. | Se conserva; lo usan los adaptadores reales. |
| `src/services/CatalogService.ts` | `[SIMULADO]` e `[INTEGRACION]` | Listas de demostración y carga asíncrona ya implementada. | Borrar las listas; la carga ya pide los catálogos. |
| `src/utils/hooks/useCatalog.ts` | `[INTEGRACION]` | Lectura de catálogos para las pantallas. | Se conserva. |
| `AuthService`, `SessionService` | `[SIMULADO]` | Acceso simulado y sesión en memoria. | Reemplazar por el acceso real. |
| `DeclarationService` | `[SIMULADO]` | Borrador en memoria. | Reemplazar por lectura y guardado por acción. |
| Servicios de totales (`FinancialSummaryService`, `SavingsTotalsService`, `CurrentAccountsService`, `CreditsTotalsService`, `CreditCardsTotalsService`) | `[SIMULADO]` | Cifras calculadas en el navegador con fórmulas provisionales. | Reemplazar por la lectura de lo que calcula el backend. |
| `AttachmentService` | `[SIMULADO]` | Subida simulada. | Reemplazar por la subida real. |
| `ConfidentialReportService` | `[SIMULADO]` | Respuestas confidenciales en memoria. | Reemplazar por el envío al canal definido. |
| `FinalizationService` | `[SIMULADO]` | Guardado final simulado. | Reemplazar por la finalización real. |

## Cliente HTTP único

`src/services/api/apiClient.ts` es el único lugar que habla con la API real. Ninguna pantalla lo llama; solo los servicios.

- **Interruptor entre datos simulados y reales.** Con `NEXT_PUBLIC_API_BASE_URL` vacía (el valor por defecto) el sistema usa datos simulados y `isMockMode()` devuelve verdadero; al definirla, los adaptadores reales pasan por `apiRequest`. Hoy solo la carga de catálogos usa la API real cuando la variable está definida; los demás servicios siguen simulados.
- **Convenciones del contrato.** JSON, sesión por cookie (`credentials: 'include'`), un cuerpo de error común representado por `ApiError` (con `status`, `code` y `fieldErrors`), `204` sin cuerpo y, ante una falla de red o un `5xx`, el mensaje genérico «La solicitud no fue procesada. Inténtelo de nuevo».
- **Sesión vencida.** Una respuesta `401` llama al manejador registrado con `setUnauthorizedHandler`. `AuthenticatedShell` lo registra para cerrar la sesión local, y su guardia de ruta lleva entonces al acceso. No se agregó un aviso visual de «sesión vencida» porque el diseño no lo dibuja.

## Catálogos asíncronos

`CatalogService` conserva las listas simuladas y agrega un almacén de catálogos (`useSyncExternalStore`, igual que los otros servicios en memoria).

- En modo simulado, los trece catálogos están disponibles desde el primer render y no se hacen llamadas.
- Con la API configurada, `AuthenticatedShell` los pide al abrir sesión (`GET /catalogs/{nombre}`, sección 4 del contrato), en paralelo. Si alguno falla, el almacén conserva los que llegaron, queda en estado `error` y el formulario muestra un aviso con «Reintentar». Cada carga nueva invalida a la anterior, de modo que una respuesta lenta no pisa a una más reciente.
- **Las pantallas no importan las listas**: los diálogos y selectores leen `useCatalog('nombre')`, y las tablas muestran `catalogLabel('nombre', valor)` y llaman a `useCatalogs()` para volver a dibujarse cuando llegan los datos. Pasar de catálogos simulados a reales no modifica ninguna pantalla.

## Recuperación ante fallos

| Situación | Comportamiento |
| --- | --- |
| Falla el pedido de las cifras del backend (pasos 3, 6, 7, 8 y 9) | Se conserva la última cifra recibida, se avisa con una notificación y se muestra un aviso permanente con «Reintentar» (`RetryNotice`). El reintento vuelve a pedirlas aunque los registros no hayan cambiado. Los hooks de totales exponen `retry`. |
| Fallan uno o varios catálogos | Aviso con «Reintentar» sobre el contenido del paso; los catálogos que sí llegaron se conservan. |
| Falla la subida de un adjunto o el guardado final | Ya contaban con estado de error y reintento: ver [adjuntos](flujos/adjuntos-de-ingresos.md) y [juramento y cierre](flujos/juramento-y-cierre.md). |
| Recargar o cerrar la pestaña con datos escritos | La declaración vive solo en memoria y se pierde. Con datos escritos y sin guardado definitivo, el navegador pregunta antes de salir (`beforeunload`); tras el guardado final deja de preguntar. |
| Sesión vencida (`401`) | Se cierra la sesión local y se lleva al acceso. |

Cada alta, edición o retiro de un registro se guarda en el borrador al instante; lo único que no se guarda es lo escrito en un diálogo abierto, que se descarta al cancelar.

## Lo que no se hizo y por qué

La preparación se acotó deliberadamente. Cada decisión de esta sección tiene una causa verificable y una condición para retomarla.

### Firmas definitivas de los servicios y guardado por acción en el adaptador

**Qué es.** El contrato propone que los servicios de totales dejen de recibir los registros (hoy `fetchSavingsTotals(accounts)` y sus equivalentes) y pasen a pedir al backend lo que este ya conoce, y que cada alta, edición o retiro se guarde en el servidor en el momento.

**Por qué no se hizo.** Las firmas dependen de acuerdos que no existen: cómo identifica el backend un registro, cómo versiona los cambios (D-11), qué devuelve exactamente cada operación y qué calcula (D-10). Cambiarlas ahora obliga a reescribir pantallas, hooks y pruebas sobre supuestos que casi con seguridad cambiarán cuando el backend defina su contrato, es decir, se haría el trabajo dos veces. Los totales siguen recibiendo los registros solo porque la simulación necesita calcular con ellos; el adaptador real los ignorará.

**Cuándo retomarlo.** Cuando exista un contrato confirmado de lectura y guardado por registro.

### Adaptadores reales de acceso, borrador, adjuntos, cuestionario confidencial y cierre

**Por qué no se hizo.** Un adaptador sin servidor que lo conteste no puede probarse, y uno escrito contra un contrato supuesto da la falsa impresión de estar integrado. Además cada uno depende de información externa registrada en la [deuda técnica de integración](07-pendientes-y-continuidad.md): política de acceso y bloqueo, receptor y canal del cuestionario confidencial, evidencia de aceptación del juramento y límites de los adjuntos. Se prefirió dejar solo lo que se puede probar hoy: el cliente HTTP y la carga de catálogos, verificados con respuestas simuladas.

**Cuándo retomarlo.** Cuando cada servicio tenga su contrato; el mapa de `src/services/README.md` indica qué archivo reemplazar.

### Persistir el borrador para que sobreviva a una recarga

**Por qué no se hizo.** La decisión vigente es no guardar información patrimonial en el navegador (`localStorage` u otro almacenamiento local), para evitar que otra persona que use el mismo equipo la consulte. La persistencia correcta es la del servidor, que depende del punto anterior. Como mitigación, el navegador advierte antes de salir con datos escritos.

**Cuándo retomarlo.** Al integrar el guardado por acción.

### Confirmar antes de descartar un diálogo con datos escritos

**Por qué no se hizo.** Es una decisión de diseño y comportamiento que Figma no dibuja: no hay modal de «¿Descartar cambios?». Agregarlo sin diseño obligaría a inventar texto y botones, y alteraría la forma en que cancelan todos los diálogos del sistema. Cancelar, la X y Escape descartan lo escrito sin modificar el registro original; este comportamiento está cubierto por pruebas.

**Cuándo retomarlo.** Si el diseño incorpora la confirmación.

### Aviso visual de sesión vencida

**Por qué no se hizo.** Figma no dibuja ese estado. Al recibir un `401` el sistema cierra la sesión y lleva al acceso, que es el comportamiento seguro; un mensaje explicativo requiere diseño y texto aprobados.

### Validación global de la declaración al terminar

**Decisión, no omisión.** El equipo definió que solo el paso 1 bloquea el avance y que después el desplazamiento entre pasos es libre; los campos obligatorios se exigen dentro de cada diálogo. Por eso «Terminar» no exige que los demás pasos estén completos. Ver [declaración y borrador](flujos/declaracion-y-borrador.md).

## Siguientes pasos al integrar

1. Confirmar el contrato por área (acceso, borrador, catálogos, totales, adjuntos, cuestionario confidencial y cierre) a partir de la propuesta y sus preguntas abiertas.
2. Definir `NEXT_PUBLIC_API_BASE_URL` y verificar la carga de catálogos contra el servidor, incluido el estado de error y el reintento.
3. Reemplazar los servicios `[SIMULADO]` uno por uno, conservando sus exportaciones y ajustando sus pruebas.
4. Retirar el [código de demostración](10-codigo-de-demostracion.md).
5. Actualizar esta página y la validación con lo realmente integrado.

Evidencia de las pruebas en [validación](06-validacion-y-calidad.md). Fuentes: `src/services/api/apiClient.ts`, `src/services/CatalogService.ts`, `src/utils/hooks/useCatalog.ts`, `src/components/Templates/AuthenticatedShell/AuthenticatedShell.tsx`, `src/services/README.md` y los hooks de totales.
