const adicionarTarefaBt = document.querySelector('.app__button--add-task');
const adicionarTarefaForm = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const cancelarBt = document.querySelector('.app__form-footer__button--cancel');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');

const removerConcluidasBt = document.querySelector('#btn-remover-concluidas');
const removerTodasBt = document.querySelector('#btn-remover-todas');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

// Atualizar tarefas
function atualizarTarefas() {
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

// Criar tarefas
function criarElementoTarefa(tarefa) {
    
    // Criação dos elementos
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;

    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');

    const botao = document.createElement('button');
    botao.classList.add('app__button-edit');

    // Atualizar tarefa
    botao.onclick = () => {
        //debugger;
        const novaDescricao = prompt('Qual é o novo nome da tarefa?');
        //console.log('Nova descrição da tarefa:', novaDescricao);
        if(novaDescricao !== null && novaDescricao !== '') {
            paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao;
            atualizarTarefas();
            alert('Tarefa atualizada com sucesso!');
        } else {
            alert('Atualização cancelada ou valor inválido!');
        }
    }

    const imagemBotao = document.createElement('img');
    imagemBotao.setAttribute('src', '/imagens/edit.png');
    botao.append(imagemBotao);

    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
    } else {
        // Selecionar tarefa
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active').forEach(elemento => {
                elemento.classList.remove('app__section-task-list-item-active');
            })
            if (tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return;
            }
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
            paragrafoDescricaoTarefa.textContent = tarefa.descricao;
    
            li.classList.add('app__section-task-list-item-active');
        }
    }

    return li;
}

// Adicionar tarefa
adicionarTarefaBt.addEventListener('click', () => {
    adicionarTarefaForm.classList.toggle('hidden');
})

adicionarTarefaForm.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = {
        descricao: textArea.value
    }
    tarefas.push(tarefa);
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    atualizarTarefas();
    textArea.value = '';
    adicionarTarefaForm.classList.add('hidden');
})

tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
});

document.addEventListener('FocoFinalizado', () => {
    if(tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
        tarefaSelecionada.completa = true;
        atualizarTarefas();
    }
})

// Limpar formulário
const limparFormulario = () => {
    adicionarTarefaForm.classList.add('hidden');
    textArea.value = '';
}

cancelarBt.addEventListener('click', limparFormulario);

// Remover tarefas
const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    })
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];
    atualizarTarefas();
}

removerConcluidasBt.onclick = () => removerTarefas(true);
removerTodasBt.onclick = () => removerTarefas(false);
