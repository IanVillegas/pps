# Reglas de trabajo para DecPat Cloud

Este proyecto es una copia local de trabajo para desarrollar DecPat Cloud con asistencia de IA. El objetivo es construir funcionalidades de forma ordenada en este repositorio personal y luego copiar manualmente los cambios al repositorio real de Grupo Mutual cuando corresponda.

## Contexto del repositorio

- La copia local de desarrollo esta en `C:\Ian\DecPat\decpat-cloud`.
- El unico remoto permitido para trabajo asistido por IA es el repositorio personal `https://github.com/IanVillegas/pps.git`.
- No se debe hacer push, commit, configuracion de remoto ni ninguna operacion de Git contra repositorios reales de DecPat, Grupo Mutual, GitLab corporativo o cualquier remoto empresarial.
- Si aparecen referencias heredadas a `sad-aml`, `sad-aml-shared`, Grupo Mutual, GitLab o URLs corporativas, deben tratarse como contexto heredado, no como autorizacion para conectarse o depender de esos recursos.

## Regla de commits

- Nunca hacer un commit sin permiso explicito del usuario.
- Nunca hacer push sin permiso explicito del usuario.
- Antes de cualquier commit, revisar y resumir el `git diff` para que el usuario confirme.
- Todos los mensajes de commit deben estar en espanol y seguir Conventional Commits.
- Ejemplos validos:
  - `feat(login): implementa pantalla base de inicio de sesion`
  - `feat(componentes): agrega campos de formulario base`
  - `fix(estilos): corrige espaciado del formulario de ingreso`
  - `chore(config): actualiza reglas locales del proyecto`

## Modelo de trabajo por tareas trazables

Trabajar en unidades pequenas pero completas. Una tarea no equivale necesariamente a un archivo; una tarea equivale a una intencion funcional terminada.

Cada tarea debe tener un identificador y un nombre claro, por ejemplo:

- `DEC-001 Fundaciones visuales`
- `DEC-002 Componentes base de formulario`
- `DEC-003 Login base`
- `DEC-004 Modales de login`
- `DEC-005 Layout transaccional`
- `DEC-006 Wizard/Stepper de declaracion`

Una tarea puede tocar varios archivos si todos son necesarios para completar la misma implementacion. Por ejemplo, una pantalla puede requerir componente, estilos SCSS, exports, hooks, tipos y tests.

## Cierre obligatorio de cada tarea

Al terminar una implementacion, entregar un resumen antes de que el usuario haga commit. El cierre debe incluir:

- Nombre/codigo de la tarea.
- Que se implemento.
- Archivos modificados o creados.
- Orden recomendado para copiar los cambios al repositorio real.
- Validaciones ejecutadas y resultado.
- Riesgos, pendientes o diferencias conocidas contra Figma.
- Mensaje de commit sugerido en espanol.

Formato sugerido:

```txt
Tarea: DEC-003 Login base

Se implemento:
- LoginPage basado en Figma.
- Componentes propios Button, TextField y Checkbox.
- Estilos responsive iniciales.

Archivos tocados:
- src/app/page.tsx
- src/components/Pages/Login/Login.tsx
- src/components/Pages/Login/Login.module.scss

Para pasar al repo real:
1. Copiar tokens primero.
2. Copiar Atoms.
3. Copiar Molecules.
4. Copiar la pagina.
5. Ajustar imports si alla se usan componentes oficiales.

Validacion:
- npm run check-types: OK
- npm run test: OK

Commit sugerido:
feat(login): implementa pantalla base de inicio de sesion
```

## Estrategia de implementacion

Actualizado 2026-09-14, segunda vuelta. Primera correccion: esta seccion decia "no depender de sad-aml-shared", y se corrigio a "usar shared primero, wrapper solo para ajustes puntuales, no modificar shared salvo completar un valor a medias". Segunda correccion (mismo dia): esa regla asumia que `sad-aml-shared` es una dependencia externa que se refresca y pisa lo local, como `node_modules`. El usuario aclaro que no es asi: Grupo Mutual jala `sad-aml-shared` al iniciar cada proyecto y se queda permanente, no se reemplaza por una libreria al pasar a produccion. Es una libreria compartida real, mantenida para que cualquier proyecto la extienda — mas parecido a un paquete compartido de monorepo que a una dependencia de solo lectura.

Con eso, el criterio para decidir donde va cada cosa **ya no es "cuanto hay que tocar"**, es **de quien es el componente**:

