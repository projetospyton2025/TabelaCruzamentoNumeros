

# Adicione esta importação junto com as outras no início do arquivo
from flask import Flask, render_template, request, jsonify, send_file, session
import pandas as pd
import requests
import io
import json
from itertools import combinations
import os
from dotenv import load_dotenv
import logging
import random  # Adicione esta importação

# O resto do código permanece igual até a função generate()


# E adicione esta configuração após criar a app
app = Flask(__name__)
app.secret_key = 'sua_chave_secreta_aqui'  # Necessário para usar session


logging.basicConfig(
    level=logging.INFO,  # Define o nível mínimo de mensagens (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    format='%(asctime)s - %(levelname)s - %(message)s',  # Formato das mensagens
    handlers=[
        logging.FileHandler("app.log"),  # Salva os logs em um arquivo
        logging.StreamHandler()         # Exibe os logs no console
    ]
)

@app.route('/')
def index():
    return render_template('index.html')


def format_number(num):
    """Formata número para ter sempre 2 dígitos"""
    return f"{num:02d}"

def combine_digits(a, b):
    """Combina dois dígitos para formar um número"""
    return int(f"{a}{b}")



# Gerando os números da grid triângulo
def get_valid_pairs(grid):
    valid_pairs = set()
    rows = [
        grid[0:5],    # primeira linha (código1)
        grid[5:9],    # segunda linha (código1)
        grid[9:12],   # terceira linha (código1)
        grid[12:14],  # quarta linha (código1)
        grid[14:15]   # quinta linha (código1)
    ]
    
    # Função auxiliar para validar e adicionar números
    def add_valid_number(num):
        if 1 <= num <= 60:
            valid_pairs.add(num)
    
    # 1. Horizontal (esquerda para direita e direita para esquerda)
    for row in rows:
        for i in range(len(row)-1):
            add_valid_number(combine_digits(row[i], row[i+1]))
            add_valid_number(combine_digits(row[i+1], row[i]))

    # 2. Diagonal (superior esquerda para inferior direita) e Diagonal (superior direita para inferior esquerda)
    for i in range(len(rows)-1):
        current_row = rows[i]
        next_row = rows[i+1]
        for j in range(min(len(current_row), len(next_row))):  # Ajustado para lidar com limites das linhas
            # Diagonal direita
            add_valid_number(combine_digits(current_row[j], next_row[j]))
            add_valid_number(combine_digits(next_row[j], current_row[j]))
            
            # Diagonal esquerda (código2)
            if j > 0:
                add_valid_number(combine_digits(current_row[j], next_row[j-1]))
                add_valid_number(combine_digits(next_row[j-1], current_row[j]))

    # 3. Vertical (código1) - Colocando a verificação das colunas
    col_positions = [
        [(0,0), (1,0), (2,0), (3,0), (4,0)],  # primeira coluna (código1)
        [(0,1), (1,1), (2,1), (3,1)],         # segunda coluna (código1)
        [(0,2), (1,2), (2,2)],                # terceira coluna (código1)
        [(0,3), (1,3)],                       # quarta coluna (código1)
        [(0,4)]                               # quinta coluna (código1)
    ]
    
    for col in col_positions:
        for i in range(len(col)-1):
            row1, pos1 = col[i]
            row2, pos2 = col[i+1]
            if pos1 < len(rows[row1]) and pos2 < len(rows[row2]):
                add_valid_number(combine_digits(rows[row1][pos1], rows[row2][pos2]))
                add_valid_number(combine_digits(rows[row2][pos2], rows[row1][pos1]))

    # 4. Tratamento especial para zero (código1) 
    for i, row in enumerate(rows):
        for j, num in enumerate(row):
            if num == 0:
                # Verificar números adjacentes (horizontal, vertical e diagonal)
                adjacent_positions = [
                    (i, j-1), (i, j+1),  # horizontal
                    (i-1, j), (i+1, j),  # vertical
                    (i-1, j-1), (i-1, j+1),  # diagonal superior
                    (i+1, j-1), (i+1, j+1)   # diagonal inferior
                ]
                
                for adj_i, adj_j in adjacent_positions:
                    if (0 <= adj_i < len(rows) and 
                        0 <= adj_j < len(rows[adj_i])):
                        adj_num = rows[adj_i][adj_j]
                        # Zero à esquerda (06)
                        add_valid_number(combine_digits(0, adj_num))
                        # Zero à direita (60)
                        add_valid_number(combine_digits(adj_num, 0))

    # 5. Tratamento especial para zero (código2)
    for i, num in enumerate(grid):
        if num == 0:
            # Verifica números adjacentes na horizontal (código2)
            if i > 0:
                add_valid_number(grid[i-1])
            if i < len(grid) - 1:
                add_valid_number(grid[i+1])

    return sorted(list(valid_pairs))


