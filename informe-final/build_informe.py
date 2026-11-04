"""Genera el Word del informe final de la PPS (EIF408, II ciclo 2026).

Uso:  python build_informe.py
Requiere: python-docx, matplotlib, Pillow. Lee control.json (extraer_control.py) y assets/.
Todo lo marcado entre {{ }} sale resaltado en amarillo: son notas de revisión o capturas por insertar.
"""
import json
import os
import re

from docx import Document
from docx.enum.section import WD_ORIENT
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_COLOR_INDEX
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

AQUI = os.path.dirname(os.path.abspath(__file__))
A = lambda n: os.path.join(AQUI, 'assets', n)
SALIDA = os.path.join(AQUI, 'Informe final PPS - Ian Villegas.docx')

ROJO = RGBColor(0xE6, 0x2C, 0x3A)  # rojo Mutual (valencia red 2026)
GRIS = RGBColor(0x5F, 0x63, 0x68)
VERDE_HEX = 'E62C3A'  # columna «Terminado» en rojo Mutual
CAB_HEX = 'E62C3A'
CLARO_HEX = 'F1F3F4'
AMARILLO_HEX = 'FFF2CC'

doc = Document()

# ----------------------------------------------------------------- estilos
sec = doc.sections[0]
sec.page_width, sec.page_height = Inches(8.5), Inches(11)
sec.left_margin = sec.right_margin = Inches(1)
sec.top_margin = sec.bottom_margin = Inches(1)
ANCHO = 6.5


def fuente(style, nombre='Calibri', tam=None, negrita=None, color=None):
    style.font.name = nombre
    rpr = style.element.get_or_add_rPr()
    rf = rpr.find(qn('w:rFonts'))
    if rf is None:
        rf = OxmlElement('w:rFonts')
        rpr.append(rf)
    for att in ('w:asciiTheme', 'w:hAnsiTheme', 'w:eastAsiaTheme', 'w:cstheme'):
        if rf.get(qn(att)) is not None:
            del rf.attrib[qn(att)]
    for att in ('w:ascii', 'w:hAnsi', 'w:eastAsia', 'w:cs'):
        rf.set(qn(att), nombre)
    if tam:
        style.font.size = Pt(tam)
    if negrita is not None:
        style.font.bold = negrita
    if color is not None:
        style.font.color.rgb = color


normal = doc.styles['Normal']
fuente(normal, tam=11)
normal.paragraph_format.space_after = Pt(6)
normal.paragraph_format.line_spacing = 1.15

for nombre, tam, color, antes, despues in (('Heading 1', 17, ROJO, 18, 8), ('Heading 2', 13.5, RGBColor(0x20, 0x21, 0x24), 14, 5),
                                           ('Heading 3', 11.5, RGBColor(0x3C, 0x40, 0x43), 10, 3)):
    st = doc.styles[nombre]
    fuente(st, tam=tam, negrita=True, color=color)
    st.font.italic = False
    st.paragraph_format.space_before = Pt(antes)
    st.paragraph_format.space_after = Pt(despues)
    st.paragraph_format.keep_with_next = True

for nombre in ('List Bullet', 'List Number'):
    st = doc.styles[nombre]
    fuente(st, tam=11)
    st.paragraph_format.space_after = Pt(3)

cap = doc.styles['Caption']
fuente(cap, tam=9.5, negrita=False, color=GRIS)
cap.font.italic = True
cap.paragraph_format.space_before = Pt(4)
cap.paragraph_format.space_after = Pt(10)


# ----------------------------------------------------------------- utilidades
def runs(p, texto, negrita=False, cursiva=False, tam=None, color=None):
    """Texto con **negrita** y {{resaltado}} en línea."""
    partes = re.split(r'(\*\*.+?\*\*|\{\{.+?\}\}|`.+?`)', texto)
    for t in partes:
        if not t:
            continue
        if t.startswith('**'):
            r = p.add_run(t[2:-2])
            r.bold = True
        elif t.startswith('`'):
            r = p.add_run(t[1:-1])
            r.font.name = 'Consolas'
            r._r.get_or_add_rPr().rFonts.set(qn('w:eastAsia'), 'Consolas')
            r.font.size = Pt((tam or 11) - 1)
        elif t.startswith('{{'):
            r = p.add_run('[' + t[2:-2] + ']')
            r.font.highlight_color = WD_COLOR_INDEX.YELLOW
            r.bold = negrita
        else:
            r = p.add_run(t)
            r.bold = negrita or None
        r.italic = cursiva or None
        if tam:
            r.font.size = Pt(tam)
        if color is not None and not t.startswith('{{'):
            r.font.color.rgb = color
    return p


def P(texto, justificado=True, **kw):
    p = doc.add_paragraph()
    if justificado:
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    return runs(p, texto, **kw)


def B(texto, estilo='List Bullet'):
    p = doc.add_paragraph(style=estilo)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    return runs(p, texto)


def H(texto, nivel=1, salto=False):
    h = doc.add_heading(texto, level=nivel)
    if salto:
        h.paragraph_format.page_break_before = True
    return h


def salto_pagina():
    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)


def sombrear(celda, hex_):
    tcpr = celda._tc.get_or_add_tcPr()
    for old in tcpr.findall(qn('w:shd')):
        tcpr.remove(old)
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), hex_)
    tcpr.append(shd)


def bordes_tabla(tabla, color='BDC1C6', tam=4, estilo='single'):
    tblpr = tabla._tbl.tblPr
    b = OxmlElement('w:tblBorders')
    for lado in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        e = OxmlElement(f'w:{lado}')
        e.set(qn('w:val'), estilo)
        e.set(qn('w:sz'), str(tam))
        e.set(qn('w:space'), '0')
        e.set(qn('w:color'), color)
        b.append(e)
    tblpr.append(b)


def margenes_celda(tabla, v=60, h=90):
    tblpr = tabla._tbl.tblPr
    m = OxmlElement('w:tblCellMar')
    for lado, val in (('top', v), ('left', h), ('bottom', v), ('right', h)):
        e = OxmlElement(f'w:{lado}')
        e.set(qn('w:w'), str(val))
        e.set(qn('w:type'), 'dxa')
        m.append(e)
    tblpr.append(m)


def fijar_anchos(tabla, anchos):
    tabla.autofit = False
    tblpr = tabla._tbl.tblPr
    lay = OxmlElement('w:tblLayout')
    lay.set(qn('w:type'), 'fixed')
    tblpr.append(lay)
    for fila in tabla.rows:
        celdas = fila.cells
        if len(anchos) > 1 and len({id(c._tc) for c in celdas}) == 1:
            celdas[0].width = Inches(sum(anchos))
            continue
        for c, w in zip(celdas, anchos):
            c.width = Inches(w)


def fila_sin_cortar(fila, repetir=False):
    trpr = fila._tr.get_or_add_trPr()
    e = OxmlElement('w:cantSplit')
    trpr.append(e)
    if repetir:
        h = OxmlElement('w:tblHeader')
        trpr.append(h)


def texto_celda(celda, texto, negrita=False, tam=9.5, color=None, alinear=None):
    celda.text = ''
    p = celda.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.05
    if alinear == 'c':
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    elif alinear == 'd':
        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    runs(p, texto, negrita=negrita, tam=tam, color=color)


def tabla(encabezados, filas, anchos, verde_col=None, tam=9.5, centradas=(), pie=None):
    """Tabla con encabezado rojo Mutual; la columna verde_col (estado Terminado) se pinta en rojo Mutual."""
    t = doc.add_table(rows=1, cols=len(encabezados))
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    bordes_tabla(t)
    margenes_celda(t)
    for i, e in enumerate(encabezados):
        c = t.rows[0].cells[i]
        sombrear(c, CAB_HEX)
        texto_celda(c, e, negrita=True, tam=tam, color=RGBColor(0xFF, 0xFF, 0xFF), alinear='c' if i in centradas else None)
    fila_sin_cortar(t.rows[0], repetir=True)
    for f in filas:
        r = t.add_row()
        fila_sin_cortar(r)
        if isinstance(f, str):  # fila de subtítulo
            m = r.cells[0].merge(r.cells[-1])
            sombrear(m, CLARO_HEX)
            texto_celda(m, f, negrita=True, tam=tam)
            continue
        for i, v in enumerate(f):
            c = r.cells[i]
            texto_celda(c, str(v), tam=tam, alinear='c' if i in centradas else None,
                        negrita=(verde_col == i), color=RGBColor(0xFF, 0xFF, 0xFF) if verde_col == i else None)
            if verde_col == i:
                sombrear(c, VERDE_HEX)
    fijar_anchos(t, anchos)
    if pie:
        pp = doc.add_paragraph(style='Caption')
        runs(pp, pie)
    else:
        doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return t


