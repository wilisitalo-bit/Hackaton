
/* =====================================
   TERROR MEMORY
   JOGO DA MEMÓRIA DE TERROR
===================================== */

// 1. RECUPERAR O NOME DO JOGADOR

const nome = localStorage.getItem("nomeJogador");

if (!nome) {
    window.location.href = "index.html";
}

const saudacao = document.getElementById("saudacao");

saudacao.textContent = "Bem-vindo ao terror, " + nome + "!";


// 2. PERSONAGENS DO JOGO

const personagens = [
    "👻",
    "🎃",
    "🧛",
    "🧟",
    "🦇",
    "💀",
    "🕷️",
    "🧙"
];


// 3. ELEMENTOS DO HTML

const tabuleiro = document.getElementById("tabuleiro");
const pontuacaoElemento = document.getElementById("pontuacao");
const tempoElemento = document.getElementById("tempo");
const tentativasElemento = document.getElementById("tentativas");
const mensagem = document.getElementById("mensagem");

const btnSom = document.getElementById("btnSom");
const btnReiniciar = document.getElementById("btnReiniciar");
const btnVoltar = document.getElementById("btnVoltar");


// 4. VARIÁVEIS DO JOGO

let primeiraCarta = null;
let segundaCarta = null;

let bloqueio = false;
let jogoAtivo = false;

let pontuacao = 0;
let tentativas = 0;
let tempo = 300;

let cronometro = null;
let somLigado = true;
let paresEncontrados = 0;


// 5. EMBARALHAR CARTAS

function embaralhar(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];

    }

    return array;
}


// 6. CRIAR TABULEIRO

function criarTabuleiro() {

    tabuleiro.innerHTML = "";

    const cartas = personagens.concat(personagens);

    embaralhar(cartas);

    cartas.forEach(function(personagem) {

        const carta = document.createElement("div");
        carta.classList.add("carta");

        // Parte interna da carta
        const interno = document.createElement("div");
        interno.classList.add("carta-interno");

        // Parte de trás da carta
        const verso = document.createElement("div");
        verso.classList.add("carta-verso");
        verso.textContent = "🎃";

        // Parte da frente da carta
        const frente = document.createElement("div");
        frente.classList.add("carta-frente");
        frente.textContent = personagem;

        // Guardar o personagem na carta
        carta.dataset.personagem = personagem;

        // Montar a carta
        interno.appendChild(verso);
        interno.appendChild(frente);

        carta.appendChild(interno);

        // Evento de clique
        carta.addEventListener("click", function() {
            virarCarta(carta);
        });

        tabuleiro.appendChild(carta);

    });

}


// 7. VIRAR CARTA

function virarCarta(carta) {

    if (!jogoAtivo || bloqueio) {
        return;
    }

    if (carta.classList.contains("virada")) {
        return;
    }

    if (carta.classList.contains("combinada")) {
        return;
    }

    // Girar a carta
    carta.classList.add("virada");

    tocarSom(500);

    if (primeiraCarta === null) {

        primeiraCarta = carta;

        return;
    }

    segundaCarta = carta;

    tentativas++;

    tentativasElemento.textContent = tentativas;

    verificarPar();

}


// 8. VERIFICAR PARES

function verificarPar() {

    const personagem1 = primeiraCarta.dataset.personagem;
    const personagem2 = segundaCarta.dataset.personagem;

    if (personagem1 === personagem2) {

        // Encontrou um par
        primeiraCarta.classList.add("combinada");
        segundaCarta.classList.add("combinada");

        pontuacao += 100;
        paresEncontrados++;

        pontuacaoElemento.textContent = pontuacao;

        mensagem.textContent = "Você encontrou um par!";

        tocarSom(800);

        limparSelecao();

        // Verificar vitória
        if (paresEncontrados === personagens.length) {
            finalizarJogo(true);
        }

    } else {

        // Não encontrou o par
        bloqueio = true;

        pontuacao -= 10;

        if (pontuacao < 0) {
            pontuacao = 0;
        }

        pontuacaoElemento.textContent = pontuacao;

        mensagem.textContent = "Os personagens são diferentes!";

        tocarSom(200);

        // Virar as cartas novamente após 1 segundo
        setTimeout(function() {

            primeiraCarta.classList.remove("virada");
            segundaCarta.classList.remove("virada");

            limparSelecao();

        }, 1000);

    }

}


// 9. LIMPAR SELEÇÃO

