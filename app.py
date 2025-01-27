
#No arquivo app.py (substitua todo o conteúdo atual por este):
from flask import Flask, render_template, request, jsonify
from itertools import combinations

app = Flask(__name__)

def combine_digits(a, b):
    """Combina dois dígitos para formar um número"""
    return int(str(a) + str(b))

def get_valid_pairs(grid):
    """Obtém todos os pares válidos (1-60) da grade"""
    valid_pairs = set()
    rows = [
        grid[0:5],    # primeira linha
        grid[5:9],    # segunda linha
        grid[9:12],   # terceira linha
        grid[12:14],  # quarta linha
        grid[14:15]   # quinta linha
    ]
    
    # Horizontal (esquerda para direita e direita para esquerda)
    for row in rows:
        for i in range(len(row)-1):
            num1 = combine_digits(row[i], row[i+1])
            num2 = combine_digits(row[i+1], row[i])
            if 1 <= num1 <= 60:
                valid_pairs.add(num1)
            if 1 <= num2 <= 60:
                valid_pairs.add(num2)
    
    # Vertical e Diagonal
    # Implemente lógica similar para outras direções...
    
    return sorted(list(valid_pairs))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        numbers = data['numbers']
        num_dezenas = data['combinations']
        
        # Validar entrada
        if len(numbers) != 15 or not all(isinstance(n, int) for n in numbers):
            return jsonify({'error': 'Entrada inválida'}), 400
            
        # Obter pares válidos
        valid_pairs = get_valid_pairs(numbers)
        
        if not valid_pairs:
            return jsonify({'error': 'Nenhuma combinação válida encontrada'}), 400
            
        # Gerar combinações com o número de dezenas solicitado
        jogos = list(combinations(valid_pairs, num_dezenas))
        
        # Filtrar combinações válidas e únicas
        jogos_validos = []
        for jogo in jogos:
            jogo_ordenado = sorted(jogo)
            if (len(set(jogo_ordenado)) == len(jogo_ordenado) and  # sem repetições
                all(1 <= num <= 60 for num in jogo_ordenado)):     # números válidos
                jogos_validos.append(jogo_ordenado)
        
        return jsonify({
            'combinations': jogos_validos,
            'total': len(jogos_validos)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)