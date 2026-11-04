"""Lee Control_PPS.xlsx (XML directo, openpyxl falla con sus gráficos) y deja un JSON para el informe."""
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
M = '{%s}' % NS['m']


def leer(path):
    z = zipfile.ZipFile(path)
    ss = []
    if 'xl/sharedStrings.xml' in z.namelist():
        for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si', NS):
            ss.append(''.join(x.text or '' for x in si.iter(M + 't')))
    wb = ET.fromstring(z.read('xl/workbook.xml'))
    rels = {r.get('Id'): r.get('Target') for r in ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))}
    hojas = []
    for s in wb.find('m:sheets', NS):
        tgt = rels[s.get('{%s}id' % NS['r'])].lstrip('/')
        tgt = tgt if tgt.startswith('xl/') else 'xl/' + tgt
        filas = []
        for row in ET.fromstring(z.read(tgt)).iter(M + 'row'):
            d = {}
            for c in row.findall('m:c', NS):
                v = c.find('m:v', NS)
                t = c.get('t')
                if t == 'inlineStr':
                    val = ''.join(x.text or '' for x in c.iter(M + 't'))
                elif v is None:
                    continue
                elif t == 's':
                    val = ss[int(v.text)]
                else:
                    val = v.text
                col = re.match(r'[A-Z]+', c.get('r')).group(0)
                if val not in (None, ''):
                    d[col] = val
            if d:
                filas.append(d)
        hojas.append({'nombre': s.get('name'), 'filas': filas})
    return hojas


if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    hojas = leer(src)
    json.dump(hojas, open(dst, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('hojas:', [h['nombre'] for h in hojas])
