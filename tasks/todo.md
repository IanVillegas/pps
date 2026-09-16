# Tareas verificables de DecPat Cloud

Base: [plan y presupuesto](plan.md), [inventario Figma y decisiones](preparacion-tecnica-visual.md).
IDs alineados con AGENTS: DEC-004 estados de login, DEC-005 shell, DEC-006 wizard, DEC-007+ pasos. Los sufijos dividen tareas conservando su identidad.

## Preparacion

- [x] DEC-000: repositorio y Figma revisados; inventario, brechas, linea base, cronograma y backlog documentados.

## Verificacion comun

- V1: `npm run check-types`, `npm run lint` y pruebas relevantes de comportamiento con `npm run test -- --runInBand`.
- V2: V1 y `npm run build` al cambiar rutas, paginas o estilos globales.
- V3: comparacion con nodo Figma del inventario, teclado y viewports 360/768/1366/1440; registrar adaptaciones cuando no haya diseno responsive.
- V4: recorrido con datos sinteticos, fallo de servicio/reintento y prevencion de duplicados; adaptador real desactivado mientras no haya contrato.

Cada tarea debe registrar archivos reales, validaciones, diferencias Figma, orden de copia y commit sugerido. Areas indicadas abajo son propuestas, no archivos ya existentes. Tamano S: 1-2 archivos; M: 3-5. Crear componente, estilos, pruebas y export segun necesidad; si excede cinco archivos funcionales, dividir en una subtarea antes de implementar. Las horas por bloque estan en plan.md y no son horas realizadas.

## Fundaciones

| Tarea                           | Aceptacion                                                                                                  | Dependencias | Areas previstas                                                                            | Tamano / checks |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------ | --------------- |
| [x] DEC-001A Tokens y assets    | Fuentes y colores trazables a GM; assets 2026 identificados; diferencias de marca registradas               | DEC-000      | src/styles, src/assets                                                                     | M; V1,V3        |
| [ ] DEC-001B Base de aplicacion | Metadata y estructura DecPat; basePath decidido; README y ejemplo de entorno coherentes                     | 001A         | src/app/layout.tsx, src/styles/globals.scss, next.config.js, README.md, .env.local.example | M; V2           |
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
| [ ] DEC-003 Login base      | Usuario/contrasena, mostrar/ocultar, recordar solo usuario y exito mock; campos validados      | 002B,002C    | src/components/Pages/Login, src/services/AuthService.ts, src/app/page.tsx | M; V2,V3        |

DEC-002E (Notificaciones) y DEC-002F (Tabla editable) se mueven a la quincena de DEC-008 (ver plan.md, Cronograma): ningun bloque hasta DEC-007 depende de ellas, y adelantar login/inicio/paso 1 es lo que exige el 25/09 del cronograma de control. Se retoman antes de DEC-008B, que si las necesita.

### Checkpoint C3

- [ ] Revisar esfuerzo real del kit y login; reestimar si excede presupuesto. Labels comprobados; toast y tabla se validan en la quincena de DEC-008.

## Acceso y navegacion

| Tarea                         | Aceptacion                                                                                                          | Dependencias | Areas previstas                                                                          | Tamano / checks |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------- | --------------- |
| [ ] DEC-004 Estados de acceso | Credenciales incorrectas y exceso de intentos; contador por vencimiento; conservar usuario y evitar doble solicitud | 003,002D     | src/components/Organisms/LoginFeedback, src/components/Pages/Login                       | M; V1,V3        |
| [ ] DEC-005A Shell            | Header/sidebar DecPat, datos por props, submenu y logout; App Router sin rutas heredadas                            | 003,001B     | src/components/Templates/AppShell, src/types/Session.types.ts, src/app/inicio/layout.tsx | M; V2,V3        |
| [ ] DEC-005B Inicio y ayuda   | Bienvenida y contacto configurable; estado error recuperable; no activar modulos administrativos sin alcance        | 005A,002D    | src/components/Pages/Home, src/components/Organisms/HelpDialog, src/app/inicio/page.tsx  | M; V2,V3        |

### Checkpoint C4

- [ ] Entrar, fallar, abrir ayuda y salir funciona; distinguir autenticacion simulada de real.

| Tarea                  | Aceptacion                                                                                                        | Dependencias | Areas previstas                                                                                                                               | Tamano / checks |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| [ ] DEC-006A Stepper   | Doce pasos configurados, activo/completo/pendiente y navegacion por teclado; no replicar doce pantallas estaticas | 005A         | src/components/Molecules/DeclarationStepper, src/types/DeclarationStep.types.ts                                                               | M; V1,V3        |
| [ ] DEC-006B Borrador  | Siguiente/anterior conserva datos y valida paso; modal inicial; paso fuera de rango controlado                    | 006A,002D    | src/app/mi-declaracion/[paso]/page.tsx, src/utils/hooks/useDeclaration.ts, src/services/DeclarationService.ts, src/types/Declaration.types.ts | M; V2,V4        |
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
| [ ] DEC-020A Visual y responsive | Diferencias Figma registradas y defectos operativos corregidos en 360/768/1366/1440                                   | 019B         | Pantallas afectadas, hasta cinco archivos por lote              | M por lote; V2,V3 |
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