function limparSelecao() {

    primeiraCarta = null;
    segundaCarta = null;

    bloqueio = false;

}


// 10. CRONÔMETRO

function iniciarCronometro() {

    clearInterval(cronometro);

    cronometro = setInterval(function() {

        if (!jogoAtivo) {
            clearInterval(cronometro);
            return;
        }

        tempo--;

        tempoElemento.textContent = tempo;

        if (tempo <= 10 && tempo > 0) {
            mensagem.textContent = "Cuidado! O tempo está acabando!";
        }

        if (tempo <= 0) {

            tempo = 0;

            tempoElemento.textContent = tempo;

            finalizarJogo(false);

        }

    }, 1000);

}


// 11. FINALIZAR JOGO

function finalizarJogo(vitoria) {

    jogoAtivo = false;
    bloqueio = true;

    clearInterval(cronometro);

    if (vitoria) {

        pontuacao += tempo * 2;

        pontuacaoElemento.textContent = pontuacao;

        mensagem.textContent =
            "PARABÉNS, " + nome + "! VOCÊ VENCEU! 🎃";

        salvarRecorde();

        tocarSom(1000);

    } else {

        mensagem.textContent =
            "O TEMPO ACABOU! VOCÊ PERDEU! TENTE NOVAMENTE.";

        tocarSom(150);

    }

}


// 12. SALVAR RECORDE

function salvarRecorde() {

    const recordeAtual = Number(
        localStorage.getItem("terrorMemoryRecorde") || 0
    );

    if (pontuacao > recordeAtual) {

        localStorage.setItem(
            "terrorMemoryRecorde",
            pontuacao
        );

        mensagem.textContent += " NOVO RECORDE!";

    }

}


// 13. INICIAR JOGO

function iniciarJogo() {

    clearInterval(cronometro);

    pontuacao = 0;
    tentativas = 0;
    tempo = 300;

    paresEncontrados = 0;

    primeiraCarta = null;
    segundaCarta = null;

    bloqueio = false;
    jogoAtivo = true;

    pontuacaoElemento.textContent = pontuacao;
    tentativasElemento.textContent = tentativas;
    tempoElemento.textContent = tempo;

    mensagem.textContent =
        "Encontre os pares antes que o tempo acabe!";

    criarTabuleiro();

    iniciarCronometro();

}


// 14. REINICIAR JOGO

function reiniciarJogo() {

    iniciarJogo();

}


// 15. EFEITOS SONOROS

function tocarSom(frequencia) {

    if (!somLigado) {
        return;
    }

    try {

        const AudioContext =
            window.AudioContext || window.webkitAudioContext;

        const audio = new AudioContext();

        const oscilador = audio.createOscillator();
        const volume = audio.createGain();

        oscilador.connect(volume);
        volume.connect(audio.destination);

        oscilador.frequency.value = frequencia;
        oscilador.type = "sine";

        volume.gain.setValueAtTime(
            0.1,
            audio.currentTime
        );

        volume.gain.exponentialRampToValueAtTime(
            0.001,
            audio.currentTime + 0.2
        );

        oscilador.start();

        oscilador.stop(audio.currentTime + 0.2);

        oscilador.onended = function() {
            audio.close();
        };

    } catch (erro) {

        console.log("Erro ao reproduzir som:", erro);

    }

}


// 16. BOTÃO DE SOM

btnSom.addEventListener("click", function() {

    somLigado = !somLigado;

    if (somLigado) {

        btnSom.textContent = "🔊 Som ligado";

    } else {

        btnSom.textContent = "🔇 Som desligado";

    }

});


// 17. BOTÃO REINICIAR

btnReiniciar.addEventListener("click", function() {

    reiniciarJogo();

});


// 18. BOTÃO VOLTAR AO INÍCIO

btnVoltar.addEventListener("click", function() {

    window.location.href = "index.html";

});


// 19. PREPARAR O JOGO

iniciarJogo();
// Controle da música de fundo
const musicaFundo = document.getElementById("musicaFundo");
const btnMusica = document.getElementById("btnMusica");

btnMusica.addEventListener("click", function() {

    if (musicaFundo.paused) {
        musicaFundo.play();
        btnMusica.textContent = "🔊 DESATIVAR MÚSICA";
    } else {
        musicaFundo.pause();
        btnMusica.textContent = "🔇 ATIVAR MÚSICA";
    }

});
