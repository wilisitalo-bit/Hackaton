
// Seleciona os elementos do HTML

const nomeJogador = document.getElementById("nomeJogador");

const btnIniciar = document.getElementById("btnIniciar");


// Evento de clique no botão

btnIniciar.addEventListener("click", function() {

    // Pega o nome digitado
    const nome = nomeJogador.value.trim();

    // Verifica se o jogador digitou um nome
    if (nome === "") {

        alert("Digite seu nome para iniciar o jogo!");

        nomeJogador.focus();

        return;
    }

    // Guarda o nome no navegador
    localStorage.setItem("nomeJogador", nome);

    // Direciona para a página do jogo
    window.location.href = "jogo.html";

});
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