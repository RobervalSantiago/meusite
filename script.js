// Inicializa o localStorage com chaves vazias, se necessÃ¡rio
function inicializarLocalStorage() {
    const chaves = ['codRazaoCliente', 'codProduto', 'codProdutoBonificado'];
    chaves.forEach(chave => {
        if (!localStorage.getItem(chave)) {
            localStorage.setItem(chave, JSON.stringify([]));
        }
    });
}

// FunÃ§Ã£o para salvar dados no localStorage
function salvarDadosLocalStorage(chave, valor) {
    let dados = JSON.parse(localStorage.getItem(chave)) || [];
    if (!dados.includes(valor)) {
        dados.push(valor);
        localStorage.setItem(chave, JSON.stringify(dados));
    }
}

// FunÃ§Ã£o para carregar sugestÃµes do localStorage
function carregarSugestoes(chave, sugestoesId, valorDigitado) {
    let dados = JSON.parse(localStorage.getItem(chave)) || [];
    let sugestoesDiv = document.getElementById(sugestoesId);
    if (!sugestoesDiv) return; // Verifica se o elemento existe

    sugestoesDiv.innerHTML = ""; // Limpa as sugestÃµes anteriores

    // Filtra as sugestÃµes com base no valor digitado
    let sugestoesFiltradas = dados.filter(item => item.toLowerCase().includes(valorDigitado.toLowerCase()));

    if (sugestoesFiltradas.length > 0 && valorDigitado.length > 0) {
        sugestoesDiv.style.display = "block"; // Mostra as sugestÃµes
        sugestoesFiltradas.forEach(item => {
            let div = document.createElement("div");
            div.textContent = item;
            div.classList.add("sugestao-item");
            div.addEventListener("click", function () {
                document.getElementById(chave).value = item; // Preenche o campo com a sugestÃ£o
                sugestoesDiv.style.display = "none"; // Oculta as sugestÃµes
            });
            sugestoesDiv.appendChild(div);
        });
    } else {
        sugestoesDiv.style.display = "none"; // Oculta as sugestÃµes se nÃ£o houver correspondÃªncias
    }
}

// FunÃ§Ã£o para validar campos
function validarCampos() {
    const codRazaoCliente = document.getElementById('codRazaoCliente').value.trim();
    const codProduto = document.getElementById('codProduto').value.trim();
    const quantidade = document.getElementById('quantidadeAcao').value.trim();
    const precoSistema = document.getElementById('precoSistema').value.trim();
    const codProdutoBonificado = document.getElementById('codProdutoBonificado').value.trim();
    const quantidadeProdutoBonificado = document.getElementById('quantidadeProdutoBonificado').value.trim();
    const valorProdutoBonificado = document.getElementById('valorProdutoBonificado').value.trim();

    // ValidaÃ§Ã£o dos campos obrigatÃ³rios
    if (!codRazaoCliente) {
        document.getElementById('codRazaoClienteHelp').textContent = "CÃ³digo/RazÃ£o do Cliente Ã© obrigatÃ³rio.";
        return false;
    }

    if (!codProduto) {
        document.getElementById('codProdutoHelp').textContent = "CÃ³digo/Produto Ã© obrigatÃ³rio.";
        return false;
    }

    if (!quantidade || isNaN(quantidade) || quantidade <= 0) {
        document.getElementById('quantidadeAcaoHelp').textContent = "Quantidade do Produto Ã© obrigatÃ³ria e deve ser um nÃºmero positivo.";
        return false;
    }

    if (!precoSistema || isNaN(precoSistema) || precoSistema <= 0) {
        document.getElementById('precoSistemaHelp').textContent = "PreÃ§o do Palm Ã© obrigatÃ³rio e deve ser um nÃºmero positivo.";
        return false;
    }

    if (!codProdutoBonificado) {
        document.getElementById('codProdutoBonificadoHelp').textContent = "CÃ³digo/Produto Bonificado Ã© obrigatÃ³rio.";
        return false;
    }

    if (!quantidadeProdutoBonificado || isNaN(quantidadeProdutoBonificado) || quantidadeProdutoBonificado <= 0) {
        document.getElementById('quantidadeProdutoBonificadoHelp').textContent = "Quantidade do Produto Bonificado Ã© obrigatÃ³ria e deve ser um nÃºmero positivo.";
        return false;
    }

    console.log("Todos os campos estÃ£o vÃ¡lidos.");
    return true;
}