def figura(archivo, ancho, pie):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.keep_with_next = True
    p.paragraph_format.space_after = Pt(2)
    p.add_run().add_picture(A(archivo), width=Inches(ancho))
    c = doc.add_paragraph(style='Caption')
    c.alignment = WD_ALIGN_PARAGRAPH.CENTER
    runs(c, pie)


def recuadro(titulo, detalle):
    """Marcador de captura que el estudiante debe insertar."""
    t = doc.add_table(rows=1, cols=1)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    bordes_tabla(t, color='BF9000', tam=8, estilo='dashed')
    margenes_celda(t, 140, 160)
    c = t.rows[0].cells[0]
    sombrear(c, AMARILLO_HEX)
    c.text = ''
    p = c.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(3)
    r = p.add_run('[INSERTAR CAPTURA] ' + titulo)
    r.bold = True
    r.font.size = Pt(10)
    p2 = c.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p2.paragraph_format.space_after = Pt(0)
    r2 = p2.add_run(detalle)
    r2.font.size = Pt(9)
    fijar_anchos(t, [ANCHO])
    fila_sin_cortar(t.rows[0])
    doc.add_paragraph().paragraph_format.space_after = Pt(0)


def campo(par, instruccion, texto_previo=''):
    """Inserta un campo de Word (TOC, PAGE...)."""
    r = par.add_run()
    f1 = OxmlElement('w:fldChar')
    f1.set(qn('w:fldCharType'), 'begin')
    it = OxmlElement('w:instrText')
    it.set(qn('xml:space'), 'preserve')
    it.text = instruccion
    f2 = OxmlElement('w:fldChar')
    f2.set(qn('w:fldCharType'), 'separate')
    r._r.append(f1)
    r._r.append(it)
    r._r.append(f2)
    if texto_previo:
        par.add_run(texto_previo)
    r3 = par.add_run()
    f3 = OxmlElement('w:fldChar')
    f3.set(qn('w:fldCharType'), 'end')
    r3._r.append(f3)


# ----------------------------------------------------------------- datos del control
ctrl = json.load(open(os.path.join(AQUI, 'control.json'), encoding='utf-8'))
hojas = {h['nombre']: h['filas'] for h in ctrl}

PERIODOS = [
    # código, periodo, horas, actividades, hoja
    ('AN', '3 al 14 de agosto', 40,
     'Inducción, accesos, análisis del sistema actual, inventario de pantallas, selección y justificación del módulo, definición del alcance y elaboración del cronograma.',
     '03 al 14 AN', 'Análisis'),
    ('FG', '17 al 28 de agosto', 40,
     'Definición visual en Figma del login, la pantalla principal del sistema, la pantalla principal de «Mi declaración», las doce secciones, la declaración jurada, los modales y los estados visuales.',
     '17 al 28 FG', 'Diseño completo en Figma'),
    ('ARQ - LG - PS - MD', '31 de agosto al 11 de septiembre', 40,
     'Configuración del proyecto React y TypeScript y del repositorio. Desarrollo de componentes reutilizables, login, pantalla principal del sistema, navegación hacia «Mi declaración» y pantalla principal del módulo.',
     '31 al 11 ARQ - LG - PS - MD', 'Preparación técnica, login y pantallas principales'),
    ('FL - DG - NF - IE', '14 al 25 de septiembre', 40,
     'Navegación del formulario, indicador de progreso, almacenamiento temporal simulado y secciones 1. Datos generales, 2. Núcleo familiar y 3. Ingresos y egresos.',
     '14 al 25 FL - DG - NF - IE', 'Navegación general y pasos 1, 2 y 3'),
    ('BI - BM - DE', '28 de septiembre al 9 de octubre', 40,
     'Secciones 4. Bienes inmuebles, 5. Bienes muebles y 6. Datos económicos, con formularios, tablas, modales, validaciones y mocks.',
     '28 al 09 BI - BM - DE', 'Pasos 4, 5 y 6'),
    ('CC - CR - TC', '12 al 23 de octubre', 40,
     'Secciones 7. Cuentas corrientes, 8. Créditos que posee y 9. Tarjetas de crédito.',
     '12 al 23 CC - CR - TC', 'Pasos 7, 8 y 9'),
    ('PJ - DJ - DP - DJU - INT', '26 al 30 de octubre', 40,
     'Secciones 10. Personería jurídica, 11. Datos judiciales, 12. Declaración patrimonial completa y pantalla final de declaración jurada. Integración general del flujo.',
     '26 al 06 PJ - DJ - DP - DJU - I', 'Pasos 10, 11, 12 y declaración jurada'),
    ('CI', '2 al 6 de noviembre', 20,
     'Pruebas regresivas en Chrome, corrección de defectos, documentación técnica, evidencias, demostración y entrega final.',
     '09 al 13 CI', 'Pruebas finales, documentación y entrega'),
]
RESULTADOS = {
    'AN': 'Inventario completo, alcance y planificación presentados para revisión.',
    'FG': 'Propuesta visual completa para validación.',
    'ARQ - LG - PS - MD': 'Flujo funcional desde el login hasta la entrada de «Mi declaración».',
    'FL - DG - NF - IE': 'Estructura del flujo y primeros tres pasos funcionales.',
    'BI - BM - DE': 'Pasos 4, 5 y 6 integrados al flujo.',
    'CC - CR - TC': 'Pasos 7, 8 y 9 funcionales e integrados.',
    'PJ - DJ - DP - DJU - INT': 'Flujo completo de «Mi declaración» disponible para validación.',
    'CI': 'Alcance acordado completado y documentado.',
}
# ajustes pedidos por el estudiante: solo Chrome
REEMPLAZOS = {
    'Probar en los tres navegadores y corregir defectos': 'Probar en Chrome y corregir defectos',
    'Corregir diferencias de comportamiento entre navegadores': 'Corregir diferencias de comportamiento detectadas en las pruebas regresivas',
}

semanas = []
for f in hojas['Avance Intermedio']:
    a = f.get('A', '')
    if a.startswith('Bitácora') and 'B' in f:
        semanas.append((a, f['B'], f['C'], f['D']))


def tareas(nombre_hoja):
    """Devuelve filas para la tabla del anexo: subtítulos y (ID, tarea, horas, 'Terminado')."""
    out, total = [], 0
    for f in hojas[nombre_hoja]:
        a, b = f.get('A', ''), f.get('B', '')
        if re.match(r'^[A-Z]{2,4}-\d+$', a):
            b = REEMPLAZOS.get(b, b)
            h = int(float(f['C']))
            total += h
            out.append((a, b, h, 'Terminado'))
        elif a and a not in ('ID', 'Total') and len(f) <= 2 and 'B' not in f and not out_es_titulo(f, nombre_hoja, a):
            out.append(a)
    return out, total


def out_es_titulo(f, hoja, a):
    # la primera fila de cada hoja es su título general (se omite)
    return hojas[hoja][0] is f


# ----------------------------------------------------------------- PORTADA
pp = doc.add_paragraph()
pp.alignment = WD_ALIGN_PARAGRAPH.CENTER
pp.add_run().add_picture(A('logo_una.png'), width=Inches(1.6))


def centro(texto, tam=12, negrita=False, color=None, antes=0, despues=4):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(antes)
    p.paragraph_format.space_after = Pt(despues)
    r = p.add_run(texto)
    r.font.size = Pt(tam)
    r.bold = negrita
    if color is not None:
        r.font.color.rgb = color
    return p


centro('Universidad Nacional de Costa Rica', 15, True, antes=6)
centro('Facultad de Ciencias Exactas y Naturales', 12)
centro('Escuela de Informática', 12, despues=26)
centro('EIF408 - Proyectos y su Aplicación en la Organización (PPS)', 12, True)
centro('Práctica Profesional Supervisada', 12)
centro('NRC 52943 · Grupo 41 · II Ciclo 2026', 12, despues=34)
centro('INFORME FINAL', 24, True, ROJO, despues=10)
centro('Reconstrucción y Modernización Tecnológica del Frontend del Sistema de Declaración Patrimonial de Grupo Mutual', 14, True, despues=34)
centro('Estudiante', 10.5, color=GRIS, despues=0)
centro('Ian Villegas Jiménez', 13, True, despues=0)
centro('Cédula: 2 0780 0171', 11, despues=14)
centro('Organización: Grupo Mutual · Dirección de Tecnologías de Información', 10.5, despues=0)
centro('Supervisor: Alexander Rojas Soto', 10.5, despues=0)
centro('Docente: MSc. Cristian Gerardo Herrera Alvarado', 10.5, despues=18)
centro('Noviembre de 2026', 11)

