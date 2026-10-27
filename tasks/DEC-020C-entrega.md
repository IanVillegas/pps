# DEC-020C Entrega: qué se entrega, qué es de demostración y qué sigue

Borrador del documento de entrega, 2026-10-27, sobre el código de `main` (`8efe9b4`). Entrega revisable al 6 de noviembre de 2026. La versión para el cliente se escribe en la rama `documentacion` (`docs/`) a partir de este texto.

## 1. Qué se entrega

Frontend de la Declaración Patrimonial de Grupo Mutual (Next.js, App Router, TypeScript): acceso, inicio, wizard de 12 pasos con sus modales y tablas, juramento y cierre. **No hay backend**: todo lo que haría una API está simulado y la integración está preparada (ver la sección 3 y `src/services/README.md`).

Cómo correrlo:

```bash
npm install
npm run dev          # http://localhost:3004
npm run test         # 64 suites, 452 pruebas
npm run check-types
npm run lint
npm run build
```

Con `NEXT_PUBLIC_API_BASE_URL` vacía (el valor por defecto) el sistema usa datos simulados.

## 2. Código de demostración dentro del producto

> **Importante para quien reciba el sistema.** Esto es código de prueba que está en el código fuente tal como se entrega, no solo en los datos. Ninguno de estos elementos es seguridad ni lógica de negocio real. **Deben borrarse o reemplazarse al conectar el backend.** Se reconocen buscando `[SIMULADO]` (ver `src/services/README.md`).

| Qué es | Dónde | Qué hace | Qué hay que hacer al integrar |
| --- | --- | --- | --- |
| **Acceso sin validación real** | `src/services/AuthService.ts`, `SessionService.ts` | Cualquier usuario y contraseña **no vacíos** inician sesión. No se comprueba nada contra ningún servicio. La sesión vive en memoria y se pierde al recargar. | Reemplazar por el acceso real. No dejar este adaptador en producción. |
| **Usuarios de prueba del acceso** | `AuthService.ts` | `error.demo` simula credenciales incorrectas, `bloqueo.demo` el bloqueo por intentos y `conexion.demo` una falla de conexión. | Borrar; esos estados los decide el servidor. |
| **Usuario de prueba del cierre** | `src/services/FinalizationService.ts` | El usuario `cierre.error` hace fallar el guardado final. | Borrar. |
| **Adjuntos de prueba** | `src/services/AttachmentService.ts` | Un archivo cuyo nombre contiene «error» falla al subir; nada se sube de verdad. | Reemplazar por la subida real. |
| **Botón «Simular error (solo desarrollo)» y parámetro `?demo=error`** | `src/components/Pages/Home/Home.tsx` | El botón aparece solo cuando `NODE_ENV` no es `production`; **el parámetro `/inicio?demo=error` no tiene esa restricción** y muestra el estado de error también en producción. | Borrar el botón, el parámetro y el estado de error de demostración. |
| **Cifras de planilla y totales inventados** | `FinancialSummaryService.ts`, `SavingsTotalsService.ts`, `CurrentAccountsService.ts`, `CreditsTotalsService.ts`, `CreditCardsTotalsService.ts` | Salario bruto y neto de ejemplo y totales calculados en el navegador con fórmulas **provisionales** (no son reglas de negocio). `CurrentAccountsService` trae una cuenta de Grupo Mutual de ejemplo. | El backend calcula y entrega estas cifras (D-10); borrar las fórmulas. |
| **Catálogos inventados** | `src/services/CatalogService.ts` | Listas de ejemplo («Agencia 1 (mock)», «Banco 1 (mock)», tipos de sociedad provisionales…). | Reemplazar por los catálogos oficiales; la carga desde la API ya existe. |
| **Borrador y respuestas en memoria** | `DeclarationService.ts`, `ConfidentialReportService.ts` | Lo que la persona escribe vive solo en memoria y se pierde al recargar. El cuestionario confidencial **no se envía a ningún lado**. | Reemplazar por guardado por acción y por el canal definido por el negocio. |
| **Guardado final simulado** | `FinalizationService.ts` | «Guardar» en el juramento espera 800 ms y dice «Guardado satisfactoriamente»; no se registra firma ni se envía la declaración. | Reemplazar por la finalización real. |