// FunÃ§Ã£o para coletar dados do formulÃ¡rio
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

// FunÃ§Ã£o para calcular o resultado
function calcularResultado(dados) {
    console.log("Dados recebidos para cÃ¡lculo:", dados);

    // Verifica se os valores sÃ£o vÃ¡lidos
    if (isNaN(dados.quantidade) || isNaN(dados.precoSistema) || isNaN(dados.quantidadeProdutoBonificado) || isNaN(dados.valorProdutoBonificado)) {
        console.error("Valores invÃ¡lidos para cÃ¡lculo.");
        return "Erro: Valores invÃ¡lidos para cÃ¡lculo.";
    }

    // CÃ¡lculo do valor do pedido
    const valorPedido = dados.quantidade * dados.precoSistema;

    // CÃ¡lculo do valor da bonificaÃ§Ã£o
    const valorBonificacao = dados.valorProdutoBonificado * dados.quantidadeProdutoBonificado;

    // Verifica se a quantidade Ã© maior que zero para evitar divisÃ£o por zero
    if (dados.quantidade <= 0) {
        console.error("Quantidade do produto deve ser maior que zero.");
        return "Erro: Quantidade do produto deve ser maior que zero.";
    }

    // CÃ¡lculo do preÃ§o solicitado
    const precoSolicitado = (valorPedido - valorBonificacao) / dados.quantidade;

    // CÃ¡lculo do investimento %
    const investimentoPercentual = (valorBonificacao / valorPedido) * 100;

    // FormataÃ§Ã£o BR (R$ 9,00 em vez de 9.00)
    const formatarMoeda = (valor) => valor.toFixed(2).replace('.', ',');

    // Montagem do resultado
    const resultado = `*SolicitaÃ§Ã£o de aÃ§Ã£o:*\n\n` +
        `CÃ³digo/Produto: ${dados.codProduto}\n` +
        `Quantidade: ${dados.quantidade}\n` +
        `Valor pedido: R$ ${formatarMoeda(valorPedido)}\n` +
        `PreÃ§o Sistema: R$ ${formatarMoeda(dados.precoSistema)}\n\n` +
        `*AÃ§Ã£o*\n\n` +
        `CÃ³digo/Produto Bonificado: ${dados.codProdutoBonificado}\n` +
        `PreÃ§o solicitado: R$ ${formatarMoeda(precoSolicitado)}\n` +
        `Investimento: ${investimentoPercentual.toFixed(1).replace('.', ',')}%\n` +
        `Quantidade bonificada: ${dados.quantidadeProdutoBonificado} Und\n` +
        `Valor BonificaÃ§Ã£o: R$ ${formatarMoeda(valorBonificacao)}\n` +
        `PreÃ§o Final: R$ ${formatarMoeda(precoSolicitado)}\n\n` +
        `CÃ³digo/RazÃ£o do Cliente: ${dados.codRazaoCliente}`;

    console.log("Resultado calculado:", resultado);
    return resultado;
}

// FunÃ§Ã£o para exibir o resultado
function exibirResultado(resultado) {
    const resultadoAcaoElement = document.getElementById('resultadoAcao');
    if (resultadoAcaoElement) {
        resultadoAcaoElement.textContent = resultado;
        document.getElementById('resultadoAcaoSection').style.display = 'block';
    } else {
        console.error("Elemento 'resultadoAcao' nÃ£o encontrado no DOM.");
    }
}

