# Tareas verificables de DecPat Cloud

Base: [plan y presupuesto](plan.md), [inventario Figma y decisiones](preparacion-tecnica-visual.md).
IDs alineados con AGENTS: DEC-004 estados de login, DEC-005 shell, DEC-006 wizard, DEC-007+ pasos. Los sufijos dividen tareas conservando su identidad.

## Estado actual (actualizado 2026-09-21)

- Ultima tarea implementada y validada: `DEC-006B Borrador` (2026-09-21), junto con su subtarea `006B2` (modal inicial). Cierre en [DEC-006B](DEC-006B-borrador.md): ruta `/mi-declaracion/[paso]` (paso invalido redirige al 1), borrador en memoria que se borra al cerrar sesion, Regresar/Continuar con validacion solo en Continuar, contrato `{ component, validate }` por paso (DEC-007 registra el primero). Antes cerro `DEC-006A Stepper` ([DEC-006A](DEC-006A-stepper.md)). El usuario realiza los commits.
- `DEC-005B Inicio y ayuda`: cerrada 2026-09-18, ver [DEC-005B](DEC-005B-inicio-ayuda.md) (tarjetas de Inicio, modal de ayuda, error recuperable via `/inicio?demo=error` y boton de solo desarrollo).
- `DEC-005A Shell interno`: cerrada 2026-09-17, ver [DEC-005A](DEC-005A-shell.md). Queda un hallazgo abierto para revisar antes de copiar al repo real: cambio disruptivo de props en los componentes compartidos (`Header`, `SideBar`, `ProfileNavigation`, `DashboardLayout`).
- Siguiente tarea sugerida: `DEC-002C2 Select` (bloquea a DEC-007) y despues `DEC-007 Personales`, que registra el paso 1 en `stepDefinitions.tsx`. Antes de DEC-007 conviene cerrar D-03 (composicion del paso 1) y los catalogos/obligatoriedad de sus campos. La autenticacion sigue simulada hasta disponer de contrato backend (D-08).
- Pixelado de `LoginWave3`/logo: **cerrado 2026-09-16**. Confirmado como comportamiento de Chrome en Windows a 125% de escala de pantalla (DPR fraccionario), no un defecto de codigo — el fix de `drop-shadow` en `LoginWave3.tsx` se mantiene como mejora real, pero no era la causa completa. Detalle en el cierre de DEC-003 mas abajo ("Investigacion de pixelado persistente").
- Texto tapado por `LoginWave3`: correccion base registrada en `ce4799a`. DEC-003A agrega ajustes para tablet compacta (481-1100px), conservando la curva y las proporciones de las ondas rojas.
- `DEC-002C2 Select` sigue diferida (tabla "Acceso y navegacion", antes de DEC-007), no iniciada; solo hace falta antes de `DEC-007`.
- Antes de asumir este estado como verdad absoluta, correr `git status`/`git log -5` para confirmar que nadie avanzo por fuera de esta nota.

## Preparacion

- [x] DEC-000: repositorio y Figma revisados; inventario, brechas, linea base, cronograma y backlog documentados.

## Verificacion comun

- V1: `npm run check-types`, `npm run lint` y pruebas relevantes de comportamiento con `npm run test -- --runInBand`.
- V2: V1 y `npm run build` al cambiar rutas, paginas o estilos globales.
- V3: comparacion con nodo Figma del inventario, teclado y viewports 768/1366/1440 (escritorio y tablet). **Actualizado 2026-09-16**: el sistema es solo para laptop/escritorio/tablet, no telefonos (ver `AGENTS.md`); ya no se valida 360px como viewport objetivo. Registrar adaptaciones cuando no haya diseno responsive.
- V4: recorrido con datos sinteticos, fallo de servicio/reintento y prevencion de duplicados; adaptador real desactivado mientras no haya contrato.

Cada tarea debe registrar archivos reales, validaciones, diferencias Figma, orden de copia y commit sugerido. Areas indicadas abajo son propuestas, no archivos ya existentes. Tamano S: 1-2 archivos; M: 3-5. Crear componente, estilos, pruebas y export segun necesidad; si excede cinco archivos funcionales, dividir en una subtarea antes de implementar. Las horas por bloque estan en plan.md y no son horas realizadas.

## Fundaciones

| Tarea                           | Aceptacion                                                                                                  | Dependencias | Areas previstas                                                                            | Tamano / checks |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------ | --------------- |
| [x] DEC-001A Tokens y assets    | Fuentes y colores trazables a GM; assets 2026 identificados; diferencias de marca registradas               | DEC-000      | src/styles, src/assets                                                                     | M; V1,V3        |
| [x] DEC-001B Base de aplicacion | Metadata y estructura DecPat; basePath decidido; README y ejemplo de entorno coherentes                     | 001A         | src/app/layout.tsx, next.config.js, README.md, .env.local.example, package.json | M; V2           |
| [x] DEC-002A Boton              | Variantes CTA/secundario, disabled y loading; foco visible (variante icono retirada: ningun caso confirmado la necesita) | 001A         | sad-aml-shared/components/Atoms/Button (ColorEnum.Cta), src/components/Atoms/index.ts      | S; V1,V3        |

### Checkpoint C1

- [ ] Tipos y build pasan; marca y tokens revisados antes de extender el kit.

| Tarea                          | Aceptacion                                                                                          | Dependencias | Areas previstas                                                     | Tamano / checks |
| ------------------------------ | --------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------- | --------------- |
| [x] DEC-002B Campo de texto    | Label/error asociados, ref y atributos nativos; required/disabled/error visibles                    | 001A         | sad-aml-shared/components/Atoms/InputText (corregido)                | M; V1,V3        |
| [x] DEC-002C Checkbox          | Nombre accesible, teclado, estado controlado y error visible                                        | 002B         | sad-aml-shared/components/Atoms/Checkbox (nuevo)                     | S; V1,V3        |
| [x] DEC-002D Dialogo           | Apertura controlada, foco inicial y retorno, Escape, scroll y footer accesible                      | 002A         | sad-aml-shared/components/Organisms/Modal (corregido)                | M; V1,V3        |

`DEC-002C` originalmente era "Checkbox y select" en una sola tarea. Se separo (2026-09-14): `sad-aml-shared/Dropdown` (Select) tiene un bug real (`key={randomKey(...)}` genera una key con `Math.random()` en cada render, React destruye y recrea las opciones en vez de reconciliarlas) y no expone `error` ni hace `...rest`, asi que no es ajustable desde afuera — necesita componente propio, mas grande que Checkbox. Login solo necesita el checkbox de "recordar usuario"; el select lo necesita recien `DEC-007` (estado civil, grado academico, etc.), asi que se movio como `DEC-002C2` justo antes de esa tarea, sin frenar Login.

