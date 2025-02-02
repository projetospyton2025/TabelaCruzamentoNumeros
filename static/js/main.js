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


// // Adicionar evento para o botão de estatísticas
// document.getElementById('show-stats')?.addEventListener('click', showStatistics);


// // No arquivo main.js, atualize a função generateGrid:
// function generateGrid(numbers) {
//     const grid = document.querySelector('.triangle-grid');
//     grid.innerHTML = '';
    
//     const rows = [5, 4, 3, 2, 1];
//     let numberIndex = 0;
    
//     rows.forEach((cellCount) => {
//         const row = document.createElement('div');
//         row.className = 'grid-row';
//         row.style.justifyContent = 'center';  // Centraliza as células
//         row.style.display = 'flex';  // Garante que as células fiquem em linha
//         row.style.gap = '10px';  // Espaço entre as células
//         row.style.margin = '5px 0';  // Espaço entre as linhas
        
//         for (let i = 0; i < cellCount; i++) {
//             const cell = document.createElement('div');
//             cell.className = 'grid-cell';
//             // Garante que o zero seja exibido
//             const value = numbers[numberIndex];
//             cell.textContent = (value !== undefined && value !== null) ? value.toString() : '';
//             // Adiciona estilos para a célula circular
//             cell.style.width = '40px';
//             cell.style.height = '40px';
//             cell.style.borderRadius = '50%';
//             cell.style.border = '2px solid #209869';  // Cor verde da Mega Sena
//             cell.style.display = 'flex';
//             cell.style.alignItems = 'center';
//             cell.style.justifyContent = 'center';
//             cell.style.backgroundColor = 'white';
//             cell.style.fontSize = '16px';
            
//             row.appendChild(cell);
//             numberIndex++;
//         }
        
//         grid.appendChild(row);
//     });
// }

    
//     // Função para formatar o jogo (ordenar em ordem crescente)
//     function formatGame(numbers) {
//         return numbers.sort((a, b) => a - b).join(' ');
//     }



// function displayCombinations(data, numDezenas = 15) {
//     const resultsDiv = document.getElementById('combinations-result');
//     resultsDiv.innerHTML = `
//         <div class="valid-pairs">
//             <h3>Pares Válidos Encontrados:</h3>
//             <p>${data.valid_pairs.join(', ')}</p>
//         </div>
//         <h3>Jogos gerados com ${numDezenas} dezenas (Total: ${data.combinations.length} jogos)</h3>
//         <div id="games-list"></div>
//     `;
    
//     const gamesList = document.getElementById('games-list');
//     data.combinations.forEach((combo, index) => {
//         gamesList.innerHTML += `
//             <div class="combination" data-game="${combo.join(' ')}">
//                 Jogo ${(index + 1).toString().padStart(2, '0')}: ${combo.join(' ')}
//             </div>`;
//     });
    
//     document.getElementById('check-results').addEventListener('click', checkResults);
// }

// // Funções de feedback visual
// // E então atualizar a função showStatistics para usar estas funções:
// async function showStatistics() {
//     try {
//         showStatsLoading(); // Substitui a manipulação direta do botão
        
//         const games = Array.from(document.querySelectorAll('.combination'))
//             .map(div => div.dataset.game.split(' '));
            
//         const response = await fetch('/get-statistics', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ games })
//         });
        
//         const data = await response.json();
        
//         if (!response.ok) {
//             throw new Error(data.error || 'Erro ao gerar estatísticas');
//         }
        
//         displayStatistics(data);
//     } catch (error) {
//         alert(error.message);
//     } finally {
//         hideStatsLoading(); // Substitui a manipulação direta do botão
//     }
// }

