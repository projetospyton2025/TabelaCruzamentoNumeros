// document.addEventListener('DOMContentLoaded', function() {
//     // Gerar campos de input com validação
//     const inputSection = document.querySelector('.number-inputs');
//     for (let i = 0; i < 15; i++) {
//         const input = document.createElement('input');
//         input.type = 'text';  // Mudado para text para melhor controle
//         input.pattern = '[0-9]';  // Aceita apenas um dígito de 0-9
//         input.required = true;
//         input.maxLength = 1;
//         input.addEventListener('input', function(e) {
//             let value = e.target.value;
//             // Permitir apenas dígitos de 0-9
//             if (!/^[0-9]$/.test(value)) {
//                 // Se o valor não for um único dígito entre 0-9, pega apenas o último dígito inserido
//                 value = value.replace(/[^0-9]/g, '').slice(-1);
//             }
//             e.target.value = value;
            
//             // Auto-avançar para o próximo campo quando um dígito é inserido
//             if (value && this.nextElementSibling && this.nextElementSibling.tagName === 'INPUT') {
//                 this.nextElementSibling.focus();
//             }
//         });
//         inputSection.appendChild(input);
//     }

//     // Função para gerar o grid de forma triangular
//     function generateGrid(numbers) {
//         const grid = document.querySelector('.triangle-grid');
//         grid.innerHTML = '';
        
//         const rows = [5, 4, 3, 2, 1];
//         let numberIndex = 0;
        
//         rows.forEach((cellCount) => {
//             const row = document.createElement('div');
//             row.className = 'grid-row';
            
//             for (let i = 0; i < cellCount; i++) {
//                 const cell = document.createElement('div');
//                 cell.className = 'grid-cell';
//                 cell.textContent = numbers[numberIndex++] || '';
//                 row.appendChild(cell);
//             }
            
//             grid.appendChild(row);
//         });
//     }

//     // Função para formatar o jogo (ordenar em ordem crescente)
//     function formatGame(numbers) {
//         return numbers.sort((a, b) => a - b).join(' ');
//     }

//     // Função para exibir as combinações
//     function displayCombinations(combinations, numDezenas = 15) {
//         const resultsDiv = document.getElementById('combinations-result');
//         resultsDiv.innerHTML = `<h3>Jogos gerados com ${numDezenas} dezenas (Total: ${combinations.length} jogos)</h3>`;
        
//         combinations.forEach((combo, index) => {
//             const formattedCombo = formatGame(combo);
//             resultsDiv.innerHTML += `
//                 <div class="combination">
//                     Jogo ${index + 1}: ${formattedCombo}
//                 </div>`;
//         });
//     }


// // Substitua o event listener do botão 'generate-btn' por este:
// document.getElementById('generate-btn').addEventListener('click', async function() {
//     try {
//         const inputs = document.querySelectorAll('.number-inputs input');
//         const numbers = Array.from(inputs).map(input => parseInt(input.value));
        
//         // Validar se todos os campos foram preenchidos
//         if (numbers.some(isNaN)) {
//             alert('Por favor, preencha todos os números.');
//             return;
//         }
        
//         const numCombinations = parseInt(document.getElementById('num-combinations').value);
        
//         const response = await fetch('/generate', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 numbers: numbers,
//                 combinations: numCombinations
//             })
//         });

//         const data = await response.json();
        
//         if (!response.ok) {
//             throw new Error(data.error || 'Erro ao gerar combinações');
//         }

//         generateGrid(numbers);
//         displayCombinations(data.combinations, numCombinations);
        
//     } catch (error) {
//         alert(error.message);
//     }
// });

//     // Função para download dos resultados
//     function downloadResults(format) {
//         window.location.href = `/download/${format}`;
//     }
// });

