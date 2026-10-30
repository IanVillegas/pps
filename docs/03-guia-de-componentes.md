# Guía de componentes

Estado: inventario vigente; las fichas detalladas se ampliarán con el desarrollo. Revisión: 30 de octubre de 2026. Código: `b4e1cdf61fc6209baf9cffb0e28829c44ec2d8b6`.

Todo componente genérico, sin lógica de negocio de DecPat, vive en `sad-aml-shared`, carpeta propia de este sistema que se entrega con él: quien quiera reutilizar lo construido solo copia esa carpeta. Las composiciones específicas del flujo patrimonial se mantienen en `src/components`. Los índices `@/components/Atoms`, `Molecules` y `Organisms` reexportan los componentes compartidos para que las pantallas importen desde una ubicación estable. Las pruebas de cada componente compartido están junto a él (`*.test.tsx`) y Jest las ejecuta.

### Componentes genéricos (en `sad-aml-shared`)

| Componente | Ubicación | Uso |
| --- | --- | --- |
| Button | `src/sad-aml-shared/components/Atoms/Button` | Acciones; contempla color, tamaño, estado deshabilitado y carga. |
| InputText | `src/sad-aml-shared/components/Atoms/InputText` | Entrada de texto con etiqueta, estados de error y, opcionalmente, un ícono al inicio (`startAdornment`). |
| Checkbox, Tooltip, Textarea | `src/sad-aml-shared/components/Atoms` | Selección, ayuda contextual y texto de varias líneas. |
| Switch | `src/sad-aml-shared/components/Atoms/Switch` | Interruptor Sí/No (`role="switch"`). Se usa en datos judiciales y en el cuestionario confidencial. |
| CurrencyIcon | `src/sad-aml-shared/components/Atoms/CurrencyIcon` | Ícono del colón o del dólar de Figma; decorativo. |
| Dropdown | `src/sad-aml-shared/components/Molecules/Dropdown` | Selección de una opción de una lista, con panel propio (ver más abajo). |
| BreadCrumbs | `src/sad-aml-shared/components/Molecules/BreadCrumbs` | «Regresar» y migas de pan del encabezado. |
| MoneyInput | `src/sad-aml-shared/components/Molecules/MoneyInput` | Campo de monto con formato estándar. Ver [montos y moneda](flujos/montos-y-moneda.md). |
| CurrencySelect | `src/sad-aml-shared/components/Molecules/CurrencySelect` | Selector de moneda con íconos; recibe la lista de monedas por propiedad. |
| RadioGroup | `src/sad-aml-shared/components/Molecules/RadioGroup` | Selección única. |
| FileUpload | `src/sad-aml-shared/components/Molecules/FileUpload` | Selección y tarjetas de archivos adjuntos. |
| RetryNotice | `src/sad-aml-shared/components/Molecules/RetryNotice` | Aviso de una carga fallida con «Reintentar». |
| Modal | `src/sad-aml-shared/components/Organisms/Modal` | Base de los diálogos. |
| AppDialog | `src/sad-aml-shared/components/Organisms/AppDialog` | Composición estándar de diálogos. |
| ConfirmDeleteDialog | `src/sad-aml-shared/components/Organisms/ConfirmDeleteDialog` | Confirmación para eliminar un registro; lo muestra `RecordsTable`. |
| RecordsTable | `src/sad-aml-shared/components/Organisms/RecordsTable` | Presentación y acciones de registros, con variante compacta. |

`MoneyInput` utiliza `src/sad-aml-shared/utils/helpers/money.ts` y `FileUpload` el tipo `src/sad-aml-shared/types/Attachment.types.ts`; ambos viajan con la carpeta.

### Componentes específicos de DecPat (en `src/components`)

| Componente | Ubicación | Uso |
| --- | --- | --- |
| NotificationProvider | `src/components/Organisms/Notification` | Contexto de notificaciones y mensajes de resultado. |
| DeclarationStepper | `src/components/Molecules/DeclarationStepper` | Navegación visual de los doce pasos. |
| CurrencyTotals | `src/components/Molecules/CurrencyTotals` | Totales por moneda de créditos y tarjetas. |
| ConfirmSaveDialog | `src/components/Organisms/ConfirmSaveDialog` | Confirmación del guardado final de la declaración. |
| Diálogos de cada paso | `src/components/Organisms/*Dialog` | Formularios de familiares, ingresos, egresos, bienes, cuentas, créditos, tarjetas, personerías y sociedades. |
| AppShell, AuthenticatedShell | `src/components/Templates` | Estructura de navegación interna y guardia de sesión. |

## Botón

