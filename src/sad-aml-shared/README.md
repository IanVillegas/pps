# Shared Project

> **Nota de DecPat (2026-10-27).** En DecPat Cloud esta carpeta es **propia del sistema**: no se jala ni se refresca desde el repositorio de Grupo Mutual y se entrega junto con el resto del código. Quien quiera reutilizar lo construido para DecPat **solo necesita copiar esta carpeta**: todo componente genérico (sin lógica de negocio de DecPat) vive aquí, con sus estilos y sus pruebas junto a cada componente (`*.test.tsx`; Jest ya no excluye esta carpeta).
>
> Agregado por DecPat: `Atoms/Switch`, `Atoms/CurrencyIcon`, `Molecules/MoneyInput`, `Molecules/CurrencySelect`, `Molecules/RadioGroup`, `Molecules/FileUpload`, `Molecules/RetryNotice`, `Organisms/AppDialog`, `Organisms/ConfirmDeleteDialog`, `Organisms/RecordsTable`, `utils/helpers/money.ts` y `types/Attachment.types.ts`. Lo heredado que se modificó está marcado con `!Modificado para DecPat` (`grep -rn "Modificado para DecPat" src/sad-aml-shared`); entre otros, el diseño de la lista del `Dropdown` y `BreadCrumbs` (compatible con App Router).
>
> Lo específico de DecPat (pantallas, diálogos de cada paso, servicios, `CurrencyTotals`, `DeclarationStepper`, `ConfirmSaveDialog`) queda en `src/components`, `src/services` y `src/app`.

Este proyecto `sad-aml-shared` contiene componentes reutilizables, configuraciones y estilos necesarios para los microfrontends de Mutual Connect. Se sigue un enfoque de **microfrontends**, permitiendo que múltiples aplicaciones consuman estos recursos de manera modular.

## 📌 Características

- Componentes compartidos (Ejemplo: botones, formularios, modales)
- Configuraciones comunes utilizadas por otros proyectos
- Estilos globales y temas reutilizables
- Importación mediante **submódulos de Git** para facilitar la integración

## 🚀 Instalación

Para utilizar este proyecto como submódulo en otro repositorio de Git:

```bash
git submodule add https://gitlab.com/grupo-mutual/microfrontends/mutual-connect/sad-aml-shared.git sad-aml-shared
```
