# Arquitectura y estructura

Estado: base técnica revisada. Revisión: 27 de octubre de 2026.

El frontend utiliza Next.js 15.4.4, React 19.1 y TypeScript 5.8.3, según `package.json`. Los estilos utilizan Sass y módulos SCSS. Jest y React Testing Library permiten verificar comportamiento de componentes y servicios. La presencia de una dependencia instalada no implica que todas las pantallas la utilicen.

| Ubicación | Responsabilidad |
| --- | --- |
| `src/app` | Rutas, layouts y composición inicial. |
| `src/components/Pages` | Pantallas y contenido de los pasos. |
| `src/components/Organisms` | Diálogos de cada paso y notificaciones; reexporta los organismos genéricos de shared. |
| `src/components/Templates` | Estructura de navegación interna. |
| `src/sad-aml-shared` | Componentes, estilos, utilidades y tipos genéricos, **propios de este sistema** (ver más abajo). |
| `src/services` | Servicios simulados (`[SIMULADO]`) y el punto de integración con la API (`api/`, `[INTEGRACION]`). El mapa está en `src/services/README.md`. |
| `src/utils/hooks` | Coordinación entre servicios y componentes. |
| `src/types` | Contratos de datos del frontend. |
| `src/styles` | Estilos globales y tokens propios. |

`src/sad-aml-shared` forma parte de este sistema: no se refresca desde el repositorio de Grupo Mutual y se entrega con él. Todo componente genérico, sin lógica de negocio de DecPat, vive ahí con sus estilos y sus pruebas (Jest no excluye esa carpeta); lo específico del flujo patrimonial permanece en `src/components`. Los índices `@/components/Atoms`, `Molecules` y `Organisms` reexportan desde shared para que las pantallas importen desde una ubicación estable. Ver la [guía de componentes](03-guia-de-componentes.md).

`src/components/Pages/Declaration/DeclarationWizard/stepDefinitions.tsx` relaciona los pasos con su contenido y sus validaciones. `src/utils/declarationSteps.ts` define los doce títulos de navegación. Mantener ambos registros coordinados al agregar contenido.

`DeclarationService` conserva el borrador en memoria y notifica cambios a sus suscriptores. `SessionService` mantiene una sesión de demostración y elimina el borrador al cerrar sesión. Una recarga pierde ambos estados. El borrador patrimonial no se almacena en `localStorage`; `AuthService` utiliza ese almacenamiento para recordar el nombre de usuario.

Los servicios de totales representan respuestas simuladas del backend. La integración real requiere acordar contratos, errores y persistencia; su sustitución puede exigir ajustes en tipos, hooks y pruebas, además del servicio. Los catálogos se leen mediante un almacén (`CatalogService`, `useCatalog`) que ya sabe pedirlos de forma asíncrona. Detalle en [integración con el backend](09-integracion-con-el-backend.md).

`ConfidentialReportService` y `FinalizationService` mantienen estados propios, separados del borrador: las respuestas del cuestionario confidencial no se almacenan con la declaración patrimonial, y el guardado del juramento tiene sus propios estados. Ambos se borran al cerrar sesión. El [contrato de API](08-contrato-api.md) describe qué pasará a pedirse a un backend y cómo se reemplazarán estos servicios.

## Ejecución local

El README declara Node.js >=18.17.0 y npm >=9.8.0. Estos mínimos deben verificarse contra el entorno aprobado para la entrega. El script `npm run dev` abre el servidor en el puerto 3004. La instalación debe respetar el archivo de dependencias bloqueadas y las restricciones de acceso a recursos institucionales.

La configuración de ejemplo está en `.env.local.example`. El README identifica `NEXT_PUBLIC_ENVIRONMENT` y `NEXT_PUBLIC_API_BASE_URL`. Esta última la lee `src/services/api/apiClient.ts`: vacía, el sistema usa datos simulados (valor por defecto); definida, solo se piden los catálogos al servidor, porque los demás servicios siguen simulados. Antes del despliegue deben confirmarse configuración, compatibilidad de dependencias y procedimiento institucional.

Fuentes: `package.json`, [README](../README.md), `src/services/DeclarationService.ts`, `src/services/SessionService.ts` y `src/services/AuthService.ts`.
