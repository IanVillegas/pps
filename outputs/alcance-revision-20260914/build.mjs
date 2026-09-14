import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';
const dir = new URL('./', import.meta.url);
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(process.argv.includes('--verify') ? 'C:/Ian/DecPat/decpat-cloud/outputs/alcance-revision-20260914/Alcance_avance_intermedio_actualizado.xlsx' : 'C:/Ian/UNA/3 - PPS/7 - Septiembre 05/Alcance_avance_intermedio_control.xlsx'));
if(process.argv.includes('--verify')) {
 wb.recalculate();
 assert.equal(wb.worksheets.getItem('General').getRange('G17').values[0][0],190);
 assert.equal(wb.worksheets.getItem('General').getRange('G19').values[0][0],333);
 console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!',options:{useRegex:true,maxResults:20},maxChars:1500})).ndjson);
 for(const [name,range,file] of [['General','A1:G10','final-general.png'],['03 al 14 AN','A1:F15','final-history.png'],['14 al 25 SEP Inicio - P1','A1:F18','final-first.png'],['Avance Intermedio','J39:S59','final-chart.png']]) {
  const p=await wb.render({sheetName:name,range,scale:1,format:'png'});
  await fs.writeFile(new URL(file,dir),new Uint8Array(await p.arrayBuffer()));
 }
 console.log('Reimported, recalculated and verified final workbook.');
 process.exit(0);
}
if (process.argv.includes('--inspect')) {
  for(const chart of wb.worksheets.getItemAt(9).charts.items) console.log(JSON.stringify({title:chart.title.text,series:chart.series.items.map(s=>({formula:s.formula,categoryFormula:s.categoryFormula}))}));
  console.log((await wb.inspect({kind:'drawing',sheetId:'Avance Intermedio',maxChars:5000})).ndjson);
  const p = await wb.render({sheetName:'Avance Intermedio',range:'A1:R38',scale:1,format:'png'});
  await fs.writeFile(new URL('before-dashboard.png',dir), new Uint8Array(await p.arrayBuffer()));
  process.exit(0);
}
const general=wb.worksheets.getItemAt(0), dash=wb.worksheets.getItemAt(9);
dash.charts.items[3].series.items[1].formula="'Avance Intermedio'!$D$25:$D$30";
const historic= [1,2,3].map(i=>wb.worksheets.getItemAt(i));
const savedHistory=historic.map((s,i)=>JSON.stringify(s.getRange(`A2:E${[13,21,14][i]}`).values));
const savedActuals=JSON.stringify(dash.getRange('A25:E31').values);
const plans=[
 {index:4,name:'14 al 25 SEP Inicio - P1',period:'14 al 25 de septiembre',code:'ARQ - LG - PS - FL - DG',total:45,title:'Inicio navegable y datos generales',demo:'25/09: login, inicio informativo y acceso al paso 1 con validaciones.',tasks:[
 ['ARQ-R01','Verificar y adaptar la configuración existente',3,'Proyecto ejecutable, rutas y dependencias verificadas. No recrear el arquetipo.'],
 ['ARQ-R02','Integrar componentes de sad-aml-shared',4,'Campos, botones, modales y mensajes disponibles probados. Crear solo faltantes justificados.'],
 ['LG-R01','Implementar el login',5,'Pantalla conectada al flujo, usando componentes compartidos y datos simulados.'],
 ['LG-R02','Completar estados y ayuda del login',4,'Validaciones, credenciales incorrectas, bloqueo y ayuda conforme a Figma.'],
 ['PS-R01','Implementar el inicio informativo',5,'Contenido de DecPat, ayuda, header y sidebar con acceso a Mi declaración.'],
 ['MD-R01','Conectar la entrada a Mi declaración',3,'Modal introductorio y acceso al formulario. Sin pantalla duplicada de módulos.'],
 ['FL-R01','Configurar la navegación de los doce pasos',5,'Paso actual, anterior y siguiente. Solo pasos implementados se presentan como completos.'],
 ['DG-R01','Implementar Datos generales',4,'Paso 1 con datos simulados, campos y validaciones de Figma.'],
 ['FL-R02','Definir estado y contratos simulados',3,'Datos conservados al navegar. Cuestionario confidencial separado de la declaración.'],
 ['QA-R01','Probar el flujo inicial en Chrome',5,'Login a paso 1 navegable, errores, teclado, modales y mensajes comprobados.'],
 ['DOC-R01','Preparar evidencia y registro técnico',3,'Recorrido reproducible y lista de componentes reutilizados y pendientes.'],
 ['SEG-R01','Demostrar el primer avance quincenal',1,'Seguimiento propuesto el 25/09 con una pantalla navegable y el flujo conectado.']
 ]},
 {index:5,name:'28 SEP al 09 OCT P2 - P5',period:'28 de septiembre al 9 de octubre',code:'NF - IE - BI - BM',total:50,title:'Núcleo familiar, ingresos y bienes',demo:'09/10: recorrido hasta el paso 5 con formularios, tablas y modales funcionales.',tasks:[
 ['NF-R01','Implementar Núcleo familiar',8,'Paso 2: tabla y modal con alta, edición, eliminación y validación.'],
 ['IE-R01','Implementar Ingresos y egresos',8,'Paso 3: formularios y tablas con componentes compartidos y estados vacíos.'],
 ['IE-R02','Implementar cálculos y condiciones',5,'Totales, monedas y campos condicionales verificados con ejemplos acordados.'],
 ['IE-R03','Implementar el manejo de PDF',5,'Seleccionar, retirar y validar archivo. Errores y carga simulada sin servicio productivo.'],
 ['BI-R01','Implementar Bienes inmuebles',8,'Paso 4: listado, modal y operaciones con validaciones. No duplicar formulario y modal.'],
 ['BM-R01','Implementar Bienes muebles',7,'Paso 5: listado, modal, operaciones y campos condicionales.'],
 ['INT-R02','Integrar los pasos 2 a 5',3,'Anterior y siguiente conservan datos y actualizan el progreso.'],
 ['QA-R02','Probar escenarios y corregir defectos',3,'Chrome: errores, cálculos, PDF, modales y toasts de los pasos incluidos.'],
 ['DOC-R02','Preparar evidencia acumulada',2,'Recorrido desde login hasta el paso 5 y resultados de pruebas.'],
 ['SEG-R02','Demostrar el segundo avance quincenal',1,'Seguimiento propuesto el 09/10 con operaciones sobre datos simulados.']
 ]},
 {index:6,name:'12 al 23 OCT P6 - P10',period:'12 al 23 de octubre',code:'DE - CC - CR - TC - PJ',total:45,title:'Productos financieros e inicio de personas jurídicas',demo:'23/10: recorrido hasta el paso 9. Paso 10 iniciado para reducir carga del cierre.',tasks:[
 ['DE-R01','Implementar depósitos y ahorros',6,'Paso 6 con datos simulados, monedas, operaciones y totales según Figma.'],
 ['CC-R01','Implementar Cuentas corrientes',5,'Paso 7: listado, modal y validaciones. Reutilizar patrones existentes.'],
 ['CR-R01','Implementar Créditos',7,'Paso 8: alta, edición, eliminación, cuotas, saldos y validaciones.'],
 ['TC-R01','Implementar Tarjetas de crédito',6,'Paso 9: monedas, cuotas y saldos. Confirmar etiquetas ambiguas antes de programar.'],
 ['PJ-R01','Iniciar Personería jurídica y sociedades',8,'Paso 10: estructura, dos modales y modelo de poderes, participaciones y dietas.'],
 ['INT-R03','Integrar los productos financieros',4,'Recorrido acumulado a paso 9, conservación de datos y contratos consistentes.'],
 ['QA-R03','Probar cálculos y corregir defectos',5,'Chrome: totales por moneda, edición, eliminación y campos condicionales.'],
 ['DOC-R03','Preparar evidencia y decisiones pendientes',3,'Demostración acumulada y confirmaciones necesarias para concluir el paso 10.'],
 ['SEG-R03','Demostrar el tercer avance quincenal',1,'Seguimiento propuesto el 23/10. Paso 10 identificado como avance parcial.']
 ]},
 {index:7,name:'26 al 30 OCT P10 - Cierre',period:'26 al 30 de octubre',code:'PJ - DJ - DP - DJU - INT',total:30,title:'Cierre funcional de la declaración',demo:'30/10: hito interno de flujo completo. La validación final se realiza del 02 al 06/11.',tasks:[
 ['PJ-R02','Completar Personería jurídica',5,'Finalizar reglas, operaciones y validaciones de los modales iniciados en la quincena anterior.'],
 ['DJ-R01','Implementar Datos judiciales',5,'Paso 11 con campos, condiciones, registros y validaciones correspondientes.'],
 ['DP-R01','Implementar el cuestionario confidencial',7,'Paso 12 con preguntas y campos condicionales. Respuestas fuera del borrador patrimonial.'],
 ['DJU-R01','Implementar juramento y aceptación',4,'Pantalla final y condiciones de aceptación según Figma.'],
 ['DJU-R02','Implementar finalización simulada',3,'Envío simulado con carga, éxito y error. Sin prometer almacenamiento ni envío productivo.'],
 ['INT-R04','Verificar el recorrido completo',3,'Los doce pasos y juramento se recorren desde el login con datos de prueba.'],
 ['QA-R04','Corregir defectos del cierre',2,'Chrome: cuestionario, separación de datos, juramento y finalización.'],
 ['DOC-R04','Registrar el hito funcional',1,'Evidencia interna del 30/10 y lista priorizada para estabilización.']
 ]},
 {index:8,name:'02 al 06 NOV CI',period:'2 al 6 de noviembre',code:'CI',total:20,title:'Estabilización y entrega final',demo:'06/11: seguimiento final, flujo completo probado en Chrome y entrega documentada.',tasks:[
 ['CI-R01','Ejecutar regresión completa en Chrome',6,'Recorrido completo, validaciones, teclado, estados vacíos, PDF, modales y toasts.'],
 ['CI-R02','Corregir y volver a probar defectos',6,'Priorizar fallos que bloquean el flujo y comprobar que las correcciones no generan regresiones.'],
 ['CI-R03','Completar documentación técnica',4,'Ejecución local, componentes reutilizados, mocks, pendientes y orden de traspaso manual.'],
 ['CI-R04','Preparar evidencia y paquete de entrega',3,'Resultados de pruebas y demostración reproducible. Sin despliegue productivo incluido.'],
 ['SEG-R04','Realizar seguimiento y entrega final',1,'Seguimiento propuesto el 06/11 con el flujo completo y limitaciones documentadas.']
 ]}
];
// The documented runtime has no rename operation. Preserve sheet identities here;
// a final package-only pass updates names and references without changing cells.
for(const p of plans) { p.newName=p.name; p.name=wb.worksheets.getItemAt(p.index).name; }
const set=(s,cell,v)=>{s.getRange(cell).clear({applyTo:'contents'});s.getRange(cell).values=[[v]];};
const formula=(s,cell,f)=>s.getRange(cell).formulas=[[f]];
const teal='#115E67';
for(const p of plans){
 const s=wb.worksheets.getItem(p.name);
 assert.equal(p.tasks.reduce((n,t)=>n+t[2],0),p.total);
 s.getRange('A1:F40').unmerge();
 s.getRange('A1:F40').clear({applyTo:'all'});
 s.getRange('A1:F1').merge(); set(s,'A1',p.title+' ('+p.period+')');
 s.getRange('A1:F1').format.font={name:'Arial',size:14,bold:true,color:teal};
 s.getRange('A1:F1').format.rowHeight=30;
 s.getRange('A2:F2').values=[['ID','Tarea','Horas estimadas','Resultado verificable','Estado','Avance']];
 s.getRange('A2:F2').format={fill:teal,font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},wrapText:true,rowHeight:32,horizontalAlignment:'center',verticalAlignment:'center'};
 const end=p.tasks.length+2;p.end=end;p.totalRow=end+1;
 s.getRange(`A3:F${end}`).values=p.tasks.map(t=>[...t,'Pendiente',null]);
 for(let r=3;r<=end;r++)formula(s,`F${r}`,`=IF(E${r}="Terminado",1,IF(E${r}="En Proceso",0.5,0))`);
 s.getRange(`A3:F${end}`).format={font:{name:'Arial',size:11},wrapText:true,verticalAlignment:'center',rowHeight:48};
 s.getRange(`E3:E${end}`).dataValidation={rule:{type:'list',values:['Pendiente','En Proceso','Terminado']}};
 s.getRange(`F3:F${end+1}`).setNumberFormat('0.0%');
 s.getRange(`C3:C${end+1}`).setNumberFormat('0');
 set(s,`B${end+1}`,'Total del período');formula(s,`C${end+1}`,`=SUM(C3:C${end})`);
 formula(s,`F${end+1}`,`=SUMPRODUCT(C3:C${end},F3:F${end})/C${end+1}`);
 s.getRange(`A${end+1}:F${end+1}`).format={fill:teal,font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:25};
 s.getRange(`A${end+3}:F${end+3}`).merge();set(s,`A${end+3}`,p.demo);
 s.getRange(`A${end+3}:F${end+3}`).format={wrapText:true,rowHeight:40,font:{name:'Arial',size:11,bold:true,color:teal}};
 s.getRange(`A${end+4}:F${end+4}`).merge();set(s,`A${end+4}`,'Alcance: frontend con mocks y componentes compartidos. Terminado requiere evidencia y pruebas en Chrome.');
 s.getRange(`A${end+4}:F${end+4}`).format={wrapText:true,rowHeight:32,font:{name:'Arial',size:10}};
 for(const [col,width] of [['A',14],['B',48],['C',12],['D',66],['E',16],['F',12]])s.getRange(`${col}1:${col}${end+4}`).format.columnWidth=width;
 s.freezePanes.freezeRows(2);
}
const hTotals=[13,21,14];
for(let i=0;i<historic.length;i++){
 const s=historic[i],end=hTotals[i]-1;
 for(let r=3;r<=end;r++)formula(s,`F${r}`,`=IF(E${r}="Terminado",1,IF(E${r}="En Proceso",0.5,0))`);
 formula(s,`F${end+1}`,`=SUMPRODUCT(C3:C${end},F3:F${end})/C${end+1}`);
 s.getRange('A1:F1').unmerge();s.getRange('A1:F1').merge();
 s.getRange('A1:F1').format.rowHeight=30;
 set(s,'A1',i===0?'Análisis (histórico)':i===1?'Diseño en Figma (histórico)':'Plan anterior de preparación (histórico)');
 const noteRow=end+3;
 s.getRange(`A${noteRow}:F${noteRow}`).merge();
 set(s,`A${noteRow}`,i===2?'Plan anterior conservado. Sus pendientes se reestiman en las hojas de septiembre a noviembre, sin sumarlos otra vez al trabajo futuro.':'Registro histórico conservado. Las pantallas y requisitos vigentes se aplican en el plan reprogramado.');
 s.getRange(`A${noteRow}:F${noteRow}`).format={wrapText:true,rowHeight:44,font:{name:'Arial',size:10}};
}
const blocks=[...historic.map((s,i)=>({name:s.name,totalRow:hTotals[i]})),...plans];
for(let i=0;i<8;i++){
 const r=i+2, dr=i+13, b=blocks[i];
 formula(general,`C${r}`,`='${b.name}'!C${b.totalRow}`);
 formula(general,`G${r}`,`='${b.name}'!F${b.totalRow}`);
 formula(general,`F${r}`,`=IF(G${r}=1,"Terminado",IF(G${r}>0,"En Proceso","Pendiente"))`);
 for(const [dc,gc] of [['A','A'],['B','B'],['C','C'],['E','F'],['F','G']])formula(dash,`${dc}${dr}`,`='General'!${gc}${r}`);
 formula(dash,`G${dr}`,`=C${dr}*F${dr}`);formula(dash,`H${dr}`,`=MAX(C${dr}-G${dr},0)`);
}
set(general,'A4','ARQ histórico');
set(general,'D4','Plan previo de preparación. Actividades y estados históricos conservados; pendientes trasladados y reestimados en el plan vigente.');
set(general,'E4','Referencia histórica, no una carga adicional para las próximas ocho semanas.');
for(let i=0;i<plans.length;i++){
 const p=plans[i],r=i+5;
 set(general,`A${r}`,p.code);set(general,`B${r}`,p.period);
 set(general,`D${r}`,p.title+'. Integración de sad-aml-shared, lógica propia del dominio y pruebas en Chrome.');
 set(general,`E${r}`,p.demo);
}
set(general,'B10','Total del plan');formula(general,'C10','=SUM(C2:C9)');formula(general,'G10',"='Avance Intermedio'!B9");
formula(general,'E12','=C10');
set(general,'D13','Pruebas y correcciones futuras');
formula(general,'E13',`=SUM('${plans[0].name}'!C12,'${plans[1].name}'!C10,'${plans[2].name}'!C9,'${plans[3].name}'!C9,'${plans[4].name}'!C3:C4)`);
set(general,'D14','Seguimientos futuros');
formula(general,'E14',`=SUM('${plans[0].name}'!C14,'${plans[1].name}'!C12,'${plans[2].name}'!C11,'${plans[4].name}'!C7)`);
set(general,'B17','Inicio informativo');set(general,'B18','Entrada a Mi declaración');set(general,'B25','Depósitos y ahorros');set(general,'B31','Cuestionario confidencial');
const overview=[
 [16,'Plan reprogramado al 14/09/2026'],
 [17,'Horas futuras (14/09 al 06/11)'],[18,'Horas históricas registradas'],[19,'Total previsto: reales + futuras'],
 [20,'Horas del plan histórico'],[21,'Presupuesto original de referencia'],[22,'Variación del plan estimado'],
 [24,'Alcance: frontend con servicios simulados. Backend, autenticación y envío productivos no incluidos.'],
 [25,'Componentes: reutilizar sad-aml-shared. Implementar solo composiciones de negocio y faltantes justificados.'],
 [26,'Chrome es el navegador objetivo. No se incluyen compromisos de soporte para Edge ni Firefox.'],
 [27,'190 h futuras equivalen a 23,75 h por semana en promedio. La semana del 26 al 30/10 requiere 30 h.'],
 [28,'Seguimientos propuestos: 25/09, 09/10, 23/10 y 06/11. Confirmar agenda con el supervisor.'],
 [29,'Las 120 h del plan histórico no son horas reales. El total previsto usa 143 h registradas más 190 h futuras.'],
 [30,'Avance por estado: Pendiente 0 %, En Proceso 50 %, Terminado 100 %. Es una aproximación ponderada por horas.'],
 [31,'El 20 % manual de ARQ del archivo original se sustituye por 13,75 % calculado; no supone trabajo nuevo.'],
 [32,'AN pasa de 100 % manual a 97,5 % por el seguimiento pendiente. No se alteran sus estados históricos.'],
 [33,'Figma vigente: inicio informativo y paso 12 confidencial, no resumen editable.'],
 [34,'https://www.figma.com/design/pVGHV6WqzhsvQZ3goaRYnE?node-id=43121-6798'],
 [35,'https://www.figma.com/design/pVGHV6WqzhsvQZ3goaRYnE?node-id=43121-1459']
];
for(const [r,text]of overview){
 const cells=r>=24||r===16?`D${r}:G${r}`:`D${r}:F${r}`;
 general.getRange(cells).merge();set(general,`D${r}`,text);
 general.getRange(cells).format={font:{name:'Arial',size:11},wrapText:true,rowHeight:r>=24?42:27};
}
formula(general,'G17','=SUM(C5:C9)');formula(general,'G18',"='Avance Intermedio'!B31");formula(general,'G19','=SUM(G17:G18)');
formula(general,'G20','=SUM(C2:C4)');set(general,'G21',300);formula(general,'G22','=C10-G21');
general.getRange('G17:G22').setNumberFormat('0');
general.getRange('A2:G9').format.wrapText=true;
general.getRange('A2:G9').format.rowHeight=90;
general.getRange('B1:B36').format.columnWidth=32;
general.getRange('D1:D36').format.columnWidth=50;
general.getRange('E1:E36').format.columnWidth=48;
general.getRange('F1:F36').format.columnWidth=17;
general.getRange('G1:G36').format.columnWidth=15;
set(dash,'A1','Avance intermedio actualizado');
set(dash,'A5','Plan total (histórico + futuro)');set(dash,'A7','Horas registradas / plan');
set(dash,'A9','Avance ponderado del plan');set(dash,'D6','Saldo del plan, no pronóstico');
set(dash,'H12','Equiv. sin completar');
set(dash,'A35','Actualice Estado en cada hoja de tareas. El avance se calcula con 0 %, 50 % y 100 % y se pondera por horas.');
set(dash,'A36','Las horas reales son las de las bitácoras. Se conservan las 143 h hasta el 11/09; no se registran horas futuras como realizadas.');
set(dash,'A37','El avance incluye el plan histórico. Para el trabajo futuro y el total previsto de horas consulte General, filas 17 a 22.');
set(dash,'A38','La reprogramación contiene 190 h futuras. Los porcentajes históricos manuales se reemplazan por cálculo desde los estados originales.');
dash.getRange('A35:L38').format.wrapText=true;
dash.getRange('A35:L38').format.rowHeight=34;
dash.getRange('A5:A10').format.wrapText=true;
dash.getRange('A5:B10').format.rowHeight=30;
dash.getRange('B13:B20').format.wrapText=true;
dash.getRange('A13:H20').format.rowHeight=45;
dash.getRange('C12:H12').format.wrapText=true;
dash.getRange('A12:L12').format.rowHeight=35;
// Checks use original raw data, not previously calculated percentages.
historic.forEach((s,i)=>assert.equal(JSON.stringify(s.getRange(`A2:E${hTotals[i]}`).values),savedHistory[i]));
assert.equal(JSON.stringify(dash.getRange('A25:E31').values),savedActuals);
wb.recalculate();
assert.equal(general.getRange('G17').values[0][0],190);
assert.equal(general.getRange('C10').values[0][0],310);
assert.equal(general.getRange('G19').values[0][0],333);
assert.equal(dash.getRange('B6').values[0][0],143);
assert.ok(Math.abs(general.getRange('G2').values[0][0]-.975)<1e-9);
// Prove state-driven recalculation and restore the test input before export.
const first=wb.worksheets.getItem(plans[0].name);
set(first,'E3','Terminado');
assert.ok(Math.abs(general.getRange('G5').values[0][0]-3/45)<1e-9);
set(first,'E3','En Proceso');
assert.ok(Math.abs(general.getRange('G5').values[0][0]-1.5/45)<1e-9);
set(first,'E3','Pendiente');
wb.recalculate();
const errors=await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!',options:{useRegex:true,maxResults:50},maxChars:3000});
console.log(errors.ndjson);
for(let i=0;i<10;i++){
 const s=wb.worksheets.getItemAt(i);
 const range=i===0?'A1:G36':i===9?'A1:Y59':`A1:F${i<4?hTotals[i-1]+2:plans[i-4].end+4}`;
 const pic=await wb.render({sheetName:s.name,range,scale:1,format:'png'});
 await fs.writeFile(new URL(`sheet-${i}.png`,dir),new Uint8Array(await pic.arrayBuffer()));
 console.log('Rendered',i,s.name);
}
const output=await SpreadsheetFile.exportXlsx(wb);
await output.save(new URL('Alcance_avance_intermedio_actualizado.xlsx',dir).pathname.replace(/^\/(\w:)/,'$1'));
await fs.writeFile(new URL('renames.json',dir),JSON.stringify(plans.map(p=>[p.name,p.newName])));
console.log(JSON.stringify({plan:general.getRange('C10').values,summary:general.getRange('G17:G22').values,actuals:dash.getRange('B6').values,progress:dash.getRange('B9').values,historyPreserved:true,actualsPreserved:true}));
