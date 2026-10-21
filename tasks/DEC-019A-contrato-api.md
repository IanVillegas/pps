# Contrato de API del frontend de la Declaración Patrimonial

Estado: **propuesta del frontend, sin backend que la implemente** (D-08). Revisión: 21 de octubre de 2026. Primera entrega de DEC-019A (plan B: contrato escrito ahora; cliente único con interruptor mock/real y catálogos asíncronos, la semana del 26 de octubre).

Este documento describe lo que el frontend necesita del backend, tomado del código actual (`src/services`, `src/types`) y de las decisiones registradas en [preparación técnica](preparacion-tecnica-visual.md). Quien implemente la API puede ajustarlo; cualquier cambio se refleja en un único adaptador del frontend, sin tocar las pantallas. Lo que no está confirmado por el negocio se marca **(por confirmar)**.

## 1. Decisiones que ya condicionan el contrato

| Decisión | Consecuencia para la API |
| --- | --- |
| D-10 | **El backend calcula** todos los totales, saldos, razones y la planilla. El frontend solo los muestra: no suma, no redondea ni convierte monedas. |
| D-11 | **Guardado por acción**: cada alta, edición o retiro de un registro se guarda en el momento (no hay un «guardar todo» al final). |
| D-09 | Los catálogos los entrega el backend; los actuales son datos de demostración. |
| D-12 | El cuestionario confidencial del paso 12 viaja por un **canal separado** y no se almacena con la declaración patrimonial. |
| D-13 | El juramento y la finalización se confirman con una **respuesta del servidor**; el frontend nunca declara éxito antes. |
| D-16 | Las tablas pueden quedar vacías; no existe una regla de «al menos un registro». |
| Adjuntos | Solo **PDF**, máximo **5 MB** por archivo (confirmado). |

## 2. Convenciones

- **Formato**: JSON UTF-8. Nombres de campo en inglés y en `camelCase`, como en los tipos del frontend. Textos de interfaz y mensajes de error en español.
- **Identificadores**: texto (`string`), asignados por el servidor al crear un registro. El frontend hoy genera ids locales; con la API usará los del servidor.
- **Montos**: **texto decimal con dos decimales** (`"1234.56"`), nunca número flotante. Máximo 15 dígitos incluidos los centavos (hasta `9999999999999.99`). No hay negativos. Cero es válido (`"0.00"`). Los montos de totales que devuelve el backend pueden ser números (`1897.45`) porque solo se muestran.
- **Moneda**: `"colones"` o `"dolares"` (valores del catálogo `currencies`). No se convierten ni se suman entre monedas.
- **Fechas**: `YYYY-MM-DD`, sin hora ni zona. El frontend las presenta como `DD/MM/AAAA`.
- **Textos libres**: llegan sin espacios al inicio ni al final. Longitudes máximas en la sección 9.
- **Autenticación**: por definir **(D-08)**; el contrato supone que toda llamada, salvo el acceso, requiere sesión válida (cookie o token).
- **Concurrencia**: por definir **(D-11)**; se propone un campo `version` por registro y la respuesta `409` cuando se edita una versión vieja.
- **Errores** (cuerpo común):
  ```json
  { "code": "validation_error", "message": "Texto para mostrar", "errors": { "campo": "Mensaje" } }
  ```
  `400`/`422` validación (el backend **debe validar** aunque el frontend ya lo haga), `401` sin sesión o sesión vencida, `403` sin permiso, `404` no existe, `409` conflicto de versión o declaración ya enviada, `5xx` falla del servicio. El frontend muestra «La solicitud no fue procesada. Inténtelo de nuevo» ante cualquier falla de red o `5xx`.

## 3. Acceso y sesión

Frontend actual: `AuthService.login`, `SessionService`, `UserService`.

| Operación | Entrada | Respuesta |
| --- | --- | --- |
| `POST /auth/login` | `{ username, password }` | `200 { user: { username, displayName } }`; `401` credenciales inválidas; `423 { retryAt }` bloqueo temporal (hoy 5 minutos, simulado); `503` servicio no disponible. |
| `POST /auth/logout` | — | `204`. Invalida la sesión; el frontend borra el estado local. |
| `GET /me` | — | `{ username, displayName }` (se usa en el saludo y el menú). |

Por confirmar: conteo de intentos fallidos y bloqueo en servidor, vencimiento de sesión, política de contraseñas y si «Recordar mi usuario» sigue siendo local (hoy guarda solo el nombre de usuario).

