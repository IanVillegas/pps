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

## Fichas pendientes de ampliación

Para cada componente ampliado, documentar propósito, ruta, propiedades principales, ejemplo breve, estados, accesibilidad y límites. Evitar copiar interfaces completas que puedan quedar desactualizadas. Los ejemplos deben verificarse contra el contrato vigente.

Fuentes: índices de `src/components/Atoms`, `Molecules` y `Organisms`; `Button.tsx` y `AppDialog.tsx`.
