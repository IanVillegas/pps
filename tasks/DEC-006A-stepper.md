# DEC-006A Stepper

Implementada y validada el 2026-09-21. Commit a cargo del usuario.

## Implementacion

- `DeclarationStepper` (`src/components/Molecules/DeclarationStepper/`, nodo Figma "Wizard" 43121:6023 en Paso 2 y 43121:5470 en Paso 3): doce pasos numerados con conectores. Es controlado: recibe `steps`, `currentStep` y `onStepSelect`; no conoce rutas ni datos (eso es DEC-006B).
- **Solo se distingue paso actual vs pendiente. No existe estado "completado"**: la declaracion no es lineal, cualquier paso se puede visitar en cualquier orden, asi que "hecho" no significa nada. Figma si trae un estado "Hecho" (aro con check); se omite a proposito. Por la misma razon todos los pasos son navegables (no hay pasos bloqueados) y `aria-current="step"` marca el actual.
- `Tooltip` (`src/sad-aml-shared/components/Atoms/Tooltip/`): shared no tenia ninguno. Es generico, asi que va en shared (regla de `AGENTS.md`), sobre `@radix-ui/react-tooltip` que ya estaba instalado. Reemplaza el `title` nativo: abre con foco de teclado y con puntero, cierra con Escape, se puede estilizar y se ancla en un portal. Reexportado desde `@/components/Atoms`.
- Cada paso muestra el nombre completo de su seccion en el tooltip. El boton tiene `aria-label="Paso N"` y el tooltip se enlaza como descripcion (`aria-describedby`), para que un lector de pantalla no lea el nombre dos veces.
- Teclado: Tab recorre los pasos; Flechas izquierda/derecha, Inicio y Fin mueven el foco; Enter/Espacio seleccionan. Elegir el paso actual no dispara `onStepSelect`.
- Configuracion: `src/utils/declarationSteps.ts` (`DECLARATION_STEPS`, 12 entradas) y `src/types/DeclarationStep.types.ts`. Los titulos se leyeron directo de Figma (encabezado de cada pantalla).

| Paso | Titulo |
| ---- | ------ |
| 1 | Datos generales |
| 2 | Conformación del núcleo familiar |
| 3 | Ingresos y egresos |
| 4 | Bienes inmuebles |
| 5 | Bienes muebles |
| 6 | Datos económicos |
| 7 | Cuentas corrientes |
| 8 | Créditos que posee |
| 9 | Tarjetas de crédito |
| 10 | Personería jurídica |
| 11 | Datos judiciales |
| 12 | Declaración patrimonial completa |

## Validacion

- `check-types`, `lint` y `test -- --runInBand`: OK (10 suites, 43 pruebas; 6 nuevas del stepper: doce pasos, solo uno con `aria-current`, salto a cualquier paso, el paso actual no se re-selecciona, tooltip por foco de teclado y cierre con Escape, flechas/Inicio/Fin). `build` OK (sin rutas nuevas). `jest.setup.ts` agrega un `ResizeObserver` vacio porque Radix lo necesita y jsdom no lo trae.
- V3 en navegador (montado en una ruta temporal ya eliminada): a 1366px el componente mide 924px y el paso es de 81px, igual que Figma; punto pendiente 12px `#CED4DA`, aro actual 20px y punto interno 12px `#47D1C6`, conectores de 28px, numero Poppins Medium 12px `#6C757D`, todo verificado con `getComputedStyle`. Tooltip abierto por teclado mostrando "Bienes muebles" en el paso 5. A 768px (tablet) no hay desborde: los conectores se encogen hasta ~22px. Sin errores de consola.

## Diferencias contra Figma y pendientes

- Estado "Hecho" de Figma no implementado (ver arriba, decision de alcance).
- Figma no especifica el tooltip; se uso el gris oscuro `gray-500` con texto blanco de 12px y flecha. Confirmar con diseno si hay un estilo oficial.
- El paso 12 se titula en Figma "Declaración patrimonial completa" aunque su contenido es el cuestionario confidencial; se dejo literal. Confirmar el nombre real antes de DEC-018A.
- El paso 1 tiene en Figma otro titulo "Mi declaración" en una composicion superpuesta (D-03); se uso "Datos generales", que es el de la composicion inferior.
- Todavia no esta montado en ninguna pantalla: DEC-006B lo conecta a `/mi-declaracion/[paso]`, decide el paso actual desde la ruta y agrega Regresar/Continuar.

## Archivos y orden de copia

1. Shared: `src/sad-aml-shared/components/Atoms/Tooltip/Tooltip.tsx`, `Tooltip.module.scss`, export en `src/sad-aml-shared/components/Atoms/index.ts`.
2. Tipos y configuracion: `src/types/DeclarationStep.types.ts`, `src/utils/declarationSteps.ts`.
3. Molecula: `src/components/Molecules/DeclarationStepper/DeclarationStepper.tsx`, `.module.scss`, `.test.tsx`; exports en `src/components/Atoms/index.ts` (Tooltip) y `src/components/Molecules/index.ts`.
4. Pruebas: `jest.setup.ts` (`ResizeObserver`).
5. Documentacion: `tasks/todo.md` y este archivo.

Commit sugerido (no ejecutado): `feat(stepper): implementa Stepper de doce pasos no lineal y Tooltip en sad-aml-shared (DEC-006A)`