document.addEventListener('DOMContentLoaded', function() {
    // Gerar campos de input com validação
    const inputSection = document.querySelector('.number-inputs');
    for (let i = 0; i < 15; i++) {
        const input = document.createElement('input');
        input.type = 'text';  // Mudado para text para melhor controle
        input.pattern = '[0-9]';  // Aceita apenas um dígito de 0-9
        input.required = true;
        input.maxLength = 1;
        input.addEventListener('input', function(e) {
            let value = e.target.value;
            // Permitir apenas dígitos de 0-9
            if (!/^[0-9]$/.test(value)) {
                // Se o valor não for um único dígito entre 0-9, pega apenas o último dígito inserido
                value = value.replace(/[^0-9]/g, '').slice(-1);
            }
            e.target.value = value;
            
            // Auto-avançar para o próximo campo quando um dígito é inserido
            if (value && this.nextElementSibling && this.nextElementSibling.tagName === 'INPUT') {
                this.nextElementSibling.focus();
            }
        });
        inputSection.appendChild(input);
    }

    // Função para gerar o grid de forma triangular
    function generateGrid(numbers) {
        const grid = document.querySelector('.triangle-grid');
        grid.innerHTML = '';
        
        const rows = [5, 4, 3, 2, 1];
        let numberIndex = 0;
        
        rows.forEach((cellCount) => {
            const row = document.createElement('div');
            row.className = 'grid-row';
            
            for (let i = 0; i < cellCount; i++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.textContent = numbers[numberIndex++] || '';
                row.appendChild(cell);
            }
            
            grid.appendChild(row);
        });
    }

    // Função para formatar o jogo (ordenar em ordem crescente)
    function formatGame(numbers) {
        return numbers.sort((a, b) => a - b).join(' ');
    }

    // Função para exibir as combinações (atualizada com funcionalidades do código2)
    function displayCombinations(combinations, numDezenas = 15) {
        const resultsDiv = document.getElementById('combinations-result');
        resultsDiv.innerHTML = `
            <h3>Jogos gerados com ${numDezenas} dezenas (Total: ${combinations.length} jogos)</h3>
            <div id="games-list"></div>
            <button id="check-results" class="btn btn-primary mt-3">Conferir Resultados</button>
        `;
        
        const gamesList = document.getElementById('games-list');
        combinations.forEach((combo, index) => {
            gamesList.innerHTML += `
                <div class="combination" data-game="${combo.join(' ')}">
                    Jogo ${(index + 1).toString().padStart(2, '0')}: ${combo.join(' ')}
                </div>`;
        });
        
        // Adicionar listener para o botão de conferência
        document.getElementById('check-results').addEventListener('click', checkResults);
    }

    // Função para conferir os resultados
    async function checkResults() {
        try {
            const games = Array.from(document.querySelectorAll('.combination'))
                .map(div => div.dataset.game.split(' '));
                
            const response = await fetch('/check-results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ games })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Erro ao conferir resultados');
            }
            
            // Destacar jogos com acertos
            data.results.forEach(result => {
                const gameDiv = Array.from(document.querySelectorAll('.combination'))
                    .find(div => div.dataset.game === result.jogo.join(' '));
                    
                if (gameDiv) {
                    gameDiv.classList.add('has-hits');
                    gameDiv.innerHTML += `
                        <div class="hits-info">
                            ${result.resultados.map(r => 
                                `<div>Concurso ${r.concurso}: ${r.acertos} acertos</div>`
                            ).join('')}
                        </div>`;
                }
            });
            
        } catch (error) {
            alert(error.message);
        }
    }

    // Substitua o event listener do botão 'generate-btn' por este:
    document.getElementById('generate-btn').addEventListener('click', async function() {
        try {
            const inputs = document.querySelectorAll('.number-inputs input');
            const numbers = Array.from(inputs).map(input => parseInt(input.value));
            
            // Validar se todos os campos foram preenchidos
            if (numbers.some(isNaN)) {
                alert('Por favor, preencha todos os números.');
                return;
            }
            
            const numCombinations = parseInt(document.getElementById('num-combinations').value);
            
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    numbers: numbers,
                    combinations: numCombinations
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Erro ao gerar combinações');
            }

            generateGrid(numbers);
            displayCombinations(data.combinations, numCombinations);
            
        } catch (error) {
            alert(error.message);
        }
    });

    // Função para download dos resultados
    function downloadResults(format) {
        window.location.href = `/download/${format}`;
    }
});