# ----------------------------------------------------------------- ÍNDICE
ti = doc.add_paragraph()
ti.paragraph_format.page_break_before = True
ti.paragraph_format.space_after = Pt(10)
rti = ti.add_run('Índice')
rti.bold = True
rti.font.size = Pt(17)
rti.font.color.rgb = ROJO
pi = doc.add_paragraph()
campo(pi, 'TOC \\o "1-2" \\h \\z \\u',
      'Haga clic derecho aquí y elija «Actualizar campo» (o presione Ctrl+A y luego F9) para generar el índice.')

# ----------------------------------------------------------------- 1. INTRODUCCIÓN
H('1. Introducción', 1, salto=True)
P('El presente documento es el informe final de la Práctica Profesional Supervisada (PPS) del curso EIF408 - Proyectos y su Aplicación en la Organización, II ciclo de 2026. La práctica se realizó en Grupo Mutual, en la Dirección de Tecnologías de Información (sección de Desarrollo de Sistemas), bajo la supervisión de Alexander Rojas Soto, entre el 3 de agosto y el 6 de noviembre de 2026, con una dedicación registrada de 300 horas distribuidas en 13 semanas de bitácora. El proyecto asignado fue la **Reconstrucción y Modernización Tecnológica del Frontend del Sistema de Declaración Patrimonial**, un sistema que el personal de Recursos Humanos utiliza para revisar y validar los datos patrimoniales de las personas trabajadoras de la organización.')
P('**Lo que se propuso.** El perfil del proyecto planteó diseñar y desarrollar componentes frontend para la nueva versión del sistema, con una arquitectura visual moderna, mantenible y segura. En la primera semana, tras una inducción funcional y un análisis comparativo de los cuatro módulos del sistema (Mi declaración, Reportes, Revisión de declaraciones y Mantenimientos), se definió el alcance concreto: el módulo **«Mi declaración»**, desarrollado exclusivamente como frontend, con datos y servicios simulados (mocks) porque el backend no estaría disponible para integración. Por recomendación del supervisor se agregó además la pantalla de inicio de sesión, por ser el primer punto de contacto del usuario con el sistema.')
P('**Lo que se logró.** Se construyó el recorrido completo del declarante: inicio de sesión con sus estados de error, pantalla de inicio informativa, introducción, formulario de **doce pasos** (datos generales, núcleo familiar, ingresos y egresos, bienes inmuebles, bienes muebles, ahorro, cuentas corrientes, créditos, tarjetas de crédito, personería jurídica y sociedades, datos judiciales, y cuestionario confidencial con juramento), confirmación y guardado final. El código propio comprende 107 archivos fuente (unas 8 700 líneas) y 56 archivos de prueba; al 3 de noviembre las 66 suites y 460 pruebas automatizadas pasaban sin errores de tipos ni de lint. Además se agregaron componentes genéricos reutilizables a la biblioteca compartida del sistema (`sad-aml-shared`), se redactó una propuesta de contrato de API, se registraron 29 decisiones y asuntos abiertos con su resolución, y se elaboró la documentación técnica de transferencia (11 páginas generales y 20 de flujos, cerca de 29 000 palabras) para que el equipo interno pueda continuar el trabajo.')
P('**Lo relevante del ciclo.** El avance no fue lineal. El acceso a los componentes compartidos de la organización se demoró y obligó a reordenar las primeras quincenas; la ausencia de un backend convirtió la definición de contratos y la separación entre lo simulado y lo real en una tarea de diseño; y el 21 de octubre se recibieron ajustes de requisitos (confirmación al eliminar, formato de montos en todos los campos, reordenamiento de «Otros detalles» y restricción de adjuntos a PDF) que se absorbieron gracias a componentes comunes ya construidos. Todas las actividades del cronograma quedaron finalizadas. La integración con servicios reales quedó preparada pero no realizada, porque estaba fuera del alcance acordado y no existen contratos confirmados.')
P('**Estructura del documento.** Siguiendo la guía del curso, el cuerpo del informe presenta el cronograma completo del proyecto con el estado de cada actividad (sección 2.1), los problemas encontrados (2.2), la realización profesional (2.3), las herramientas, lenguajes y conocimientos aplicados y el proceso seguido (2.4), el desenvolvimiento en habilidades blandas (2.5), las sugerencias y recomendaciones para la carrera (2.6) y el impacto del trabajo en la organización y la Universidad (2.7). Luego se presentan las conclusiones (sección 3) y los anexos con el cronograma detallado, las evidencias de resultados, las verificaciones realizadas, la trazabilidad contra los objetivos del perfil, las bitácoras y el aval del patrocinador (sección 4).')

# ----------------------------------------------------------------- 2. CUERPO
H('2. Cuerpo del documento', 1, salto=True)

# ---- 2.1 Cronograma
H('2.1 Cronograma del proyecto', 2)
P('El cronograma de la práctica se organizó en ocho periodos que suman **300 horas planificadas**: siete de 40 horas y el cierre de 20 horas. Cada periodo agrupa los productos que debían estar disponibles al final de cada quincena. La Tabla 1 muestra el cronograma completo con el estado final de cada periodo; el detalle de sus 103 tareas, una por una, se presenta en el Anexo A. Al cierre de la práctica **no quedó ninguna actividad sin finalizar**.')

filas = []
for cod, per, h, act, hoja, nombre in PERIODOS:
    filas.append((cod, per, h, act, 'Terminado'))
tabla(['Código', 'Periodo', 'Horas', 'Actividades principales', 'Estado'], filas,
      [0.95, 1.1, 0.5, 3.1, 0.85], verde_col=4, tam=9, centradas=(2, 4),
      pie='Tabla 1. Cronograma del proyecto y estado final de cada periodo. Fuente: Control_PPS.')

P('La Figura 1 representa gráficamente la totalidad del proyecto finalizado: los ocho periodos, sus fechas y su estado.')
figura('fig_gantt.png', 6.4, 'Figura 1. Diagrama de Gantt del proyecto finalizado. Fuente: elaboración propia a partir de Control_PPS.')

H('Indicadores de avance', 3)
tabla(['Indicador', 'Resultado'], [
    ('Horas planificadas', '300 h'),
    ('Horas reales registradas en bitácoras (13 semanas)', '300 h (100 %)'),
    ('Periodos del cronograma terminados', '8 de 8'),
    ('Avance funcional ponderado por horas', '100 %'),
    ('Actividades sin finalizar', 'Ninguna'),
], [4.6, 1.9], tam=10, pie='Tabla 2. Indicadores de cierre. Fuente: Control_PPS, hoja «Avance Intermedio» actualizada al cierre.')
figura('fig_horas.png', 6.4, 'Figura 2. Horas registradas por semana y horas acumuladas. S03 corresponde a la tercera semana del ciclo lectivo (bitácora 01) y S15 a la última (bitácora 13). Fuente: Control_PPS.')
recuadro('Figura 3. Panel «Avance Intermedio» del Control_PPS.xlsx',
         'Pegue aquí la captura de la hoja de resumen del Excel con sus cuatro gráficos actualizados (100 %), como hizo en el informe intermedio. Después reemplace esta nota por el pie de figura.')

H('Actividades sin finalizar', 3)
P('Ninguna actividad del cronograma quedó sin concluir. Para que el lector no confunda alcance con avance, se aclara qué quedó **fuera del alcance acordado** y, por tanto, no figura como actividad del cronograma: la integración con un backend real, los módulos Reportes, Revisión de declaraciones y Mantenimientos, el despliegue a producción y la firma digital. Estos temas se definieron desde el perfil del proyecto como exclusiones y se documentan como pendientes de continuidad (ver sección 3 y Anexo C).')

