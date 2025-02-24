document.getElementById('formAcao').addEventListener('submit', function (e) {
    e.preventDefault();
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

document.getElementById('gerarBonificacao').addEventListener('click', function () {
    const codPedido = document.getElementById('codPedido').value.trim();

    // Validação do campo obrigatório
    if (codPedido === "") {
        document.getElementById('codPedidoHelp').textContent = "Este campo é obrigatório.";
        return;
    } else {
        document.getElementById('codPedidoHelp').textContent = "";
    }

    // Coletar dados e gerar bonificação
    const dados = coletarDadosBonificacao();
    const resultadoBonificacao = gerarBonificacao(dados);

    // Exibir o resultado da bonificação
    document.getElementById('resultadoBonificacaoSection').style.display = 'block';
    document.getElementById('resultadoBonificacao').textContent = resultadoBonificacao;

    // Mostrar os botões de copiar e compartilhar
    document.getElementById('botoesBonificacao').style.display = 'flex';
});

document.getElementById('limpar').addEventListener('click', function () {
    // Reseta o formulário
    document.getElementById('formAcao').reset();
    // Oculta as seções de resultados e botões
    document.getElementById('resultadoAcaoSection').style.display = 'none';
    document.getElementById('resultadoBonificacaoSection').style.display = 'none';
    document.getElementById('botoesResultado').style.display = 'none';
    document.getElementById('resultadoAcao').textContent = "";
    document.getElementById('resultadoBonificacao').textContent = "";
    document.getElementById('bonificacaoCampos').style.display = 'none';
});

// Função genérica para copiar texto
function copiarTexto(elementId) {
    navigator.clipboard.writeText(document.getElementById(elementId).textContent)
        .then(() => alert("Texto copiado!"))
        .catch(() => alert("Erro ao copiar texto!"));
}

// Função genérica para compartilhar no WhatsApp
function compartilharWhatsApp(elementId) {
    const mensagem = document.getElementById(elementId).textContent;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Adicionar eventos de clique para copiar e compartilhar
document.getElementById('copiar').addEventListener('click', () => copiarTexto('resultadoAcao'));
document.getElementById('compartilhar').addEventListener('click', () => compartilharWhatsApp('resultadoAcao'));

document.getElementById('copiarBonificacao').addEventListener('click', () => copiarTexto('resultadoBonificacao'));
document.getElementById('compartilharBonificacao').addEventListener('click', () => compartilharWhatsApp('resultadoBonificacao'));

function validarCampos() {
    const precoSistema = parseFloat(document.getElementById('precoSistema').value);
    const precoSolicitado = parseFloat(document.getElementById('precoSolicitado').value);

    if (precoSolicitado >= precoSistema) {
        document.getElementById('precoSolicitadoHelp').textContent = "O preço solicitado deve ser menor que o preço do sistema.";
        return false;
    }

    return true;
}

function coletarDadosFormulario() {
    return {
        codRazaoCliente: document.getElementById('codRazaoCliente').value.trim(),
        codProduto: document.getElementById('codProduto').value.trim(),
        quantidade: parseFloat(document.getElementById('quantidadeAcao').value) || 0,
        precoSistema: parseFloat(document.getElementById('precoSistema').value) || 0,
        precoSolicitado: parseFloat(document.getElementById('precoSolicitado').value) || 0,
        codProdutoBonificado: document.getElementById('codProdutoBonificado').value.trim(),
        supervisor: document.getElementById('supervisor').value.trim()
    };
}

function calcularResultado(dados) {
    const valorPedido = dados.quantidade * dados.precoSistema;
    const investimentoPercentual = ((dados.precoSistema - dados.precoSolicitado) / dados.precoSistema) * 100;

    // A quantidade bonificada é a porcentagem de desconto aplicada ao valor do pedido
    const qtdBonificada = Math.round((valorPedido * (investimentoPercentual / 100)) / dados.precoSistema;

    const valorBonificacao = (qtdBonificada * dados.precoSistema).toFixed(2);

    return `*Solicitação de ação:*\n\n` +
        `Código/Produto: ${dados.codProduto}\n` +
        `Quantidade do Produto: ${dados.quantidade}\n` +
        `Preço do Palm: R$ ${dados.precoSistema.toFixed(2)}\n\n` +
        `*Ação*\n\n` +
        `Preço solicitado: R$ ${dados.precoSolicitado.toFixed(2)}\n` +
        `Investimento: ${investimentoPercentual.toFixed(0)} %\n` +
        `Quantidade bonificada: ${qtdBonificada} und\n` +
        `Valor Bonificação: R$ ${valorBonificacao}\n` +
        `Valor pedido: R$ ${valorPedido.toFixed(2)}\n` +
        `Código/Produto Bonificado: ${dados.codProdutoBonificado}\n\n` +
        `Código/Razão do Cliente: ${dados.codRazaoCliente}`;
}

function exibirResultado(resultado) {
    // Mostra a seção de resultados da ação
    document.getElementById('resultadoAcaoSection').style.display = 'block';
    // Preenche o conteúdo do resultado
    document.getElementById('resultadoAcao').textContent = resultado;
}

function coletarDadosBonificacao() {
    return {
        codRazaoCliente: document.getElementById('codRazaoCliente').value.trim(),
        supervisor: document.getElementById('supervisor').value.trim(),
        codPedido: document.getElementById('codPedido').value.trim(),
        codProduto: document.getElementById('codProduto').value.trim(),
        quantidade: document.getElementById('quantidadeAcao').value.trim(),
        valorBonificacao: document.getElementById('resultadoAcao').textContent.match(/Valor Bonificação: R\$\s*([\d,.]+)/)[1],
        observacao: document.getElementById('observacao').value.trim()
    };
}

function gerarBonificacao(dados) {
    return `*Bonificação*\n\n` +
        `*Código/Razão do Cliente:* ${dados.codRazaoCliente}\n` +
        `*Consultor:* 1473647 - Roberval Santiago\n` +
        `*Cód do pedido:* ${dados.codPedido}\n` +
        `*Código/Produto Bonificado:* ${document.getElementById('codProdutoBonificado').value.trim()}\n` +
        `*Quantidade:* ${dados.quantidade} UND\n` +
        `*Valor da bonificação:* R$ ${dados.valorBonificacao}\n` +
        `*Observação:* ${dados.observacao || "  "}`;
}

function mostrarLoading(mostrar) {
    document.getElementById('loading').style.display = mostrar ? 'block' : 'none';
}
