# DEC-000 Preparacion tecnica y visual

Fecha de revision: 2026-09-10. Copia local: `C:/Ian/DecPat/decpat-cloud`.
Resultado: inventario y preparacion documental realizados; implementacion funcional pendiente.
Este documento distingue evidencia del repositorio, evidencia de Figma y propuestas de desarrollo.

## 1. Fuentes y alcance de la revision

- [Flujo DecPat, Propuesta DecPat 2](https://www.figma.com/design/pVGHV6WqzhsvQZ3goaRYnE/Mutual?node-id=43121-438).
- [Design System GM, componentes MM y ML](https://www.figma.com/design/9kPyFvx98Nm6zcVICW2erz/GM?node-id=21-30).
- [Design System GM, estilos](https://www.figma.com/design/9kPyFvx98Nm6zcVICW2erz/GM?node-id=0-1).
- [Design System GM, componentes MC](https://www.figma.com/design/9kPyFvx98Nm6zcVICW2erz/GM?node-id=3945-2838).

Se inspeccionaron los metadatos de la pagina DecPat completa, los contextos de las pantallas 2 a 12, inicio, login, los modales de captura y los campos de la composicion inferior del paso 1. El contexto completo del paso 1 excedio el limite del servicio y se revisaron sus subnodos. Se visualizaron capturas de login, ahorro, cuentas corrientes y datos judiciales. La revision es un inventario de diseno y codigo; no es una prueba del prototipo interactivo ni una comparacion de una UI implementada contra todas las capturas.

El listado general del archivo DecPat devolvio solo Portada, aunque la pagina referenciada y sus nodos se pudieron consultar directamente. Por eso, la cobertura declarada es la pagina `43121:438`, no todos los posibles flujos del archivo. Los nombres de capas genericos, las capas ocultas y los ejemplos no se consideran requisitos definitivos.

## 2. Estado local comprobado

| Area                | Evidencia                                                                                 | Consecuencia                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Stack               | Next 15.4.4, React 19.1.0, TypeScript 5.8.3; Node v24.13.1 y npm 11.10.1 en esta revision | Mantener React, App Router y SCSS Modules                                                       |
| Rutas               | `src/app/page.tsx`, `layout.tsx`, `loading.tsx`; build muestra `/` y `/_not-found`        | No hay pantallas funcionales de DecPat conectadas                                               |
| Prefijo             | `next.config.js` define `basePath: '/seguridad'`; dev usa puerto 3004                     | La URL base actual es `http://localhost:3004/seguridad`; decidir prefijo DecPat antes del shell |
| Inicio              | Texto Seguridad y enlaces a administracion, reportes y manejo-cuentas                     | Esos enlaces no acreditan rutas existentes                                                      |
| Componentes propios | Indices de Atoms, Molecules, Organisms y Templates; pagina Dummy                          | Atomic Design preparado, kit DecPat pendiente                                                   |
| Shared              | 221 archivos seguidos por Git; 44 archivos TSX, incluidos indices y pruebas               | Biblioteca presente localmente; estas cifras no equivalen a 44 componentes listos               |
| Estado              | `src/redux/store.ts` con reducer vacio                                                    | Declaracion, sesion y proveedores aun sin conectar                                              |
| Servicios           | `getUserMock` y `adaptUser` de ejemplo                                                    | Sin contratos locales de autenticacion o declaracion                                            |
| HTTP compartido     | Axios con `NEXT_PUBLIC_API_BASE_URL`, timeout 10 s, interceptor de token                  | Cliente generico; el manejo 401 solo tiene comentarios                                          |
| Entorno ejemplo     | Usa nombres heredados, no documenta `NEXT_PUBLIC_API_BASE_URL`                            | Alinear documentacion y contrato antes de integrar                                              |
| Fuentes y assets    | Poppins y Work Sans locales; logos heredados; `public` solo favicon y `.gitkeep`          | Comparar logo 2026 y exportar assets exactos cuando se implementen                              |
| Estilos             | Import global de shared comentado; tipografias enlazadas desde shared                     | No asumir reset, tokens o iconos globales activos                                               |
| Documentacion       | README conserva SAD-AML, puerto 3000 y Husky                                              | Actualizar en tarea de fundaciones; el script real usa 3004                                     |
| Git                 | `git status --short` vacio antes de preparar documentos                                   | Punto de partida limpio; no se hizo commit ni push                                              |

No se inicializaron submodulos, descargaron repositorios corporativos ni invocaron endpoints empresariales. Las lecturas de Figma se limitaron a las referencias autorizadas.

## 3. Inventario de shared y decision de uso

Los exports verificados son:

- Atoms: BackButton, Button, Card, Crumb, CurrencyInfo, Drawer, Icon, InputText, ListItem, Picture, ProfileNavigation, Title, SubtitleText, TextInformation, InputSecret, LastAccess, CardRadioButton, RoundIcon y Spinner.
- Molecules: SideMenuList, ProfileInfoHeader, InputSearch, ImageCarousel, EntityCard, LoadingSpinner y Dropdown.
- Organisms: SideBar, Header, EntityCardList, Notification, Modal y Alert.
- Templates: Container y DashboardLayout.
- Existen fuera de esos exports: DatePicker, BreadCrumbs, BreadCrumbsAndBack y TitleWithDrawable.

**Actualizado 2026-09-14 (revierte la decision original de esta seccion):** `AGENTS.md` decia "no depender de sad-aml-shared para nuevas implementaciones", lo que contradecia a `CLAUDE.md` y `.agents/decpat-figma-react.md` (ambos piden usar shared primero y no duplicar lo que ya existe). El usuario confirmo que la prioridad es usar `sad-aml-shared` cuando cubra lo que pide Figma, envolviendolo en `src/components` solo para ajustar un detalle puntual (color, ARIA, comportamiento), y crear un componente local nuevo unicamente cuando shared no tenga nada equivalente. `AGENTS.md` ya se actualizo en esa linea. Este documento queda con el analisis original de brechas (tabla abajo), que sigue vigente: sigue indicando, por componente, si conviene reutilizar+envolver o construir desde cero.

| Necesidad                 | Referencia local                              | Brecha comprobada / trabajo necesario                                                                                                                                                 |
| ------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Botones                   | `Atoms/Button`                                | **Resuelto 2026-09-14**: se agrego `ColorEnum.Cta` + clase `.cta` dentro del propio `Button.module.scss` de shared (usa `$accent-400`, ya existia en la paleta). `spinner` sigue sin deshabilitar por si mismo: cada pantalla debe pasar `disabled` junto con `spinner`.                                             |
| Campo de texto            | `Atoms/InputText`                             | **Resuelto 2026-09-14, corregido directo en shared**: label con `htmlFor`, error con `aria-describedby`/`aria-invalid`, se elimino el prop `maxlength` muerto. Version anterior de este resuelto construyo un `TextField` propio para no tocar shared; se reviso ese criterio (ver `AGENTS.md`) y se aplico el fix directo en `InputText.tsx`.                                       |
| Contrasena                | `Atoms/InputSecret`                           | **Resuelto 2026-09-16, corregido directo en shared**: ref de foco conectada, label con `htmlFor`, `aria-describedby`/`aria-invalid`, `onFocus`/`onBlur` encadenados en vez de reemplazables. De paso se encontro que usaba `react-i18next` sin instancia inicializada (confirmado en consola: `NO_I18NEXT_INSTANCE`, el boton mostraba literal `"button.shared.toggleHide"`); se quito i18next, texto hardcodeado en espanol.                                        |
| Select                    | `Molecules/Dropdown`                          | Radix Select, agrupacion y vacio; API sin error/caption; keys aleatorias. Validar nombre accesible y persistencia de seleccion                                                        |
| Fecha                     | `Molecules/DatePicker`                        | MUI/Moment, es y DD/MM/YYYY; no exportado; onChange any; contrato de error/disabled ausente                                                                                           |
| Modal                     | `Organisms/Modal`                             | **Resuelto 2026-09-14, corregido directo en shared**: width/height ya conectados (se elimino `marginContent`), ternarios literales corregidos, error de hidratacion real corregido (`<p><div>` invalido cuando `description` es string), boton cerrar con `aria-label`, foco vuelve al cerrar (Radix no lo hacia solo, sin `Trigger`), scroll para contenido largo, footer no se desborda en 360-375px. |
| Toast                     | `Organisms/Notification`                      | Seis estados y autocierre 3000 ms; ancho inline con `!important` invalido; titulo blanco en fondo INFO blanco; proveedor por instancia y temporizador adicional                       |
| Alerta                    | `Organisms/Alert`                             | Mensaje en linea con icono; definir anuncio accesible y semantica segun estado                                                                                                        |
| Shell                     | Header, SideBar, DashboardLayout              | Textos y rutas de pagos; `next/router` en App Router; datos fijos; logout vacio en template; requiere composicion DecPat                                                              |
| Breadcrumb                | BreadCrumbs y BreadCrumbsAndBack              | `next/router`, sin exports generales; usar navegacion compatible con App Router                                                                                                       |
| Checkbox / switch / radio | Dependencias Radix; CardRadioButton           | **Checkbox resuelto 2026-09-14** con input nativo, agregado directo a `sad-aml-shared/components/Atoms/Checkbox` (no en `src/components`: es un control generico, no especifico de DecPat — ver `AGENTS.md`). Switch y radio genericos (fuera de CardRadioButton) siguen sin resolver, se atienden cuando una tarea los necesite.                                                                                                               |
| Tablas editables          | Sin componente de tabla en inventario         | Crear tabla semantica, acciones, estado vacio y resumen por moneda                                                                                                                    |
| Adjuntos                  | Sin uploader en inventario                    | Crear seleccion/arrastre, lista, retiro, validacion y estados de transferencia                                                                                                        |
| Wizard                    | Sin stepper en inventario                     | Crear configuracion de 12 pasos y navegacion validada                                                                                                                                 |
| Montos / totales          | Helpers currencyFormat y formatIdentification | Son referencias; requieren contrato numerico y pruebas de calculos de DecPat                                                                                                          |

Estos hallazgos proceden de lectura estatica. No se corrigio shared ni se ejecutaron sus componentes en navegador en esta tarea.

## 4. Mapa de pantallas

Todos los IDs de esta tabla pertenecen al archivo DecPat enlazado arriba. La ruta propuesta no existe aun y se expresa sin basePath.

| Pantalla               | Nodo                    | Contenido confirmado                                                                   | Ruta propuesta / tarea                               |
| ---------------------- | ----------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Login                  | 43121:6904              | Usuario, contrasena, mostrar/ocultar, recordar usuario, ayuda, ingresar                | `/` / DEC-003                                        |
| Inicio                 | 43121:6798              | Bienvenida, que es DecPat, contacto de ayuda                                           | `/inicio` / DEC-005B                                 |
| Perfil                 | 43121:6869              | Submenu con cerrar sesion; otras opciones ocultas                                      | Parte del shell / DEC-005A                           |
| Paso 1                 | 43121:6243              | Datos personales; dos composiciones superpuestas                                       | `/mi-declaracion/1` / DEC-007                        |
| Paso 2                 | 43121:5909              | Conformacion del nucleo familiar; tabla y alta                                         | `/mi-declaracion/2` / DEC-008                        |
| Paso 3                 | 43121:5334              | Planilla, ingresos adicionales, egresos, situacion financiera, razones y saldo mensual | `/mi-declaracion/3` / DEC-009A-C                     |
| Paso 4                 | 43121:4951              | Bienes inmuebles, tabla y alta                                                         | `/mi-declaracion/4` / DEC-010                        |
| Paso 5                 | 43121:4527              | Bienes muebles/vehiculos, tabla y alta                                                 | `/mi-declaracion/5` / DEC-011                        |
| Paso 6                 | 43121:4102              | Cuentas de ahorro, titular, relacion, entidad, montos, acciones y totales CRC/USD      | `/mi-declaracion/6` / DEC-012                        |
| Paso 7                 | 43121:3695              | Cuentas corrientes de GM, montos adicionales, vacio y totales CRC/USD                  | `/mi-declaracion/7` / DEC-013                        |
| Paso 8                 | 43121:3274              | Creditos, cuotas, saldos, entidad, moneda y fecha de conclusion                        | `/mi-declaracion/8` / DEC-014                        |
| Paso 9                 | 43121:2819              | Tarjetas, cuotas y saldos por moneda                                                   | `/mi-declaracion/9` / DEC-015                        |
| Paso 10                | 43121:2464              | Personeria juridica y participacion en sociedades                                      | `/mi-declaracion/10` / DEC-016A-B                    |
| Paso 11                | 43121:1791 y 43121:2088 | Datos judiciales, embargos, pension y campos condicionales                             | `/mi-declaracion/11` / DEC-017                       |
| Paso 12                | 43121:1459 y 43121:1124 | Cuestionario confidencial y variante ampliada                                          | `/mi-declaracion/12` / DEC-018A                      |
| Cierre                 | 43121:866               | Texto de declaracion bajo juramento y accion final                                     | Estado final del flujo / DEC-018B                    |
| Error general          | 43121:455               | Error con invitacion a intentar mas tarde                                              | Estado recuperable / DEC-005B, DEC-019               |
| Error dentro del shell | 43121:517               | Error en Mi declaracion; nombre de capa Error sin datos                                | Estado de carga fallida, distinto de una tabla vacia |

El menu muestra Reportes, Declaraciones y Mantenimientos. No hay pantallas detalladas de esos modulos en la pagina revisada. Su presencia en el menu no permite estimar CRUD, filtros, exportaciones, roles ni reglas. Se registran como alcance por definir, fuera de la estimacion base del flujo del declarante.

## 5. Campos y modales

Paso 1, composicion inferior (nodos 43121:6765 a 43121:6775): nombre y apellidos, cedula, edad, estado civil, ultimo grado academico, carrera, telefono habitacion, telefono celular, agencia, oficina y direccion exacta. Los asteriscos son evidencia visual de obligatoriedad; aun falta definir datos precargados, editabilidad, formatos y catalogos. La composicion superior no debe duplicarse en React.

Hay 16 frames con nombre de modal en la pagina, incluyendo dos variantes de ingresos. No equivalen a 16 componentes distintos: se deben componer con un contenedor reutilizable y formularios por dominio.

| Modal                      | Nodo       | Campos / estados observados                                                                          | Tarea    |
| -------------------------- | ---------- | ---------------------------------------------------------------------------------------------------- | -------- |
| Credenciales incorrectas   | 43121:6960 | Error usuario/contrasena, cerrar y accion de retorno                                                 | DEC-004  |
| Exceso de intentos         | 43121:6970 | Espera de cinco minutos y contador de ejemplo 02:36; contacto placeholder                            | DEC-004  |
| Contacto de ayuda          | 43121:6886 | Correo y telefono de ejemplo; cerrar                                                                 | DEC-005B |
| Introduccion a declaracion | 43121:6787 | Periodicidad anual e indicacion para nuevos ingresos                                                 | DEC-006  |
| Nucleo familiar            | 43121:6211 | Nombre, parentesco, genero, edad, fecha de nacimiento                                                | DEC-008  |
| Ingresos sin adjuntos      | 43121:5766 | Tipo, monto, justificacion, seleccion/arrastre de PDF                                                | DEC-009B |
| Ingresos con adjuntos      | 43121:5788 | Lista de cuatro ejemplos Imagen.png y acciones                                                       | DEC-009B |
| Egresos                    | 43121:5323 | Modal informativo sobre rebajos de planilla y cuotas; no confundir con un formulario de alta         | DEC-009C |
| Inmueble                   | 43121:4922 | Finca, ubicacion, adquisicion, destino, valor de mercado                                             | DEC-010  |
| Mueble                     | 43121:4486 | Tipo, marca, placa, descripcion, ano, valor, observacion                                             | DEC-011  |
| Ahorro                     | 43121:4067 | Titular, relacion con cuenta, moneda, monto, numero, entidad                                         | DEC-012  |
| Cuenta corriente           | 43121:3674 | Entidad, saldo actual y moneda                                                                       | DEC-013  |
| Credito                    | 43121:3231 | Tipo, entidad, moneda, conclusion, monto inicial, cuota, saldo, numero                               | DEC-014  |
| Tarjeta                    | 43121:2768 | Periodo, entidad, moneda, limite, ultimos cuatro digitos, vencimiento, cuotas y saldos               | DEC-015  |
| Personeria                 | 43121:2440 | Cedula juridica, nombre, plazo, objetivo                                                             | DEC-016A |
| Sociedad                   | 43121:2392 | Nombre, tipo, cargo, cedula, plazo; porcentaje, dietas, tipo de poder y limite de suma condicionales | DEC-016B |

Para cada modal de captura: apertura en alta/edicion, valores iniciales, validacion, envio pendiente, exito, fallo conservando datos y cancelacion. Estos comportamientos son criterios de implementacion propuestos; Figma no define todos sus contratos. Verificar Escape, foco inicial, retorno del foco, etiquetas accesibles, scroll interno y prevencion de envios duplicados.

## 6. Estados, toasts y comportamiento

| Estado                                     | Evidencia                                                                | Tratamiento propuesto                                                                                     |
| ------------------------------------------ | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Login incorrecto / bloqueado               | Modales dibujados                                                        | Motivo y fecha de desbloqueo provenientes del contrato de autenticacion; no inventar cantidad de intentos |
| Tabla vacia                                | Texto No existen registros en pasos 7 y 10                               | Mostrar alta cuando aplique; no tratar vacio como error                                                   |
| Fallo de carga                             | Dos pantallas de error                                                   | Reintento sin perder datos ya editados                                                                    |
| Adjunto vacio / seleccionado               | Dos modales de ingresos                                                  | Diferenciar seleccionado localmente de subido al servidor                                                 |
| Campos condicionales                       | Judiciales, sociedades y paso 12                                         | Definir cuando se muestran, requieren o limpian                                                           |
| Cargando / guardando                       | Libreria local y referencias GM                                          | Estado pendiente, acciones bloqueadas y anuncio accesible                                                 |
| Toast de alta/edicion/eliminacion          | No se identifico un nodo explicito de toast DecPat en la pagina revisada | Propuesta: mensaje breve tras operacion confirmada; no declarar texto aprobado                            |
| Toast de fallo de guardado / adjunto       | No identificado explicitamente                                           | Propuesta: fallo persistente o accion reintentar; preservar formulario                                    |
| Confirmar eliminacion / salida con cambios | Hay acciones de eliminar, no modal especifico identificado               | Definir confirmacion antes de implementar; no inventar una pantalla ya aprobada                           |
| Final enviado                              | Existe pantalla de juramento, no se verifico recibo de envio             | Separar aceptacion, enviando, error y confirmacion de backend                                             |

No se encontro un componente llamado toast/notificacion en las paginas GM inspeccionadas; si aparece bajo otra nomenclatura o en otra pagina, debe anexarse su nodo. `Notification` SI existe en shared y es referencia tecnica, no prueba de diseno DecPat aprobado.

## 7. Fundamentos visuales y brechas

| Elemento    | Figma / GM                                                                                            | Estado local / decision                                                                  |
| ----------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Titulos     | Work Sans 600; H5 24 px; subtitulos 18 px                                                             | Fuentes locales coinciden; usar tokens semanticos                                        |
| Texto       | Poppins 12/14/16 px segun funcion                                                                     | **Resuelto 2026-09-14**: 14/16px ya existian en GM; se agrego `$fs-body-4` (12px) en `_typography.scss` sobre `$_fs-12`, que ya estaba sin usar |
| Marca       | Rojo 2026 #E62C3A y logo nuevo                                                                        | **Resuelto 2026-09-14** (color): `$red-2026` agregado en `_colors.scss`, convive con el heredado `#E5353E`. Logo sigue pendiente (ver `src/assets/README.md`) |
| CTA         | Amarillo #FDD058, radio 10 px; login 48 px alto, pasos con variantes 60 px                            | **Resuelto 2026-09-14**: `ColorEnum.Cta` en el Boton de shared (ya usaba `$accent-400`, no hizo falta agregarlo); radio y alturas ya coincidian en Button.module.scss |
| Controles   | Bordes #CED4DA, radio 8 px; labels Work Sans 14 px                                                    | Corregir asociacion accesible en componentes propios                                     |
| Superficies | Fondo #F3F5F6, blanco; texto #343A40 y secundario #6C757D                                             | Coinciden con escala local                                                               |
| Verde       | Conviven #12A195 y #47D1C6 heredados con #00998A y #45B9B2 de 2026                                    | **Agregado 2026-09-14**: `$green-2026-400/300` en `_colors.scss`, junto a `$green-400/300` heredados. Sigue pendiente cual va en cada componente |
| Elevacion   | Elevation-3: 0 8 16, #6C757D17; iluminacion de CTA amarilla                                           | No inventar sombras globales uniformes                                                   |
| Desktop     | Pantallas mayoritariamente de 1366 px; sidebar con fondo 266 y marco 286; contenido cercano a 1006 px | Traducir a grid/flex responsive, no copiar coordenadas absolutas                         |
| Modales     | Anchos de 558 a 891 px; sociedad 750 x 1024                                                           | Ancho maximo responsivo y scroll; no altura fija para todo                               |
| Responsive  | No se identificaron variantes moviles DecPat en esta pagina; GM contiene ejemplos moviles             | **Actualizado 2026-09-16**: el sistema es solo laptop/escritorio/tablet (decision del usuario, ver AGENTS.md); QA queda en 768, 1366 y 1440 px, ya no se valida 360px |

GM tiene anotaciones de colores que no siempre coinciden con el relleno actual: por ejemplo `21:8` usa #E62C3A y la etiqueta cercana conserva #E5353E. Para DEC-001 usar la propiedad/estilo vigente del nodo, registrar discrepancia y contrastar con el flujo.

Assets a resolver en DEC-001: logo rojo/negro 2026, logo blanco de login, fondo exacto de login e ilustracion de error. Los recursos disponibles no prueban equivalencia por nombre. Guardar assets duraderos en el proyecto cuando se implementen, sin depender de enlaces temporales del MCP.

## 8. Decisiones y dependencias abiertas

| ID   | Punto                                                          | Efecto / momento de resolver                                                                                                                      |
| ---- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-01 | Regla de componentes propios vs prioridad shared en guia local | **Resuelto 2026-09-14**: usar sad-aml-shared primero, envuelto en src/components solo para ajustar algo puntual; local nuevo solo si shared no tiene equivalente. Ver seccion 3 y AGENTS.md |
| D-02 | Prefijo local y prefijo de despliegue real                     | **Resuelto 2026-09-16**: se elimino `basePath: '/seguridad'` de `next.config.js`. Rutas sin prefijo (`/`, `/inicio`, `/mi-declaracion/[paso]`). El prefijo de despliegue real queda pendiente hasta que se conozca; no se inventa uno. |
| D-03 | Dos composiciones del paso 1 y capas duplicadas de shell       | DEC-007; propuesta: una composicion usando campos inferiores, pendiente de confirmacion visual                                                    |
| D-04 | Tarjetas repite Cuota colones y Saldo colones                  | DEC-015; confirmar si segundo par corresponde a dolares; no corregir etiqueta por suposicion                                                      |
| D-05 | PDF requerido pero ejemplos de adjuntos PNG                    | DEC-009B; propuesta PDF segun instruccion escrita; confirmar cantidad y tamano maximo                                                             |
| D-06 | Bien mueble: descripcion vs modelo                             | Anotacion 43121:4485; resolver etiqueta o tooltip en DEC-011                                                                                      |
| D-07 | Roles y modulos administrativos                                | Solo menu disponible; se necesita alcance adicional para estimar Reportes, Declaraciones y Mantenimientos                                         |
| D-08 | Autenticacion, intentos, expiracion y cierre                   | Contrato/API pendiente; mock solo para desarrollo, sin representar seguridad real                                                                 |
| D-09 | Catalogos, datos precargados, editabilidad y origen de saldos  | Acordar con backend por paso; no se deduce de valores de ejemplo                                                                                  |
| D-10 | Calculos, redondeo, denominadores cero y conversion de moneda  | Acordar antes de DEC-009A/C y pasos financieros; separar totales CRC/USD                                                                          |
| D-11 | Guardado parcial, recuperacion y concurrencia                  | Acordar identificador, version y estados de declaracion; no usar localStorage para patrimonio real                                                |
| D-12 | Cuestionario confidencial del paso 12                          | Figma dice que no queda en declaracion y solo lo recibe Desarrollo Humano; requiere canal y permisos separados, sin envio real durante desarrollo |
| D-13 | Juramento y finalizacion                                       | Confirmar secuencia, texto vigente, evidencia de aceptacion y respuesta final; no asumir firma digital                                            |
| D-14 | Contactos de ayuda y periodicidad                              | Textos con ejemplos y reglas en modal inicial; validacion de negocio antes de entrega                                                             |
| D-15 | Bordes rojos y adornos de revision                             | Paso 7 incluye borde rojo exterior; confirmar si es anotacion antes de replicarlo                                                                 |

Los puntos abiertos no impiden comenzar fundaciones y componentes. Si un contrato no esta listo, implementar escenarios sinteticos explicitamente separados del adaptador real. Nunca presentar un guardado local o simulado como envio oficial.

## 9. Validacion de linea base

Ejecutada el 10 de septiembre de 2026 sobre el codigo existente:

| Comando                           | Resultado                             |
| --------------------------------- | ------------------------------------- |
| `npm.cmd run check-types`         | OK                                    |
| `npm.cmd run test -- --runInBand` | OK: 1 suite, 1 prueba Dummy           |
| `npm.cmd run lint`                | OK, sin avisos reportados             |
| `npm.cmd run build`               | OK: pagina raiz y not-found estaticas |

Jest excluye `src/sad-aml-shared/`; la compilacion solo incluye las rutas actuales y no verifica el comportamiento de un DashboardLayout todavia no montado. No hubo prueba de API ni validacion responsive del producto, que aun no esta implementado. El helper aislado fallo inicialmente; se recupero la lectura y ejecucion con PowerShell del sistema mediante el mecanismo de permisos de la herramienta.

## 10. Criterio de salida de preparacion

- [x] Estructura, stack, rutas y dependencias locales inventariadas.
- [x] Exports compartidos y brechas principales documentados.
- [x] Pantallas, 12 pasos, modales y estados mapeados a nodos.
- [x] Toasts propuestos distinguidos de estados verificados en Figma.
- [x] Diferencias visuales, decisiones pendientes y contratos identificados.
- [x] Linea base de tipos, pruebas, lint y build ejecutada.
- [x] Orden de trabajo, estimacion y tareas registrados en plan.md y todo.md.

La preparacion se puede cerrar con decisiones pendientes registradas. No significa que todos los disenos o contratos esten aprobados ni que se hayan desarrollado pantallas.
