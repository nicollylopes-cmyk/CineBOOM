import { FilmeItem } from './FilmeItem.js';

const form = document.getElementsByTagName('form')[0];
const filmeInput = document.getElementById('filme-input');
const btnBuscar = document.getElementById('btn-buscar');
const avisoBloqueio = document.getElementById('aviso-bloqueio');

let filmes_vistos;
if (localStorage.getItem('filmes_vistos')) {
    filmes_vistos = JSON.parse(localStorage.getItem('filmes_vistos'));
} else {
    filmes_vistos = [];
}

let pontuacao = 0;
let gameOver = false;
let num_tab_linha = 3;
let num_tab_coluna = 3;
let tamanho_tab = num_tab_coluna * num_tab_linha;

const maximo_minas = 2;
let posicao_minas_i = [];
let posicao_minas_j = [];
let posicao_visitados_linha = [];
let posicao_visitados_coluna = [];

function gerar_n_aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function coordenada_existente(vetor_linha, vetor_coluna, linha, coluna) {
    let qtde_elementos = vetor_coluna.length;
    for (let i = 0; i < qtde_elementos; i++) {
        if (vetor_linha[i] == linha && vetor_coluna[i] == coluna) {
            return true;
        }
    }
    return false;
}

for (let i = 0; i < maximo_minas; i++) {
    let a = gerar_n_aleatorio(0, 3);
    let b = gerar_n_aleatorio(0, 3);
    if (coordenada_existente(posicao_minas_i, posicao_minas_j, a, b) === false) {
        posicao_minas_i.push(a);
        posicao_minas_j.push(b);
    }
}

document.getElementById('btn_reset').addEventListener('click', function () {
    pontuacao = 0;
    gameOver = false;
    posicao_minas_i = [];
    posicao_minas_j = [];
    posicao_visitados_linha = [];
    posicao_visitados_coluna = [];
    document.getElementById('label_fim_de_jogo').innerText = "";
    document.getElementById('placar').innerText = pontuacao;
    
    for (let i = 0; i < maximo_minas; i++) {
        let a = gerar_n_aleatorio(0, 3);
        let b = gerar_n_aleatorio(0, 3);
        if (coordenada_existente(posicao_minas_i, posicao_minas_j, a, b) === false) {
            posicao_minas_i.push(a);
            posicao_minas_j.push(b);
        }
    }
    
    const celulas = document.querySelectorAll('#tabuleiro td');
    celulas.forEach(celula => {
        celula.style.background = '#262626';
    });
    
    verificarLiberacaoPalpite();
});

let tab_tabuleiro = document.getElementById('tabuleiro');
for (let i = 0; i < num_tab_linha; i++) {
    const tab_tr = document.createElement('tr');
    for (let j = 0; j < num_tab_coluna; j++) {
        let tab_td = document.createElement('td');
        tab_td.id = String(i) + "_" + String(j);
        tab_td.addEventListener('click', () => {
            verifica_clique_campo(i, j, tab_td);
        });
        tab_tr.appendChild(tab_td);
    }
    tab_tabuleiro.appendChild(tab_tr);
}

function verifica_clique_campo(linha, coluna, celula) {
    if (gameOver) return;

    let pisouNaMina = false;
    const qtde_minas = posicao_minas_i.length;

    for (let i = 0; i < qtde_minas; i++) {
        if (posicao_minas_i[i] == linha && posicao_minas_j[i] == coluna) {
            pisouNaMina = true;
            break;
        }
    }

    if (pisouNaMina) {
        celula.style.backgroundColor = '#cc0000';
        celula.style.background = 'radial-gradient(circle, #ff4d4d 0%, #8b0000 100%)';
        document.getElementById('label_fim_de_jogo').innerText = "Boom loser! Você explodiu uma mina!";
        document.getElementById('label_fim_de_jogo').style.color = '#ff4d4d';
        gameOver = true;
    } else {
        let qtde_visitados = posicao_visitados_coluna.length;
        let visitado = false;
        for (let i = 0; i < qtde_visitados; i++) {
            if (posicao_visitados_linha[i] == linha && posicao_visitados_coluna[i] == coluna) {
                visitado = true;
                break;
            }
        }

        if (visitado === false) {
            pontuacao++;
            celula.style.backgroundColor = '#107c41';
            celula.style.background = 'radial-gradient(circle, #24a148 0%, #107c41 100%)';
            document.getElementById('placar').innerText = pontuacao;
            posicao_visitados_linha.push(linha);
            posicao_visitados_coluna.push(coluna);

            if (posicao_visitados_coluna.length + posicao_minas_i.length === tamanho_tab) {
                gameOver = true;
                document.getElementById('label_fim_de_jogo').innerText = "Tabuleiro limpo! Você é fera!";
                document.getElementById('label_fim_de_jogo').style.color = '#24a148';
            }
            
            verificarLiberacaoPalpite();
        } else {
            alert("Esse elemento já foi clicado!");
        }
    }
}
function verificarLiberacaoPalpite() {
    if (pontuacao >= 3) {
        filmeInput.disabled = false;
        btnBuscar.disabled = false;
        avisoBloqueio.innerHTML = "Palpite Liberado! Faça sua aposta cinematográfica.";
        avisoBloqueio.style.color = "#24a148";
    } else {
        filmeInput.disabled = true;
        btnBuscar.disabled = true;
        avisoBloqueio.innerHTML = "Consiga pelo menos 3 pontos no Campo Minado para liberar seu palpite!";
        avisoBloqueio.style.color = "#ff9900";
    }
}
const id_filme = gerar_n_aleatorio(500, 900);
let nome_secreto = '';