// FunÃ§Ã£o para coletar dados da bonificaÃ§Ã£o
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

// FunÃ§Ã£o para gerar a bonificaÃ§Ã£o
function gerarBonificacao(dados) {
    return `*BonificaÃ§Ã£o:*\n\n` +
        `*CÃ³d cliente/razÃ£o:* ${dados.codRazaoCliente}\n` +
        `*CÃ³d/vendedor:* ${dados.codConsultor}\n` +
        `*Autorizado por:* Fornecedor\n` +
        `*CÃ³d do pedido:* ${dados.codPedido}\n` +
        `*CÃ³d/produto:* ${dados.codProdutoBonificado}\n` +
        `*Quantidade:* ${dados.quantidadeProdutoBonificado}\n` +
        `*Valor BonificaÃ§Ã£o:* R$ ${parseFloat(dados.valorProdutoBonificado).toFixed(2).replace('.', ',')}\n` +
        `*ObservaÃ§Ã£o:* ${dados.observacao || " "}`;
}

// FunÃ§Ã£o para mostrar/ocultar o spinner de carregamento
function mostrarLoading(mostrar) {
    document.getElementById('loading').style.display = mostrar ? 'block' : 'none';
}

// Evento de envio do formulÃ¡rio
document.getElementById('formAcao').addEventListener('submit', function (e) {
    e.preventDefault(); // Impede o envio padrÃ£o do formulÃ¡rio
    console.log("FormulÃ¡rio enviado. Validando campos...");
    mostrarLoading(true);

    if (!validarCampos()) {
        mostrarLoading(false);
        return;
    }

    const dados = coletarDadosFormulario();
    const resultado = calcularResultado(dados);
    exibirResultado(resultado);

    // Mostra os botÃµes de copiar e compartilhar
    document.getElementById('botoesResultado').style.display = 'flex';

    mostrarLoading(false);
    document.getElementById('bonificacaoCampos').style.display = 'block';
});

// Evento de clique no botÃ£o de gerar bonificaÃ§Ã£o
document.getElementById('gerarBonificacao').addEventListener('click', function () {
    const dadosBonificacao = coletarDadosBonificacao();
    const resultadoBonificacao = gerarBonificacao(dadosBonificacao);
    document.getElementById('resultadoBonificacao').textContent = resultadoBonificacao;
    document.getElementById('resultadoBonificacaoSection').style.display = 'block';
    document.getElementById('botoesBonificacao').style.display = 'flex';
});

// FunÃ§Ã£o para copiar texto
function copiarTexto(elementId) {
    navigator.clipboard.writeText(document.getElementById(elementId).textContent)
        .then(() => alert("Texto copiado!"))
        .catch(() => alert("Erro ao copiar texto!"));
}

// FunÃ§Ã£o para compartilhar no WhatsApp
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

// Evento de clique no botÃ£o de limpar
document.getElementById('limpar').addEventListener('click', function () {
    document.getElementById('formAcao').reset();
    document.getElementById('resultadoAcaoSection').style.display = 'none';
    document.getElementById('bonificacaoCampos').style.display = 'none';
    document.getElementById('resultadoBonificacaoSection').style.display = 'none';
    document.getElementById('botoesResultado').style.display = 'none';
    document.getElementById('botoesBonificacao').style.display = 'none';
    // Limpar as sugestÃµes
    document.getElementById('sugestoesCliente').innerHTML = "";
    document.getElementById('sugestoesProduto').innerHTML = "";
    document.getElementById('sugestoesBonificado').innerHTML = "";
});

// FunÃ§Ã£o para alternar entre modo escuro e claro
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

// Adicionar evento de clique ao botÃ£o de alternÃ¢ncia
document.addEventListener('DOMContentLoaded', function () {
    inicializarLocalStorage();
    loadTheme();
    document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
});