## 4. Catálogos

Frontend actual: constantes de `CatalogService`. Se pedirán de forma asíncrona.

`GET /catalogs/{name}` → `[ { "value": "texto-estable", "label": "Texto a mostrar" } ]`, ordenado como debe verse.

Catálogos usados: `marital-status`, `agencies`, `relationships` (parentesco familiar), `genders`, `real-estate-destinations`, `movable-asset-types`, `movable-asset-brands`, `income-types`, `expense-types`, `account-relationships`, `currencies` (`colones`, `dolares`), `financial-entities`. El valor `value` se guarda en los registros; si un valor deja de existir, el backend debe seguir devolviéndolo al leer registros antiguos **(por confirmar)**.

## 5. Declaración: datos que el usuario captura

Cada área se guarda por acción (D-11). Los registros se exponen como colecciones; la lectura devuelve la lista completa.

### 5.1 Datos que no son tabla

| Recurso | Paso | Campos |
| --- | --- | --- |
| `GET/PUT /declaration/personal-data` | 1 | `fullName`, `idNumber`, `age` (dígitos), `maritalStatus` (catálogo), `lastAcademicDegree`, `career`, `homePhone`, `agency` (catálogo), `cellPhone`, `office`, `address`. Los once son obligatorios. **(por confirmar)** si algunos vienen precargados y de solo lectura. |
| `GET/PUT /declaration/financial-notes` | 3 | `financialSituation` (`estable` \| `dificil` \| `grave`), `situationDetail` (opcional), `patrimonialChanges` (`si` \| `no`), `patrimonialChangesDetail` (opcional; solo con `si`). Las dos preguntas son obligatorias. |
| `GET/PUT /declaration/judicial-data` | 11 | `penal`, `civil`, `embargoes`, `alimony` (booleanos; ausente equivale a `false`); `penalDetail`, `civilDetail`, `embargoesDetail` (opcionales, solo con su booleano en `true`); `alimonyTo` y `alimonyAmount` (obligatorios solo con `alimony: true`). Al pasar un booleano a `false`, el backend descarta sus campos. |

### 5.2 Colecciones (tablas)

Operaciones comunes de cada colección: `GET /declaration/{colección}`, `POST` (devuelve el registro con su `id`), `PUT /declaration/{colección}/{id}` y `DELETE /declaration/{colección}/{id}` (`204`). Todos los campos listados son obligatorios salvo que se indique lo contrario.

| Colección | Paso | Campos del registro |
| --- | --- | --- |
| `family-members` | 2 | `fullName`, `age` (dígitos), `relationship` (catálogo), `gender` (catálogo), `birthDate` (fecha). El frontend avisa de duplicados (mismo nombre y fecha de nacimiento); el backend debe decidir si los rechaza **(por confirmar)**. No se valida la edad contra la fecha (D-19). |
| `additional-incomes` | 3 | `type` (catálogo `income-types`), `amount`, `justification`, `attachmentIds` (lista de ids de adjuntos, opcional). Se asume que los montos de este paso están en colones **(por confirmar)**. |
| `expenses` | 3 | `type` (catálogo `expense-types`), `amount` (colones, por confirmar). El tipo `cuotas-creditos` identifica las cuotas de créditos para la razón cuota-ingreso. |
| `real-estate` | 4 | `fincaNumber`, `location`, `marketValue`, `destination` (catálogo), `acquisitionForm`. **Moneda del valor sin definir (por confirmar).** |
| `movable-assets` | 5 | `type` (catálogo), `brand` (catálogo), `plate`, `year` (cuatro dígitos; sin rango definido), `marketValue`, `description`, `observation`. **Moneda del valor sin definir (por confirmar).** |
| `savings-accounts` | 6 | `accountNumber`, `holderName`, `relationship` (catálogo `account-relationships`), `amount`, `currency`, `entity` (catálogo). |
| `current-accounts` | 7 | `entity` (catálogo), `balance`, `currency`. Son las cuentas que **agrega** la persona. |
| `credits` | 8 | `entity`, `loanType` (texto), `initialAmount`, `currentBalance`, `installment`, `loanNumber` (texto), `currency`, `endDate` (fecha; puede ser futura o pasada, sin rango). |
| `credit-cards` | 9 | `period` (**año**, cuatro dígitos, D-20), `entity`, `currency` (moneda de la tarjeta), `expiryDate` (fecha), `limit` (en la moneda de la tarjeta), `lastFour` (cuatro dígitos exactos), `balanceColones`, `installmentColones`, `balanceDollars`, `installmentDollars` (cada tarjeta puede tener saldo y cuota en ambas monedas; `"0.00"` si no aplica). |
| `legal-entities` | 10 | `name`, `legalId` (cédula jurídica, sin formato definido), `purpose`, `term` (**número**, dígitos; la unidad no está definida, D-21). |
| `companies` | 10 | **Pendiente**: la información que maneja la tabla de sociedades aún no se define (D-22, DEC-016B). |