H('Ajustes al cronograma durante la ejecución', 3)
P('Aunque el resultado final cumple el cronograma, su ejecución requirió ajustes que conviene dejar registrados:')
B('**Pendientes de la quincena de arquitectura (31 de agosto al 11 de septiembre).** La integración de la biblioteca de componentes compartidos dependía de un acceso que otra área debía facilitar. Mientras tanto se avanzó en análisis, revisión de Figma, inventario de componentes y planificación. Los componentes se incorporaron el 10 de septiembre y los pendientes se retomaron en la quincena siguiente sin sumar sus horas otra vez al trabajo futuro.')
B('**Reorganización del 14 de septiembre.** Se corrigió el plan para que el contenido de cada quincena coincidiera con los compromisos del cronograma de control. Eso recargó la quincena del 14 al 25 de septiembre (unas 59 horas de contenido frente a 40 de capacidad nominal), por lo que se definieron como medidas diferir la tabla editable y las notificaciones a la quincena siguiente, acotar la revisión visual a una resolución de referencia y simplificar el bloqueo por intentos fallidos del login. Las quincenas de octubre tenían holgura para absorber lo diferido.')
B('**Ajustes de requisitos del 21 de octubre.** Cinco cambios solicitados durante la revisión (ver sección 2.2) se atendieron dentro del periodo de octubre sin mover los hitos, porque los componentes comunes ya construidos permitieron aplicarlos de una vez a todas las pantallas.')
B('**Fechas de cierre.** El periodo de los pasos 10 a 12 se ubicó del 26 al 30 de octubre y el de pruebas finales y entrega del 2 al 6 de noviembre, de modo que el cierre ocurriera antes de la fecha de entrega de este informe (7 de noviembre).')
B('**Navegadores.** El alcance de pruebas se acordó sobre Chrome; las tareas de regresión y corrección de defectos del cierre se ejecutaron sobre ese navegador.')

# ---- 2.2 Problemas
H('2.2 Problemas encontrados', 2)
P('Este apartado recoge, con sus causas, la forma en que se abordaron y lo aprendido, los aspectos negativos y positivos de la práctica. Se presenta de forma franca, con el propósito de que pueda discutirse con los compañeros y sirva de retroalimentación.')

H('2.2.1 Dificultades y aspectos negativos', 3)
P('**a) Dependencia de componentes compartidos mantenidos por otra área.** El proyecto base requería la biblioteca `sad-aml-shared`, que no estaba disponible al inicio. La solicitud de acceso, la disponibilidad limitada del personal técnico para atenderla y la verificación posterior (instalación de dependencias, configuración, tipos y compilación) consumieron días de la quincena de arquitectura. Se mitigó trabajando en tareas independientes (análisis, Figma, inventario, documentación) y se resolvió con la incorporación de la biblioteca el 10 de septiembre. **Lección:** identificar y solicitar desde el primer día todos los accesos y recursos que están en manos de otros, y comprobar anticipadamente que funcionan. Este riesgo estaba identificado como crítico en la matriz de riesgos, lo que permitió reaccionar sin detener el proyecto.')
P('**b) Ausencia de backend y de contratos.** Como el backend no estaba disponible, cada decisión que normalmente viene de una API (autenticación y bloqueo, catálogos, datos precargados, fórmulas de totales, guardado parcial, destino del cuestionario confidencial, evidencia del juramento) quedó abierta. Se registraron 29 decisiones y asuntos abiertos (D-01 a D-29) con la pregunta, el efecto y la resolución, y se consultaron con el supervisor y el equipo técnico. La respuesta técnica fue separar lo simulado de lo real: servicios marcados como simulados, un cliente HTTP único con interruptor entre datos simulados y reales, catálogos asíncronos y una propuesta de contrato de API. **Lección:** cuando falta información externa, el diseño debe aislar lo incierto detrás de una interfaz para que su resolución no obligue a reescribir las pantallas.')
P('**c) Ambigüedades y diferencias entre el diseño de Figma y la necesidad real.** Se encontraron composiciones duplicadas para un mismo paso, columnas repetidas con significado distinto (por ejemplo, saldo y cuota en colones y en dólares en las tarjetas), textos con faltas de ortografía, notas de revisión dibujadas sobre las pantallas, un nodo de anotación que ya no existía y estados que el diseño no dibuja (por ejemplo, la lista abierta del selector o un aviso de sesión vencida). Cada caso se documentó con su decisión; donde el diseño no dice nada, se definió con los tokens del sistema y se dejó registrado. **Lección:** el diseño es una fuente de verdad parcial; hay que contrastarlo con el alcance y preguntar antes de implementar.')
P('**d) Cambios de requisitos en plena construcción.** El 21 de octubre se solicitaron cinco cambios: confirmación antes de eliminar en todas las tablas, formato de montos con centavos mientras se escribe, extendido luego a todos los campos de monto, reordenamiento de «Otros detalles» con un campo nuevo, y restricción de adjuntos a PDF; el 27 de octubre se corrigió además la visibilidad del detalle de cambios patrimoniales. Implicaron retrabajo en diez tablas y en los ocho pasos con campos de monto. El costo se contuvo porque las tablas, los diálogos y los campos de monto ya eran componentes comunes. **Lección:** invertir en componentes reutilizables y en pruebas reduce el costo del cambio.')
P('**e) Planificación y carga de trabajo.** La estimación inicial fue optimista en algunas quincenas (la del 14 al 25 de septiembre concentró cerca de 59 horas de contenido para 40 de capacidad). Además, la práctica no remunerada, los desplazamientos y las clases presenciales redujeron la dedicación en algunas semanas (semana 8: 19 horas; semana 12: 16 horas; semana 15: 16 horas frente a las 25 habituales). El total de 300 horas se mantuvo, pero con menos holgura de la prevista. **Lección:** estimar con margen y revisar la estimación apenas se cierran los primeros entregables.')
P('**f) Deuda de calidad detectada y no resuelta.** Persisten dos avisos técnicos: la transición de «no controlado a controlado» del selector compartido en las pruebas con listas desplegables y una advertencia de Sass (división con `/`) dentro de la biblioteca compartida. Ninguno impide el funcionamiento ni la compilación, pero quedaron registrados para el equipo interno. También se detectó, al medir con JavaScript los doce pasos, que algunas tablas desbordaban a 768 px; se corrigió reduciendo su ancho mínimo para que desplacen dentro de su región.')
P('**g) Verificaciones fuera del alcance de tiempo.** No se realizó una auditoría de accesibilidad con lector de pantalla ni medición de contraste, tampoco una comparación píxel a píxel contra Figma en todas las pantallas ni un recorrido completo solo con teclado. Se verificó lo esencial (foco, errores asociados a campos, teclado en el indicador de pasos) y se dejó el resto como pendiente de continuidad.')

H('2.2.2 Aspectos positivos', 3)
P('**a) Acompañamiento y retroalimentación.** Las reuniones quincenales con demostración permitieron validar temprano. La incorporación del login al alcance, a recomendación del supervisor, y las confirmaciones del equipo interno y la revisión de las capturas del sistema original sobre las dudas registradas (por ejemplo, que el «periodo» de la tarjeta es un año, que el «plazo» de la personería es un número o que no existe validación entre edad y fecha de nacimiento) evitaron suposiciones erróneas.')
P('**b) Trabajo por unidades trazables.** Dividir el proyecto en unidades identificadas (DEC-001 a DEC-020), cada una con su registro de implementación, validaciones y pendientes, hizo posible saber en todo momento qué estaba hecho y qué faltaba, y facilitó la documentación final. El historial muestra 113 commits entre el 10 de agosto y el 2 de noviembre.')
P('**c) Cultura de pruebas y verificación.** Cada tarea se cerró con comprobación de tipos, lint y pruebas, y con revisión en navegador cuando afectaba la interfaz. Esto permitió absorber los cambios de octubre sin romper lo existente y encontrar defectos (como el desborde de tablas) antes de la entrega.')
P('**d) Una biblioteca genérica reutilizable.** Los componentes que no contienen lógica de negocio se ubicaron en `sad-aml-shared` con sus estilos y sus pruebas: quien quiera reutilizar lo construido solo necesita esa carpeta. Esto cumple el estándar de desarrollo de la organización y reduce el trabajo duplicado.')
P('**e) Documentación como parte del desarrollo.** La documentación técnica se escribió junto con el código y se contrastó contra él (incluida la identificación de los códigos DEC y las marcas de lo simulado), lo que reduce el riesgo de que el equipo receptor reciba descripciones que no coinciden con el producto.')