// function displayStatistics(data) {
//     const statsDiv = document.getElementById('stats-result');
//     statsDiv.innerHTML = `
//         <div class="statistics-container">
//             <h3>Estatísticas de Acertos</h3>
//             <div class="stats-table">
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Jogo</th>
//                             <th>Concurso</th>
//                             <th>Acertos</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         ${data.stats.map(stat => `
//                             <tr>
//                                 <td>${stat.jogo.join(' ')}</td>
//                                 <td>${stat.concurso}</td>
//                                 <td>${stat.acertos}</td>
//                             </tr>
//                         `).join('')}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     `;
// }

//     // Função para conferir os resultados
//     async function checkResults() {
//         try {
//             showCheckLoading(); // Adiciona indicador de carregamento 17:20

//             const games = Array.from(document.querySelectorAll('.combination'))
//                 .map(div => div.dataset.game.split(' '));
                
//             const response = await fetch('/check-results', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ games })
//             });
            
//             const data = await response.json();
            
//             if (!response.ok) {
//                 throw new Error(data.error || 'Erro ao conferir resultados');
//             }
            
//             // Destacar jogos com acertos
//             data.results.forEach(result => {
//                 const gameDiv = Array.from(document.querySelectorAll('.combination'))
//                     .find(div => div.dataset.game === result.jogo.join(' '));
                    
//                 if (gameDiv) {
//                     gameDiv.classList.add('has-hits');
//                     gameDiv.innerHTML += `
//                         <div class="hits-info">
//                             ${result.resultados.map(r => 
//                                 `<div>Concurso ${r.concurso}: ${r.acertos} acertos</div>`
//                             ).join('')}
//                         </div>`;
//                 }
//             });
            
//         } catch (error) {
//             alert(error.message);
//         } finally {
//             hideCheckLoading(); // Oculta o indicador de carregamento 17:20
//         }
//     }

// // Event listener para o botão "generate"
// document.getElementById('generate-btn').addEventListener('click', async function () {
//     try {
//         showLoading(); // Mostra o indicador de carregamento
        
//         // Obtém os números inseridos
//         const inputs = document.querySelectorAll('.number-inputs input');
//         const numbers = Array.from(inputs).map(input => parseInt(input.value));
        
//         if (numbers.some(isNaN)) {
//             alert('Por favor, preencha todos os números.');
//             return;
//         }
        
//         // Obtém a quantidade de combinações
//         const numCombinations = parseInt(document.getElementById('num-combinations').value);
        
//         // Faz a requisição ao backend
//         const response = await fetch('/generate', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json'
//             },
//             body: JSON.stringify({
//                 numbers: numbers,
//                 combinations: numCombinations
//             })
//         });

//         // Trata os erros da requisição
//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
//         }

//         const data = await response.json();


//         // Adicione estas duas linhas aqui ↓
//         console.log("Números enviados ao backend:", numbers);  // Novo log
//         console.log("Pares válidos recebidos do backend:", data.valid_pairs);  // Novo log

        
//         // Gera o grid triangular com os números
//         generateGrid(numbers);
        
//         // Exibe os pares válidos (ADICIONADO DO CÓDIGO2)
//         displayValidPairs(data.valid_pairs);
        
//         // Exibe as combinações geradas
//         //displayCombinations(data.combinations, numCombinations);
//         displayCombinations(data, numCombinations);

        
//     } catch (error) {
//         console.error('Erro:', error);
//         alert('Erro ao gerar combinações: ' + error.message);
//     } finally {
//         hideLoading(); // Oculta o indicador de carregamento
//     }
// });

// // Função para exibir os pares válidos (ADICIONADO DO CÓDIGO2)
// function displayValidPairs(validPairs) {
//     const validPairsDiv = document.getElementById('valid_pairs');
//     validPairsDiv.innerHTML = validPairs
//         .map(num => `<span class="valid-pair">${String(num).padStart(2, '0')}</span>`)
//         .join('');
// }


//     // Para corrigir os downloads, adicione o handler correto no JavaScript:
//     function downloadResults(format) {
//         const form = document.createElement('form');
//         form.method = 'GET';
//         form.action = `/download/${format}`;
//         document.body.appendChild(form);
//         form.submit();
//         document.body.removeChild(form);
//     }

