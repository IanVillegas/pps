import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load('C:/Ian/UNA/3 - PPS/7 - Septiembre 05/Alcance_avance_intermedio_control.xlsx'));
console.log((await wb.inspect({kind:'workbook,sheet',maxChars:8000})).ndjson);
for (let i=0;i<10;i++) {
 const s=wb.worksheets.getItemAt(i);
 console.log(JSON.stringify({name:s.name,values:s.getUsedRange().values,formulas:s.getUsedRange().formulas}));
}
const image=await wb.render({sheetName:'31 al 11 ARQ - LG - PS - MD',range:'A1:F14',scale:1,format:'png'});
await fs.writeFile(new URL('./before.png',import.meta.url),new Uint8Array(await image.arrayBuffer()));