# ---- 2.3 Realización profesional
H('2.3 Realización profesional', 2)
P('{{Borrador a partir de la evidencia del proyecto; ajústelo con sus propias palabras y elimine esta nota.}}', justificado=False)
P('Personal y profesionalmente, la práctica fue una experiencia exigente y muy valiosa. Al inicio sentí incertidumbre: el alcance se estaba definiendo, los accesos tardaron en llegar y el backend no existiría, de modo que gran parte del trabajo consistía en decidir cómo construir algo sin conocer todos sus insumos. A medida que se completaron los primeros pasos y el supervisor pudo ver el recorrido funcionando en las demostraciones quincenales, esa incertidumbre se transformó en confianza. Ver terminado el flujo completo de doce pasos, con pruebas y documentación, me dio una sensación sólida de responsabilidad cumplida y de haber trabajado como un profesional en informática y no como un estudiante resolviendo un ejercicio.')
P('También fue un reto personal sostener el ritmo. La práctica no es remunerada, implica desplazamientos y coincide con las clases y los trabajos de otros cursos; hubo semanas con menos horas de las deseadas y otras de mayor presión. Me ayudó planificar cada semana, registrar las horas en las bitácoras y priorizar lo crítico, aunque aprendí que debo avisar antes cuando la carga empieza a afectar el cronograma, en lugar de esperar a que se note.')
P('Entre mis **fortalezas** identifico la disciplina para organizar el trabajo en unidades pequeñas y verificables, la capacidad de aprender rápidamente un stack moderno (Next.js, React y TypeScript) mientras se construye, la atención al detalle en la fidelidad visual con el diseño, el hábito de documentar decisiones y de formular preguntas concretas con su efecto en el trabajo, y el cuidado por probar lo que se entrega. Entre mis **debilidades** reconozco una tendencia a estimar con optimismo (la quincena sobrecargada de septiembre es el ejemplo), a dedicar mucho tiempo a ajustes finos de interfaz que podrían esperar, y a esperar respuestas de terceros sin escalar el bloqueo con la suficiente anticipación.')
P('Hubo aspectos que siento que la Universidad no me proporcionó y que tuve que fortalecer por mi cuenta: las pruebas automatizadas de interfaz (Jest y Testing Library), la accesibilidad web, el trabajo con un sistema de diseño y con diseños de Figma, el uso profundo de TypeScript y de frameworks actuales como Next.js, la lectura y extensión de un código base existente que depende de bibliotecas internas, el manejo de accesos corporativos (VPN, repositorios, permisos), la seguridad aplicada al frontend, la estimación de esfuerzo y la redacción de documentación técnica pensada para que la use otro equipo. {{Confirme esta lista contra los cursos que usted cursó realmente.}}')

# ---- 2.4 Herramientas
H('2.4 Herramientas, lenguajes, conocimientos y proceso', 2)
P('Este apartado describe puntualmente qué se utilizó y cómo se desarrolló el trabajo.')
H('2.4.1 Lenguajes y tecnologías', 3)
tabla(['Tecnología', 'Uso en el proyecto'], [
    ('TypeScript', 'Lenguaje principal del código (componentes, servicios, hooks, tipos y pruebas).'),
    ('React 19 y Next.js 15 (App Router)', 'Interfaz y rutas: `/` (acceso), `/inicio` y `/mi-declaracion/[paso]`.'),
    ('HTML5 y CSS3 / SCSS Modules', 'Estructura y estilos de las pantallas (35 hojas de estilo propias) sobre los tokens del sistema de diseño de Grupo Mutual.'),
    ('React Hook Form', 'Formularios, validaciones y manejo de errores de campo.'),
    ('Radix UI', 'Primitivas accesibles utilizadas por los selectores, diálogos y conmutadores de la biblioteca compartida.'),
    ('JSON / HTTP (cliente propio)', 'Contrato de API propuesto y cliente HTTP único con interruptor entre datos simulados y reales.'),
    ('Jest y React Testing Library', 'Pruebas de componentes, servicios y hooks: 66 suites y 460 pruebas, verificadas el 3 de noviembre de 2026.'),
    ('ESLint, Prettier y el compilador de TypeScript', 'Calidad estática: tipos y lint sin errores en la última verificación.'),
], [2.3, 4.2], tam=9.5, pie='Tabla 3. Lenguajes, frameworks y bibliotecas utilizados.')
H('2.4.2 Herramientas de trabajo', 3)
tabla(['Herramienta', 'Uso'], [
    ('Visual Studio Code', 'Entorno de desarrollo.'),
    ('Git y GitLab', 'Control de versiones y repositorio del proyecto; commits en español bajo Conventional Commits.'),
    ('Figma y Design System GM', 'Fuente visual: medidas, estados, textos y nodos de cada pantalla y modal.'),
    ('Navegador Chrome y sus herramientas de desarrollo', 'Revisión visual, inspección del DOM, estilos calculados, consola y mediciones de desbordes.'),
    ('Microsoft Teams y correo electrónico', 'Comunicación con el supervisor y el equipo técnico; reuniones quincenales de avance.'),
    ('VPN y equipo institucional', 'Acceso al ambiente de trabajo no productivo.'),
    ('Excel (Control_PPS) y bitácoras', 'Control del cronograma, las horas y el avance por periodo.'),
    ('Word y Markdown', 'Documentación interna de tareas y documento técnico de entrega; Confluence como destino de la documentación.'),
], [2.3, 4.2], tam=9.5, pie='Tabla 4. Herramientas utilizadas. {{Confirme el repositorio institucional.}}')
H('2.4.3 Conocimientos aplicados', 3)
B('**Análisis funcional:** inventario de pantallas, campos, reglas, modales y estados a partir del sistema vigente y del diseño.')
B('**Arquitectura frontend:** estructura de carpetas por responsabilidad (átomos, moléculas, organismos, páginas y plantillas), servicios separados de las pantallas, hooks y tipos.')
B('**Componentes reutilizables:** tablas de registros, diálogos, campos de monto, selector de moneda, carga de archivos, avisos de reintento, entre otros.')
B('**Formularios y validación:** campos obligatorios, límites de entrada, formato de montos como centavos, campos condicionales, errores accesibles asociados a su campo.')
B('**Manejo de estado asíncrono y recuperación ante fallos:** cargas con estado, descarte de respuestas obsoletas, reintentos y tratamiento de la sesión vencida.')
B('**Seguridad y confidencialidad desde el diseño:** no persistir información patrimonial en el almacenamiento del navegador, separar el cuestionario confidencial del borrador de la declaración y declarar éxito solo tras la respuesta del servicio. Se siguieron criterios de OWASP para frontend.')
B('**Accesibilidad básica y diseño adaptable:** foco, teclado, mensajes de error y revisión a 1440, 1366, 1024 y 768 px (escritorio y tablet).')
B('**Pruebas y gestión de calidad:** pruebas unitarias y de componentes, comprobación de tipos y lint, compilación de producción y revisión en navegador.')
B('**Gestión de proyectos y riesgos:** cronograma, matriz de riesgos, bitácoras, control de horas y registro de decisiones.')
H('2.4.4 Proceso de desarrollo', 3)
P('El trabajo siguió un ciclo repetible, aplicado a cada unidad (DEC) y revisado en las reuniones quincenales con el supervisor:')
for t in [
    '**Analizar:** leer el diseño y el registro de la tarea, identificar campos, reglas, modales, estados y dudas abiertas, y contrastarlas con el alcance.',
    '**Resolver dudas:** registrar cada duda como decisión (D-nn) con su efecto y consultarla con el supervisor o el equipo técnico antes de implementar lo que dependía de ella.',
    '**Implementar en unidades pequeñas:** componente, estilos, servicios simulados, tipos y pruebas, reutilizando la biblioteca compartida antes de crear algo nuevo.',
    '**Verificar:** comprobación de tipos, lint y pruebas; revisión en el navegador contra el diseño; mediciones cuando se trataba de responsive.',
    '**Registrar y cerrar:** resumen de lo implementado, archivos tocados, orden recomendado de traslado, validaciones, diferencias conocidas contra el diseño y mensaje de commit.',
    '**Documentar:** actualizar la documentación técnica y el registro de pendientes de continuidad conforme se cerraba cada bloque.',
]:
    B(t, 'List Number')
P('Las fases del proyecto fueron: análisis y planificación (agosto), definición visual, preparación técnica y arquitectura (finales de agosto y septiembre), construcción de los doce pasos en bloques de dos semanas (septiembre y octubre), integración, cierre y documentación (finales de octubre y noviembre).')