//     // Adicione os event listeners para os botões
//     document.getElementById('download-txt').addEventListener('click', () => downloadResults('txt'));
//     document.getElementById('download-html').addEventListener('click', () => downloadResults('html'));
//     document.getElementById('download-excel').addEventListener('click', () => downloadResults('xlsx'));

// });

// //Feedback visual: Para o botão Gerar Combinações
// function showLoading() {
//     const btn = document.getElementById('generate-btn');
//     btn.disabled = true;
//     btn.textContent = 'Gerando...Aguarde!';
// }

// function hideLoading() {
//     const btn = document.getElementById('generate-btn');
//     btn.disabled = false;
//     btn.textContent = 'Gerar Combinações';
// }

// // Feedback visual: Para o botão Conferir Resultados
// function showCheckLoading() {
//     const btn = document.getElementById('check-results');
//     btn.disabled = true;
//     btn.textContent = 'Conferindo...Aguarde!';
// }

// function hideCheckLoading() {
//     const btn = document.getElementById('check-results');
//     btn.disabled = false;
//     btn.textContent = 'Conferir Resultados';
// }
// // Feedback visual: Para o botão Estatísticas
// function showStatsLoading() {
//     const btn = document.getElementById('show-stats');
//     btn.disabled = true;
//     btn.textContent = 'Buscando Estatísticas...';
// }

// function hideStatsLoading() {
//     const btn = document.getElementById('show-stats');
//     btn.disabled = false;
//     btn.textContent = 'Estatísticas (5-6 Acertos)';
// }

