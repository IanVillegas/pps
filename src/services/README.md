# Servicios: qué es simulado y qué es punto de integración

Este sistema no tiene backend (D-08). Todo lo que haría una API está **simulado** en esta carpeta, y lo poco que ya está preparado para conectarla está marcado. Las pantallas no hablan con la API: solo con estos servicios y con los hooks de `src/utils/hooks`.

## Cómo reconocer cada cosa en el código

Dos marcas, fáciles de buscar:

```bash
grep -rn "\[SIMULADO\]" src      # lo que se reemplaza o se borra al conectar el backend
grep -rn "\[INTEGRACION\]" src   # lo que ya está preparado para la API real
```

- **`[SIMULADO]`** va en la primera línea de cada servicio de demostración. Ese archivo se reemplaza por su adaptador real o se borra; las pantallas que lo usan no cambian mientras se conserve su contrato (nombres y tipos de lo que exporta).
- **`[INTEGRACION]`** marca el código que *no* se borra: el cliente HTTP, la carga de catálogos y su conexión con la sesión. Es lo que usa la API real.

## Mapa

| Archivo | Qué hace hoy | Al conectar el backend | Contrato (`tasks/DEC-019A-contrato-api.md`) |
| --- | --- | --- | --- |
| `api/apiClient.ts` `[INTEGRACION]` | Cliente HTTP único; con `NEXT_PUBLIC_API_BASE_URL` vacía el sistema usa datos simulados. | **Se conserva.** Es lo que llaman los adaptadores reales. | Sección 2 |
| `CatalogService.ts` | Listas de demostración (`[SIMULADO]`) y carga asíncrona (`[INTEGRACION]`, ya implementada). | Borrar las listas de demostración; la carga ya pide `GET /catalogs/{nombre}`. | Sección 4 |
| `AuthService.ts`, `SessionService.ts` `[SIMULADO]` | Acceso simulado y sesión en memoria. | Reemplazar por el acceso real; un `401` ya cierra la sesión local (`AuthenticatedShell`). | Sección 3 |
| `DeclarationService.ts` `[SIMULADO]` | Borrador en memoria, se pierde al recargar. | Reemplazar por lectura y guardado por acción (cada alta, edición o retiro). | Sección 5 |
| `FinancialSummaryService.ts`, `SavingsTotalsService.ts`, `CurrentAccountsService.ts`, `CreditsTotalsService.ts`, `CreditCardsTotalsService.ts` `[SIMULADO]` | Totales y cifras calculados en el navegador (provisional) y una cuenta de Grupo Mutual de ejemplo. | Reemplazar por la lectura de lo que calcula el backend. Hoy reciben los registros solo porque la simulación los necesita. | Sección 6 |
| `AttachmentService.ts` `[SIMULADO]` | Subida simulada. | Reemplazar por la subida real. | Sección 7 |
| `ConfidentialReportService.ts` `[SIMULADO]` | Respuestas del cuestionario confidencial en memoria, canal separado. | Reemplazar por el envío al canal definido por el negocio. | Sección 8.1 |
| `FinalizationService.ts` `[SIMULADO]` | Guardado final simulado (800 ms; el usuario `cierre.error` simula el fallo). | Reemplazar por la finalización real. | Sección 8.2 |

Lo que **no** es de los servicios y se conserva: `src/utils/hooks/useCatalog.ts` (`[INTEGRACION]`, lectura de catálogos) y los hooks de totales (`useSavingsTotals`, etc.), que ya manejan respuestas lentas, error y reintento.

## Andamio heredado sin uso

`UserService.ts`, `adapters/UserAdapter.ts`, `src/types/HomePage.types.ts`, `src/components/Pages/Dummy/` y los `index.ts` vacíos vienen del arquetipo, no tienen que ver con la declaración y no los usa ninguna pantalla. Se pueden borrar sin consecuencias.

## Por qué no está más avanzado

La justificación de lo que no se hizo (firmas definitivas de los servicios, adaptadores reales, persistencia del borrador) está en `tasks/DEC-019-integracion-y-recuperacion.md`, sección «Lo que no se hizo (y por qué)».