El índice `src/components/Atoms/index.ts` exporta `Button` y `ButtonColor`. Las propiedades relevantes incluyen `text`, `color`, `size`, `disabled`, `spinner` y las propiedades nativas del botón. Definir `type` expresamente dentro de formularios.

```tsx
import { Button, ButtonColor } from '@/components/Atoms';

<Button type="submit" text="Guardar" color={ButtonColor.Cta} />;
```

## Diálogo estándar

`AppDialog` (en `sad-aml-shared`) recibe `open`, `onClose`, `size` y `title`; su contenido llega mediante `children` y sus acciones mediante `footer`. La escala actual es `sm` (575 px), `md` (640 px), `lg` (805 px) y `xl` (891 px). Las descripciones accesibles se proporcionan mediante `description` o `srDescription`. El área de contenido y acciones tiene desplazamiento interno.

Los formularios específicos aportan campos y validación; el contenedor concentra presentación y cierre. Revisar título accesible, foco, teclado y desplazamiento cuando se modifique un diálogo.

## Indicador y contenedor de la declaración

Referencia revisada: `875867890e6e48ce97668b7a0019cc8255a8f3a6`, 14 de octubre de 2026.

`DeclarationStepper` recibe `steps` (lista de números, títulos e iconos), `currentStep` y `onStepSelect`. Informa el paso actual y permite seleccionar cualquiera de los demás; no valida valores ni determina completitud. Las flechas, Home y End mueven el foco; activar un botón selecciona el paso. Puede importarse desde `@/components/Molecules`.

`DeclarationWizard` recibe `stepId` y, opcionalmente, `definitions`. Normalmente utiliza el registro del proyecto. Coordina borrador, introducción y validación al continuar. Su importación es directa desde `src/components/Pages/Declaration/DeclarationWizard/DeclarationWizard.tsx`.

| Propiedad de definición | Uso |
| --- | --- |
| `component` | Contenido que recibe valores, errores y un callback para reemplazar los valores del paso. Si falta, se muestra un mensaje de contenido pendiente. |
| `validate` | Devuelve mensajes por campo. Si falta o devuelve un objeto vacío, el contenedor permite continuar. |
| `cards` | Si es verdadero, el contenido coloca las acciones recibidas dentro de sus tarjetas. |
| `ownActions` | Si es verdadero, el contenido recibe los botones del contenedor en `actions` y decide si y dónde mostrarlos; el contenedor sigue dibujando la tarjeta. Lo usa el último paso. |
| `onFinish` | Acción de «Continuar» en el último paso, que no tiene siguiente. Sin ella, el botón del último paso permanece deshabilitado. |

Los cambios enviados por el contenido deben incluir todos los valores del paso que se necesiten conservar. La navegación mediante el indicador no ejecuta `validate`. Detalle del comportamiento y archivos en [declaración y borrador](flujos/declaracion-y-borrador.md).

## Formulario de familiar

Referencia revisada: `bda881c3316f635e2c0579c040b2dca1395d7f7a`, 14 de octubre de 2026.

`FamilyDialog`, ubicado en `src/components/Organisms/FamilyDialog/FamilyDialog.tsx`, recibe `open`, `member` opcional para edición, `others` para comparar duplicados, `onSave` y `onClose`. El consumidor debe excluir de `others` el registro que está editando. `onSave` entrega datos validados sin identificador; la pantalla asigna o conserva ese identificador y actualiza el borrador.

El formulario mantiene cambios locales hasta guardar y los descarta al cerrar. Su validación es específica de familiares; no reutilizarla como una validación genérica de personas sin revisar sus supuestos. Detalle de campos y límites en [núcleo familiar](flujos/nucleo-familiar.md).

## Formularios económicos y selector de adjuntos

Referencia revisada: `78b3e72e6274248af2648ace1e567a5ceb9b2b4d`, 14 de octubre de 2026.

`IncomeDialog` y `ExpenseDialog`, ubicados en sus carpetas de `src/components/Organisms`, reciben `open`, `item` opcional, `onSave` y `onClose`. Mantienen edición local hasta guardar; entregan datos sin identificador a la pantalla. El primero incorpora justificación y archivos; el segundo solo tipo y monto. Sus reglas se describen en [ingresos y egresos](flujos/ingresos-y-egresos.md).

`FileUpload` se exporta desde `@/components/Molecules` y presenta archivos y acciones; `useAttachments` concentra validación y simulación. Sus propiedades, límites y estados se detallan en [adjuntos](flujos/adjuntos-de-ingresos.md). Antes de reutilizar con otra configuración, revisar textos fijos de tamaño y tipo.

## Diálogos de bienes, cuentas y créditos