## 6. Datos que calcula y entrega el backend (solo lectura)

Todos se piden **después de cada alta, edición o retiro** de las colecciones de las que dependen; el frontend conserva el último valor si una petición falla. No reciben cuerpo: el backend calcula con lo que tiene guardado.

| Recurso | Pasos | Respuesta | Frontend actual |
| --- | --- | --- | --- |
| `GET /declaration/financial-summary` | 3 | `{ grossSalary, netSalary, totalExpenses, monthlyBalance, expenseToIncomeRatio, creditPaymentToIncomeRatio }` (números; razones en porcentaje con dos decimales). `grossSalary` y `netSalary` son la **planilla** (precarga, solo lectura). | `FinancialSummaryService` |
| `GET /declaration/savings-accounts/totals` | 6 | `{ colones, dolares }` (saldo total de cada moneda). | `SavingsTotalsService` |
| `GET /declaration/current-accounts/group` | 7 | Cuentas corrientes **de Grupo Mutual** de la persona (solo lectura): `[ { id, accountNumber, holderName, relationship, balance, currency, entity } ]`. | `CurrentAccountsService` |
| `GET /declaration/current-accounts/totals` | 7 | `{ colones, dolares }`: suma las cuentas de Grupo Mutual y las agregadas, cada moneda por separado. | `CurrentAccountsService` |
| `GET /declaration/credits/totals` | 8 | `{ colones: { balance, installments }, dolares: { balance, installments } }`: suma de saldos y de cuotas por moneda. | `CreditsTotalsService` |
| `GET /declaration/credit-cards/totals` | 9 | Igual que los créditos: las columnas de colones se suman entre sí y las de dólares entre sí. | `CreditCardsTotalsService` |

Las fórmulas actuales del frontend son **provisionales**, pensadas solo para que la pantalla tenga algo que mostrar: suma simple por moneda; las razones gasto-ingreso y cuota-ingreso como porcentaje del ingreso total (salario neto de la planilla más los ingresos adicionales), y el saldo mensual como ese ingreso total menos los egresos. Redondeo, denominador cero y tratamiento de la planilla por confirmar (D-10).

## 7. Adjuntos (paso 3)

Frontend actual: `AttachmentService.uploadAttachment`, `useAttachments`. Solo PDF, hasta 5 MB.

| Operación | Entrada | Respuesta |
| --- | --- | --- |
| `POST /attachments` | `multipart/form-data` con `file`. | `201 { id, name }`. Rechazo `415` (no es PDF) o `413` (más de 5 MB). El backend debe validar el contenido, no solo la extensión. El frontend usa los eventos de progreso de la carga para su barra. |
| `GET /attachments/{id}` | — | El PDF (descarga y vista previa). |
| `DELETE /attachments/{id}` | — | `204`. Retira un adjunto aún no asociado o de un ingreso. |

Un adjunto subido se asocia a un ingreso al guardarlo, con su id en `attachmentIds`. Por confirmar: límite de cantidad de archivos por ingreso (hoy un máximo simbólico en el frontend), limpieza de adjuntos huérfanos cuando se descarta el modal y acceso restringido a la persona dueña.

## 8. Cuestionario confidencial y finalización (paso 12)

### 8.1 Cuestionario confidencial (D-12)

Frontend actual: `ConfidentialReportService` (estado separado del borrador; `buildConfidentialPayload`).

`POST /confidential-reports`
```json
{
  "answers": [
    { "questionId": "lifestyle", "answer": "no" },
    { "questionId": "vacations", "answer": "si", "detail": "Texto opcional" }
  ]
}
```
Siempre llegan las ocho preguntas, en este orden: `lifestyle`, `vacations`, `debts`, `ownBusiness`, `afterHours`, `absences`, `blocksClients`, `suspicious`. `detail` solo viaja con `answer: "si"` y si la persona escribió algo (máximo 1000 caracteres). **No se almacena con la declaración patrimonial** y solo debe llegar a la Dirección de Desarrollo Humano.