### Checkpoint C2

- [ ] Formulario minimo usable con teclado; dialogos no ocultan botones en viewport estrecho.

| Tarea                       | Aceptacion                                                                                     | Dependencias | Areas previstas                                                           | Tamano / checks |
| --------------------------- | ---------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------- | --------------- |
| [x] DEC-003 Login base      | Usuario/contrasena, mostrar/ocultar, recordar solo usuario y exito mock; campos validados      | 002B,002C    | src/components/Pages/Login, src/services/AuthService.ts, src/app/page.tsx | M; V2,V3        |

DEC-002E (Notificaciones) y DEC-002F (Tabla editable) se mueven a la quincena de DEC-008 (ver plan.md, Cronograma): ningun bloque hasta DEC-007 depende de ellas, y adelantar login/inicio/paso 1 es lo que exige el 25/09 del cronograma de control. Se retoman antes de DEC-008B, que si las necesita.

### Checkpoint C3

- [ ] Revisar esfuerzo real del kit y login; reestimar si excede presupuesto. Labels comprobados; toast y tabla se validan en la quincena de DEC-008.

## Acceso y navegacion

| Tarea                         | Aceptacion                                                                                                          | Dependencias | Areas previstas                                                                          | Tamano / checks |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------- | --------------- |
| [x] DEC-004 Estados de acceso | Credenciales incorrectas y exceso de intentos; contador por vencimiento; conservar usuario y evitar doble solicitud | 003,002D     | src/components/Organisms/LoginFeedback, src/components/Pages/Login                       | M; V1,V3        |
| [x] DEC-005A Shell            | Header/sidebar DecPat, datos por props, submenu y logout; App Router sin rutas heredadas                            | 003,001B     | src/components/Templates/AppShell, src/types/Session.types.ts, src/app/inicio/layout.tsx | M; V2,V3        |
| [x] DEC-005B Inicio y ayuda   | Bienvenida y contacto configurable; estado error recuperable; no activar modulos administrativos sin alcance        | 005A,002D    | src/components/Pages/Home, src/components/Organisms/HelpDialog, src/app/inicio/page.tsx  | M; V2,V3        |

### Checkpoint C4

- [x] Entrar, fallar, abrir ayuda y salir funciona; distinguir autenticacion simulada de real. Verificado 2026-09-18 al cerrar DEC-005B: login (exito/error/bloqueo), shell, modal de ayuda y logout probados en navegador; autenticacion sigue marcada como simulada (D-08 abierto) en toda la documentacion.

| Tarea                  | Aceptacion                                                                                                        | Dependencias | Areas previstas                                                                                                                               | Tamano / checks |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| [x] DEC-006A Stepper   | Doce pasos configurados, solo actual/pendiente (flujo no lineal, sin "completo"), tooltip con el nombre de la seccion y navegacion por teclado; no replicar doce pantallas estaticas | 005A         | src/components/Molecules/DeclarationStepper, src/types/DeclarationStep.types.ts, src/utils/declarationSteps.ts, sad-aml-shared/components/Atoms/Tooltip | M; V1,V3        |
| [x] DEC-006B Borrador  | Siguiente/anterior conserva datos y valida paso; modal inicial; paso fuera de rango controlado                    | 006A,002D    | src/app/mi-declaracion/[paso]/page.tsx, src/utils/hooks/useDeclaration.ts, src/services/DeclarationService.ts, src/types/Declaration.types.ts | M; V2,V4        |
| [ ] DEC-002C2 Select   | Nombre accesible, teclado, seleccion controlada y error; corrige el bug de keys aleatorias (`Math.random()`) de `sad-aml-shared/Dropdown`, que no es ajustable desde afuera | 002C         | src/components/Molecules/SelectField                                                                                                          | M; V1,V3        |
| [ ] DEC-007 Personales | Una composicion D-03; once campos (estado civil, grado academico, agencia y oficina son select), obligatoriedad/editabilidad acordadas; ida/vuelta sin perdida | 006B,002C2   | src/components/Pages/Declaration/PersonalData, src/types/PersonalData.types.ts                                                                | M; V1,V3        |

### Checkpoint C5 (objetivo 25/09, ver plan.md)

- [ ] Primer paso conectado al wizard; errores impiden avanzar y estado se conserva. Contratos de catalogos revisados.

## Captura y calculos

| Tarea                            | Aceptacion                                                                            | Dependencias       | Areas previstas                                                                              | Tamano / checks |
| -------------------------------- | ------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------- | --------------- |
| [ ] DEC-002E Notificaciones      | Exito/error legibles, anuncio y cierre; textos propuestos identificados; autocierre controlado | 002A       | src/components/Organisms/Notification                                                        | M; V1,V3        |
| [ ] DEC-002F Tabla editable      | Filas con IDs estables, acciones accesibles y vacio; scroll sin romper pagina         | 002A                | src/components/Organisms/RecordsTable                                                        | M; V1,V3        |
| [ ] DEC-008A Fecha               | Valor tipado, DD/MM/YYYY, fecha invalida y limites; nombre accesible                  | 002B               | src/components/Molecules/DateField                                                           | M; V1,V3        |
| [ ] DEC-008B Familia             | Alta/edicion/retiro sin duplicados; edad/fecha coherentes; cancelar no altera fila    | 007,008A,002D,002F | src/components/Pages/Declaration/Family, src/components/Organisms/FamilyDialog               | M; V1,V3,V4     |
| [ ] DEC-009A Planilla y calculos | Neto/bruto y modelo numerico; formulas D-10 documentadas y probadas con cero/redondeo | 008B               | src/components/Pages/Declaration/Income, src/utils/financialCalculations.ts, prueba asociada | M; V1,V3        |

### Checkpoint C6

- [ ] Agregar/editar familiar y navegar funciona. Recalibrar esfuerzo de tablas; formulas acordadas antes de reutilizarlas.