# ---- 2.5 Habilidades blandas
H('2.5 Desenvolvimiento en habilidades blandas', 2)
P('{{Borrador; ajuste la columna «Durante la carrera» con su experiencia real en los cursos.}}', justificado=False)
P('Las habilidades blandas que se desarrollaron durante la carrera —trabajo en proyectos de curso, exposición de resultados, cumplimiento de fechas de entrega y resolución de problemas en equipo— se pusieron a prueba y se fortalecieron en un contexto real y de mayor responsabilidad:')
tabla(['Habilidad', 'Durante la carrera', 'Fortalecimiento en la práctica'], [
    ('Comunicación', 'Presentaciones y entregas de los cursos.', 'Formular preguntas concretas con su efecto en el trabajo (29 decisiones registradas), presentar avances de forma demostrativa cada quincena y reportar bloqueos al supervisor.'),
    ('Gestión del tiempo y organización', 'Fechas de entrega de proyectos y trabajos.', 'Planificación semanal, división en unidades verificables, control de 300 horas y reorganización del cronograma cuando fue necesario.'),
    ('Autonomía y responsabilidad', 'Proyectos individuales de curso.', 'Ser la única persona desarrolladora del frontend: decidir, avanzar con lo independiente cuando un recurso estaba bloqueado y responder por la calidad de lo entregado.'),
    ('Adaptabilidad al cambio', 'Cambios de enunciado o de requisitos en proyectos.', 'Absorber los ajustes de requisitos del 21 de octubre y las correcciones posteriores sin perder los hitos.'),
    ('Resolución de problemas y pensamiento crítico', 'Ejercicios y proyectos con enunciado definido.', 'Resolver problemas sin un enunciado cerrado (ausencia de backend, diferencias de Figma) y verificar de forma crítica lo producido.'),
    ('Recibir y aplicar retroalimentación', 'Revisiones de docentes.', 'Incorporar de forma iterativa la retroalimentación del supervisor y del equipo técnico en las revisiones quincenales.'),
    ('Comunicación escrita y documentación', 'Informes y documentación de cursos.', 'Redactar documentación técnica para un equipo que continuará el proyecto, bitácoras semanales y este informe.'),
    ('Ética profesional y confidencialidad', 'Lineamientos generales de los cursos.', 'Manejar información institucional, usar datos propios con lo sensible parcialmente oculto en las evidencias y consultar qué puede incluirse en documentos universitarios.'),
], [1.45, 1.7, 3.35], tam=9, pie='Tabla 5. Habilidades blandas desarrolladas y fortalecidas.')

# ---- 2.6 Sugerencias
H('2.6 Sugerencias y recomendaciones', 2)
P('{{Borrador; son propuestas basadas en lo que la práctica requirió. Ajústelas según su criterio y el plan de estudios vigente.}}', justificado=False)
H('a) Cursos del plan de estudios', 3)
B('**Fortalecer** los cursos de desarrollo web con frameworks y lenguajes actuales (React o similares, TypeScript), de modo que se aborden la composición de componentes, el manejo de estado y la comunicación con servicios.')
B('**Fortalecer** la calidad de software con prácticas de pruebas automatizadas (unitarias y de componentes), análisis estático e integración continua.')
B('**Incorporar** contenidos de accesibilidad web (WCAG), de diseño de interfaces y sistemas de diseño, y de seguridad aplicada al frontend (por ejemplo, criterios OWASP).')
B('**Incorporar o reforzar** la lectura y extensión de código existente y el trabajo con repositorios y bibliotecas compartidas, que es la realidad de la mayoría de proyectos en una organización.')
B('**Incorporar** estimación de esfuerzo, gestión de riesgos y redacción de documentación técnica como parte de los cursos de ingeniería de software.')
H('b) Metodologías de trabajo', 3)
P('Conviene fortalecer, en los cursos de proyecto, el trabajo con metodologías ágiles aplicadas de forma completa (planificación por entregables, revisiones periódicas con demostración, retrospectivas), la práctica de revisión de código entre pares, el desarrollo guiado por pruebas, el registro de decisiones de arquitectura y la elaboración de documentación viva. La práctica mostró que dividir el trabajo en unidades pequeñas con criterios de cierre explícitos, y validarlas de forma periódica con quien las usa, reduce el retrabajo.')
H('c) Habilidades blandas dentro de los cursos', 3)
P('Los cursos podrían integrar actividades en las que el estudiante deba obtener requisitos de una persona real, formular preguntas, documentar supuestos y presentar avances parciales, de modo que aprenda a comunicar bloqueos y a negociar el alcance antes de llegar a la práctica. Los proyectos con un cliente o una contraparte que cambie requisitos a mitad del semestre —de manera controlada— permitirían desarrollar adaptabilidad y gestión del cambio.')
P('También sería útil que los trabajos grupales incluyan evaluación de la comunicación y de la responsabilidad individual, que se practique la exposición técnica ante públicos no técnicos y que se incorporen talleres cortos sobre gestión del tiempo, manejo de la carga académica y laboral, y comunicación escrita profesional. Estos aspectos pesaron tanto como los técnicos en el éxito de la práctica.')
H('d) Aporte del curso de Práctica Profesional Supervisada y posibles mejoras', 3)
P('La PPS permite aplicar la formación en un entorno real, enfrentar problemas que no tienen enunciado cerrado y construir un producto con usuarios y restricciones verdaderas. Considero que su aporte es muy alto. Como mejoras propongo: (1) coordinar con la organización, antes del inicio, los accesos, repositorios y herramientas necesarios, para no perder las primeras semanas; (2) entregar desde el inicio las guías y los formatos de los informes de avance, el informe final y el aval del patrocinador, con ejemplos; (3) definir con claridad en el perfil el alcance y las exclusiones, de modo que las horas se calculen contra un alcance verificable; y (4) prever un espacio de intercambio entre practicantes a mitad del semestre para compartir problemas y soluciones.')

# ---- 2.7 Impacto
H('2.7 Impacto de mi trabajo en la organización y la Universidad', 2)
P('{{Borrador; revise especialmente la valoración del aporte con el supervisor.}}', justificado=False)
H('¿Cuál fue mi principal aporte a la organización?', 3)
P('Mi principal aporte fue entregar a Grupo Mutual una **base frontend completa, probada y documentada** para el módulo «Mi declaración» del Sistema de Declaración Patrimonial, lista para que el equipo interno continúe con la integración. Concretamente:')
B('El recorrido completo del declarante: acceso, inicio, introducción, doce pasos con sus tablas y modales, cuestionario confidencial, juramento y guardado final, con datos simulados claramente identificados.')
B('Componentes genéricos nuevos en la biblioteca compartida (conmutador, ícono de moneda, campo de monto, selector de moneda, grupo de opciones, carga de archivos, aviso de reintento, diálogo base, confirmación de eliminación y tabla de registros), con sus estilos y pruebas, además del rediseño de la lista del selector y la corrección de las migas de pan.')
B('Una propuesta de contrato de API, un cliente HTTP único, catálogos asíncronos y el mapa de lo simulado y lo preparado, de modo que integrar un backend consista en implementar adaptadores y no en reescribir pantallas.')
B('Documentación técnica de transferencia (guía de componentes, flujos, decisiones técnicas, validación y calidad, pendientes y continuidad, entrega) y el registro de 29 decisiones, que reduce el costo de incorporación del equipo receptor.')
B('Pruebas automatizadas (460, verificadas el 3 de noviembre) y verificaciones documentadas de tipos, lint, compilación de producción y comportamiento responsive.')
P('El beneficiario directo es el personal de Recursos Humanos, que revisa las declaraciones, y la sección de Desarrollo de Sistemas, que recibe una base reutilizable para las siguientes etapas de la reconstrucción. {{Agregue aquí, si lo desea, la valoración del supervisor sobre el aporte.}}')
H('¿Qué me aportó la organización a mi enriquecimiento personal y profesional?', 3)
P('La organización me dio la oportunidad de trabajar en un sistema institucional real, con un diseño definido, una biblioteca compartida, un estándar de desarrollo y personas que revisan lo que se produce. Aprendí a trabajar con un código base existente y con dependencias que administran otras áreas, a convivir con la incertidumbre de un backend inexistente, a decidir con información incompleta y a documentar esas decisiones, y a presentar avances de forma periódica ante un supervisor. También me permitió conocer cómo se coordinan las áreas de una entidad financiera, qué significa la confidencialidad de la información en la práctica y qué se espera de una persona desarrolladora: no solo programar, sino comunicar, verificar y dejar el trabajo en condiciones de ser continuado por otros.')
H('Impacto en la Universidad', 3)
P('Para la Universidad, el trabajo constituye evidencia de que la formación en la Escuela de Informática permite a un estudiante asumir, de forma individual, un proyecto de desarrollo con alcance y calidad profesionales, y aporta retroalimentación concreta sobre los contenidos que el plan de estudios debe fortalecer (sección 2.6). Mantiene además el vínculo con una organización que recibe practicantes.')