Por confirmar: **receptor, canal, permisos y momento del envío** (con la finalización o por separado), y qué recibe la persona como acuse. Ningún dato patrimonial debe viajar en esta petición.

### 8.2 Juramento y finalización (D-13)

Frontend actual: `FinalizationService` con los estados `idle → oath → sending → done | error`.

`POST /declaration/submit`
- Entrada: `{ oathVersion }` (identificador del texto de juramento mostrado). La fecha y hora de aceptación las asigna el **servidor**.
- Respuesta `200`: `{ submittedAt, receiptId? }`. `409` si la declaración ya fue enviada. `422` con `errors` si falta algo que el backend exija.
- Debe ser **idempotente**: repetir la llamada con la declaración ya enviada devuelve el mismo resultado, no una segunda declaración.

Por confirmar: texto vigente y su versionado (hoy el de «Grupo Mutual»), evidencia de aceptación, secuencia (si se guarda como borrador antes de enviar), qué ocurre tras guardar (hay un modal posterior que aún no está diseñado) y si la declaración enviada queda en solo lectura.

## 9. Límites de campos del frontend

Valores **simbólicos** (D-17) de `src/utils/fieldLimits.ts`; el backend define los reales y el frontend los reemplaza en un solo lugar.

| Campo | Máximo |
| --- | --- |
| Usuario / contraseña | 60 / 100 |
| Nombre y apellidos, grado, carrera, oficina, titular, nombre de personería | 120 |
| Cédula, cédula jurídica | 20 |
| Edad | 3 dígitos |
| Teléfonos | 20 |
| Dirección, justificación de ingreso, observación | 500 |
| Número de finca, número de cuenta o préstamo | 30 |
| Ubicación, descripción de mueble, objetivo de personería | 200 |
| Forma de adquisición, tipo de préstamo | 60 |
| Montos | 15 dígitos incluidos centavos |
| Plazo de personería | 4 dígitos |
| Detalles judiciales | 300 |
| Descripción de situación y de cambios patrimoniales, detalle de denuncia | 1000 |

## 10. Correspondencia con el frontend actual

| Servicio actual | Qué simula | Pasará a |
| --- | --- | --- |
| `AuthService`, `SessionService`, `UserService` | Acceso, sesión en memoria y usuario de ejemplo. | Sección 3. |
| `DeclarationService` | Borrador en memoria, sin persistencia. | Sección 5 (guardado por acción) y lectura al abrir cada paso. |
| `CatalogService` | Constantes. | Sección 4, asíncronos. |
| `FinancialSummaryService`, `SavingsTotalsService`, `CurrentAccountsService`, `CreditsTotalsService`, `CreditCardsTotalsService` | Totales calculados en el navegador (provisional) y una cuenta de Grupo Mutual de ejemplo. | Sección 6; dejan de recibir los registros como parámetro y leen lo guardado. |
| `AttachmentService` | Subida simulada con progreso y fallo si el nombre contiene «error». | Sección 7. |
| `ConfidentialReportService` | Estado local y armado del payload. | Sección 8.1. |
| `FinalizationService` | Guardado simulado con 800 ms y fallo para el usuario `cierre.error`. | Sección 8.2. |

## 11. Preguntas para el backend y el negocio

1. Autenticación, sesión, bloqueo por intentos y vencimiento (D-08).
2. Versionado y concurrencia de los registros (D-11): ¿`version`, `ETag` u otra estrategia?
3. Datos precargados: planilla, cuentas de Grupo Mutual y, tal vez, los datos personales; cuáles son de solo lectura.
4. Catálogos oficiales y qué pasa con valores retirados.
5. Moneda de los montos sin selector: ingresos y egresos (¿colones?), inmuebles, muebles y la pensión alimenticia.
6. Reglas de validación del servidor: duplicados (familia, cuentas, créditos), rangos de fechas, formato de cédulas, unidad del plazo.
7. Fórmulas, redondeo y manejo del denominador cero en los totales y las razones (D-10).
8. Cuestionario confidencial: receptor, canal, permisos, momento y acuse (D-12).
9. Juramento: texto, versión, evidencia de aceptación y secuencia de finalización (D-13).
10. Tabla de sociedades del paso 10 (D-22).
11. Qué sucede con la declaración tras el envío: solo lectura, nueva versión anual, recibo.

Fuentes: `src/services`, `src/types`, `src/utils/fieldLimits.ts` y `tasks/preparacion-tecnica-visual.md`.