@app.route('/generate', methods=['POST'])
def generate():
    try:
        logging.info("Recebendo requisição...")
        
        # Recebendo os dados da requisição
        data = request.json
        if not data:
            return jsonify({'error': 'Dados não recebidos'}), 400
            
        # Obtendo os parâmetros necessários
        numbers = data.get('numbers')
        num_dezenas = data.get('combinations')
        
        if not numbers or not num_dezenas:
            return jsonify({'error': 'Parâmetros incompletos'}), 400
            
        logging.info(f"Números recebidos: {numbers}")
        logging.info(f"Quantidade de dezenas: {num_dezenas}")
        
        # Validando e processando pares válidos
        valid_pairs = get_valid_pairs(numbers)
        
        logging.info(f"Pares válidos encontrados: {valid_pairs}")
        
        # Verificando o intervalo válido para o número de dezenas
        if not (6 <= num_dezenas <= 20):
            return jsonify({'error': 'Número de dezenas deve estar entre 6 e 20'}), 400
        
        # Calculando o limite máximo de combinações baseado no número de dezenas
        MAX_COMBINATIONS = int(10000 / num_dezenas)  # Ajuste dinâmico
        
        # Calculando o total de combinações possíveis
        from math import comb
        total_possible = comb(len(valid_pairs), num_dezenas)
        
        # Se tivermos muitos pares válidos, vamos reduzir proporcionalmente
        if len(valid_pairs) > num_dezenas * 4:
            quantidade_pares = num_dezenas * 4  # Mantém 4x o número de dezenas
            valid_pairs = random.sample(valid_pairs, quantidade_pares)
        
        # Gerando combinações de jogos
        jogos = list(combinations(valid_pairs, num_dezenas))
        
        # Limitando o número de jogos de forma proporcional
        if len(jogos) > MAX_COMBINATIONS:
            jogos = random.sample(jogos, MAX_COMBINATIONS)
        
        # Filtrar e formatar jogos válidos
        jogos_validos = []
        for jogo in jogos:
            jogo_ordenado = sorted(jogo)
            if (len(set(jogo_ordenado)) == len(jogo_ordenado) and
                all(1 <= num <= 60 for num in jogo_ordenado)):
                jogos_validos.append([format_number(n) for n in jogo_ordenado])
        
        logging.info(f"Total de jogos gerados: {len(jogos_validos)}")
        
        return jsonify({
            'combinations': jogos_validos,
            'total': len(jogos_validos),
            'valid_pairs': valid_pairs
        })
            
    except Exception as e:
        logging.error(f"Erro: {str(e)}")
        return jsonify({'error': str(e)}), 400


