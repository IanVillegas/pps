# DecPat Cloud

Frontend del Sistema de Declaración Patrimonial de Grupo Mutual: acceso, inicio informativo, wizard de doce pasos y estados de envío. Construido con Next.js (App Router), TypeScript y Atomic Design.

Esta es una **copia local de trabajo** para desarrollar con asistencia de IA (ver [AGENTS.md](AGENTS.md)) y luego copiar manualmente los cambios al repositorio real de Grupo Mutual. No está conectada a ningún remoto corporativo.

## Documentación del proyecto

- [AGENTS.md](AGENTS.md) — reglas de trabajo, alcance de este repositorio y criterio para usar/extender `sad-aml-shared`.
- [tasks/plan.md](tasks/plan.md) — presupuesto de horas y cronograma.
- [tasks/todo.md](tasks/todo.md) — tareas verificables, dependencias y registro de cierre de cada una.
- [tasks/preparacion-tecnica-visual.md](tasks/preparacion-tecnica-visual.md) — inventario de Figma, brechas contra `sad-aml-shared` y decisiones pendientes (D-01 a D-15).

## Requisitos

1. Node.js >=18.17.0 y npm >=9.8.0.
2. Git.

## Empezando

```bash
npm install
npm run dev
```

El proyecto corre en `http://localhost:3004` (puerto fijado en el script `dev`, ver `package.json`). Sin `basePath`: las rutas no llevan prefijo (ver `next.config.js`).

## Scripts principales

| Script              | Qué hace                                              |
| -------------------- | ------------------------------------------------------ |
| `npm run dev`         | Servidor de desarrollo en el puerto 3004.               |
| `npm run build`       | Build de producción.                                    |
| `npm run start`       | Sirve el build ya compilado.                            |
| `npm run test`        | Corre las pruebas con Jest (`src/sad-aml-shared/` está excluido). |
| `npm run check-types`  | Verifica tipos con `tsc --noEmit`.                      |
| `npm run lint`         | ESLint.                                                 |
| `npm run lint-fix`     | ESLint con `--fix`.                                     |
| `npm run format`       | Prettier sobre todo el proyecto.                        |

Antes de dar por cerrada una tarea se corren `check-types`, `lint` y `test`; `build` además cuando cambian rutas, páginas o estilos globales (criterio V1/V2 documentado en `tasks/todo.md`).

## Variables de entorno

Copiar `.env.local.example` a `.env.local`. Solo dos variables son leídas por el código hoy (verificado, no son un listado aspiracional):

| Variable                     | Uso                                                                                   |
| ----------------------------- | --------------------------------------------------------------------------------------| 
| `NEXT_PUBLIC_ENVIRONMENT`     | `next.config.js` la usa para decidir si se quitan los `console.log` en build.         |
| `NEXT_PUBLIC_API_BASE_URL`    | Base URL del cliente Axios de `sad-aml-shared`. Sin uso activo: el alcance actual es frontend con datos simulados (ver `AGENTS.md`), no hay adaptador real conectado. |

## Estructura de carpetas

```
decpat-cloud/
├── public/
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── app/                  # Rutas (App Router)
│   ├── assets/                # Assets propios de DecPat (ver src/assets/README.md)
│   ├── components/
│   │   ├── Atoms/              # Reexporta sad-aml-shared o componentes propios (ver AGENTS.md)
│   │   ├── Molecules/
│   │   ├── Organisms/
│   │   ├── Pages/
│   │   └── Templates/
│   ├── sad-aml-shared/         # Copia local del Design System GM; usar primero, ver AGENTS.md
│   ├── services/
│   ├── styles/
│   │   └── _tokens.scss        # Tokens propios (solo lo que GM no tiene, ej. radios)
│   ├── types/
│   └── utils/
├── tasks/                     # Plan, backlog y registro de cierre de cada tarea
├── AGENTS.md
├── next.config.js
├── package.json
└── README.md
```

## Convenciones

- Componentes propios en PascalCase por carpeta (`Componente/Componente.tsx` + `.module.scss` + `.test.tsx`).
- Sufijos como `.test.ts`, `.types.ts`, `.service.ts` para archivos no-componente.
- Antes de crear un componente nuevo, revisar si `sad-aml-shared` ya lo tiene (ver criterio en `AGENTS.md`, sección "Estrategia de implementación").
- Commits en español, Conventional Commits (ver `AGENTS.md`, sección "Regla de commits"). Nunca commitear ni hacer push sin permiso explícito del usuario.

## Stack técnico

Next.js 15.4, React 19.1, TypeScript 5.8, Sass (SCSS Modules), Redux Toolkit, React Hook Form, Radix UI (vía `sad-aml-shared`), Axios, Jest + React Testing Library, ESLint + Prettier.
