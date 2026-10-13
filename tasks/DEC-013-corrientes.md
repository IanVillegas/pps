# DEC-013 Cuentas corrientes (paso 7)

Implementada y validada el 2026-10-13.

## D-15 resuelta por el usuario

El borde rojo exterior que Figma dibuja en el paso 7 (y los bordes rojos o amarillos que aparezcan en otras pantallas) son **anotaciones del propio usuario**, cosas que tenía que preguntar; **no son parte del diseño visual** y no se replican. Queda cerrada D-15.

## Implementación

- **Paso** `src/components/Pages/Declaration/CurrentAccounts/CurrentAccounts.tsx` (nodo Figma 43121:3695), registrado como paso 7 en `stepDefinitions.tsx`, **sin `validate`**: la tabla de montos puede quedar vacía y aun así continuar (D-16), mismo criterio que los demás pasos de tabla.
- **Cuentas corrientes de Grupo Mutual** (tabla de solo lectura, sin acciones, como en Figma): número de cuenta/título, nombre de dueño, parentesco, monto, moneda y entidad. Las entrega el backend (`fetchGroupCurrentAccounts`); la persona no las edita. Mientras llegan se muestra «Cargando cuentas de Grupo Mutual…»; si falla, «No se pudieron cargar las cuentas de Grupo Mutual» más el toast de error; si no hay, «No hay cuentas corrientes de Grupo Mutual».
- **«Indique los montos a la fecha»**: tabla con alta, edición y retiro de las cuentas que agrega la persona (entidad financiera, saldo actual y moneda), con `RecordsTable`. Cada cambio se guarda en el borrador al instante y avisa con un toast (D-11).
- **Modal** `src/components/Organisms/CurrentAccountDialog/CurrentAccountDialog.tsx` (nodo Figma 43121:3674, «Datos económicos», 575 px): entidad financiera (lista), saldo actual (solo dígitos) y moneda (lista), los tres obligatorios. «Agregar» al crear y «Guardar» al editar (Figma solo dibuja el alta). Cancelar no altera la fila.
- **Saldos por moneda** («Saldos de cuentas corrientes», Colones y Dólares, separados): los entrega el backend, igual que en los pasos 3 y 6 (D-10). `src/services/CurrentAccountsService.ts` simula la respuesta: suma las cuentas de Grupo Mutual más las agregadas, cada moneda por separado, **sin convertir ni mezclar** (provisional, reemplazable por la API real). `src/utils/hooks/useCurrentAccounts.ts` pide las cuentas de Grupo Mutual una sola vez y los saldos en cada cambio, y descarta respuestas viejas; si un refresco falla conserva el último saldo.
- **Datos de prueba**: la cuenta de Grupo Mutual simulada la ajustó el usuario a un ejemplo con aspecto real («100-200-30000000», «Ian Villegas Jiménez», parentesco «Principal»); sigue siendo un dato sintético que vive solo en `CurrentAccountsService.ts`. «Principal» no está en el catálogo de relaciones (la tabla muestra el valor tal cual); cuando el backend defina el catálogo real de parentescos habrá que alinearlo.

## Validación

- `check-types`, `lint` y 250 pruebas: OK (24 nuevas: 3 de validación del modal, 3 del servicio simulado, 5 del hook, 13 del paso — cuentas de Grupo Mutual sin acciones de edición, vacío y carga, fallo del backend, tabla vacía de montos, listado con catálogos legibles, modal con sus tres campos y errores, solo dígitos, alta con aviso y nuevo pedido de saldos, cancelar sin alterar, editar con datos precargados, retirar con aviso, saldos por moneda y guion mientras llegan —).
- V3 en navegador (sesión local de prueba): la pantalla coincide con Figma (tabla de Grupo Mutual, montos a la fecha, saldos, botones); el modal coincide; se agregó una cuenta de «Banco 1 (mock)» por 1,500 en dólares con el toast «Guardado satisfactoriamente» y el saldo en dólares pasó de $ 0.00 a $ 1,500.00 mientras colones siguió en ₡ 250,000.00. Sin errores de consola.

## Diferencias y pendientes contra Figma

- Figma dibuja «No existen registros.» con punto final; se usa el texto estándar de la tabla, sin punto (igual que el resto de los pasos).
- Los saldos de muestra de Figma son «₡ 1,897.45» y «$ 1,000» (con y sin decimales); se usa el mismo formato de dos decimales en ambos (D-10), como en el paso 6.
- Con ancho de tablet (768) las tablas hacen scroll horizontal dentro de sí mismas (`min-width` de `RecordsTable`, DEC-002F); la de Grupo Mutual tiene seis columnas.
- Catálogos sintéticos (D-09); la lista de entidades incluye «Grupo Mutual», que es el ejemplo de Figma.
- Eliminar no pide confirmación, mismo criterio que el resto de las tablas.
