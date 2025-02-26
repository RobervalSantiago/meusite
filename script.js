// Função para salvar dados no localStorage
function salvarDadosLocalStorage(chave, valor) {
    let dados = JSON.parse(localStorage.getItem(chave)) || [];
    if (!dados.includes(valor)) {
        dados.push(valor);
        localStorage.setItem(chave, JSON.stringify(dados));
    }
}

// Função para carregar sugestões do localStorage
function carregarSugestoes(chave, sugestoesId, valorDigitado) {
    let dados = JSON.parse(localStorage.getItem(chave)) || [];
    let sugestoesDiv = document.getElementById(sugestoesId);
    sugestoesDiv.innerHTML = ""; // Limpa as sugestões anteriores

    // Filtra as sugestões com base no valor digitado
    let sugestoesFiltradas = dados.filter(item => item.toLowerCase().includes(valorDigitado.toLowerCase()));

    if (sugestoesFiltradas.length > 0 && valorDigitado.length > 0) {
        sugestoesDiv.style.display = "block"; // Mostra as sugestões
        sugestoesFiltradas.forEach(item => {
            let div = document.createElement("div");
            div.textContent = item;
            div.classList.add("sugestao-item");
            div.addEventListener("click", function () {
                document.getElementById(chave).value = item; // Preenche o campo com a sugestão
                sugestoesDiv.style.display = "none"; // Oculta as sugestões
            });
            sugestoesDiv.appendChild(div);
        });
    } else {
        sugestoesDiv.style.display = "none"; // Oculta as sugestões se não houver correspondências
    }
}

// Carregar sugestões ao carregar a página
window.addEventListener("load", function () {
    // Inicialmente, as sugestões estão ocultas
    document.getElementById("sugestoesCliente").style.display = "none";
    document.getElementById("sugestoesProduto").style.display = "none";
    document.getElementById("sugestoesBonificado").style.display = "none";
});

// Salvar dados ao preencher os campos
document.getElementById("codRazaoCliente").addEventListener("input", function () {
    carregarSugestoes("codRazaoCliente", "sugestoesCliente", this.value);
});

document.getElementById("codProduto").addEventListener("input", function () {
    carregarSugestoes("codProduto", "sugestoesProduto", this.value);
});

document.getElementById("codProdutoBonificado").addEventListener("input", function () {
    carregarSugestoes("codProdutoBonificado", "sugestoesBonificado", this.value);
});

// Salvar dados ao sair do campo
document.getElementById("codRazaoCliente").addEventListener("change", function () {
    salvarDadosLocalStorage("codRazaoCliente", this.value);
});

document.getElementById("codProduto").addEventListener("change", function () {
    salvarDadosLocalStorage("codProduto", this.value);
});

document.getElementById("codProdutoBonificado").addEventListener("change", function () {
    salvarDadosLocalStorage("codProdutoBonificado", this.value);
});

// Função para validar campos
function validarCampos() {
    const codRazaoCliente = document.getElementById('codRazaoCliente').value.trim();
    const codProduto = document.getElementById('codProduto').value.trim();
    const quantidade = document.getElementById('quantidadeAcao').value.trim();
    const precoSistema = parseFloat(document.getElementById('precoSistema').value);
    const codProdutoBonificado = document.getElementById('codProdutoBonificado').value.trim();
    const valorProdutoBonificado = parseFloat(document.getElementById('valorProdutoBonificado').value);
    const supervisor = document.getElementById('supervisor').value.trim();
    const consultor = document.getElementById('consultor').value.trim();

    // Validação dos campos obrigatórios
    if (!codRazaoCliente) {
        document.getElementById('codRazaoClienteHelp').textContent = "Código/Razão do Cliente é obrigatório.";
        return false;
    }

    if (!codProduto) {
        document.getElementById('codProdutoHelp').textContent = "Código/Produto é obrigatório.";
        return false;
    }

    if (!quantidade || quantidade <= 0) {
        document.getElementById('quantidadeAcaoHelp').textContent = "Quantidade do Produto é obrigatória.";
        return false;
    }

    if (!precoSistema || precoSistema <= 0) {
        document.getElementById('precoSistemaHelp').textContent = "Preço do Palm é obrigatório.";
        return false;
    }

    if (!codProdutoBonificado) {
        document.getElementById('codProdutoBonificadoHelp').textContent = "Código/Produto Bonificado é obrigatório.";
        return false;
    }

    if (!supervisor) {
        document.getElementById('supervisorHelp').textContent = "Supervisor é obrigatório.";
        return false;
    }

    if (!consultor) {
        document.getElementById('consultorHelp').textContent = "Consultor é obrigatório.";
        return false;
    }

    console.log("Todos os campos estão válidos.");
    return true;
}