| Tarea                          | Aceptacion                                                                                                              | Dependencias   | Areas previstas                                                        | Tamano / checks |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------- | --------------- |
| [ ] DEC-009B Adjuntos          | Seleccionar/arrastrar y retirar PDF; estados invalido/pendiente/error; seleccionado no equivale a subido; D-05 definida | 002B           | src/components/Molecules/FileUpload, src/services/AttachmentService.ts | M; V1,V3,V4     |
| [ ] DEC-009C Ingreso adicional | Tipo/monto/justificacion y adjuntos integrados; cancelar conserva fila original y error conserva formulario             | 009A,009B,002D | src/components/Organisms/IncomeDialog, pagina Income                   | M; V1,V3        |
| [ ] DEC-009D Egresos           | Registros, modal informativo y situacion financiera; saldo/ratios se actualizan segun D-10                              | 009C           | src/components/Pages/Declaration/Expenses, src/types/Expenses.types.ts | M; V1,V3        |

### Checkpoint C7

- [ ] Paso 3 completo, adjuntos sinteticos y calculos con casos limite; no se presenta carga local como transferencia real.

| Tarea                 | Aceptacion                                                                                 | Dependencias | Areas previstas                                                                             | Tamano / checks |
| --------------------- | ------------------------------------------------------------------------------------------ | ------------ | ------------------------------------------------------------------------------------------- | --------------- |
| [ ] DEC-010 Inmuebles | Tabla y formulario de finca/ubicacion/adquisicion/destino/valor; vacio y validacion        | 009D,002F    | src/components/Pages/Declaration/RealEstate, src/components/Organisms/RealEstateDialog      | M; V1,V3        |
| [ ] DEC-011 Muebles   | Tipo/marca/placa/ano/valor/observacion; D-06 resuelta; cancelar sin perdida                | 010          | src/components/Pages/Declaration/MovableAssets, src/components/Organisms/MovableAssetDialog | M; V1,V3        |
| [ ] DEC-012 Ahorro    | Titular/relacion/cuenta/entidad/monto y acciones segun contrato; totales CRC/USD separados | 011,009A     | src/components/Pages/Declaration/Savings, src/components/Organisms/SavingsDialog            | M; V1,V3        |

### Checkpoint C8

- [ ] Tablas y acciones usables con teclado; sin mezcla de monedas ni precargas falsas.

| Tarea                  | Aceptacion                                                                                        | Dependencias | Areas previstas                                                                                 | Tamano / checks |
| ---------------------- | ------------------------------------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------- | --------------- |
| [ ] DEC-013 Corrientes | Diferenciar datos GM y altas; vacio, edicion y totales; borde de revision D-15 resuelto           | 012          | src/components/Pages/Declaration/CurrentAccounts, src/components/Organisms/CurrentAccountDialog | M; V1,V3        |
| [ ] DEC-014 Creditos   | Operacion/tipo/inicial/cuota/saldo/conclusion; sumatorias por moneda y fechas validas             | 013,008A     | src/components/Pages/Declaration/Loans, src/components/Organisms/LoanDialog                     | M; V1,V3        |
| [ ] DEC-015 Tarjetas   | D-04 resuelta; ultimos cuatro digitos/periodo/limite/vencimiento/cuotas/saldos; resumen coherente | 014          | src/components/Pages/Declaration/CreditCards, src/components/Organisms/CreditCardDialog         | M; V1,V3        |

### Checkpoint C9

- [ ] Creditos y tarjetas con totales esperados y vacios; etiquetas duplicadas resueltas con evidencia.

## Condicionales y cierre

| Tarea                    | Aceptacion                                                                                                  | Dependencias | Areas previstas                                                                            | Tamano / checks |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------ | --------------- |
| [ ] DEC-016A Personerias | Alta/edicion/retiro de cedula/nombre/plazo/objetivo; vacio con accion                                       | 015          | src/components/Pages/Declaration/LegalEntities, src/components/Organisms/LegalEntityDialog | M; V1,V3        |
| [ ] DEC-016B Sociedades  | Cargo controla porcentaje/dietas/poder/limite segun contrato; modal largo usable y sin validaciones ocultas | 016A         | src/components/Organisms/CompanyDialog, src/types/Company.types.ts, pagina LegalEntities   | M; V1,V3        |
| [ ] DEC-017 Judiciales   | Penal/civil/embargos/pension y campos condicionales; requeridos solo cuando aplica                          | 016B         | src/components/Pages/Declaration/JudicialData, src/components/Atoms/SwitchField            | M; V1,V3        |

### Checkpoint C10

- [ ] Cambiar respuestas condicionales no deja validaciones bloqueantes ni datos incompatibles segun reglas acordadas.

| Tarea                     | Aceptacion                                                                                             | Dependencias       | Areas previstas                                                                                                 | Tamano / checks   |
| ------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------ | --------------------------------------------------------------------------------------------------------------- | ----------------- |
| [ ] DEC-018A Confidencial | Variantes del paso 12; payload y estado separados; prueba demuestra exclusion del borrador patrimonial | 017, D-12 definida | src/components/Pages/Declaration/ConfidentialReport, src/services/ConfidentialReportService.ts, tipos asociados | M; V1,V3,V4       |
| [ ] DEC-018B Juramento    | D-13 definida; pendiente/error/exito dependen de servicio; envio repetido controlado y texto vigente   | 018A               | src/components/Pages/Declaration/Completion, src/services/DeclarationService.ts                                 | M; V2,V3,V4       |
| [ ] DEC-019A Integracion  | Login-12-cierre; adaptador real solo con contrato; documentar lo simulado y evidencia de recorrido     | 018B               | src/services, src/types, pruebas de integracion                                                                 | M por lote; V2,V4 |

### Checkpoint C11

- [ ] Respuestas confidenciales fuera del payload patrimonial; finalizacion no declara exito antes de respuesta confirmada.

| Tarea                            | Aceptacion                                                                                                            | Dependencias | Areas previstas                                                 | Tamano / checks   |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------- | ----------------- |
| [ ] DEC-019B Recuperacion        | Fallo de carga/guardado/adjunto con reintento; salida con cambios y expiracion segun contrato; sin perdida silenciosa | 019A         | src/utils/hooks/useDeclaration.ts, feedback y pruebas del flujo | M; V1,V4          |
| [ ] DEC-020A Visual y responsive | Diferencias Figma registradas y defectos operativos corregidos en 768/1366/1440 (sin telefonos, ver AGENTS.md)                                   | 019B         | Pantallas afectadas, hasta cinco archivos por lote              | M por lote; V2,V3 |
| [ ] DEC-020B Regresion           | Recorrido feliz/errores, teclado/foco, adjuntos/calculos; usar reserva en defectos, no funciones nuevas               | 020A         | Pruebas y modulos afectados                                     | M por lote; V2,V4 |