# ----------------------------------------------------------------- 3. CONCLUSIONES
H('3. Conclusiones', 1, salto=True)
P('**El proyecto cumplió lo acordado.** Todas las actividades del cronograma se finalizaron y se registraron las 300 horas previstas. El resultado es un frontend funcional de doce pasos, con login, inicio, juramento y guardado final, sustentado en datos simulados, 460 pruebas automatizadas verificadas el 3 de noviembre y documentación técnica de transferencia. Los objetivos específicos del perfil se cumplieron en el alcance definido; el Anexo D presenta la trazabilidad objetivo por objetivo.')
P('**El éxito se explica más por la gestión que por la técnica.** Los problemas de mayor efecto no fueron de programación sino de dependencias externas (accesos y componentes compartidos), de información faltante (contratos del backend) y de cambios de requisitos. Lo que permitió absorberlos fue identificar los riesgos temprano, dividir el trabajo en unidades verificables, registrar cada decisión y aislar lo incierto detrás de interfaces. La práctica confirma que la gestión de riesgos y la comunicación están directamente ligadas al avance técnico.')
P('**Una mirada crítica: lo que no se hizo y sus límites.** El sistema no está integrado con ningún servicio institucional; autenticación, sesión, borrador, totales, adjuntos, cuestionario confidencial y guardado final son simulados, y varios asuntos de negocio siguen abiertos (catálogos oficiales, fórmulas y redondeo de los totales, formato de la cédula jurídica, moneda de algunos montos, reglas por cargo en sociedades, destino del cuestionario confidencial). Tampoco se realizó una auditoría de accesibilidad completa, una comparación píxel a píxel con Figma, un recorrido solo con teclado ni pruebas fuera de Chrome. Estas limitaciones no son defectos ocultos: están documentadas con la información que falta, quién la tiene y qué parte del código se verá afectada. Deben leerse como la frontera honesta del trabajo, no como una promesa de producto terminado.')
P('**El trabajo por componentes y por pruebas resultó rentable.** Los cambios de requisitos de octubre se aplicaron a diez tablas y a ocho pasos con campos de monto con un costo bajo gracias a los componentes comunes. Sin ellos, el retrabajo habría comprometido el cierre. Del mismo modo, la documentación escrita junto con el código y contrastada contra él evita que el equipo receptor herede descripciones que no coinciden con el producto.')
P('**Balance personal y profesional.** La práctica me permitió comprobar que puedo asumir de forma autónoma un proyecto real, pero también identificó mis puntos por mejorar: estimar con más margen, escalar los bloqueos antes y limitar el tiempo en ajustes finos.')
P('**Recomendación final.** Para continuar el proyecto, se recomienda cerrar primero los asuntos de negocio abiertos, definir los contratos con el backend y reemplazar los servicios simulados por adaptadores reales, retirar el código de demostración antes de usar el sistema con datos reales, completar la auditoría de accesibilidad y la comparación con el diseño, y trasladar la documentación a Confluence con la aceptación del equipo receptor. Doy por finalizada la práctica con satisfacción por lo aprendido y por lo entregado.')

# ----------------------------------------------------------------- 4. ANEXOS
H('4. Anexos: evidencias de resultados', 1, salto=True)
P('Los anexos presentan la evidencia del producto generado: el cronograma detallado (A), las capturas del sistema (B), las verificaciones realizadas y su alcance (C), la trazabilidad contra los objetivos del perfil (D), las bitácoras (E) y el aval del patrocinador (F). Las capturas se tomaron del sistema en ejecución local con los datos del estudiante, con la información sensible parcialmente oculta (cédula, teléfonos, número de finca, placa y número de préstamo); no contienen información institucional real.')

# ---- Anexo A
H('Anexo A. Cronograma detallado por periodo', 2)
P('Cada periodo se detalla tarea por tarea. Estado final de todas las tareas: **Terminado**. Abreviaturas: AN análisis; FG Figma; ARQ arquitectura frontend; LG login; PS pantalla principal del sistema; MD pantalla principal de «Mi declaración»; FL flujo general; DG datos generales; NF núcleo familiar; IE ingresos y egresos; BI bienes inmuebles; BM bienes muebles; DE datos económicos; CC cuentas corrientes; CR créditos; TC tarjetas de crédito; PJ personería jurídica; DJ datos judiciales; DP declaración patrimonial completa; DJU declaración jurada; INT integración; CI cierre; CDM corrección de defectos y mejoras; SEG seguimiento quincenal.')
for i, (cod, per, h, act, hoja, nombre) in enumerate(PERIODOS, 1):
    filas, total = tareas(hoja)
    H(f'A.{i} {cod} · {per} · {nombre}', 3)
    tabla(['ID', 'Tarea', 'Horas', 'Estado'], filas + [('', '**Total del periodo**', total, 'Terminado')],
          [0.8, 4.2, 0.6, 0.9], verde_col=3, tam=9, centradas=(2, 3),
          pie=f'Tabla A.{i}. Resultado esperado del periodo: {RESULTADOS[cod]}')

# ---- Anexo B
H('Anexo B. Evidencias del producto: capturas del sistema', 2, salto=True)
P('Las figuras siguientes muestran el recorrido del declarante en el sistema desarrollado, ejecutado en un ambiente local con los datos del estudiante, con lo sensible parcialmente oculto. Cada figura indica el paso del cronograma al que corresponde.')
EV = [
    ('ian_login', 'Figura B.1. Inicio de sesión (periodo ARQ - LG - PS - MD). Formulario con validaciones, recordar usuario y visibilidad de contraseña.'),
    ('ian_home', 'Figura B.2. Pantalla principal del sistema (periodo ARQ - LG - PS - MD), con acceso a «Mi declaración».'),
    ('ian_intro', 'Figura B.3. Introducción de «Mi declaración» (periodo ARQ - LG - PS - MD).'),
    ('ian_step1-errores', 'Figura B.4. Paso 1, Datos generales, con validación de campos obligatorios (periodo FL - DG - NF - IE).'),
    ('ian_step1', 'Figura B.5. Paso 1, Datos generales, completo; cédula y teléfonos parcialmente ocultos (periodo FL - DG - NF - IE).'),
    ('ian_step2', 'Figura B.6. Paso 2, Núcleo familiar (periodo FL - DG - NF - IE).'),
    ('ian_step3-after', 'Figura B.7. Paso 3, Ingresos y egresos, con un ingreso adicional registrado y aviso de guardado (periodo FL - DG - NF - IE).'),
    ('ian_step3-modal', 'Figura B.8. Modal de alta de ingreso adicional con campo de monto formateado, justificación y carga de archivo PDF (periodo FL - DG - NF - IE y ajustes de octubre).'),
    ('ian_step4-after', 'Figura B.9. Paso 4, Bienes inmuebles, con un registro (periodo BI - BM - DE).'),
    ('ian_step5-after', 'Figura B.10. Paso 5, Bienes muebles, con un vehículo registrado (periodo BI - BM - DE).'),
    ('ian_step6', 'Figura B.11. Paso 6, Datos económicos: ahorro (periodo BI - BM - DE).'),
    ('ian_step8-after', 'Figura B.12. Paso 8, Créditos que posee, con un crédito registrado y totales por moneda (periodo CC - CR - TC).'),
    ('ian_step9', 'Figura B.13. Paso 9, Tarjetas de crédito (periodo CC - CR - TC).'),
    ('ian_step10', 'Figura B.14. Paso 10, Personería jurídica y sociedades (periodo PJ - DJ - DP - DJU - INT).'),
    ('ian_step12', 'Figura B.15. Paso 12, cuestionario confidencial (periodo PJ - DJ - DP - DJU - INT).'),
    ('ian_oath', 'Figura B.16. Declaración jurada (periodo PJ - DJ - DP - DJU - INT).'),
    ('ian_confirm', 'Figura B.17. Confirmación antes de guardar la declaración (periodo PJ - DJ - DP - DJU - INT).'),
    ('ian_saved', 'Figura B.18. Guardado satisfactorio de la declaración (periodo PJ - DJ - DP - DJU - INT).'),
]
for arch, pie in EV:
    figura(arch + '.jpg', 5.9, pie)
recuadro('Figura B.19. Comparación con Figma (opcional)',
         'Una pantalla del sistema junto a su nodo de Figma (por ejemplo, el paso 10 o el modal de eliminar), para evidenciar la fidelidad visual.')
recuadro('Figura B.20. Resultado de las pruebas automatizadas',
         'Captura de la terminal con «npx jest --runInBand» (suites y pruebas satisfactorias) y, si desea, de «npx tsc --noEmit» y «npx eslint src» sin errores. Use el resultado de la última ejecución.')