// Função para coletar dados do formulário
function coletarDadosFormulario() {
    return {
        codRazaoCliente: document.getElementById('codRazaoCliente').value.trim(),
        codProduto: document.getElementById('codProduto').value.trim(),
        quantidade: parseFloat(document.getElementById('quantidadeAcao').value) || 0,
        precoSistema: parseFloat(document.getElementById('precoSistema').value) || 0,
        codProdutoBonificado: document.getElementById('codProdutoBonificado').value.trim(),
        valorProdutoBonificado: parseFloat(document.getElementById('valorProdutoBonificado').value) || 0,
        supervisor: document.getElementById('supervisor').value.trim(),
        consultor: document.getElementById('consultor').value.trim()
    };
}

// Função para calcular o resultado
function calcularResultado(dados) {
    console.log("Dados recebidos para cálculo:", dados);

    // Cálculo do valor do pedido
    const valorPedido = dados.quantidade * dados.precoSistema;

    // Cálculo do preço solicitado
    const precoSolicitado = valorPedido / dados.quantidade;

    // Cálculo da quantidade bonificada
    const quantidadeBonificada = (valorPedido - (dados.quantidade * precoSolicitado)) / dados.precoSistema;
    const quantidadeBonificadaFormatada = Math.abs(quantidadeBonificada).toFixed(2); // Evita valores negativos

    // Cálculo do valor da bonificação
    const valorBonificacao = (quantidadeBonificadaFormatada * dados.valorProdutoBonificado).toFixed(2);

    // Montagem do resultado
    const resultado = `*Solicitação de ação:*\n\n` +
        `Código/Produto: ${dados.codProduto}\n` +
        `Quantidade do Produto: ${dados.quantidade}\n` +
        `Preço do Palm: R$ ${dados.precoSistema.toFixed(2)}\n\n` +
        `*Ação*\n\n` +
        `Preço solicitado: R$ ${precoSolicitado.toFixed(2)}\n` +
        `Quantidade bonificada: ${quantidadeBonificadaFormatada} und\n` +
        `Valor Bonificação: R$ ${valorBonificacao}\n` +
        `Valor pedido: R$ ${valorPedido.toFixed(2)}\n` +
        `Código/Produto Bonificado: ${dados.codProdutoBonificado}\n\n` +
        `Código/Razão do Cliente: ${dados.codRazaoCliente}\n` +
        `Supervisor: ${dados.supervisor}\n` +
        `Consultor: ${dados.consultor}`;

    console.log("Resultado calculado:", resultado);
    return resultado;
}

// Função para exibir o resultado
function exibirResultado(resultado) {
    console.log("Exibindo resultado:", resultado);
    // Mostra a seção de resultados da ação
    document.getElementById('resultadoAcaoSection').style.display = 'block';
    // Preenche o conteúdo do resultado
    document.getElementById('resultadoAcao').textContent = resultado;
}

// Função para coletar dados da bonificação
function coletarDadosBonificacao() {
    return {
        codRazaoCliente: document.getElementById('codRazaoCliente').value.trim(),
        supervisor: document.getElementById('supervisor').value.trim(),
        consultor: document.getElementById('consultor').value.trim(),
        codPedido: document.getElementById('codPedido').value.trim(),
        codProduto: document.getElementById('codProduto').value.trim(),
        quantidade: document.getElementById('quantidadeAcao').value.trim(),
        valorBonificacao: document.getElementById('resultadoAcao').textContent.match(/Valor Bonificação: R\$\s*([\d,.]+)/)[1],
        observacao: document.getElementById('observacao').value.trim()
    };
}

