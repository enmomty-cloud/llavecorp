# Genera imágenes de relleno pixel para productos a partir de rejillas de texto.
# Uso: python scripts/pixel-productos.py   -> escribe public/img/productos/{slug}.svg
# Cada letra es un color; '.' es transparente. Todo es arte original en rejilla de 16x16.
import os
os.chdir(os.path.join(os.path.dirname(__file__), '..'))

COLORES = {
    'k': '#1a1433',  # índigo
    'c': '#fffaea',  # crema
    'r': '#e4342b',  # rojo
    'g': '#ffd23f',  # dorado
    'o': '#d9a300',  # dorado oscuro
    'b': '#19c3d6',  # cian
    'v': '#28d17c',  # verde
    'x': '#b8b4c4',  # plata
    'p': '#8e5bd6',  # morado
    'w': '#ffffff',
}

DISENOS = {
    'cartucho-dorado': ("El cartucho dorado", [
        '..kkkkkkkkkkkk..',
        '.kggggggggggggk.',
        '.kgoggggggggogk.',
        '.kgokkkkkkkkogk.',
        '.kgokccccccKogk.'.replace('K', 'k'),
        '.kgokckkkkckogk.',
        '.kgokccccccKogk.'.replace('K', 'k'),
        '.kgokkkkkkkkogk.',
        '.kgoggggggggogk.',
        '.kgoggggggggogk.',
        '.kggggggggggggk.',
        '.kkggggggggggkk.',
        '..kooooooooook..',
        '..kkkkkkkkkkkk..',
        '................',
        '................',
    ]),
    'espada-pixel': ("Espada pixel", [
        '.............kk.',
        '............kbbk',
        '...........kbbk.',
        '..........kbbk..',
        '.........kbbk...',
        '........kbbk....',
        '.......kbbk.....',
        '..kk..kbbk......',
        '..kgkkbbk.......',
        '...kgggk........',
        '..kgggkk........',
        '.kggkkk.........',
        'krrk............',
        'krrk............',
        '.kk.............',
        '................',
    ]),
    'escudo-llave': ("Escudo con llave", [
        '.kkkkkkkkkkkkkk.',
        'kbbbbbbbbbbbbbbk',
        'kbbbbbbbbbbbbbbk',
        'kbbccccbbbbbbbbk',
        'kbcbbbbcbbbbbbbk',
        'kbcbkkbccccccbbk',
        'kbcbkkbcbbbbbbbk',
        'kbcbbbbcbcbcbbbk',
        'kbbccccbbbbbbbbk',
        '.kbbbbbbbbbbbbk.',
        '.kbbbbbbbbbbbbk.',
        '..kbbbbbbbbbbk..',
        '...kbbbbbbbbk...',
        '....kbbbbbbk....',
        '.....kbbbbk.....',
        '......kkkk......',
    ]),
    'corazon-contenedor': ("Corazón contenedor", [
        '................',
        '..kkkk....kkkk..',
        '.krrrrk..krrrrk.',
        'krrwrrrkkrrrrrrk',
        'krwrrrrrrrrrrrrk',
        'krrrrrrrrrrrrrrk',
        'krrrrrrrrrrrrrrk',
        '.krrrrrrrrrrrrk.',
        '..krrrrrrrrrrk..',
        '...krrrrrrrrk...',
        '....krrrrrrk....',
        '.....krrrrk.....',
        '......krrk......',
        '.......kk.......',
        '................',
        '................',
    ]),
    'pocion': ("Poción", [
        '.....kkkkkk.....',
        '.....kccccK.....'.replace('K', 'k'),
        '.....kkkkkk.....',
        '......kccK......'.replace('K', 'k'),
        '......kccK......'.replace('K', 'k'),
        '.....kccccK.....'.replace('K', 'k'),
        '....kccccccK....'.replace('K', 'k'),
        '...kccrrrrccK...'.replace('K', 'k'),
        '..kcrrrrrrrrck..',
        '..krrrrrrrrrrk..',
        '..krrwrrrrrrrk..',
        '..krrrrrrrrrrk..',
        '..kcrrrrrrrrck..',
        '...kccrrrrcck...',
        '....kkkkkkkk....',
        '................',
    ]),
    'cofre': ("Cofre del tesoro", [
        '................',
        '..kkkkkkkkkkkk..',
        '.krrrrrrrrrrrrk.',
        'krrggrrrrrrggrrk',
        'krrggrrrrrrggrrk',
        'kkkkkkkkkkkkkkkk',
        'krrrrrrkkrrrrrrk',
        'krrrrrkggkrrrrrk',
        'krrrrrkgkkrrrrrk',
        'krrrrrrkkrrrrrrk',
        'krrggrrrrrrggrrk',
        'krrggrrrrrrggrrk',
        'krrrrrrrrrrrrrrk',
        '.kkkkkkkkkkkkkk.',
        '................',
        '................',
    ]),
    'triangulo-dorado': ("Triángulo dorado", [
        '................',
        '.......kk.......',
        '......kggk......',
        '......kggk......',
        '.....kggggk.....',
        '.....kggggk.....',
        '....kggggggk....',
        '....kgoooogk....',
        '...kggooooggk...',
        '...kggggggggk...',
        '..kggggggggggk..',
        '..kggggggggggk..',
        '.kggggggggggggk.',
        '.kggggggggggggk.',
        'kkkkkkkkkkkkkkkk',
        '................',
    ]),
    'hada-en-frasco': ("Hada en frasco", [
        '......kkkk......',
        '.....kccccK.....'.replace('K', 'k'),
        '......kkkk......',
        '.....kbbbbk.....',
        '....kbbbbbbk....',
        '...kbbbbbbbbk...',
        '...kbbwbbwbbk...',
        '...kbwggggwbk...',
        '...kbbgccgbbk...',
        '...kbwggggwbk...',
        '...kbbwbbwbbk...',
        '...kbbbbbbbbk...',
        '...kbbbbbbbbk...',
        '....kbbbbbbk....',
        '.....kkkkkk.....',
        '................',
    ]),
    'recuerdo-boda': ("Con sus nombres y la fecha", [
        '..kkkk....kkkk..',
        '.krrrrk..krrrrk.',
        'krrwrrrkkrrrrrrk',
        'krwrrrrrrrrrrrrk',
        'krrrrkkkkkkrrrrk',
        'krrrkggggggkrrrk',
        '.krrkgkkkkgkrrk.',
        '..krkgkkkkgkrk..',
        '...kkggggggkk...',
        '....kgkkkkgk....',
        '.....kgggggk....'.replace('gggggk....', 'ggggk.....'),
        '......krrk......',
        '.......kk.......',
        '................',
        '................',
        '................',
    ]),
    'recuerdo-xv': ("Con su nombre y la fecha", [
        '................',
        '.......kk.......',
        '......kggk......',
        '..kk..kggk..kk..',
        '.kggk.kggk.kggk.',
        '.kggkkkggkkkggk.',
        '.kgggggggggggggk'.replace('gggggggggggggk', 'ggggggggggggk.'),
        '.kggkrrkggkrrggk'.replace('ggkrrkggkrrggk', 'ggkrrkggkrrgk.'),
        '.kggkrrkggkrrggk'.replace('ggkrrkggkrrggk', 'ggkrrkggkrrgk.'),
        '.kggggggggggggk.',
        '.kkkkkkkkkkkkkk.',
        '..kbbbbbbbbbbk..',
        '..kbbbbbbbbbbk..',
        '...kkkkkkkkkk...',
        '................',
        '................',
    ]),
}

def svg(nombre, filas, caption):
    celda = 20
    ancho = 16 * celda
    rects = []
    for y, fila in enumerate(filas):
        assert len(fila) == 16, f'{nombre}: fila {y} tiene {len(fila)} columnas'
        for x, ch in enumerate(fila):
            if ch == '.': continue
            rects.append(f'<rect x="{x * celda}" y="{y * celda}" width="{celda}" height="{celda}" fill="{COLORES[ch]}"/>')
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" shape-rendering="crispEdges">
  <defs><pattern id="h" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1.4" fill="#1a1433" opacity=".18"/></pattern></defs>
  <rect width="400" height="400" fill="#fbf4dc"/><rect width="400" height="400" fill="url(#h)"/>
  <g transform="translate({(400 - ancho) // 2} 20)">
    {''.join(rects)}
  </g>
  <text x="200" y="372" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="12" fill="#1a1433">{caption}</text>
</svg>
'''

os.makedirs('public/img/productos', exist_ok=True)
for slug, (caption, filas) in DISENOS.items():
    with open(f'public/img/productos/{slug}.svg', 'w', encoding='utf-8', newline='\n') as f:
        f.write(svg(slug, filas, caption))
    print('ok', slug)