Revisión: 14 de octubre de 2026, código `343c313c503bd25c652236b319c6e3874efeb8d4`.

| Componente en `src/components/Organisms` | Responsabilidad y contrato de datos |
| --- | --- |
| `RealEstateDialog` | Propiedad: `RealEstateItemData`; campos en [inmuebles](flujos/bienes-inmuebles.md). |
| `MovableAssetDialog` | Bien mueble: `MovableAssetItemData`; campos en [muebles](flujos/bienes-muebles.md). |
| `SavingsDialog` | Cuenta de ahorro: `SavingsAccountItemData`; campos en [ahorro](flujos/cuentas-de-ahorro.md). |
| `CurrentAccountDialog` | Monto agregado: `CurrentAccountItemData`; campos en [cuentas corrientes](flujos/cuentas-corrientes.md). |
| `CreditDialog` | Préstamo: `CreditItemData`; campos en [créditos](flujos/creditos.md). |
| `LegalEntityDialog` | Personería jurídica: `LegalEntityItemData`; campos en [personería jurídica](flujos/personeria-juridica.md). |
| `CreditCardDialog` | Tarjeta: `CreditCardItemData`; campos en [tarjetas de crédito](flujos/tarjetas-de-credito.md). Código revisado: `779fd7ad2b39796d3d2466f0ddb9ac44298f9193`. |

Todos reciben `open`, `item` opcional, `onSave` y `onClose`; el consumidor administra las filas y sus identificadores. Los tipos viven en `src/types`. Son composiciones de dominio: sus reglas no deben trasladarse sin revisión a formularios genéricos. Los controles base proceden de shared y la tabla de `RecordsTable`.

Los hooks `useSavingsTotals`, `useCurrentAccounts`, `useCreditsTotals` y `useCreditCardsTotals` reciben arreglos de registros y entregan resultados con estado. Mantener estables las referencias cuando los datos no cambian para evitar solicitudes repetidas. Los estados y límites de actualización se describen en [operaciones comunes](flujos/registros-patrimoniales.md).

## Totales por moneda

Referencia revisada: `779fd7ad2b39796d3d2466f0ddb9ac44298f9193`, 20 de octubre de 2026.

`CurrencyTotals`, ubicado en `src/components/Molecules/CurrencyTotals` y exportado desde `@/components/Molecules`, presenta dos columnas (colones y dólares), cada una con su icono, la suma de saldos y la sumatoria de cuotas mensuales. Reciben las propiedades `heading` (título de la sección), `colonesTitle`, `dolaresTitle` y `totals`, con la forma `{ colones: { balance, installments }, dolares: { balance, installments } }`. Mientras `totals` no existe cada cifra muestra «—». El componente solo presenta lo que entrega el servicio: no suma ni convierte.

Lo utilizan los pasos de [créditos](flujos/creditos.md) y [tarjetas de crédito](flujos/tarjetas-de-credito.md). Los totales de [ahorro](flujos/cuentas-de-ahorro.md) y [cuentas corrientes](flujos/cuentas-corrientes.md) tienen otra estructura (un saldo por moneda, sin cuotas) y mantienen su propia presentación.

## Componentes agregados con los pasos 9 a 12 y los ajustes de octubre

Referencia revisada: `17a0ad9f2cdc42bc8c44265dbb4be85bbbc5ada2`, 21 de octubre de 2026.

- **`ConfirmDeleteDialog`** recibe `open`, `onConfirm` y `onClose`. Se compone con `AppDialog` (tamaño `md`): ícono de alerta, la pregunta de confirmación y «Cancelar» / «Sí, eliminar». `RecordsTable` lo monta cuando se le entrega `onDelete` y llama a ese callback solo al confirmar; el resto de las pantallas no necesita cambios.
- **`MoneyInput`** recibe `label`, `value` (texto decimal con dos decimales o vacío), `onChange`, `errors`, `id` y `currency`. `currency` es `'colones'` o `'dolares'` para mostrar su ícono, `undefined` mientras se espera la selección (reserva el espacio) y `null` cuando el monto no tiene moneda (sin ícono ni espacio). Los detalles de entrada están en [montos y moneda](flujos/montos-y-moneda.md).
- **`CurrencySelect`** recibe `label`, `currencies` (la lista de monedas, cada una con `value` y `label`), `value`, `onChange`, `errors` e `id`, y se coloca antes del campo de monto. Quien lo usa obtiene `currencies` del catálogo `currencies` (`useCatalog`). Cada opción lleva su ícono, también la elegida; para ello inserta el texto dentro de `Select.ItemText`, porque `Dropdown` solo lo hace por sí mismo con opciones de texto plano.
- **`Switch`** recibe `checked`, `onChange` y un nombre accesible (`aria-labelledby` o `aria-label`); los textos «No» y «Sí» son opcionales y visuales.
- **`CurrencyTotals`** presenta los totales por moneda de créditos y tarjetas con el mismo `CurrencyIcon`.
- **Cambios en `sad-aml-shared`** marcados como modificaciones para DecPat: `InputText` admite `startAdornment` (ícono decorativo dentro del campo, al inicio) y `Textarea` tiene estilo para `disabled`. `sad-aml-shared` es propio de este sistema: no hay un repositorio al que trasladarlos.
- `RadioGroup` ya no tiene la opción `compact`, que dejó de usarse con el nuevo orden de «Otros detalles».