// Função para gerar a bonificação
function gerarBonificacao(dados) {
    // Extrai a quantidade bonificada do resultado da ação
    const quantidadeBonificada = document.getElementById('resultadoAcao').textContent.match(/Quantidade bonificada:\s*(\d+)/)[1];

    return `*Bonificação*\n\n` +
        `*Código/Razão do Cliente:* ${dados.codRazaoCliente}\n` +
        `*Consultor:* ${dados.consultor}\n` +
        `*Código do Pedido:* ${dados.codPedido}\n` +
        `*Código/Produto Bonificado:* ${document.getElementById('codProdutoBonificado').value.trim()}\n` +
        `*Quantidade Bonificada:* ${quantidadeBonificada} UND\n` +
        `*Valor da Bonificação:* R$ ${dados.valorBonificacao}\n` +
        `*Observação:* ${dados.observacao || "Nenhuma observação fornecida."}`;
}

// Função para mostrar/ocultar o spinner de carregamento
function mostrarLoading(mostrar) {
    document.getElementById('loading').style.display = mostrar ? 'block' : 'none';
}

// Evento de envio do formulário
document.getElementById('formAcao').addEventListener('submit', function (e) {
    e.preventDefault(); // Impede o envio padrão do formulário
    console.log("Formulário enviado. Validando campos...");
    mostrarLoading(true);

    if (!validarCampos()) {
        mostrarLoading(false);
        return;
    }

    const dados = coletarDadosFormulario();
    const resultado = calcularResultado(dados);
    exibirResultado(resultado);

    // Mostra os botões de copiar e compartilhar
    document.getElementById('botoesResultado').style.display = 'flex';

    mostrarLoading(false);
    document.getElementById('bonificacaoCampos').style.display = 'block';
});

// Evento de clique no botão de gerar bonificação
document.getElementById('gerarBonificacao').addEventListener('click', function () {
    const dadosBonificacao = coletarDadosBonificacao();
    const resultadoBonificacao = gerarBonificacao(dadosBonificacao);
    document.getElementById('resultadoBonificacao').textContent = resultadoBonificacao;
    document.getElementById('resultadoBonificacaoSection').style.display = 'block';
    document.getElementById('botoesBonificacao').style.display = 'flex';
});

// Função para copiar texto
function copiarTexto(elementId) {
    navigator.clipboard.writeText(document.getElementById(elementId).textContent)
        .then(() => alert("Texto copiado!"))
        .catch(() => alert("Erro ao copiar texto!"));
}

// Função para compartilhar no WhatsApp
function compartilharWhatsApp(elementId) {
    const mensagem = document.getElementById(elementId).textContent;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Eventos de clique para copiar e compartilhar
document.getElementById('copiar').addEventListener('click', () => copiarTexto('resultadoAcao'));
document.getElementById('compartilhar').addEventListener('click', () => compartilharWhatsApp('resultadoAcao'));

document.getElementById('copiarBonificacao').addEventListener('click', () => copiarTexto('resultadoBonificacao'));
document.getElementById('compartilharBonificacao').addEventListener('click', () => compartilharWhatsApp('resultadoBonificacao'));

// Evento de clique no botão de limpar
document.getElementById('limpar').addEventListener('click', function () {
    document.getElementById('formAcao').reset();
    document.getElementById('resultadoAcaoSection').style.display = 'none';
    document.getElementById('bonificacaoCampos').style.display = 'none';
    document.getElementById('resultadoBonificacaoSection').style.display = 'none';
    document.getElementById('botoesResultado').style.display = 'none';
    document.getElementById('botoesBonificacao').style.display = 'none';
    // Limpar as sugestões
    document.getElementById('sugestoesCliente').innerHTML = "";
    document.getElementById('sugestoesProduto').innerHTML = "";
    document.getElementById('sugestoesBonificado').innerHTML = "";
});

// Função para alternar entre modo escuro e claro
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Verificar o tema salvo no localStorage
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
}

// Adicionar evento de clique ao botão de alternância
document.addEventListener('DOMContentLoaded', function () {
    loadTheme();
    document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
});
