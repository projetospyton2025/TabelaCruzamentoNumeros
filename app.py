
# Adicione esta importação no topo do arquivo
from flask import Flask, render_template, request, jsonify, send_file, session  # Adicionado session
import pandas as pd
import requests
import io
import json
from itertools import combinations


# E adicione esta configuração após criar a app
app = Flask(__name__)
app.secret_key = 'sua_chave_secreta_aqui'  # Necessário para usar session

@app.route('/')
def index():
    return render_template('index.html')


def format_number(num):
    """Formata número para ter sempre 2 dígitos"""
    return f"{num:02d}"

def combine_digits(a, b):
    """Combina dois dígitos para formar um número"""
    return int(f"{a}{b}")

def get_valid_pairs(grid):
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
            # Considerar combinações nos dois sentidos
            num1 = combine_digits(row[i], row[i+1])
            num2 = combine_digits(row[i+1], row[i])
            # Verificar se as combinações estão no intervalo válido
            if 1 <= num1 <= 60:
                valid_pairs.add(num1)
            if 1 <= num2 <= 60:
                valid_pairs.add(num2)
            # Zero à esquerda também é válido (06)
            if row[i] == 0:
                zero_combo = row[i+1]
                if 1 <= zero_combo <= 60:
                    valid_pairs.add(zero_combo)
            if row[i+1] == 0:
                zero_combo = row[i]
                if 1 <= zero_combo <= 60:
                    valid_pairs.add(zero_combo)
    
    # Diagonal e vertical
    # Implementar lógica adicional aqui...
    
    return sorted(list(valid_pairs))


@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        numbers = data['numbers']
        num_dezenas = data['combinations']
        
        valid_pairs = get_valid_pairs(numbers)
        
        # Gerar combinações de acordo com o número de dezenas solicitado
        if 6 <= num_dezenas <= 20:  # Permitir até 20 dezenas
            jogos = list(combinations(valid_pairs, num_dezenas))
            
            jogos_validos = []
            for jogo in jogos:
                jogo_ordenado = sorted(jogo)
                if (len(set(jogo_ordenado)) == len(jogo_ordenado) and
                    all(1 <= num <= 60 for num in jogo_ordenado)):
                    jogos_validos.append([format_number(n) for n in jogo_ordenado])
            
            # Armazenar na sessão para download
            session['combinations'] = jogos_validos
            session['num_dezenas'] = num_dezenas
            
            return jsonify({
                'combinations': jogos_validos,
                'total': len(jogos_validos)
            })
        else:
            return jsonify({'error': 'Número de dezenas deve estar entre 6 e 20'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/download/<format>')
def download(format):
    try:
        # Recuperar dados da sessão ou receber como parâmetro
        combinations = session.get('combinations', [])
        num_dezenas = session.get('num_dezenas', 6)
        
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

# @app.route('/check-results', methods=['POST'])
# def check_results():
#     try:
#         data = request.json
#         generated_games = data['games']
        
#         # Buscar resultados da API com timeout e tratamento de erro
#         try:
#             response = requests.get(
#                 'https://loteriascaixa-api.herokuapp.com/api/megasena/latest',
#                 timeout=10
#             )
#             response.raise_for_status()  # Levanta exceção para códigos de erro HTTP
#             latest_results = response.json()
#         except requests.exceptions.RequestException as e:
#             return jsonify({'error': f'Erro ao acessar API da loteria: {str(e)}'}), 500
        
#         # Analisar jogos
#         results = []
#         for game in generated_games:
#             matches = []
#             for result in latest_results:
#                 numbers = set(map(int, game))
#                 drawn_numbers = set(result['dezenas'])
#                 hits = len(numbers.intersection(drawn_numbers))
#                 if hits >= 4:  # Registrar apenas 4+ acertos
#                     matches.append({
#                         'concurso': result['concurso'],
#                         'data': result['data'],
#                         'acertos': hits,
#                         'numeros_sorteados': result['dezenas']
#                     })
#             if matches:
#                 results.append({
#                     'jogo': game,
#                     'resultados': sorted(matches, key=lambda x: x['acertos'], reverse=True)
#                 })
        
#         return jsonify({
#             'results': sorted(results, key=lambda x: max(r['acertos'] for r in x['resultados']), reverse=True)
#         })
        
#     except Exception as e:
#         return jsonify({'error': str(e)}), 400


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




if __name__ == '__main__':
    app.run(debug=True)  # Corrigido o espaçamento