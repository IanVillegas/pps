# Guía de componentes

Estado: inventario inicial; las fichas detalladas se ampliarán con el desarrollo. Revisión: 14 de octubre de 2026.

Los componentes genéricos reutilizables se mantienen en `sad-aml-shared`. Las composiciones específicas del flujo patrimonial se mantienen en DecPat. Los índices de Atoms y Molecules permiten importar varios componentes compartidos desde una ubicación estable.

| Componente | Ubicación actual | Uso |
| --- | --- | --- |
| Button | `src/sad-aml-shared/components/Atoms/Button` | Acciones; contempla color, tamaño, estado deshabilitado y carga. |
| InputText | `src/sad-aml-shared/components/Atoms/InputText` | Entrada de texto con etiqueta y estados de error. |
| Checkbox, Tooltip, Textarea | `src/sad-aml-shared/components/Atoms` | Selección, ayuda contextual y texto de varias líneas. |
| Dropdown | `src/sad-aml-shared/components/Molecules/Dropdown` | Selección de opciones de catálogo. |
| Modal | `src/sad-aml-shared/components/Organisms/Modal` | Base de los diálogos. |
| AppDialog | `src/components/Organisms/AppDialog` | Composición estándar de diálogos de DecPat. |
| RecordsTable | `src/components/Organisms/RecordsTable` | Presentación y acciones de registros. |
| NotificationProvider | `src/components/Organisms/Notification` | Contexto de notificaciones y mensajes de resultado. |
| DeclarationStepper | `src/components/Molecules/DeclarationStepper` | Navegación visual de la declaración. |
| FileUpload, RadioGroup | `src/components/Molecules` | Adjuntos y selección única; revisar su posible reutilización al ampliar la biblioteca. |

Este inventario describe la ubicación existente. No afirma que todo componente local sea necesariamente específico del dominio: la clasificación de componentes genéricos existentes debe revisarse antes de ampliar sus funcionalidades.

## Botón

El índice `src/components/Atoms/index.ts` exporta `Button` y `ButtonColor`. Las propiedades relevantes incluyen `text`, `color`, `size`, `disabled`, `spinner` y las propiedades nativas del botón. Definir `type` expresamente dentro de formularios.

```tsx
import { Button, ButtonColor } from '@/components/Atoms';

<Button type="submit" text="Guardar" color={ButtonColor.Cta} />;
```

## Diálogo estándar

`AppDialog` recibe `open`, `onClose`, `size` y `title`; su contenido llega mediante `children` y sus acciones mediante `footer`. La escala actual es `sm` (575 px), `md` (640 px), `lg` (805 px) y `xl` (891 px). Las descripciones accesibles se proporcionan mediante `description` o `srDescription`. El área de contenido y acciones tiene desplazamiento interno.

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
| `CreditCardDialog` | Tarjeta: `CreditCardItemData`; campos en [tarjetas de crédito](flujos/tarjetas-de-credito.md). Código revisado: `779fd7ad2b39796d3d2466f0ddb9ac44298f9193`. |

Todos reciben `open`, `item` opcional, `onSave` y `onClose`; el consumidor administra las filas y sus identificadores. Los tipos viven en `src/types`. Son composiciones de dominio: sus reglas no deben trasladarse sin revisión a formularios genéricos. Los controles base proceden de shared y la tabla de `RecordsTable`.

Los hooks `useSavingsTotals`, `useCurrentAccounts`, `useCreditsTotals` y `useCreditCardsTotals` reciben arreglos de registros y entregan resultados con estado. Mantener estables las referencias cuando los datos no cambian para evitar solicitudes repetidas. Los estados y límites de actualización se describen en [operaciones comunes](flujos/registros-patrimoniales.md).

## Totales por moneda

Referencia revisada: `779fd7ad2b39796d3d2466f0ddb9ac44298f9193`, 20 de octubre de 2026.

`CurrencyTotals`, ubicado en `src/components/Molecules/CurrencyTotals` y exportado desde `@/components/Molecules`, presenta dos columnas (colones y dólares), cada una con su icono, la suma de saldos y la sumatoria de cuotas mensuales. Reciben las propiedades `heading` (título de la sección), `colonesTitle`, `dolaresTitle` y `totals`, con la forma `{ colones: { balance, installments }, dolares: { balance, installments } }`. Mientras `totals` no existe cada cifra muestra «—». El componente solo presenta lo que entrega el servicio: no suma ni convierte.

Lo utilizan los pasos de [créditos](flujos/creditos.md) y [tarjetas de crédito](flujos/tarjetas-de-credito.md). Los totales de [ahorro](flujos/cuentas-de-ahorro.md) y [cuentas corrientes](flujos/cuentas-corrientes.md) tienen otra estructura (un saldo por moneda, sin cuotas) y mantienen su propia presentación.

## Fichas restantes

Para cada componente ampliado, documentar propósito, ruta, propiedades principales, ejemplo breve, estados, accesibilidad y límites. Evitar copiar interfaces completas que puedan quedar desactualizadas. Los ejemplos deben verificarse contra el contrato vigente.

Fuentes: índices de `src/components/Atoms`, `Molecules` y `Organisms`; `Button.tsx` y `AppDialog.tsx`.