### Checkpoint C12: hito funcional 30/31 octubre y estabilizacion

- [ ] Al cerrar DEC-019B: demostracion completa, pendientes clasificados y presupuesto revisado; no presentar mocks como API real.
- [ ] Al cerrar DEC-020B: validaciones registradas y defectos materiales resueltos o pendientes explicitos.

| Tarea                | Aceptacion                                                                                      | Dependencias | Areas previstas                                               | Tamano / checks           |
| -------------------- | ----------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------- | ------------------------- |
| [ ] DEC-020C Entrega | Evidencia, configuracion, pendientes y orden de copia por DEC; entrega revisable al 6 noviembre | 020B         | README.md, tasks/plan.md, tasks/todo.md, documento de entrega | M; lectura y consistencia |

Cada D-xx se cierra con fecha, decision, origen de confirmacion y tareas afectadas. No marcar resuelto por el paso del tiempo. Commit/push solo con permiso del usuario; antes de commit revisar diff.

### DEC-002B Campo de texto (2026-09-14)

A diferencia de DEC-002A, aqui si hizo falta un componente propio: el label de `InputText` (shared) no tiene `htmlFor` y su error no tiene asociacion ARIA, y ninguna de las dos cosas se puede arreglar pasando props desde afuera — hay que cambiar el JSX interno del componente (agregar `id`/`htmlFor`/`aria-describedby`), y eso si es "cambiar su comportamiento", no completar un valor a medias (no aplica la excepcion de `AGENTS.md`).

- Archivos: `src/components/Atoms/TextField/TextField.tsx`, `TextField.module.scss`, `TextField.test.tsx` (nuevos); `src/components/Atoms/index.ts` (export).
- Reuso real: el diseno (bordes `gray-200`, radio `tokens.$radius-control`, tipografia `gm-type.$fs-body-3`/`$fs-body-4`/`$fs-caption-1`) viene de los mismos archivos de GM que ya tocamos en las tareas anteriores; el markup (label/input/caption/error) es nuevo, escrito para asociar todo correctamente. `id` se genera con `useId()` si no se pasa uno.
- Validaciones: `check-types`, `lint`, `test -- --runInBand` OK (4 pruebas nuevas). `build` OK (V2, consume `_tokens.scss`). V3: montado en `src/app/page.tsx`, revisado en `http://localhost:3004/seguridad` — se confirmo en el DOM real que clickear la etiqueta "Correo" enfoca su input (label/htmlFor) y que el campo con error trae `aria-invalid="true"` y `aria-describedby` apuntando al mensaje; foco por teclado recorre los campos en orden, salta el deshabilitado. `page.tsx` revertido al terminar.
- Commit sugerido (no ejecutado): `feat(textfield): agrega Campo de texto propio con label y error asociados`.

### DEC-002C Checkbox (2026-09-14)

Se separo de "Checkbox y select" (ver nota en la seccion Fundaciones). `sad-aml-shared` no tiene ningun checkbox generico (solo `CardRadioButton`); se construyo con `<input type="checkbox">` nativo y estilo propio en vez de traer Radix solo para esto — el nativo ya da teclado y semantica de formulario gratis.

- Archivos: `src/components/Atoms/Checkbox/Checkbox.tsx`, `Checkbox.module.scss`, `Checkbox.test.tsx` (nuevos); `src/components/Atoms/index.ts` (export).
- Reuso: mismos tokens de GM que TextField (`gm.$gray-200`, `gm.$green-400` para el check, tipografia `gm-type.$fs-body-3`/`$fs-caption-1`). El radio del cuadro (4px) y el verde de "marcado" quedaron documentados en el propio SCSS como decisiones sin confirmar en Figma (Figma no da spec de checkbox especifica; el verde de marca 2026 sigue sin resolver por componente).
- Validaciones: `check-types`, `lint`, `test -- --runInBand` OK (5 pruebas nuevas). `build` OK (V2). V3: montado en `src/app/page.tsx`, revisado en `http://localhost:3004/seguridad`: se confirmo por JS que el click sobre la etiqueta (usando el `ref` del accessibility tree, no coordenadas de pixel) marca el checkbox correcto; el toggle por teclado (espacio) no se pudo verificar manualmente en el navegador porque la herramienta de automatizacion no dispara la accion nativa del navegador con teclas sinteticas (se probo con un checkbox nativo sin ningun estilo y tampoco respondio, aislando que es una limitacion de la herramienta, no del componente) — si quedo cubierto por la prueba automatizada con `@testing-library/user-event`, que sí simula esto correctamente. `page.tsx` revertido al terminar.
- Commit sugerido (no ejecutado): `feat(checkbox): agrega Checkbox propio con label y error asociados`.

### Migracion DEC-002B/DEC-002C a sad-aml-shared (2026-09-14, mismo dia)

El usuario aclaro que `sad-aml-shared` no es una dependencia externa que se refresca y pisa lo local: Grupo Mutual lo jala al iniciar cada proyecto y se queda permanente, es una libreria compartida real pensada para que cualquier proyecto la extienda. Con eso, el criterio para decidir donde va cada cosa cambio de "cuanto hay que tocar" a "de quien es el componente" (ver `AGENTS.md`, seccion "Estrategia de implementacion"). Se revirtio la separacion anterior:

- `Checkbox` se movio de `src/components/Atoms/Checkbox` a `sad-aml-shared/components/Atoms/Checkbox`, renombrado a la convencion BEM de esa carpeta (`checkbox__row`, `checkbox__input`, `checkbox__label`, `checkbox__errors`, prop `errors` en vez de `error`) y agregado a su `index.ts`. Ya no importa `src/styles/_tokens.scss` (shared no debe depender de la app): el radio de 4px queda hardcodeado, igual que el resto de los componentes de esa carpeta.
- El `TextField` propio se elimino. Se corrigio `InputText.tsx` directo en `sad-aml-shared`: label con `htmlFor`, error con `aria-describedby`/`aria-invalid`, y se elimino el prop `maxlength` (minuscula) que nunca hacia nada — `maxLength` nativo ya pasa por `...rest`.
- `src/components/Atoms/index.ts` reexporta `InputText` y `Checkbox` directo de shared, sin wrapper.
- Pruebas: como Jest excluye `src/sad-aml-shared/`, las pruebas de ambos (asociacion de label, aria-describedby, teclado, disabled, que `maxLength` si funcione) se movieron a `src/components/Atoms/index.test.tsx`, que importa el barril. 9 pruebas en total, todas en verde.
- Revalidado en navegador con el mismo criterio que antes de migrar: clic en la etiqueta de `InputText` (con id generado por `useId`) enfoca el input real; clic en la etiqueta del `Checkbox` ya migrado tambien lo marca/desmarca correctamente.
- Commit sugerido (no ejecutado): `refactor(shared): mueve Checkbox e InputText corregido a sad-aml-shared`.

