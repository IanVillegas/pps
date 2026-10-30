# DecPat Cloud — plan del video (versión animada)

## Qué es
DecPat es el sistema de Declaración Patrimonial de Grupo Mutual: cada colaborador entra, completa
un wizard de 12 pasos y firma bajo juramento.

- **Para quién:** colaboradores de Grupo Mutual (una vez al año) y Talento Humano.
- **Qué lo distingue:** un trámite legal pesado (Ley 7786) convertido en un flujo guiado que valida
  lo obligatorio, registra ingresos, bienes y créditos con sus modales, y cierra con firma.
- **Hook:** "12 pasos. Una firma." con el stepper encendiéndose punto por punto.
- **Caption:** "DecPat Cloud: la Declaración Patrimonial de Grupo Mutual, de 12 pasos a una firma."

## Decisiones (acordadas con Ian)
- Duración 45–60 s → **58.9 s** (27 compases a 110 BPM).
- Tono institucional elegante, solo música (sin narración).
- Secciones: paso 1, ingresos (3), bien inmueble (4), vehículo (5), créditos (8), juramento y guardado.
- Estado extra: modal de bienvenida.
- Cierre con curso, universidad, año y autor.
- Datos reales de Ian con lo sensible parcialmente oculto.

## Técnica
No son capturas planas: cada estado de la app se guardó como **HTML real** (DOM + CSS de DecPat, sin
scripts) y la composición anima elementos dentro de ese DOM: tecleo letra por letra, dropdowns que se
seleccionan, modales que entran con rebote y salen al guardar, fila nueva que aparece resaltada, aviso
"Guardado satisfactoriamente" que se desliza, indicador del stepper que viaja entre pasos, totales que
cuentan hacia arriba y spinner al guardar. Cursor, clics y efectos de sonido van en el grid del beat.

## Storyboard (compases de 2.18 s)

| Compases | Escena | Qué se anima | Texto en pantalla |
|---|---|---|---|
| 0–2 | Hook | Stepper 1→12 se enciende, titulares entran | "12 pasos. Una firma." |
| 2–4 | Login | Marca y panel entran; se escribe `ian.villegas` y la contraseña; clic en Ingresar | — |
| 4–5 | Inicio | Menú y tarjetas entran; clic en "Mi declaración" | — |
| 5–6 | Bienvenida | Modal "Declaración Patrimonial Funcionarios" entra y se cierra con "Entendido" | — |
| 6–9 | Paso 1 | Los 11 campos se llenan uno a uno | "Datos generales, completos antes de avanzar" |
| 9–12 | Paso 3 | Stepper 1→3; Agregar nuevo → modal Alquileres ₡350,000 → fila + aviso | "Ingresos adicionales, con su justificación" |
| 12–15 | Paso 4 | Stepper 3→4; modal finca en Canoas ₡70,000,000 (Herencia, Alquiler) → fila + aviso | "Bienes inmuebles con su valor de mercado" |
| 15–18 | Paso 5 | Stepper 4→5; modal BMW X6 2026 → fila + aviso | "Vehículos con placa, año y valor" |
| 18–21 | Paso 8 | Stepper 5→8; modal crédito Grupo Mutual → fila + totales que cuentan | "Créditos y cuotas, totalizados al instante" |
| 21–24 | Cierre | Stepper 8→12; juramento párrafo a párrafo; Guardar → confirmación → spinner → aviso + "ding" | "Se firma bajo juramento" |
| 24–27 | Outro | Logo, "DecPat Cloud", curso, universidad y autor | créditos |

## Datos mostrados
| Campo | En el video |
|---|---|
| Usuario | ian.villegas (contraseña solo como puntos) |
| Nombre | Ian Villegas Jiménez |
| Cédula | 2-0780-•••• |
| Teléfono habitación | ••••-•••• |
| Celular | 6104-•••• |
| Agencia | CN Alajuela (el catálogo simulado no la trae; se reemplazó solo el texto visible) |
| Dirección | Las Cañas, Alajuela |
| Finca | 1234••••• |
| Placa | ISO••• |
| N.º de préstamo | PR-••••-0418 |

Los salarios de planilla (1,500,000 / 1,200,000) son los que trae el sistema simulado.
