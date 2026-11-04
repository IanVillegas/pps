"""Genera las dos figuras del informe: diagrama de Gantt del cronograma y horas por semana."""
import datetime as dt
import json
import os

import matplotlib
matplotlib.use('Agg')
import matplotlib.dates as mdates
import matplotlib.pyplot as plt

AQUI = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(AQUI, 'assets')
VERDE = '#2E8B3D'
GRIS = '#5F6368'
ROJO = '#E62C3A'
RAYA = '#D9DCE0'

plt.rcParams['font.family'] = 'DejaVu Sans'

D = dt.date
PERIODOS = [
    ('AN', 'Análisis', D(2026, 8, 3), D(2026, 8, 14), 40),
    ('FG', 'Figma', D(2026, 8, 17), D(2026, 8, 28), 40),
    ('ARQ-LG-PS-MD', 'Arquitectura y login', D(2026, 8, 31), D(2026, 9, 11), 40),
    ('FL-DG-NF-IE', 'Flujo, pasos 1, 2 y 3', D(2026, 9, 14), D(2026, 9, 25), 40),
    ('BI-BM-DE', 'Pasos 4, 5 y 6', D(2026, 9, 28), D(2026, 10, 9), 40),
    ('CC-CR-TC', 'Pasos 7, 8 y 9', D(2026, 10, 12), D(2026, 10, 23), 40),
    ('PJ-DJ-DP-DJU-INT', 'Pasos 10, 11, 12 y juramento', D(2026, 10, 26), D(2026, 10, 30), 40),
    ('CI', 'Pruebas y entrega', D(2026, 11, 2), D(2026, 11, 6), 20),
]


def gantt():
    fig, ax = plt.subplots(figsize=(8.6, 4.3), dpi=200)
    n = len(PERIODOS)
    for i, (cod, nombre, ini, fin, h) in enumerate(PERIODOS):
        y = n - 1 - i
        ax.barh(y, (fin - ini).days + 1, left=mdates.date2num(ini), height=0.58, color=ROJO)
        ax.text(mdates.date2num(fin) + 1.6, y, f'{h} h · Terminado', va='center', fontsize=7.5, color=GRIS)
    ax.set_yticks(range(n))
    ax.set_yticklabels([f'{c}\n{nom}' if len(nom) < 30 else f'{c}\n{nom[:28]}…'
                        for c, nom, *_ in reversed(PERIODOS)], fontsize=7)
    ax.xaxis_date()
    ax.xaxis.set_major_locator(mdates.WeekdayLocator(byweekday=mdates.MO, interval=2))
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%d %b'))
    ax.tick_params(axis='x', labelsize=7.5, colors=GRIS)
    ax.set_xlim(mdates.date2num(D(2026, 8, 1)), mdates.date2num(D(2026, 11, 24)))
    ax.grid(axis='x', color=RAYA, linewidth=0.7)
    ax.set_axisbelow(True)
    for s in ('top', 'right', 'left'):
        ax.spines[s].set_visible(False)
    ax.spines['bottom'].set_color(RAYA)
    ax.tick_params(axis='y', length=0)
    fig.tight_layout()
    fig.savefig(os.path.join(ASSETS, 'fig_gantt.png'))
    plt.close(fig)


def horas():
    ctrl = json.load(open(os.path.join(AQUI, 'control.json'), encoding='utf-8'))
    semanas = []
    for f in ctrl[0]['filas']:
        a = f.get('A', '')
        if a.startswith('Bitácora') and 'B' in f:
            semanas.append((a.split('/')[1].strip().replace('Semana ', 'S'), float(f['B'])))
    etiquetas = [s for s, _ in semanas]
    valores = [v for _, v in semanas]
    acum, t = [], 0
    for v in valores:
        t += v
        acum.append(t)
    fig, (ax, bx) = plt.subplots(1, 2, figsize=(8.6, 3.3), dpi=200, gridspec_kw={'width_ratios': [1.25, 1]})
    ax.bar(etiquetas, valores, color=ROJO, width=0.62)
    for x, v in zip(etiquetas, valores):
        ax.text(x, v + 0.6, f'{v:g}', ha='center', fontsize=7, color=GRIS)
    ax.set_ylim(0, 31)
    ax.set_title('Horas registradas por semana', fontsize=8.5, color='#202124', loc='left')
    bx.plot(etiquetas, acum, color=ROJO, linewidth=1.8, marker='o', markersize=3.2)
    bx.axhline(300, color=GRIS, linestyle=(0, (4, 3)), linewidth=0.9)
    bx.text(0, 306, 'Meta: 300 h', fontsize=7, color=GRIS)
    bx.text(len(etiquetas) - 1, acum[-1] - 38, f'{acum[-1]:g} h', fontsize=8, color='#202124', ha='center', fontweight='bold')
    bx.set_ylim(0, 335)
    bx.set_title('Horas acumuladas', fontsize=8.5, color='#202124', loc='left')
    for a in (ax, bx):
        a.tick_params(labelsize=7, colors=GRIS)
        for s_ in ('top', 'right'):
            a.spines[s_].set_visible(False)
        for s_ in ('left', 'bottom'):
            a.spines[s_].set_color(RAYA)
        a.grid(axis='y', color=RAYA, linewidth=0.6)
        a.set_axisbelow(True)
    bx.set_xticks(range(0, len(etiquetas), 2))
    bx.set_xticklabels(etiquetas[::2])
    fig.tight_layout()
    fig.savefig(os.path.join(ASSETS, 'fig_horas.png'))
    plt.close(fig)
    return semanas, acum


if __name__ == '__main__':
    gantt()
    print(horas())
