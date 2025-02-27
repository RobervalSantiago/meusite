// Inicializa o localStorage com chaves vazias, se necessário
function inicializarLocalStorage() {
    const chaves = ['codRazaoCliente', 'codProduto', 'codProdutoBonificado'];
    chaves.forEach(chave => {
        if (!localStorage.getItem(chave)) {
            localStorage.setItem(chave, JSON.stringify([]));
        }
    });
}

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
    if (!sugestoesDiv) return; // Verifica se o elemento existe

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

// Função para validar campos
function validarCampos() {
    const codRazaoCliente = document.getElementById('codRazaoCliente').value.trim();
    const codProduto = document.getElementById('codProduto').value.trim();
    const quantidade = document.getElementById('quantidadeAcao').value.trim();
    const precoSistema = document.getElementById('precoSistema').value.trim();
    const codProdutoBonificado = document.getElementById('codProdutoBonificado').value.trim();
    const quantidadeProdutoBonificado = document.getElementById('quantidadeProdutoBonificado').value.trim();
    const valorProdutoBonificado = document.getElementById('valorProdutoBonificado').value.trim();

    // Validação dos campos obrigatórios
    if (!codRazaoCliente) {
        document.getElementById('codRazaoClienteHelp').textContent = "Código/Razão do Cliente é obrigatório.";
        return false;
    }

    if (!codProduto) {
        document.getElementById('codProdutoHelp').textContent = "Código/Produto é obrigatório.";
        return false;
    }

    if (!quantidade || isNaN(quantidade) || quantidade <= 0) {
        document.getElementById('quantidadeAcaoHelp').textContent = "Quantidade do Produto é obrigatória e deve ser um número positivo.";
        return false;
    }

    if (!precoSistema || isNaN(precoSistema) || precoSistema <= 0) {
        document.getElementById('precoSistemaHelp').textContent = "Preço do Palm é obrigatório e deve ser um número positivo.";
        return false;
    }

    if (!codProdutoBonificado) {
        document.getElementById('codProdutoBonificadoHelp').textContent = "Código/Produto Bonificado é obrigatório.";
        return false;
    }

    if (!quantidadeProdutoBonificado || isNaN(quantidadeProdutoBonificado) || quantidadeProdutoBonificado <= 0) {
        document.getElementById('quantidadeProdutoBonificadoHelp').textContent = "Quantidade do Produto Bonificado é obrigatória e deve ser um número positivo.";
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
        quantidadeProdutoBonificado: parseFloat(document.getElementById('quantidadeProdutoBonificado').value) || 0,
        valorProdutoBonificado: parseFloat(document.getElementById('valorProdutoBonificado').value) || 0
    };
}

// Função para calcular o resultado
function calcularResultado(dados) {
    console.log("Dados recebidos para cálculo:", dados);

    // Verifica se os valores são válidos
    if (isNaN(dados.quantidade) || isNaN(dados.precoSistema) || isNaN(dados.quantidadeProdutoBonificado) || isNaN(dados.valorProdutoBonificado)) {
        console.error("Valores inválidos para cálculo.");
        return "Erro: Valores inválidos para cálculo.";
    }

    // Cálculo do valor do pedido
    const valorPedido = dados.quantidade * dados.precoSistema;

    // Cálculo do valor da bonificação
    const valorBonificacao = dados.valorProdutoBonificado * dados.quantidadeProdutoBonificado;

    // Verifica se a quantidade é maior que zero para evitar divisão por zero
    if (dados.quantidade <= 0) {
        console.error("Quantidade do produto deve ser maior que zero.");
        return "Erro: Quantidade do produto deve ser maior que zero.";
    }

    // Cálculo do preço solicitado
    const precoSolicitado = (valorPedido - valorBonificacao) / dados.quantidade;

    // Cálculo do investimento %
    const investimentoPercentual = (valorBonificacao / valorPedido) * 100;

    // Formatação BR (R$ 9,00 em vez de 9.00)
    const formatarMoeda = (valor) => valor.toFixed(2).replace('.', ',');

    // Montagem do resultado
    const resultado = `*Solicitação de ação:*\n\n` +
        `Código/Produto: ${dados.codProduto}\n` +
        `Quantidade: ${dados.quantidade}\n` +
        `Valor pedido: R$ ${formatarMoeda(valorPedido)}\n` +
        `Preço Sistema: R$ ${formatarMoeda(dados.precoSistema)}\n\n` +
        `*Ação*\n\n` +
        `Código/Produto Bonificado: ${dados.codProdutoBonificado}\n` +
        `Preço solicitado: R$ ${formatarMoeda(precoSolicitado)}\n` +
        `Investimento %: ${investimentoPercentual.toFixed(2).replace('.', ',')}%\n` +
        `Quantidade bonificada: ${dados.quantidadeProdutoBonificado} Und\n` +
        `Valor Bonificação: R$ ${formatarMoeda(valorBonificacao)}\n` +
        `Preço Final: R$ ${formatarMoeda(precoSolicitado)}\n\n` +
        `Código/Razão do Cliente: ${dados.codRazaoCliente}`;

    console.log("Resultado calculado:", resultado);
    return resultado;
}

// Função para exibir o resultado
function exibirResultado(resultado) {
    const resultadoAcaoElement = document.getElementById('resultadoAcao');
    if (resultadoAcaoElement) {
        resultadoAcaoElement.textContent = resultado;
        document.getElementById('resultadoAcaoSection').style.display = 'block';
    } else {
        console.error("Elemento 'resultadoAcao' não encontrado no DOM.");
    }
}

// Função para coletar dados da bonificação
function coletarDadosBonificacao() {
    return {
        codRazaoCliente: document.getElementById('codRazaoCliente').value.trim(),
        codConsultor: document.getElementById('codConsultor').value.trim(),
        codPedido: document.getElementById('codPedido').value.trim(),
        codProdutoBonificado: document.getElementById('codProdutoBonificado').value.trim(),
        quantidadeProdutoBonificado: document.getElementById('quantidadeProdutoBonificado').value.trim(),
        valorProdutoBonificado: document.getElementById('valorProdutoBonificado').value.trim(),
        observacao: document.getElementById('observacao').value.trim()
    };
}

// Função para gerar a bonificação
function gerarBonificacao(dados) {
    return `*Cód cliente/razão:* ${dados.codRazaoCliente}\n` +
        `*Cód/vendedor:* ${dados.codConsultor}\n` +
        `*Autorizado por:* Fornecedor\n` +
        `*Cód do pedido:* ${dados.codPedido}\n` +
        `*Cód/produto:* ${dados.codProdutoBonificado}\n` +
        `*Quantidade:* ${dados.quantidadeProdutoBonificado}\n` +
        `*Valor Bonificação:* R$ ${parseFloat(dados.valorProdutoBonificado).toFixed(2).replace('.', ',')}\n` +
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
    inicializarLocalStorage();
    loadTheme();
    document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
});