### DEC-002D Dialogo (2026-09-14)

Se corrigio `Modal.tsx`/`Modal.module.scss` directo en `sad-aml-shared` (mismo criterio de "de quien es el componente": un dialogo generico no es especifico de DecPat). Ningun consumidor existente usaba este componente todavia (se verifico con grep antes de tocarlo), asi que no hay riesgo de romper algo.

Bugs reales encontrados y corregidos (no solo estilo):
- **Error de hidratacion confirmado por consola**: cuando `description` es un string, Radix ya envuelve el contenido en un `<p>`, pero el componente ademas metia un `<div>` adentro (`<AlertDialog.Description><div>{description}</div></AlertDialog.Description>`) — HTML invalido, React tiraba "`<p>` cannot contain a nested `<div>`". Se corrigio pasando el string directo cuando es string, y usando `asChild` solo cuando `description` ya es un elemento JSX.
- **Boton de cerrar sin nombre accesible**: `<button><i className="ri-close-line"></i></button>` no tenia `aria-label`; un lector de pantalla no sabria que hace. Se agrego `aria-label="Cerrar"`.
- **Foco no vuelve al cerrar**: verificado en navegador (esperando el efecto async de Radix para descartar condicion de carrera) que al presionar Escape el foco caia en `<body>`, no en el elemento que abrio el modal. Causa: el modal es controlado desde afuera sin `AlertDialog.Trigger`, asi que Radix no tiene que ref restaurar. Se guarda el elemento enfocado en un `useEffect` que observa el prop `open` (no `onOpenChange`: ese solo se dispara cuando Radix decide cerrar, no cuando el padre cambia `open` de afuera) y se restaura en `onCloseAutoFocus`.
- **Sin scroll para contenido largo**: `max-height: 100%` sin `overflow-y` recortaba el contenido sin forma de llegar al resto. Se agrego `overflow-y: auto` y `max-height: calc(100vh - 64px)`. Verificado con 25 lineas de texto: `scrollHeight` (942px) > `clientHeight` (600px), con scroll activo.
- **Footer desbordaba en viewport angosto**: dos botones de 219px + 32px de gap no caben en 360-375px. Se agrego `flex-wrap` y una regla `@include mixin.lessThanX(500px)` que apila los botones. Verificado a 375px: `flexDirection: column`, sin overflow horizontal de la pagina.
- **Props `width`/`height` declaradas pero nunca usadas**; el ancho real lo controlaba `marginContent` (prop mal nombrada, ninguna otra cosa la usaba). Se elimino `marginContent` y se conectaron `width`/`height` de verdad.
- Se corrigieron dos "ternarios" armados con template literals que en realidad concatenaban texto literal (`` `${className} ? ${className} : ...` ``, `` `${classNameTitle && styles[classNameTitle]} ? ...` ``) — nunca fueron condicionales reales, dejaban clases como `undefined` y `?` en el DOM.
- Se elimino `<AlertDialog.Trigger asChild></AlertDialog.Trigger>` (sin children, invalido con `asChild`; no se usaba ya que el modal es controlado).
- Archivos: `src/sad-aml-shared/components/Organisms/Modal/Modal.tsx`, `Modal.module.scss`; `src/components/Organisms/index.ts` (nuevo, reexporta `Modal`), `src/components/Organisms/index.test.tsx` (nuevo).
- Validaciones: `check-types`, `lint`, `test -- --runInBand` OK (4 pruebas nuevas: Escape dispara `onOpenChange(false)`, boton cerrar con nombre accesible, sin `<p><div>` invalido, no renderiza nada si `open=false`). `build` OK. El retorno de foco NO se probo en Jest (jsdom no simula de forma confiable el foco async de Radix); se verifico a mano en el navegador con esperas explicitas para descartar condiciones de carrera, documentado arriba.
- Commit sugerido (no ejecutado): `fix(modal): corrige hidratacion, foco, scroll y footer del Modal de sad-aml-shared`.

### DEC-001B Base de aplicacion (2026-09-16)

- Archivos: `next.config.js` (elimina `basePath: '/seguridad'`, resuelve D-02), `src/app/layout.tsx` (metadata DecPat, `robots: noindex, nofollow` por ser sistema interno, quita el header/footer hardcodeado de SAD-AML — el shell real es DEC-005A), `.env.local.example` (reemplaza variables de un microfrontend bancario que no se usan en ningun lado del codigo por las 2 que si se leen), `README.md` (reescrito para DecPat), `package.json` (`name: decpat-cloud`).
- Hallazgos al revisar antes de escribir: Husky no esta instalado (ni `.husky/`, ni en `devDependencies`, ni script `prepare`) pero el README tenia una seccion completa explicandolo — se quito. Las variables de `.env.local.example` (`NEXT_PUBLIC_MY_PRODUCTS_HOME_MF_END_POINT_URL` y similares) no aparecen en ningun archivo `.ts/.tsx` del proyecto (verificado con grep); las 2 reales son `NEXT_PUBLIC_ENVIRONMENT` (`next.config.js`) y `NEXT_PUBLIC_API_BASE_URL` (`sad-aml-shared/services/api/AxiosClient.ts`).
- No se agrego `openGraph`/`twitter` a la metadata: esos campos necesitan una URL de dominio real que este proyecto no tiene; se omiten en vez de inventar una.
- Validaciones: `check-types`, `lint`, `test -- --runInBand` OK. `build` OK (V2, cambian rutas/config). Verificado en navegador (pestaña nueva, sin historial de pruebas previas): la app carga en `http://localhost:3004/` sin `/seguridad`, `document.title` = "DecPat", meta `robots` = "noindex, nofollow", cero errores de consola.
- Commit sugerido (no ejecutado): `feat(app): configura metadata, basePath y documentacion de DecPat`.

### DEC-003 Login base (2026-09-16)

Antes de armar la pantalla se reviso `InputSecret` de shared (necesario para "mostrar/ocultar") con la misma disciplina que Button/TextField/Modal, y aparecieron bugs reales confirmados con evidencia, no solo lectura del codigo:

- **`useTranslation` de react-i18next sin instancia inicializada**: el proyecto no inicializa i18next en ningun lado (`src/app/providers` vacio, sin `initReactI18next`) y `src/translations/es/global.json` esta vacio (`{}`). Confirmado en consola del navegador: `react-i18next:: NO_I18NEXT_INSTANCE`, y el boton de mostrar/ocultar literalmente mostraba el texto `"button.shared.toggleHide"` (la key sin traducir) en vez de algo legible. Se quito i18next del componente y se hardcodeo el texto en espanol ("Mostrar contraseña"/"Ocultar contraseña"), consistente con que el resto del proyecto no usa i18n en ningun lado.
- **Ref interno muerto**: se creaba un `useRef` para enfocar el input al hacer click en el wrapper, pero nunca se conectaba al input real (el `ref` reenviado por el padre se usaba por separado) — ese click no hacia nada. Se combinaron ambos refs. Confirmado en navegador: `wrapper.click()` ahora si mueve el foco al input.
- **Label sin `htmlFor`, sin `aria-describedby`/`aria-invalid`**: mismo patron que `InputText` antes de corregirse.
- **`onFocus`/`onBlur` reemplazables**: iban al final via `...rest`, asi que un padre que pasara los suyos (ej. React Hook Form) los hubiera pisado por completo, rompiendo el estilo de foco. Se encadenaron ambos.
- **Boton de mostrar/ocultar sin `aria-label`**: solo tenia `title` (poco confiable para lectores de pantalla) con la key de traduccion rota.
- Archivos: `src/sad-aml-shared/components/Atoms/InputSecret/InputSecret.tsx` (corregido).

Pantalla, primera version (nodo Figma 43121:6904 solo por el inventario escrito, sin ver el diseno real):

- Validacion con reglas nativas de React Hook Form (`register(..., { required })`), sin agregar `@hookform/resolvers`/schema de `yup`: no estan instalados y dos campos requeridos no justifican la dependencia nueva.
- "Recordar usuario": guarda **solo el usuario** en `localStorage` (`decpat.rememberedUsername`), nunca la contrasena; se precarga al montar.
- Exito mock: `AuthService.login` resuelve `success` si usuario y contrasena no estan vacios (sin backend, D-08 sigue abierto). Se muestra un estado de exito en la misma pantalla en vez de redirigir a `/inicio` (esa ruta no existe hasta DEC-005B; redirigir hoy resultaria en 404).
- Archivos: `src/services/AuthService.ts` (nuevo), `src/components/Pages/Login/Login.tsx`, `Login.module.scss`, `Login.test.tsx` (nuevos), `src/app/page.tsx` (renderiza `Login`).
- El usuario noto que esta version no se parecia al diseno real y no estaba pensada a escala de escritorio. Se investigo por que: esta sesion nunca habia probado el conector oficial de Figma (`5714a1b5-...`), solo se sabia que un conector *distinto* (`plugin:figma:figma`) pedia autorizacion, y se asumio sin probar que ningun acceso a Figma estaba disponible.

### DEC-003 Login base — reconstruccion con Figma real (2026-09-16, mismo dia)

Se probo el servidor oficial de Figma directo y **si funciona** sin autorizacion adicional (`get_screenshot`/`get_design_context` respondieron con datos reales del archivo). Se recargo el nodo 43121:6904 completo y se rehizo la pantalla:

- Layout real: dos paneles a escala de escritorio (canvas de referencia 1366x720), no una tarjeta centrada. Panel izquierdo con fondo rojo diagonal, logo de Grupo Mutual, titulo "Bienvenido a la Declaración Patrimonial" y texto descriptivo; panel derecho con el formulario.
- Texto corregido al real de Figma: titulo del formulario "Iniciar sesión" (no "DecPat"), checkbox "Recordar mi usuario" (no "Recordar usuario"), se agrego el enlace "Centro de ayuda" (se habia omitido) y el texto "¿Olvidó su contraseña? Comuníquese con soporte interno.".
- Confirmado con el diseno real: el rojo de marca 2026 (`#E62C3A`) **si es el que usa Login** (resuelve la ambiguedad rojo-2026-vs-heredado que quedaba abierta desde `DEC-001A`).
- Ajustes a `sad-aml-shared` con valores exactos del diseno (mismo criterio de siempre: valores confirmados por Figma, no inventados): `Checkbox` con borde verde `#12A195` y 22px (no gris 20px), label 12px/Medium/gris-400 (no 14px/gris-500); `Button.cta` con el `box-shadow` de "iluminacion" (`0px 16px 24px rgba(255,207,77,0.3)`) que `preparacion-tecnica-visual.md` ya tenia anotado como pendiente sin el valor exacto.
- Assets reales descargados (logo + 3 formas del fondo) — ver `src/assets/README.md` para el detalle y por que se guardaron como `.tsx` con SVG incrustado en vez de `.svg` sueltos (evita que un `<img>` de SVG se pixele al escalar, reportado por el usuario en una laptop real).
- Bug de CSS encontrado y corregido: un `@media` para ocultar el panel de marca en telefonos se habia anidado dentro de `.login` en vez de dentro de `.login__brand`; Sass lo compilaba *antes* de la regla base de `.login__brand` en el CSS final, asi que esa regla base (sin condicion) ganaba siempre sin importar el ancho de pantalla. Se detecto probando en un viewport real angosto, no leyendo el SCSS. Se corrigio anidando el `@media` dentro de la propia regla que modifica.
- **Decision de alcance del usuario, 2026-09-16**: el sistema es solo para laptop/escritorio/tablet, los telefonos no son un dispositivo soportado. Se ajusto el breakpoint que oculta el panel de marca de `768px` (que hubiera afectado tablet, que si esta en alcance) a `480px` (resguardo minimo solo para telefonos). Se registro esta regla en `AGENTS.md` y se quito el viewport 360px de las validaciones V3 en `todo.md`/`plan.md`/`preparacion-tecnica-visual.md`.
- Archivos adicionales: `src/assets/images/LoginWave1.tsx`, `LoginWave2.tsx`, `LoginWave3.tsx`, `LogoGrupoMutual.tsx` (nuevos); `src/sad-aml-shared/components/Atoms/Checkbox/Checkbox.module.scss`, `src/sad-aml-shared/components/Atoms/Button/Button.module.scss` (corregidos); `Login.tsx`/`Login.module.scss`/`Login.test.tsx` (reescritos).
- Validaciones: `check-types`, `lint`, `test -- --runInBand` OK (18 pruebas). `build` OK (V2). V3: comparado contra la captura real de Figma — colores, radio, sombra del boton y borde del checkbox verificados por `getComputedStyle` (coinciden exacto); funcionalidad reprobada completa (validacion, envio exitoso, persistencia de "recordar usuario", toggle de contrasena) en viewport 1366; confirmado que a 768px (tablet) el panel de marca se mantiene visible y a 375px (fuera de alcance) se oculta sin verse roto.
- Commit sugerido (no ejecutado): `feat(login): reconstruye Login desde el diseno real de Figma y corrige assets/checkbox/boton`.
- **Fix adicional (mismo dia)**: el usuario reviso Login en su propio navegador (`npm run dev`, puerto 3004) a resolucion de laptop real y noto un marco/borde en toda la pagina, mas visible del lado rojo. Causa: `<body>` nunca reseteo el margen de 8px que aplican los navegadores por defecto. Es un fix global (`src/styles/globals.scss`), no especifico de Login — afecta a cualquier pantalla, se corrigio ahi para que beneficie a todas. Verificado con `getComputedStyle` (`margin: 0px`) y capturas a 1920px de ancho.
- **Investigacion de pixelado persistente (mismo dia)**: tras el fix de `<img>`→`<svg>` incrustado, el usuario siguio viendo bordes pixelados especificamente en `LoginWave3` (la forma blanca diagonal) y el logo de Grupo Mutual. Se investigo con evidencia (render aislado del SVG en un canvas propio, sin pasar por la captura de pantalla de la herramienta) antes de tocar codigo:
  - `LoginWave3` es la unica de las 3 formas con un `<filter>` SVG nativo (sombra), y se estira de forma no uniforme (226% alto / 91.8% ancho del contenedor) — un filtro `userSpaceOnUse` sobre contenido asi estirado es un patron donde algunos navegadores rasterizan el area del filtro a la resolucion del viewBox original en vez de al tamano final en pantalla, mas grande. Es la explicacion tecnica mas probable, aunque no se logro reproducir el pixelado de forma concluyente en las pruebas de este lado (el render aislado se veia limpio). Se reemplazo el filtro SVG nativo por un `filter: drop-shadow(...)` CSS en el contenedor (mismos valores: offset 10px, blur 2px, negro 25%), que los navegadores rasterizan con el tamano final ya compuesto.
  - El logo (`LogoGrupoMutual`) no tiene filtro y esta casi a escala 1:1 (viewBox 175.871x45.6626 vs ~177px de ancho renderizado); no se encontro un defecto de codigo equivalente. La hipotesis mas probable para este y para cualquier residuo en la diagonal es el **escalado de pantalla de Windows** (125%/150% es comun) generando tamanos de pixel fraccionarios — un efecto de todo el sistema operativo/navegador, no de este codigo especifico. Pendiente de que el usuario confirme revisando su configuracion de escala de pantalla y con zoom del navegador en 100% (Ctrl+0).
  - Archivo: `src/assets/images/LoginWave3.tsx` (filtro SVG nativo reemplazado por CSS).
  - **Cerrado 2026-09-16**: el usuario confirmo que el pixelado sigue igual con zoom de navegador en 100% (Ctrl+0), y que su Windows esta a **125% de escala** en **Chrome**. Esto confirma la hipotesis: 125% es una escala fraccionaria "no limpia" (DPR 1.25) y es un comportamiento documentado de Chromium en Windows — el compositor rasteriza bordes diagonales/curvos con un ligero desenfoque/aliasing en ese DPR especifico, sin importar el sitio. Prueba de que no es un defecto de este codigo: afecta por igual a `LoginWave3` (que si tenia `<filter>`, ya reemplazado por CSS) y al logo (que nunca tuvo filtro ni estiramiento no uniforme relevante) — el unico factor en comun es la escala de Windows, no el SVG. No requiere mas cambios de codigo; el fix de `drop-shadow` en `LoginWave3.tsx` se mantiene porque es una mejora real (evita el riesgo de rasterizado de filtro a resolucion de viewBox), aunque no haya sido la causa completa del pixelado reportado. Si se necesita confirmacion adicional en algun momento, la prueba definitiva seria cambiar Windows a 100% o 150% (escalas enteras) y comparar — no se le pidio al usuario por ser un cambio molesto a todo su escritorio para un defecto ya explicado.
- **Bug real encontrado y corregido 2026-09-16: texto tapado por la diagonal blanca en viewports angostos.** El usuario reporto, con capturas de dos laptops de 1920x1080 fisicos, que en la de escala 150% de Windows (ancho efectivo ~1280px CSS) el texto del panel izquierdo se superpone con `LoginWave3` (la forma blanca), mientras que en la de 125% (~1536px CSS) no pasa.
  - Causa confirmada con evidencia (no solo lectura de codigo): `.login__brand` fija el texto a `max-width: 460px` (un valor en pixeles, no relativo), mientras que la posicion de `LoginWave3` (`left: 43.34%`) y el padding del panel (`9%`) son porcentaje del viewport. Usando `Path2D.isPointInPath` sobre el `path` real del SVG (no una aproximacion visual) se confirmo que el borde derecho del texto queda **dentro** de la forma blanca por debajo de un ancho de viewport de ~1339px — lo que incluye tanto los 1280px reportados como, mas grave, **los 768px que `AGENTS.md` ya declaraba como breakpoint de tablet validado**: a 768px el titulo y el parrafo completos quedaban enteramente encima de la forma blanca (texto blanco sobre blanco, invisible). La validacion V3 original de DEC-003 solo habia confirmado que el panel de marca seguia "visible" a 768px, no que el texto fuera legible sobre el fondo correcto.
  - Fix: `src/components/Pages/Login/Login.module.scss`, `left` de `.login__wave--3` cambia de `43.34%` fijo a `max(43.34%, calc(9vw + 490px))`. Por debajo de ~1427px de ancho de viewport gana el `calc()`, que mantiene siempre 30px de margen contra el borde real del texto (`9vw + 460px`); por encima, gana el `43.34%` original de Figma sin ningun cambio (verificado en 1920px: el valor coincide exacto con el original, 832px).
  - Validado con la misma tecnica (`Path2D.isPointInPath`) en 768, 1280, 1366 (referencia Figma) y 1920px: cero solapamiento en los cuatro, con margen de 30px justo por debajo del cruce y creciente por encima. Verificado tambien visualmente en el navegador (capturas a 768 y 1280). `check-types`, `lint` y `test -- --runInBand` OK (18 pruebas, sin cambios de comportamiento). No aplica V2 (cambio de SCSS con scope de componente, no de ruta/estilo global).
  - Diferencia contra Figma: a 1366px (canvas de referencia) la diagonal ahora arranca 21px mas a la derecha que el valor literal exportado (613px vs 592px) para garantizar el margen de 30px; a simple vista no es perceptible y evita que el mismo defecto reaparezca en cualquier laptop con escala fraccionaria de Windows entre 768 y ~1427px de ancho efectivo.
  - Commit sugerido (no ejecutado): `fix(login): evita que la diagonal blanca tape el texto en viewports angostos`.

