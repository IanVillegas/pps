# Juramento y cierre

Estado: segunda vista del paso 12 implementada con confirmación y un guardado simulado. Revisión: 27 de octubre de 2026.
Código: `c789b079859bd590e4180cb0ac3ae08fec58b781`. Seguimiento: DEC-018B; documentación: DOC-015.

## Flujo

El paso 12 tiene dos vistas. En la primera, el [cuestionario confidencial](cuestionario-confidencial.md), el botón de la derecha se rotula «Terminar» y está habilitado. Al pulsarlo no se abre otro paso: aparece la declaración bajo juramento, con el título del paso y un único botón «Guardar» (sin «Regresar»). «Guardar» no guarda directamente: abre un diálogo de confirmación (ver más abajo). El texto menciona al Conglomerado Financiero **Grupo Mutual**; la variante con «Grupo Mutual Alajuela - La Vivienda» que trae el diseño ya no se usa. Si la persona abandona el paso sin guardar, al volver ve de nuevo el cuestionario.

## Confirmación del guardado

`ConfirmSaveDialog` (nodo de diseño 43310:470704, tamaño `md` de `AppDialog`) se titula «Confirmación» y advierte que, al guardar, los datos no podrán cambiarse y la firma quedará registrada en la declaración, con la pregunta «¿Está seguro(a) de que desea guardar su declaración?». Solo el botón «Guardar» del diálogo inicia el guardado simulado; «Cancelar», la X y Escape lo cierran sin guardar y el juramento queda como estaba. Si el guardado falla, «Guardar» vuelve a abrir el diálogo para reintentar. Tras confirmar se muestran el indicador de carga y, al terminar, el aviso y el botón «Guardado» deshabilitado, sin salir del paso: el diseño no dibuja ninguna pantalla posterior.

El texto conserva las faltas de ortografía del diseño («podran», «sera»), por confirmar con el negocio. El diseño nombra «Guardar definitivamente» en el texto, mientras el botón se llama «Guardar»; el texto se cambió a «Guardar» para que coincida con el botón.

## Estados del guardado

`FinalizationService` mantiene el estado del cierre, separado del borrador y del cuestionario. `useFinalization` lo expone.

| Estado | Significado y presentación |
| --- | --- |
| `idle` | Cuestionario visible. |
| `oath` | Juramento visible y «Guardar» disponible. |
| `sending` | Guardando: el botón muestra el indicador de carga y queda bloqueado. |
| `done` | El servicio confirmó el guardado: aparece «Guardado satisfactoriamente» y el botón pasa a «Guardado», deshabilitado. |
| `error` | El servicio falló: aparece «La solicitud no fue procesada. Inténtelo de nuevo» y «Guardar» queda disponible para reintentar. |

- **El éxito se declara solo cuando termina la respuesta simulada**, nunca antes.
- **El envío repetido se controla**: con un guardado en curso o ya terminado, otra llamada se ignora; tres clics seguidos producen un solo guardado.
- El cierre de sesión borra el estado y descarta la respuesta de un guardado que seguía en curso, para que no se confirme en la sesión siguiente.

## Simulación

El guardado simulado espera aproximadamente 800 ms y no envía datos a ningún lugar. El usuario de demostración `cierre.error` reproduce el estado de error; no es una política de seguridad. Cuando exista la API, solo cambia `submitDeclaration` (ver [contrato](../08-contrato-api.md), sección de finalización).

## Contenedor de pasos

El contenedor admite dos opciones nuevas en cada definición de paso: `ownActions`, por la cual el paso recibe los botones del contenedor y decide si y dónde mostrarlos (el contenedor sigue dibujando la tarjeta), y `onFinish`, que define qué hace «Continuar» en el último paso. Sin `onFinish`, el botón del último paso permanece deshabilitado. El paso 12 usa ambas: `onFinish` abre el juramento y, en esa vista, oculta los botones del contenedor. Ver [declaración y borrador](declaracion-y-borrador.md).

## Continuidad

Referencias: `src/components/Pages/Declaration/Completion/Completion.tsx`, `src/services/FinalizationService.ts`, `src/utils/hooks/useFinalization.ts` y `DeclarationWizard`.

Referencias: además de las anteriores, `src/components/Organisms/ConfirmSaveDialog/ConfirmSaveDialog.tsx`.

Pendientes: la evidencia de aceptación del juramento (fecha, versión del texto), la secuencia real de finalización, si la declaración enviada queda en solo lectura (D-13) y la ortografía del texto de la confirmación. Evidencia en [validación](../06-validacion-y-calidad.md).