function preparaFilme(id) {
    const img_card = document.getElementById('filme-img');
    const name_card = document.getElementById('filme-name');
    const card = document.getElementById('card');
    const erro = document.getElementById('erro');
    const genero_card = document.getElementById('filme-genero');
    const nota_card = document.getElementById('filme-nota');
    const data_card = document.getElementById('filme-data');

    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNWZjOGZkNjQ3OWM5YjEwYTNiYzQ2YjkwZTk3MWNjNSIsIm5iZiI6MTc4MjM0Mzg3OC45MDMsInN1YiI6IjZhM2M2OGM2NGUyYTYwNjA2NmY3NTU5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.azWBiRXXwxXSF7IQy238rm9FM2vNsPp_0FqTzAWGEfA'; 
    const url = `https://api.themoviedb.org/3/movie/${id}?language=pt-BR`;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    };

    fetch(url, options)
        .then(response => {
            if (!response.ok) throw new Error('Filme não encontrado');
            return response.json();
        })
        .then(data => {
            nome_secreto = data.title;

            if (data.poster_path) {
                img_card.src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
            } else {
                img_card.src = 'https://via.placeholder.com/500x750?text=Sem+Foto';
            }
            
            img_card.classList.add('silhouette');
            name_card.textContent = '????';
            nota_card.textContent = data.vote_average.toFixed(1);
            
            if (data.release_date) {
                data_card.textContent = data.release_date.split('-').reverse().join('/');
            } else {
                data_card.textContent = 'Sem data';
            }
            
            const generos = data.genres.map(g => g.name).join(', ');
            genero_card.textContent = generos;

            card.style.display = 'block';
            erro.style.display = 'none';
        })
        .catch(err => {
            console.error(err);
            erro.style.display = 'block';
            card.style.display = 'none';
        });
}
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const palpite = formData.get('filme_nome');
    const hit_text = document.getElementById('filme-hit');

    document.getElementById('filme-img').classList.remove('silhouette');
    document.getElementById('filme-name').textContent = nome_secreto;

    filmes_vistos.push(new FilmeItem(id_filme, nome_secreto, palpite));

    if (palpite.toLowerCase().trim() === nome_secreto.toLowerCase().trim()) {
        hit_text.textContent = ' Acertou! Indicação Perfeita!';
        hit_text.style.color = '#24a148';
    } else {
        hit_text.textContent = ' Errou seu loser! O Oscar não veio dessa vez.';
        hit_text.style.color = '#ff4d4d';
    }

    renderizarTabela();
});

function renderizarTabela() {
    const tbody = document.getElementById('filmes-tbody');
    tbody.innerHTML = '';

    filmes_vistos.forEach(filme => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${filme.titulo}</strong></td>
            <td>${filme.tentativa}</td>
            <td>
                <button class="btn-apagar" onclick="apagarFilme(${filme.id})">
                    Apagar
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    localStorage.setItem('filmes_vistos', JSON.stringify(filmes_vistos));
}

function apagarFilme(id) {
    filmes_vistos = filmes_vistos.filter(filme => filme.id !== id);
    renderizarTabela();
}

window.apagarFilme = apagarFilme;

preparaFilme(id_filme);
renderizarTabela();