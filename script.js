function coletarDadosFormulario() {
    return {
        codRazaoCliente: document.getElementById('codRazaoCliente').value.trim(),
        codProduto: document.getElementById('codProduto').value.trim(),
        quantidade: parseFloat(document.getElementById('quantidadeAcao').value) || 0,
        precoSistema: parseFloat(document.getElementById('precoSistema').value) || 0,
        precoSolicitado: parseFloat(document.getElementById('precoSolicitado').value) || 0,
        produtoBonificado: document.getElementById('produtoBonificado').value.trim(),
        codigoBonificado: document.getElementById('codigoBonificado').value.trim(),
        supervisor: document.getElementById('supervisor').value.trim()
    };
}

function calcularResultado(dados) {
    const valorPedido = dados.quantidade * dados.precoSistema;
    const investimentoPercentual = ((dados.precoSistema - dados.precoSolicitado) / dados.precoSistema) * 100;

    // A quantidade bonificada é a porcentagem de desconto aplicada ao valor do pedido
    const qtdBonificada = Math.round((valorPedido * (investimentoPercentual / 100)) / dados.precoSistema);

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
        `Produto (BNF): ${dados.produtoBonificado}\n` +
        `Código (BNF): ${dados.codigoBonificado}\n\n` +
        `Código/Razão do Cliente: ${dados.codRazaoCliente}`;
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