document.addEventListener('DOMContentLoaded', function() {
    // Gerar campos de input com validação
    const inputSection = document.querySelector('.number-inputs');
    for (let i = 0; i < 15; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.pattern = '[0-9]';
        input.required = true;
        input.maxLength = 1;
        input.addEventListener('input', function(e) {
            let value = e.target.value;
            if (!/^[0-9]$/.test(value)) {
                value = value.replace(/[^0-9]/g, '').slice(-1);
            }
            e.target.value = value;
            
            if (value && this.nextElementSibling && this.nextElementSibling.tagName === 'INPUT') {
                this.nextElementSibling.focus();
            }
        });
        inputSection.appendChild(input);
    }

    // Event listeners para os botões principais
    document.getElementById('generate-btn')?.addEventListener('click', generateCombinations);
    document.getElementById('check-results')?.addEventListener('click', checkResults);
    document.getElementById('show-stats')?.addEventListener('click', showStatistics);

    // Event listeners para os botões de download
    document.getElementById('download-txt')?.addEventListener('click', () => downloadResults('txt'));
    document.getElementById('download-html')?.addEventListener('click', () => downloadResults('html'));
    document.getElementById('download-excel')?.addEventListener('click', () => downloadResults('xlsx'));

    // Funções de feedback visual
    function showLoading() {
        const btn = document.getElementById('generate-btn');
        btn.disabled = true;
        btn.textContent = 'Gerando...Aguarde!';
    }

    function hideLoading() {
        const btn = document.getElementById('generate-btn');
        btn.disabled = false;
        btn.textContent = 'Gerar Combinações';
    }

    function showCheckLoading() {
        const btn = document.getElementById('check-results');
        btn.disabled = true;
        btn.textContent = 'Conferindo...Aguarde!';
    }

    function hideCheckLoading() {
        const btn = document.getElementById('check-results');
        btn.disabled = false;
        btn.textContent = 'Conferir Resultados';
    }

    function showStatsLoading() {
        const btn = document.getElementById('show-stats');
        btn.disabled = true;
        btn.textContent = 'Buscando Estatísticas...';
    }

    function hideStatsLoading() {
        const btn = document.getElementById('show-stats');
        btn.disabled = false;
        btn.textContent = 'Estatísticas (5-6 Acertos)';
    }

    // Função principal de geração do grid
    function generateGrid(numbers) {
        const grid = document.querySelector('.triangle-grid');
        grid.innerHTML = '';
        
        const rows = [5, 4, 3, 2, 1];
        let numberIndex = 0;
        
        rows.forEach((cellCount) => {
            const row = document.createElement('div');
            row.className = 'grid-row';
            row.style.justifyContent = 'center';
            row.style.display = 'flex';
            row.style.gap = '10px';
            row.style.margin = '5px 0';
            
            for (let i = 0; i < cellCount; i++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                const value = numbers[numberIndex];
                cell.textContent = (value !== undefined && value !== null) ? value.toString() : '';
                cell.style.width = '40px';
                cell.style.height = '40px';
                cell.style.borderRadius = '50%';
                cell.style.border = '2px solid #209869';
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                cell.style.backgroundColor = 'white';
                cell.style.fontSize = '16px';
                
                row.appendChild(cell);
                numberIndex++;
            }
            
            grid.appendChild(row);
        });
    }

    // Funções de exibição
    function displayCombinations(data, numDezenas = 15) {
        const resultsDiv = document.getElementById('combinations-result');
        resultsDiv.innerHTML = `
            <div class="valid-pairs">
                <h3>Pares Válidos Encontrados:</h3>
                <p>${data.valid_pairs.join(', ')}</p>
            </div>
            <h3>Jogos gerados com ${numDezenas} dezenas (Total: <span class="red">${data.combinations.length}</span> jogos)</h3>
            <div id="games-list"></div>
        `;
        
        const gamesList = document.getElementById('games-list');
        data.combinations.forEach((combo, index) => {
            gamesList.innerHTML += `
                <div class="combination" data-game="${combo.join(' ')}">
                    Jogo ${(index + 1).toString().padStart(2, '0')}: ${combo.join(' ')}
                </div>`;
        });
    }

    function displayValidPairs(validPairs) {
        const validPairsDiv = document.getElementById('valid_pairs');
        validPairsDiv.innerHTML = validPairs
            .map(num => `<span class="valid-pair">${String(num).padStart(2, '0')}</span>`)
            .join('');
    }

    function displayStatistics(data) {
        const statsDiv = document.getElementById('stats-result');
        statsDiv.innerHTML = `
            <div class="statistics-container">
                <h3>Estatísticas de Acertos</h3>
                <div class="stats-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Jogo</th>
                                <th>Concurso</th>
                                <th>Acertos</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.stats.map(stat => `
                                <tr>
                                    <td>${stat.jogo.join(' ')}</td>
                                    <td>${stat.concurso}</td>
                                    <td>${stat.acertos}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // Funções principais de ação
    async function generateCombinations() {
        try {
            showLoading();
            
            const inputs = document.querySelectorAll('.number-inputs input');
            const numbers = Array.from(inputs).map(input => parseInt(input.value));
            
            if (numbers.some(isNaN)) {
                alert('Por favor, preencha todos os números.');
                return;
            }
            
            const numCombinations = parseInt(document.getElementById('num-combinations').value);
            
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    numbers: numbers,
                    combinations: numCombinations
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            generateGrid(numbers);
            displayValidPairs(data.valid_pairs);
            displayCombinations(data, numCombinations);
            
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao gerar combinações: ' + error.message);
        } finally {
            hideLoading();
        }
    }

    async function checkResults() {
        try {
            showCheckLoading();

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
        } finally {
            hideCheckLoading();
        }
    }

    async function showStatistics() {
        try {
            showStatsLoading();
            
            const games = Array.from(document.querySelectorAll('.combination'))
                .map(div => div.dataset.game.split(' '));
                
            const response = await fetch('/get-statistics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ games })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Erro ao gerar estatísticas');
            }
            
            displayStatistics(data);
        } catch (error) {
            alert(error.message);
        } finally {
            hideStatsLoading();
        }
    }

    // Função de download
    function downloadResults(format) {
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = `/download/${format}`;
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
});