Lo que el usuario final **nunca** debe creer a partir de este sistema: que su declaración quedó registrada, que su información se envió o que su sesión es segura. Hoy no ocurre ninguna de las tres cosas.

## 3. Qué ya está preparado para la integración

Ver `src/services/README.md` (mapa completo) y [DEC-019](DEC-019-integracion-y-recuperacion.md). En corto: cliente HTTP único (`src/services/api/apiClient.ts`) con interruptor simulado/real, catálogos pedidos de forma asíncrona (`GET /catalogs/{nombre}`) con error y reintento, `401` como sesión vencida, y las propuestas de contrato en [DEC-019A](DEC-019A-contrato-api.md). Lo que no se hizo, y por qué, está en DEC-019 («Lo que no se hizo»).

## 4. `sad-aml-shared` es propio de este sistema

`src/sad-aml-shared` deja de ser una librería que Grupo Mutual refresca o que otros proyectos jalan: **es parte de este sistema** y se entrega con él. Por eso:

- Sus modificaciones no son un riesgo de traspaso: no hay que llevarlas a ningún otro repositorio. Están marcadas como `!Modificado para DecPat` (búsqueda: `grep -rn "Modificado para DecPat" src/sad-aml-shared`) y las agregadas para el botón, colores y tipografías están en `AGENTS.md`.
- **Todo componente genérico vive en `sad-aml-shared`** (2026-10-27), siguiendo el estándar de desarrollo de Grupo Mutual. Quien quiera reutilizar lo construido para DecPat **solo copia esa carpeta**. Se movieron ahí, con sus estilos y sus pruebas: `Switch`, `CurrencyIcon`, `MoneyInput` (con `utils/helpers/money.ts`), `CurrencySelect` (recibe la lista de monedas por propiedad), `RadioGroup`, `FileUpload` (con `types/Attachment.types.ts`), `RetryNotice`, `AppDialog`, `ConfirmDeleteDialog` y `RecordsTable`. Las pantallas siguen importando desde los barriles `@/components/Atoms`, `Molecules` y `Organisms`, que ahora reexportan de shared.
- Jest ya no excluye `src/sad-aml-shared`: las pruebas de lo movido corren con las del resto.
- Se rediseñó la lista del `Dropdown` (panel con borde, sombra, opciones de 40 px, marca en la elegida y resaltado por teclado) y se agregó el breadcrumb de Figma (nodo 43121:6538) con el `BreadCrumbs` de shared, que se corrigió para el App Router.
- Lo específico de DecPat queda en `src/components`: `CurrencyTotals`, `DeclarationStepper`, `ConfirmSaveDialog`, los diálogos de cada paso, los pasos, `AppShell` y `AuthenticatedShell`.

## 5. Dudas de negocio abiertas

D-20 (rango del año de la tarjeta), D-21 (unidad del plazo y formato de la cédula jurídica), D-23 (contenido del detalle judicial y moneda de la pensión), D-28 (catálogo de tipos de sociedad, reglas por cargo y moneda de dieta y límite) y la lista de «Deuda técnica de integración» de [`todo.md`](todo.md). Ninguna bloquea el uso del sistema simulado.

## 6. Qué se verificó y qué no

Verificado: `tsc` y `eslint` sin errores, 64 suites y 452 pruebas, `next build` compila, recorrido login-cierre en el navegador y medición de desbordes a 1440, 1366 y 768 px ([DEC-020](DEC-020-visual-y-regresion.md)).

**No** verificado: auditoría de accesibilidad completa (lector de pantalla, contraste), comparación píxel a píxel contra Figma, recorrido completo solo con teclado, Edge y Firefox, teléfonos (fuera de alcance). El modal de confirmación y otros textos conservan faltas de ortografía que vienen de Figma («podran», «sera»), por confirmar con el negocio.

## 7. Pendiente de la rama `documentacion`

Fusionar `main` y escribir en `docs/`: sociedades, modal de confirmación, tabla compacta, bloqueo del paso 1 (D-29), paso 3 (D-27), cliente HTTP, catálogos, recuperación, revisión responsive y, con su justificación completa, **lo que no se hizo de DEC-019**. La sección 2 de este documento va también a `docs/` con el mismo nivel de claridad.
