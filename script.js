
const html = document.querySelector('html');
const titulo = document.querySelector('.app__title');
const banner = document.querySelector('.app__image');

// Botões
const botoes = document.querySelectorAll('.app__card-button');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const musicaBt = document.querySelector('.toggle-checkbox');
const startPauseBt = document.querySelector('#start-pause');
const iniciarOuPausarBt = document.querySelector('#start-pause span');
const iniciarOuPausarImg = document.querySelector('.app__card-primary-button-icon');

// Músicas
const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio('/sons/luna-rise-part-one.mp3');
musica.loop = true;
const somIniciar = new Audio('/sons/play.wav');
const somPausar = new Audio('/sons/pause.mp3');
const somTemp = new Audio('/sons/beep.mp3');

// Temporizador
const displayTempo = document.querySelector('#timer');
let tempoDecorridoEmSegundos = 1500;
let intervaloId = null;
let tempFoco = 15;
let tempCurto = 300;
let tempLongo = 900;


// Foco
focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 15;
    alterarContexto('foco');
    focoBt.classList.add('active');
})

// Descanso curto
curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
})

// Descanso longo
longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
})

// Função dos botões 
function alterarContexto(contexto) {
    mostrarTempo();
    botoes.forEach(function (contexto){
        contexto.classList.remove('active');
    })
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);
    switch (contexto) {
        case 'foco': titulo.innerHTML = `Otimize sua produtividade,<br><strong class="app__title-strong">mergulhe no que importa.</strong>`;
            
        break;
        
        case 'descanso-curto':
            titulo.innerHTML = `Que tal dar uma respirada?<br><strong class="app__title-strong">Faça uma pausa curta!</strong>`;
            
        break;

        case 'descanso-longo':
            titulo.innerHTML = `Hora de voltar à superfície.<br><strong class="app__title-strong">Faça uma pausa longa.</strong>`;
            
        break;

        default:
            break;
    }
}

// Músicas
musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
})

// Temporizador
const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos <= 0) {
        somTemp.play();
        alert('Tempo finalizado!');
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if(focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(evento);
        }

        zerar();
        return;
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
}

startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    if(intervaloId) {
        somPausar.play();
        zerar();
        return;
    }
    intervaloId = setInterval(contagemRegressiva, 1000);
    iniciarOuPausarBt.textContent = 'Pausar';
    iniciarOuPausarImg.setAttribute('src', '/imagens/pause.png');
    somIniciar.play();
}

function zerar () {
    clearInterval(intervaloId);
    intervaloId = null;
    iniciarOuPausarBt.textContent = 'Começar';
    iniciarOuPausarImg.setAttribute('src', '/imagens/play_arrow.png');
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-BR', {minute: '2-digit', second: '2-digit'});
    displayTempo.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();