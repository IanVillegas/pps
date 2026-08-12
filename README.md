
# �️ sad-aml-security

Microfrontend para la gestión de seguridad en la plataforma SAD-AML de Grupo Mutual. Este proyecto sigue las mejores prácticas de desarrollo frontend, empleando Next.js, TypeScript, Atomic Design y una arquitectura escalable y mantenible.


## 6. Ejecuta el proyecto en modo desarrollo

```bash
npm run dev
```

## 7. Configura el repositorio remoto y sube tu código

```bash
git add .
git commit -m "feat: inicializa microfrontend basado en arquetipo"
git push -u origin main
```

## 8. Adapta la funcionalidad

- Implementa las páginas, componentes y lógica específica de tu microfrontend siguiendo las metodologías y convenciones del arquetipo (Atomic Design, Git Flow, etc.).
- Usa los scripts y herramientas ya configurados (`lint`, `test`, `build`, etc.).

---

**Recuerda:**

- Mantén la estructura y convenciones para facilitar la mantenibilidad y escalabilidad.
- Consulta este README y la documentación del arquetipo para dudas sobre scripts, dependencias o estructura.

¡Listo! Ya tienes la base para tu nuevo microfrontend siguiendo las mejores prácticas del equipo 🚀

# Grupo Mutual - Admin ML

¡Hola y bienvenidx! Comenzar en un nuevo proyecto tiene sus tropiezos. No te preocupes. Aquí tienes lo necesario para que nos acompañes en el camino. 😀

### Requisitos

Antes de continuar asegúrate de tener instalado en tu máquina lo siguiente:

1. Git
2. Node.js (verion >=18.17.0) con NPM (version >=9.8.0)
3. Un editor de texto. Nos encanta [VSCode](https://code.visualstudio.com/)

## Empezando

1. Clona el proyecto. (https://grupomutual.atlassian.net/wiki/spaces/AdminML/pages/3529212002/C+mo+crear+un+nuevo+microfrontend+a+partir+de+este+arquetipo?atlOrigin=eyJpIjoiNWZhYzcyZmRmMGIwNDVlMTgwMjBiNjk1YjM3ODYwMDQiLCJwIjoiYyJ9)
2. Instala las dependencias ejecutando: `npm install`
3. Listo, ahora puedes ejecutar el proyecto en tu máquina. Conoce los scripts que puedes ejecutar en la sección _Scripts definidos en el package.json_.

### Scripts definidos en el package.json

Ejecuta `npm run <nombre_script>` reemplazando `<nombre_script>` por uno de los siguientes:

- **dev**: Iniciar el proyecto en el puerto 3000.
- **build**: Compilar el proyecto para producción.
- **start**: Iniciar el proyecto compilado.
- **start-0**: Iniciar el proyecto compilado en el puerto 3000.
- **test**: Ejecutar los tests con Jest.
- **test:ci**: Ejecutar los tests en modo CI con cobertura.
- **lint**: Reporta malas prácticas en el código que debemos mejorar.
- **lint-fix**: Corrige automáticamente algunas de las malas prácticas reportadas.
- **lint-staged**: Reporta malas prácticas sobre archivos preparados para commit.
- **prepare**: Configurar Husky para git hooks.
- **check-updates**: Muestra las versiones más recientes de las dependencias.
- **update**: Actualiza las dependencias del package.json y las instala.
- **check-types**: Verificar que el tipado TypeScript cumpla con las configuraciones.
- **format**: Formatea todos los archivos con Prettier.

💡 Probablemente uses `npm run dev` más que los otros para desarrollo.

## Metodologías

Estas son algunas de las metodologías que usamos. Aplícalas.

- Atomic Design
- Git Flow
- Diseño web mobile-first
- Commits convencionales
- Pattern Adapter

### Ramas de Git

Las siguientes son ramas principales del proyecto:

- develop: Aquí sí, esta rama refleja el ambiente de desarrollo.
- cert: El equipo de calidad usa esta rama para asegurar la calidad del producto.
- release: Rama que contiene la versión final de un sprint
- preprod: Rama para el ambiente de preproducción
- prod: Rama principal usada para producción. ¡No trabajes aquí!

Recuerda que usamos Git Flow.

### Stack tecnológico

- **Node.js** (versión >=18.17.0) y **NPM** (versión >=9.8.0)
- **Next.js** 15.4.4 - Framework React para aplicaciones web
- **React** 19.1.0 - Biblioteca para interfaces de usuario
- **TypeScript** 5.8.3 - Superset tipado de JavaScript
- **Sass (SCSS)** - Preprocesador CSS
- **Redux Toolkit** 2.8.2 - Gestión de estado
- **React Hook Form** 7.61.1 - Manejo de formularios
- **Material-UI** 7.2.0 - Componentes de interfaz
- **Radix UI** - Componentes de interfaz primitivos
- **Axios** 1.11.0 - Cliente HTTP
- **i18next** - Internacionalización
- **Jest** 30.0.5 - Framework de testing
- **React Testing Library** 16.3.0 - Utilidades de testing
- **ESLint** + **Prettier** - Linting y formateo de código
- **Husky** - Git hooks
- **Atomic Design** - Metodología de diseño de componentes
- **Pattern Adapter** - Patrón de diseño
- **Git Submodule** (`sad-aml-shared`) - Componentes compartidos

#### Extensiones recomendadas para el editor:

- EditorConfig
- ESLint
- Prettier
- TypeScript and JavaScript Language Features

### Estructura de carpetas

```
sad-aml-security/
├── public/
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── fonts/
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── page.tsx
│   │   └── providers/
│   ├── assets/
│   │   └── index.ts
│   ├── components/
│   │   ├── Atoms/
│   │   ├── Molecules/
│   │   ├── Organisms/
│   │   ├── Pages/
│   │   └── Templates/
│   ├── redux/
│   │   └── store.ts
│   ├── sad-aml-shared/ 
│   │   ├── assets/
│   │   ├── components/
│   │   ├── configs/
│   │   ├── models/
│   │   ├── providers/
│   │   ├── public/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── translations/
│   │   ├── types/
│   │   └── utils/
│   ├── services/
│   │   ├── index.ts
│   │   ├── UserService.ts
│   │   └── adapters/
│   ├── styles/
│   │   ├── globals.d.ts
│   │   └── globals.scss
│   ├── translations/
│   │   ├── en/
│   │   └── es/
│   ├── types/
│   │   └── HomePage.types.ts
│   └── utils/
│       ├── hooks/
│       └── index.ts
├── eslint.config.mjs
├── jest.config.ts
├── jest.setup.ts
├── next.config.js
├── package.json
├── README.md
├── tsconfig.json
```

### Convenciones

- Usa [pascal-case](https://www.theserverside.com/definition/Pascal-case) para nombrar archivos y directorios.
- Considera usar sufijos como `.test.ts`, `.interface.ts`, `.type.ts`, `.adapter.ts` o `.service.ts` para nombrar archivos.

### Dependencias principales

#### Dependencias de producción

- **@emotion/react** & **@emotion/styled** - Biblioteca CSS-in-JS
- **@mui/material** & **@mui/x-date-pickers** - Material-UI components
- **@radix-ui/** - Componentes primitivos accesibles (alert-dialog, checkbox, dropdown-menu, etc.)
- **@reduxjs/toolkit** - Herramientas modernas para Redux
- **axios** - Cliente HTTP para APIs
- **react-hook-form** - Gestión eficiente de formularios
- **react-i18next** & **i18next** - Internacionalización
- **react-redux** - Integración de Redux con React
- **yup** - Validación de esquemas

#### Dependencias de desarrollo

- **@testing-library/jest-dom** & **@testing-library/react** - Herramientas de testing
- **jest** & **jest-environment-jsdom** - Framework de testing
- **eslint** & **prettier** - Linting y formateo
- **husky** & **lint-staged** - Git hooks y linting pre-commit
- **ts-jest** & **typescript** - Soporte para TypeScript en tests

### Variables de entorno

| Nombre                  | Descripción        |
| ----------------------- | ------------------ |
| NEXT_PUBLIC_ENVIRONMENT | Nombre del entorno |

## Recursos

- [https://midu.dev/buenas-practicas-escribir-commits-git/](https://midu.dev/buenas-practicas-escribir-commits-git/)
- [https://www.conventionalcommits.org/es/v1.0.0-beta.2/](https://www.conventionalcommits.org/es/v1.0.0-beta.2/)