## Registro de tareas cerradas

### DEC-001A Tokens y assets (2026-09-14)

- Archivos: `src/styles/_tokens.scss` (nuevo), `src/styles/globals.scss` (agrega `@use './tokens'`), `src/assets/index.ts` (barril vacio documentado), `src/assets/README.md` (nuevo).
- Validaciones: `check-types` OK; `lint` sin avisos; `test -- --runInBand` OK (1 suite); `build` OK y se confirmo por inspeccion del CSS generado (`.next/static/css/*.css`) que las 24 variables `--decpat-*` compilan con los valores esperados (V2, por tocar un estilo global).
- Diferencias contra Figma: rojo de marca 2026 (#E62C3A) sin equivalente en GM, que sigue en el heredado #E5353E; verde con dos pares en pugna (#12A195/#47D1C6 heredado vs #00998A/#45B9B2 2026) sin resolver por componente; GM no tiene el escalon tipografico de 12px que pide Figma (se agrego `--decpat-font-size-body-sm`); GM no centraliza radios (se agregaron `--decpat-radius-control`/`--decpat-radius-cta` desde Figma). Detalle completo en `preparacion-tecnica-visual.md` seccion 7.
- Pendiente: los 4 assets de imagen 2026 (logo rojo/negro, logo blanco de login, fondo de login, ilustracion de error) quedan identificados en `src/assets/README.md` pero no exportados; el conector MCP de Figma no esta autorizado en esta sesion. No se uso ningun asset heredado de `sad-aml-shared` como sustituto definitivo.
- Commit sugerido (no ejecutado): `feat(styles): agrega tokens de marca DecPat trazables a GM`.
- **Corregido 2026-09-14** (misma logica que el episodio de DEC-002A, dos vueltas):
  1. Primera correccion: la version original tenia 24 variables `--decpat-*`, mas de la mitad copias literales de valores que ya existen en `sad-aml-shared/styles/settings` (superficie, texto, bordes, alertas, tamanos de titulo). Se recorto a 9.
  2. Segunda correccion (a pedido del usuario): de esas 9, los colores 2026/heredado y el tamano de 12px SI tenian donde vivir en shared (son la misma familia de archivos que ya existe, solo les faltaba el valor), asi que se movieron a `sad-aml-shared/styles/settings/_colors.scss` (`$red-2026`, `$green-2026-400/300`) y `_typography.scss` (`$fs-body-4`, sobre `$_fs-12` que ya existia sin usar). `_tokens.scss` quedo solo con los 2 radios (`$radius-control`, `$radius-cta`), que son los unicos valores para los que shared no tiene ningun archivo ni convencion equivalente (cada componente hardcodea su propio radio). Se convirtio de variables CSS (`:root`) a variables SCSS normales, consistente con como esta escrito el resto del proyecto.
  - Verificacion: compilacion desechable con `npx sass` confirmando que los 6 valores nuevos (`$red-2026`, `$green-2026-400/300`, `$fs-body-4`, `$radius-control`, `$radius-cta`) resuelven al hex/rem/px esperado.

### DEC-002A Boton (2026-09-14, tercera y version final)

Historial de esta tarea, para que quede claro por que cambio dos veces en el mismo dia:
1. Reimplemento el boton desde cero (D-01, basado en un `AGENTS.md` que contradecia a `CLAUDE.md`).
2. El usuario corrigio la prioridad (usar shared primero) y se rehizo como wrapper con overrides CSS (`!important`) mas un boton-icono local.
3. El usuario pregunto si el color no estaba ya en `_colors.scss` (si, como `$_light_mustard`/`$accent-400`) y si hacia falta un atomo nuevo solo por eso; al revisar, `ColorEnum` de shared ya tenia valores sin usar (`Warning`, `Danger`, `Yellow600`) y el boton-icono no lo necesitaba nadie (`ModalAlert` de shared cierra con un `<button>` propio, no con este atomo). Se corrigio a esta version final.

**Resultado final: no hay componente local. Se usa `sad-aml-shared/components/Atoms/Button` directo**, reexportado desde `src/components/Atoms/index.ts` para que las pantallas siempre importen desde `@/components/Atoms`.

- Archivos: `src/sad-aml-shared/types/enum/Color.enum.ts` (+`Cta`), `src/sad-aml-shared/components/Atoms/Button/Button.module.scss` (+`.cta`, usa `$accent-400`/`$accent-500` ya existentes), `src/components/Atoms/index.ts` (reexporta `Button` y `ColorEnum` como `ButtonColor`), `src/components/Atoms/index.test.tsx` (nuevo, prueba que `Cta` aplica una clase distinta a la de green), `src/app/layout.tsx` (+`import 'remixicon/fonts/remixicon.css'`, hallazgo aparte: sin esto los iconos de shared —Boton, InputSecret, Modal— no se veian en ningun lado, no solo en Boton). Se elimino `src/components/Atoms/Button/` (el wrapper de la version 2).
- Excepcion documentada en `AGENTS.md`: se modifico `sad-aml-shared` (normalmente prohibido) para completar un `ColorEnum` que ya declaraba colores sin clase CSS; no es un cambio de comportamiento, es terminar algo que shared dejo a medias.
- Validaciones: `check-types`, `lint`, `test -- --runInBand` OK, `build` OK (V2 por tocar `layout.tsx` y un estilo global). V3: montado temporalmente en `src/app/page.tsx`, revisado en `http://localhost:3004/seguridad` (color CTA correcto, disabled+cta combinados bien, spinner con icono real de remixicon visible, foco visible con el `:focus` propio de shared); revertido al terminar.
- Diferencia conocida y aceptada: shared no oculta el texto durante `spinner`, lo muestra junto al glyph; en botones de texto corto el ancho puede crecer unos pixeles al cargar.
- Commit sugerido (no ejecutado): `feat(button): agrega ColorEnum.Cta al Boton de sad-aml-shared y carga remixicon`.