@app.route('/download/<format>', methods=['POST'])
def download(format):
    try:
        data = request.json
        combinations = data.get('combinations', [])
        num_dezenas = data.get('num_dezenas', 6)
        
        if format == 'txt':
            output = io.StringIO()
            output.write(f"Jogos gerados com {num_dezenas} dezenas\n")
            output.write(f"Total de jogos: {len(combinations)}\n\n")
            
            for i, combo in enumerate(combinations, 1):
                output.write(f"Jogo {i}: {' '.join(combo)}\n")
                
            output.seek(0)
            return send_file(
                io.BytesIO(output.getvalue().encode('utf-8')),
                mimetype='text/plain',
                as_attachment=True,
                download_name='jogos_mega_sena.txt'
            )
            
        elif format == 'xlsx':
            df = pd.DataFrame(combinations)
            df.index = [f"Jogo {i+1}" for i in range(len(df))]
            df.columns = [f"Número {i+1}" for i in range(len(df.columns))]
            
            output = io.BytesIO()
            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df.to_excel(writer, sheet_name=f'Jogos {num_dezenas} dezenas')
                
            output.seek(0)
            return send_file(
                output,
                mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                as_attachment=True,
                download_name='jogos_mega_sena.xlsx'
            )
            
        elif format == 'html':
            html_content = f"""
            <html>
            <head>
                <title>Jogos Mega Sena</title>
                <style>
                    table {{ border-collapse: collapse; width: 100%; }}
                    th, td {{ border: 1px solid black; padding: 8px; text-align: center; }}
                    th {{ background-color: #209869; color: white; }}
                </style>
            </head>
            <body>
                <h2>Jogos gerados com {num_dezenas} dezenas</h2>
                <p>Total de jogos: {len(combinations)}</p>
                <table>
                    <tr>
                        <th>Jogo</th>
                        {''.join(f'<th>Número {i+1}</th>' for i in range(num_dezenas))}
                    </tr>
                    {''.join(f'<tr><td>Jogo {i+1}</td>{"".join(f"<td>{n}</td>" for n in combo)}</tr>' for i, combo in enumerate(combinations))}
                </table>
            </body>
            </html>
            """
            
            return send_file(
                io.BytesIO(html_content.encode()),
                mimetype='text/html',
                as_attachment=True,
                download_name='jogos_mega_sena.html'
            )
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/check-results', methods=['POST'])
def check_results():
    try:
        data = request.json
        generated_games = data['games']
        
        # Buscar todos os resultados da Mega-Sena com timeout e tratamento de erro
        try:
            response = requests.get(
                'https://loteriascaixa-api.herokuapp.com/api/megasena',
                timeout=10
            )
            response.raise_for_status()  # Levanta exceção para códigos de erro HTTP
            all_results = response.json()
        except requests.exceptions.RequestException as e:
            return jsonify({'error': f'Erro ao acessar API da loteria: {str(e)}'}), 500

        # Conferir jogos
        results = []
        for game in generated_games:
            matches = []
            for result in all_results:
                numbers = set(map(int, game))
                drawn_numbers = set(map(int, result['dezenas']))
                hits = len(numbers.intersection(drawn_numbers))
                if hits >= 4:  # Registrar apenas 4+ acertos
                    matches.append({
                        'concurso': result['concurso'],
                        'data': result['data'],
                        'acertos': hits,
                        'numeros_sorteados': result['dezenas']
                    })
            if matches:
                results.append({
                    'jogo': game,
                    'resultados': sorted(matches, key=lambda x: x['acertos'], reverse=True)
                })
        
        return jsonify({
            'results': sorted(results, key=lambda x: max(r['acertos'] for r in x['resultados']), reverse=True)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

# @app.route('/get-statistics', methods=['POST'])
# def get_statistics():
#     try:
#         data = request.json
#         games = data.get('games', [])
        
#         # Buscar resultados da Mega-Sena
#         response = requests.get(
#             'https://loteriascaixa-api.herokuapp.com/api/megasena',
#             timeout=10
#         )
#         response.raise_for_status()
#         all_results = response.json()
        
#         # Processar estatísticas
#         stats = []
#         for game in games:
#             game_numbers = set(map(int, game))
#             for result in all_results:
#                 drawn_numbers = set(map(int, result['dezenas']))
#                 hits = len(game_numbers.intersection(drawn_numbers))
                
#                 if hits >= 5:  # Apenas jogos com 5 ou 6 acertos
#                     stats.append({
#                         'jogo': game,
#                         'concurso': result['concurso'],
#                         'acertos': hits,
#                         'data': result['data']
#                     })
        
#         # Ordenar por número de acertos (decrescente) e concurso
#         stats.sort(key=lambda x: (-x['acertos'], -int(x['concurso'])))
        
#         return jsonify({
#             'stats': stats,
#             'total': len(stats)
#         })
        
#     except Exception as e:
#             return jsonify({'error': str(e)}), 400

@app.route('/get-statistics', methods=['POST'])
def get_statistics():
    try:
        data = request.json
        games = data.get('games', [])
        
        # Buscar resultados da Mega-Sena
        response = requests.get(
            'https://loteriascaixa-api.herokuapp.com/api/megasena',
            timeout=10
        )
        response.raise_for_status()
        all_results = response.json()
        
        # Processar estatísticas
        stats = []
        for game in games:
            game_numbers = set(map(int, game))
            for result in all_results:
                drawn_numbers = set(map(int, result['dezenas']))
                hits = len(game_numbers.intersection(drawn_numbers))
                
                if hits >= 5:  # Apenas jogos com 5 ou 6 acertos
                    stats.append({
                        'jogo': game,
                        'concurso': result['concurso'],
                        'acertos': hits,
                        'data': result['data'],
                        'numeros_sorteados': result['dezenas']  # Adicionando os números sorteados
                    })
        
        # Ordenar por número de acertos (decrescente) e concurso
        stats.sort(key=lambda x: (-x['acertos'], -int(x['concurso'])))
        
        return jsonify({
            'stats': stats,
            'total': len(stats)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

"""
if __name__ == '__main__':
    app.run(debug=True)  # Corrigido o espaçamento
"""

# Carrega as variáveis do arquivo .env
load_dotenv()

# Configuração da porta
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))  # Obtém a porta do ambiente ou usa 5000 como padrão
    app.run(host="0.0.0.0", port=port)  # Inicia o servidor Flask na porta correta