recuadro('Figura B.21. Documentación técnica',
         'Captura de la documentación publicada (índice de la guía de componentes o una página de flujo) o del documento técnico final en Word.')

# ---- Anexo C
H('Anexo C. Verificaciones realizadas y su alcance', 2, salto=True)
tabla(['Verificación', 'Resultado', 'Fecha y procedimiento'], [
    ('Tipos y lint', 'Sin errores', '27 de octubre y 3 de noviembre de 2026 (mismo resultado): `npx tsc --noEmit` y `npx eslint src`.'),
    ('Pruebas automatizadas', '66 suites y 460 pruebas satisfactorias', '27 de octubre y 3 de noviembre de 2026 (mismo resultado): `npx jest --runInBand`. Incluyen componentes, servicios, hooks y los componentes genéricos de `sad-aml-shared`.'),
    ('Compilación de producción', 'Compila las rutas `/`, `/inicio` y `/mi-declaracion/[paso]`', '27 de octubre de 2026: `next build` sobre una copia del proyecto. El único aviso proviene de Sass dentro de `sad-aml-shared`.'),
    ('Recorrido en navegador (Chrome)', 'Acceso, bloqueo del paso 1, avance y salto entre pasos, y en el paso 12 «Terminar», «Guardar», confirmación y aviso final', '27 de octubre de 2026, servidor local con usuario de demostración.'),
    ('Desbordes responsive', 'Sin desborde de página en los 12 pasos a 1440, 1366 y 768 px', '27 de octubre de 2026, medición con JavaScript. A 768 px los pasos 5, 6, 8 y 9 desplazan dentro de su tabla, por diseño.'),
    ('Ajustes posteriores', 'Botón «Agregar nuevo» y mensaje de tabla vacía conformes al diseño; 15 suites y 193 pruebas relacionadas satisfactorias', '29 de octubre de 2026, revisión de estilos calculados a 1366 px.'),
], [1.55, 2.25, 2.7], tam=9, pie='Tabla C.1. Verificaciones realizadas. Fuente: documentación técnica del proyecto (validación y calidad, entrega).')
P('**Lo que no se verificó** (límites conocidos del alcance): auditoría de accesibilidad con lector de pantalla y medición de contraste; comparación pantalla por pantalla y píxel a píxel contra Figma; recorrido completo solo con teclado; teléfonos (fuera del alcance acordado); e integración con servicios institucionales (no existen). Estos puntos están registrados como pendientes de continuidad.')

# ---- Anexo D
H('Anexo D. Trazabilidad contra los objetivos del perfil', 2)
tabla(['Objetivo específico', 'Producto', 'Evidencia y estado'], [
    ('1. Analizar las funcionalidades del sistema actual (interfaz, navegación, flujos).', 'Resumen de entendimiento funcional y mapa de pantallas.', 'Inventario de pantallas, campos, modales y estados; documento de preparación técnica y visual con 29 decisiones abiertas y resueltas (periodo AN). Cumplido.'),
    ('2. Definir una propuesta de estructura frontend.', 'Propuesta de arquitectura frontend.', 'Rutas, estructura por capas y guía de arquitectura (`/`, `/inicio`, `/mi-declaracion/[paso]`). Cumplido.'),
    ('3. Diseñar prototipos o maquetas de las pantallas priorizadas.', 'Prototipos de interfaz.', 'Definición visual en Figma de login, inicio, «Mi declaración», doce pasos, juramento, modales y estados (periodo FG). Cumplido.'),
    ('4. Desarrollar componentes frontend reutilizables.', 'Catálogo inicial de componentes.', 'Átomos, moléculas y organismos; diez componentes genéricos nuevos en `sad-aml-shared`; guía de componentes. Cumplido.'),
    ('5. Implementar las pantallas priorizadas con buenas prácticas.', 'Pantallas implementadas en el ambiente de desarrollo.', 'Recorrido completo: login, inicio, introducción, doce pasos, juramento y guardado (Anexo B). Cumplido, con servicios simulados.'),
    ('6. Realizar pruebas funcionales básicas y documentar los resultados.', 'Evidencias de pruebas, incidencias y correcciones.', '460 pruebas automatizadas, tipos, lint, compilación, recorrido en navegador y mediciones responsive (Anexo C). Cumplido.'),
    ('7. Elaborar documentación técnica y funcional.', 'Documento técnico final, guía de componentes y recomendaciones de continuidad.', '11 páginas generales, 20 de flujos, contrato de API, inventario de código de demostración y pendientes con responsables. Cumplido; publicación en Confluence a cargo del estudiante.'),
], [2.0, 1.7, 2.8], tam=9, pie='Tabla D.1. Trazabilidad de objetivos específicos, productos y evidencias.')

# ---- Anexo E
H('Anexo E. Bitácoras de la práctica', 2)
P('Se registraron 13 bitácoras semanales con un total de 300 horas. Los documentos originales (EIF408-07 Bitácora 01 a 13) se conservan aparte.')
MESES = ['', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']


def rango(txt):
    i, f = [x.strip() for x in txt.split(' al ')]
    (ya, ma, da), (yb, mb, db) = [list(map(int, x.split('-'))) for x in (i, f)]
    return f'{da} al {db} de {MESES[mb]}' if ma == mb else f'{da} de {MESES[ma]} al {db} de {MESES[mb]}'


filas = [(a.replace('Bitácora ', 'B').replace(' / Semana ', ' · S'), rango(c), b, d, '') for a, b, c, d in semanas]
tabla(['Bitácora', 'Periodo', 'Horas', 'Acumulado'], [(a, c, int(float(b)), int(float(d))) for a, c, b, d, _ in filas] + [('', '**Total**', 300, 300)],
      [1.6, 2.9, 0.9, 1.1], tam=9.5, centradas=(2, 3), pie='Tabla E.1. Horas registradas por semana. Fuente: Control_PPS.')

# ---- Anexo F
H('Anexo F. Aval del patrocinador', 2)
P('El informe debe estar firmado por el supervisor y el estudiante mediante el documento «Aval del Patrocinador» disponible en el aula virtual, al que debe agregarse el siguiente último párrafo:')
q = doc.add_paragraph()
q.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
q.paragraph_format.left_indent = Inches(0.4)
q.paragraph_format.right_indent = Inches(0.4)
runs(q, '«Asimismo, indico que se han alcanzado los objetivos planteados para la realización de la práctica, los cuales han sido de nuestro interés y satisfacción, por tanto, damos por finalizada la práctica profesional supervisada».', cursiva=True)
recuadro('Aval del patrocinador firmado',
         'Inserte la copia digitalizada del Aval, firmado por Alexander Rojas Soto y por el estudiante, y súbala también a la plataforma en la liga correspondiente. Sin la firma del supervisor el informe no puede evaluarse.')

# ----------------------------------------------------------------- pie de página
sec.different_first_page_header_footer = True
fp = sec.footer.paragraphs[0]
fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
campo(fp, 'PAGE', '1')
for r in fp.runs:
    r.font.size = Pt(9)
    r.font.color.rgb = GRIS
hp = sec.header.paragraphs[0]
hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
r = hp.add_run('Informe final PPS · Ian Villegas Jiménez · EIF408 · II Ciclo 2026')
r.font.size = Pt(8.5)
r.font.color.rgb = GRIS

# actualizar campos (índice) al abrir

cp = doc.core_properties
cp.title = 'Informe final de la PPS - Declaración Patrimonial (Grupo Mutual)'
cp.author = 'Ian Villegas Jiménez'
cp.subject = 'EIF408 - Proyectos y su Aplicación en la Organización, II Ciclo 2026'

# orden de hijos de w:tblPr según el esquema (Word es estricto con el orden)
ORDEN_TBLPR = ['tblStyle', 'tblpPr', 'tblOverlap', 'bidiVisual', 'tblStyleRowBandSize', 'tblStyleColBandSize', 'tblW', 'jc',
               'tblCellSpacing', 'tblInd', 'tblBorders', 'shd', 'tblLayout', 'tblCellMar', 'tblLook']
for tp in doc.element.body.iter(qn('w:tblPr')):
    hijos = list(tp)
    hijos.sort(key=lambda e: ORDEN_TBLPR.index(e.tag.split('}')[1]) if e.tag.split('}')[1] in ORDEN_TBLPR else 99)
    for h in hijos:
        tp.remove(h)
    for h in hijos:
        tp.append(h)

doc.save(SALIDA)
print('guardado:', SALIDA)
