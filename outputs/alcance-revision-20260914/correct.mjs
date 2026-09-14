import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';
const dir = new URL('./',import.meta.url);
const outputPath='C:/Ian/DecPat/decpat-cloud/outputs/alcance-revision-20260914/Alcance_avance_intermedio_corregido.xlsx';
const verify=process.argv.includes('--verify');
const expectedFuture=180;
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(verify?outputPath:'C:/Ian/DecPat/decpat-cloud/outputs/alcance-revision-20260914/Alcance_avance_intermedio_actualizado.xlsx'));
const general=wb.worksheets.getItemAt(0),dash=wb.worksheets.getItemAt(9);
if(process.argv.includes('--audit')){
 console.log((await wb.inspect({kind:'table',sheetId:wb.worksheets.getItemAt(3).name,range:'A1:F16',tableMaxRows:16,tableMaxCols:6,maxChars:4000})).ndjson);
 const pic=await wb.render({sheetName:wb.worksheets.getItemAt(3).name,range:'A1:F16',scale:1,format:'png'});
 await fs.writeFile(new URL('correction-before.png',dir),new Uint8Array(await pic.arrayBuffer()));
 process.exit(0);
}
const totals=[13,21,13,15,13,12,11,8];
const realBefore=JSON.stringify(dash.getRange('A25:E31').values);
const set=(s,c,v)=>{s.getRange(c).clear({applyTo:'contents'});s.getRange(c).values=[[v]];};
const f=(s,c,v)=>s.getRange(c).formulas=[[v]];
if(!verify){
const analysis=[
 ['Verificar inducción, accesos y recursos disponibles',3,'Recursos y ambiente de trabajo identificados. Registrar dependencias pendientes.'],
 ['Analizar login, inicio informativo y acceso a Mi declaración',4,'Flujo de entrada con información de DecPat, ayuda y modal introductorio identificado.'],
 ['Analizar Datos generales, Núcleo familiar e Ingresos y egresos',5,'Campos, reglas, cálculos, PDF y operaciones de los pasos 1 a 3 identificados.'],
 ['Analizar Bienes inmuebles, Bienes muebles y Depósitos y ahorros',5,'Listados, formularios dentro de modales, monedas y operaciones de los pasos 4 a 6.'],
 ['Analizar Cuentas corrientes, Créditos y Tarjetas de crédito',5,'Datos, cálculos, validaciones y estados de los pasos 7 a 9 identificados.'],
 ['Analizar Personería jurídica, Datos judiciales, cuestionario confidencial y juramento',5,'Cierre del flujo identificado. Las respuestas confidenciales se separan de los datos patrimoniales.'],
 ['Inventariar necesidades de integración con sad-aml-shared',5,'Mapeo de controles, tablas, modales y mensajes requeridos. Sin estimar una biblioteca nueva.'],
 ['Definir alcance, exclusiones y criterios de aceptación',4,'Frontend con mocks, Chrome y entregas navegables quincenales.'],
 ['Estimar tareas de integración y lógica de negocio',3,'Cronograma por entregables, dependencias y pruebas, sujeto a seguimiento.'],
 ['Realizar seguimiento quincenal',1,'Revisión de alcance y registro de acuerdos con el supervisor.']
];
const design=[
 ['Alinear el flujo visual con el sistema de diseño existente',3,'Navegación y patrones visuales de referencia. Reutilizar controles existentes.'],
 ['Definir el login y sus estados en Figma',2,'Login, validaciones, errores, bloqueo y ayuda documentados.'],
 ['Definir la pantalla de inicio informativa',2,'Información de DecPat, ayuda y acceso lateral a Mi declaración.'],
 ['Definir el modal de introducción y entrada al formulario',2,'Acceso al paso 1 sin duplicar pantallas de entrada.'],
 ['Definir Datos generales',2,'Paso 1 y estados de sus controles.'],
 ['Definir Núcleo familiar y su modal',3,'Paso 2 con listado, alta, edición, eliminación y estados vacíos.'],
 ['Definir Ingresos y egresos y el manejo de PDF',4,'Paso 3 con campos, cálculos, archivo y mensajes de error.'],
 ['Definir Bienes inmuebles y su modal',3,'Paso 4 con listado y formulario de registro dentro del modal.'],
 ['Definir Bienes muebles y su modal',3,'Paso 5 con listado, formulario y condiciones.'],
 ['Definir Depósitos y ahorros',2,'Paso 6 con monedas, totales y operaciones.'],
 ['Definir Cuentas corrientes',2,'Paso 7 con campos, listado y modal.'],
 ['Definir Créditos',2,'Paso 8 con cuotas, saldos y validaciones.'],
 ['Definir Tarjetas de crédito',2,'Paso 9 con monedas, cuotas y saldos.'],
 ['Definir Personería jurídica y sociedades',2,'Paso 10 con sus dos modales y campos condicionales.'],
 ['Definir Datos judiciales',2,'Paso 11 y sus condiciones de captura.'],
 ['Definir el cuestionario confidencial',2,'Paso 12 con preguntas, campos condicionales y separación de respuestas.'],
 ['Definir el juramento y la finalización',1,'Aceptación, carga, éxito y error del cierre simulado.'],
 ['Realizar seguimiento quincenal',1,'Revisión del flujo visual y registro de acuerdos.']
];
const preparation=[
 ['Verificar la configuración del arquetipo existente',3,'Entorno, scripts y dependencias revisados. Aprovechar el proyecto disponible.'],
 ['Configurar rutas y conectar la estructura existente',6,'Pantallas y contenedor conectados al arquetipo, aprovechando sad-aml-shared.'],
 ['Definir contratos de datos y escenarios simulados',6,'Datos de prueba, estados y contratos separados de la interfaz. Cuestionario independiente.'],
 ['Integrar el login con sad-aml-shared',5,'Campos, botones y mensajes existentes conectados a datos simulados.'],
 ['Implementar validaciones y estados del login',3,'Acceso válido, errores, bloqueo y ayuda usando los controles compartidos.'],
 ['Integrar la pantalla de inicio informativa',5,'Información de DecPat, ayuda, header y sidebar con componentes existentes.'],
 ['Conectar la introducción y el acceso a Mi declaración',5,'Modal introductorio y entrada al formulario, sin pantalla duplicada de módulos.'],
 ['Probar el flujo inicial en Chrome',3,'Navegación, controles, modales y mensajes comprobados en el entorno local.'],
 ['Documentar y demostrar el flujo inicial',3,'Recorrido reproducible, componentes reutilizados y decisiones de integración.'],
 ['Realizar seguimiento quincenal',1,'Acuerdos técnicos y alcance de la primera entrega navegable.']
];
for(const [i,rows] of [[1,analysis],[2,design],[3,preparation]]){
 const s=wb.worksheets.getItemAt(i);
 assert.equal(rows.reduce((n,r)=>n+r[1],0),40);
 if(i===3){
  const original=s.getRange('A3:F13').values.filter(r=>r[0]!=='ARQ-03');
  s.getRange('A3:F16').unmerge();s.getRange('A3:F16').clear({applyTo:'contents'});
  s.getRange('A3:F12').values=original.map((r,j)=>[r[0],rows[j][0],rows[j][1],rows[j][2],r[4],null]);
  for(let r=3;r<=12;r++)f(s,`F${r}`,`=IF(E${r}="Terminado",1,IF(E${r}="En Proceso",0.5,0))`);
  s.getRange('A3:F12').format.fill='#FFFFFF';
  s.getRange('A13:F13').format={fill:'#115E67',font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:25};
  set(s,'B13','Total del período');
  s.getRange('A15:F15').merge();
  s.getRange('A14:F16').format.fill='#FFFFFF';
 }
 for(let j=0;j<rows.length;j++){
  const r=j+3;set(s,`B${r}`,rows[j][0]);if(i===3)set(s,`C${r}`,rows[j][1]);set(s,`D${r}`,rows[j][2]);
 }
 set(s,'A1',i===1?'Análisis del alcance vigente':i===2?'Definición visual con componentes existentes':'Preparación técnica e integración de sad-aml-shared');
 s.getRange(`B3:D${totals[i-1]-1}`).format.wrapText=true;
 s.getRange(`A3:F${totals[i-1]-1}`).format.rowHeight=i===2?40:54;
 s.getRange(`D1:D${totals[i-1]+2}`).format.columnWidth=65;
 set(s,`A${totals[i-1]+2}`,i===3?'Las 8 h retiradas de ARQ-03 se reparten: rutas +2, contratos +2, login +1, validaciones +1, pruebas +1 y documentación +1.':'Descripciones corregidas al alcance vigente. No se añaden horas realizadas ni se acreditan nuevas tareas terminadas.');
 s.getRange(`A${totals[i-1]+2}:F${totals[i-1]+2}`).format.rowHeight=36;
}
const budgets=[
 [3,3,4,4,4,2,4,4,3,5,3,1],
 [7,6,4,4,6,6,2,3,1,1],
 [5,4,6,5,8,3,5,3,1],
 [7,6,8,5,4,4,4,2],
 [6,6,4,3,1]
];
for(let i=0;i<budgets.length;i++){
 const s=wb.worksheets.getItemAt(i+4),expected=i===4?20:40;
 assert.equal(budgets[i].reduce((a,b)=>a+b,0),expected);
 s.getRange(`C3:C${budgets[i].length+2}`).values=budgets[i].map(h=>[h]);
 set(s,`A${totals[i+3]+3}`,'Frontend con mocks y sad-aml-shared. Las horas cubren integración, lógica, validaciones y pruebas; no la creación de controles base.');
}
const first=wb.worksheets.getItemAt(4);
set(first,'B3','Aplicar los ajustes del entorno y las rutas');
set(first,'D3','Ajustes identificados en preparación aplicados al flujo navegable.');
set(first,'B4','Integrar sad-aml-shared en las pantallas del flujo');
set(first,'D4','Conectar propiedades, eventos y estados de controles existentes. Sin recrear botones, campos ni modales base.');
set(first,'B9','Integrar el wizard y su lógica de navegación');
set(first,'D9','Aprovechar el control compartido disponible y conectar el estado de los doce pasos.');
const descriptions=[
 ['AN','Análisis del flujo vigente, reglas, cálculos, PDF, confidencialidad y necesidades de integración con sad-aml-shared.','Alcance del frontend, Chrome y criterios de aceptación definidos.'],
 ['FG','Definición visual del login, inicio informativo, introducción, doce pasos y juramento, usando el sistema de diseño existente.','Pantallas, modales, estados y mensajes alineados con Figma.'],
 ['ARQ','Integración del arquetipo, contratos, login, inicio informativo y entrada al formulario con sad-aml-shared.','Plan inicial corregido. Pendientes retomados en la siguiente quincena, sin sumar sus horas otra vez al trabajo futuro.']
];
for(let i=0;i<3;i++){
 set(general,`A${i+2}`,descriptions[i][0]);set(general,`D${i+2}`,descriptions[i][1]);set(general,`E${i+2}`,descriptions[i][2]);
}
for(let i=0;i<8;i++){
 const s=wb.worksheets.getItemAt(i+1),tr=totals[i];
 f(s,`C${tr}`,`=SUM(C3:C${tr-1})`);
 f(s,`F${tr}`,`=SUMPRODUCT(C3:C${tr-1},F3:F${tr-1})/C${tr}`);
 f(general,`C${i+2}`,`='${s.name}'!C${tr}`);f(general,`G${i+2}`,`='${s.name}'!F${tr}`);
}
set(general,'D16','Alcance y horas corregidos');
set(general,'D20','Horas planificadas antes del 14/09');
set(general,'D25','Reutilización de sad-aml-shared en todas las fases. El trabajo propio corresponde a composición, lógica y conexión de datos.');
set(general,'D26','Chrome es el único navegador objetivo del alcance.');
set(general,'D27','Se restablecen 40 h por hoja de detalle y 20 h para cierre. El tramo del 26/10 al 06/11 requiere 60 h (40 + 20).');
set(general,'D29','Las horas del plan son estimaciones, no horas realizadas. El total previsto suma las horas registradas y el trabajo futuro.');
set(general,'D31','Las tareas anteriores también se reformulan para reflejar sad-aml-shared. Las bitácoras y sus horas reales permanecen intactas.');
set(general,'D32','El avance se recalcula con las horas redistribuidas y los estados existentes. Esta revisión no certifica nueva ejecución.');
set(general,'D33','Las estimaciones requieren que los controles compartidos cubran lo previsto. Confirmar brechas y revisar capacidad en el primer seguimiento.');
set(dash,'A5','Plan total actualizado');
set(dash,'A37','El alcance se corrige en todas las hojas. General distingue horas planificadas, horas reales y trabajo futuro.');
set(dash,'A38','Presupuesto original restablecido: siete hojas de 40 h y cierre de 20 h. Las horas se redistribuyen entre tareas sin alterar las bitácoras.');
assert.equal(JSON.stringify(dash.getRange('A25:E31').values),realBefore);
}
wb.recalculate();
for(let i=0;i<8;i++)assert.equal(wb.worksheets.getItemAt(i+1).getRange(`C${totals[i]}`).values[0][0],i===7?20:40);
assert.equal(general.getRange('G17').values[0][0],expectedFuture);
assert.equal(general.getRange('C10').values[0][0],120+expectedFuture);
assert.equal(general.getRange('G19').values[0][0],143+expectedFuture);
assert.equal(dash.getRange('B6').values[0][0],143);
// Prevent obsolete work descriptions from surviving in any worksheet.
const invalid=/desarrollar componentes frontend reutilizables|crear y configurar el proyecto|pantalla principal del sistema|pantalla principal de|maqueta de resumen|representaci[oó]n de los m[oó]dulos|Edge|Firefox|GitLab|190 h|23,75/iu;
for(let i=0;i<10;i++){
 const s=wb.worksheets.getItemAt(i),values=s.getRange('A1:L38').values;
 for(let r=0;r<values.length;r++)for(const v of values[r])if(typeof v==='string')assert.ok(!invalid.test(v),`${s.name}:${r+1} ${v}`);
}
if(!verify){
 const s=wb.worksheets.getItemAt(4);
 set(s,'E3','Terminado');assert.equal(general.getRange('G5').values[0][0],3/40);
 set(s,'E3','En Proceso');assert.equal(general.getRange('G5').values[0][0],1.5/40);
 set(s,'E3','Pendiente');wb.recalculate();
}
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!',options:{useRegex:true,maxResults:50},maxChars:1500})).ndjson);
for(let i=0;i<10;i++){
 const s=wb.worksheets.getItemAt(i),range=i===0?'A1:G36':i===9?'A1:Y59':`A1:F${totals[i-1]+3}`;
 const img=await wb.render({sheetName:s.name,range,scale:1,format:'png'});
 await fs.writeFile(new URL(`corrected-${i}.png`,dir),new Uint8Array(await img.arrayBuffer()));
}
if(!verify){const file=await SpreadsheetFile.exportXlsx(wb);await file.save(outputPath);}
console.log(JSON.stringify({outputPath,eachSheetHours:totals.map((r,i)=>wb.worksheets.getItemAt(i+1).getRange(`C${r}`).values[0][0]),future:expectedFuture,actuals:143,planned:120+expectedFuture,forecast:143+expectedFuture,obsoleteDescriptions:0}));