- **Generico y reutilizable por cualquier proyecto de Grupo Mutual** (Boton, Campo de texto, Checkbox, Modal, Select, Tabla — cualquier atomo/molecula de UI sin logica de negocio de DecPat) → construirlo o corregirlo **directo dentro de `src/sad-aml-shared`**, siguiendo sus convenciones de carpeta/exports/nombres. No crear un duplicado en `src/components` para evitar tocar shared.
- **Especifico de DecPat** (pantallas, el wizard de 12 pasos, calculos, servicios del dominio, cualquier composicion que no tenga sentido fuera de este flujo) → va en `src/components`/`src/app`/`src/services`/etc., nunca en `sad-aml-shared`.
- Esto tambien aplica a corregir comportamiento, no solo a agregar valores: si `sad-aml-shared` tiene un bug o una falta de accesibilidad en un componente generico (label sin `htmlFor`, keys aleatorias, etc.), se corrige ahi mismo. Ya no aplica la restriccion anterior de "no cambiar su comportamiento, solo completar valores a medias".
- Antes de crear algo nuevo en `sad-aml-shared`, seguir sus convenciones existentes (mismo patron de carpeta `Componente/Componente.tsx` + `.module.scss`, agregarlo al `index.ts` de Atoms/Molecules/Organisms que corresponda) para que no se note como un injerto ajeno si algun dia se sube al repositorio real.
- Motivo practico: como esta copia nunca hace push a un remoto real (ver seccion de contexto), el traspaso manual sigue siendo la unica via de llevar esto al repositorio real. Que la carpeta de esta copia coincida con el destino real (`sad-aml-shared` aqui → repo de shared alla; todo lo demas → repo de decpat-cloud) hace ese traspaso mecanico, sin tener que reclasificar componente por componente.
- Usar Figma como fuente visual para medidas, colores, tipografias, estados e intencion de componentes.
- Usar el Design System GM como referencia para tokens y componentes base cuando este disponible.

Registro de lo agregado a `sad-aml-shared` bajo la regla anterior (mas restrictiva), que sigue siendo valido, solo que ya no hace falta tratarlo como excepcion:
- `types/enum/Color.enum.ts` + `components/Atoms/Button/Button.module.scss`: `ColorEnum.Cta` y la clase `.cta` (usa `$accent-400`/`$accent-500`).
- `styles/settings/_colors.scss`: `$green-2026-400/300` y `$red-2026`, junto a los heredados.
- `styles/settings/_typography.scss`: `$fs-body-4` (12px), sobre `$_fs-12`.

Migrado 2026-09-14: `Checkbox` (antes en `src/components/Atoms/Checkbox`) ahora vive en `components/Atoms/Checkbox` dentro de `sad-aml-shared`, siguiendo su convencion de nombres (`checkbox__row`, `checkbox__input`, etc., igual que `inputText__label`). `InputText.tsx` se corrigio directo (label con `htmlFor`, error con `aria-describedby`/`aria-invalid`, se elimino el prop `maxlength` muerto que nunca funcionaba) en vez de mantener un `TextField` propio en paralelo. `src/components/Atoms/index.ts` ahora reexporta ambos directo de shared, sin wrapper. Las pruebas de ambos viven en `src/components/Atoms/index.test.tsx` (shared no corre Jest).

## Orden recomendado inicial

1. `DEC-001 Fundaciones visuales`: tokens CSS, estilos globales, tipografias, sombras, radios, spacing.
2. `DEC-002 Componentes base`: Button, TextField, PasswordField, Checkbox, Select/Dropdown, Modal.
3. `DEC-003 Login base`: pantalla normal de inicio de sesion.
4. `DEC-004 Estados y modales de login`: error de credenciales, exceso de intentos, ayuda.
5. `DEC-005 Shell interno`: header, sidebar/base transaccional, contenedor de contenido.
6. `DEC-006 Wizard/Stepper`: componente programatico para pasos 1 a 12.
7. `DEC-007+`: pasos de declaracion patrimonial, uno por tarea o por grupo funcional pequeno.

## Criterios para tocar archivos adicionales

Antes de editar, explicar brevemente que archivos o areas se van a tocar y por que.

Es aceptable tocar archivos adicionales cuando sea necesario para completar la tarea, por ejemplo:

- Agregar exports en `index.ts`.
- Crear tipos en `src/types`.
- Crear hooks en `src/utils/hooks`.
- Ajustar tokens o estilos globales.
- Agregar o actualizar tests.
- Conectar una pagina en `src/app`.

Evitar mezclar cambios no relacionados. Si aparece una mejora ajena al alcance, dejarla para otra tarea.

## Validacion

Ejecutar las validaciones razonables segun el cambio:

- `npm run check-types` para TypeScript.
- `npm run test` para pruebas.
- `npm run build` cuando cambien pantallas, Next.js config, rutas o estilos globales.
- Revision visual contra Figma cuando el cambio sea de interfaz.

Si una validacion no se puede ejecutar, indicarlo claramente en el cierre de la tarea.

## Figma y sistema de diseno

- Para implementaciones visuales, tomar como referencia el Figma de flujo de DecPat y el Figma de Design System GM.
- No copiar jerarquias de Figma de forma literal cuando esten hechas con grupos o posiciones absolutas.
- Traducir la intencion visual a componentes React mantenibles.
- Priorizar componentes programaticos y reutilizables sobre replicas capa por capa.
- Registrar cualquier diferencia necesaria entre Figma y la implementacion.

## Cuidado con recursos corporativos

- No intentar inicializar submodulos corporativos sin autorizacion explicita.
- No ejecutar comandos que descarguen codigo privado de Grupo Mutual desde GitLab u otro servicio empresarial.
- No asumir acceso a paquetes, assets, fuentes o componentes internos si no estan presentes en esta copia local.
- Si falta algo exclusivo, crear una alternativa local propia o detenerse y reportar la dependencia.

## Principio general

Desarrollar como si este fuera un proyecto propio, limpio y autosuficiente, pero manteniendo suficiente trazabilidad para que el usuario pueda copiar cada tarea al repositorio real en orden y con seguridad.