## Lista de opciones, breadcrumb y componentes agregados el 27 de octubre

Referencia revisada: `c789b079859bd590e4180cb0ac3ae08fec58b781`, 27 de octubre de 2026.

- **`Dropdown`: lista de opciones.** La lista abierta es un panel con el borde y el radio del campo, la sombra de las tarjetas, una separación de 4 px del campo y un ancho igual al del campo. Cada opción mide al menos 40 px, se resalta al pasar el puntero o al navegar con las flechas (`data-highlighted`), la elegida va en negrita con una marca verde y las deshabilitadas se atenúan. El alto máximo es 280 px o el espacio disponible en pantalla, con desplazamiento interno (`isShort` lo reduce a 160 px). Sin opciones muestra «Sin registros» (`labelNoRegister`). El diseño de Figma no dibuja la lista abierta; se definió con los tokens del sistema. Las opciones de texto plano (`string`) muestran su texto; una opción puede entregar un elemento propio (como en `CurrencySelect`, que incluye el ícono dentro de `Select.ItemText`).
- **`BreadCrumbs`** recibe `items` (cada uno con `id`, `label`, `href` y `active`; `active` hace que la miga sea un enlace y la última, la pantalla actual, no lo es) y, opcionalmente, `goBackUrl`. «Regresar» lleva a la miga anterior. Se ajustó para el App Router: usaba `next/router`, propio del Pages Router. `AppShell` lo muestra en el encabezado, a la izquierda, solo dentro de la declaración («Inicio / Mi declaración», nodo de diseño 43121:6538).
- **`RetryNotice`** recibe `message` y `onRetry`. Se anuncia con `role="alert"` y no desaparece solo. Lo usan los totales del backend y las listas de opciones.
- **`RecordsTable`** admite además `dense` (variante compacta para tablas de muchas columnas), `addAriaLabel` (nombre accesible del botón de agregar cuando hay varias tablas en la pantalla) y un ancho mínimo de 480 px (antes 560 px), con el que dejaron de desplazar en tablet (768 px) las tablas de los pasos 2, 3, 4, 7 y 10; las de los pasos 5, 6, 8 y 9 siguen desplazando dentro de la propia tabla.
- **`ConfirmSaveDialog`** recibe `open`, `onConfirm` y `onClose`; se compone con `AppDialog` de tamaño `md`. Ver [juramento y cierre](flujos/juramento-y-cierre.md).
- **`SocietyDialog`** es el diálogo de sociedades; ver [sociedades](flujos/sociedades.md).

## Botón «Agregar nuevo» y tabla vacía

El botón «Agregar nuevo» tiene un diseño distintivo para separarse del contenido de la pantalla (nodo de diseño 43320:2169, «Button secundario activo»): contorno amarillo de 1 px, radio de 10 px, fondo blanco, ícono «+» de 20 px separado 6 px del texto y texto en Work Sans SemiBold de 18 px, gris. Mide alrededor de 189×42 px frente a 191×41 px del diseño. El diseño no dibuja el estado de hover; se resolvió con un tinte suave del mismo amarillo. Lo dibuja `RecordsTable` y aplica a todas las tablas que permiten agregar.

El mensaje «No existen registros» de una tabla vacía tiene el mismo tamaño y espaciado en todas las tablas, también en la variante compacta (`dense`), que solo reduce las filas con datos y los encabezados.

## Fichas restantes

Para cada componente ampliado, documentar propósito, ruta, propiedades principales, ejemplo breve, estados, accesibilidad y límites. Evitar copiar interfaces completas que puedan quedar desactualizadas. Los ejemplos deben verificarse contra el contrato vigente.

Fuentes: índices de `src/components/Atoms`, `Molecules` y `Organisms`, y de `src/sad-aml-shared/components`; `Button.tsx`, `AppDialog.tsx`, `Dropdown.tsx` y `BreadCrumbs.tsx`.
