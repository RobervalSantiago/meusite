document.getElementById('formAcao').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Coletar dados
    const dados = {
        razao: document.getElementById('razaoAcao').value,
        codCliente: document.getElementById('codClienteAcao').value,
        produto: document.getElementById('produtoAcao').value,
        codProduto: document.getElementById('codProdutoAcao').value,
        quantidade: parseFloat(document.getElementById('quantidadeAcao').value),
        precoSistema: parseFloat(document.getElementById('precoSistema').value),
        precoSolicitado: parseFloat(document.getElementById('precoSolicitado').value)
    };

    // Cálculos
    const valorPedido = dados.quantidade * dados.precoSistema;
    const investimentoPercentual = ((dados.precoSistema - dados.precoSolicitado) / dados.precoSistema) * 100;
    const qtdBonificada = (valorPedido * (investimentoPercentual / 100)) / dados.precoSistema;
    const valorBonificacao = (qtdBonificada * dados.precoSistema).toFixed(2);

    // Formatar resultado
    const resultado = `Solicitação de ação:\n\n` +
        `Produto: ${dados.produto}\n` +
        `Código do Produto: ${dados.codProduto}\n` +
        `Quantidade: ${dados.quantidade} und\n` +
        `Preço sistema: R$ ${dados.precoSistema.toFixed(2)}\n\n` +
        `Ação\n\n` +
        `Preço solicitado: R$ ${dados.precoSolicitado.toFixed(2)}\n` +
        `Investimento%: ${investimentoPercentual.toFixed(0)}%\n` +
        `Quantidade bonificada: ${Math.round(qtdBonificada)} und\n` +
        `Valor Bonificação: R$ ${valorBonificacao}\n` +
        `Valor pedido: R$ ${valorPedido.toFixed(2)}\n\n` +
        `Razão: ${dados.razao}\n` +
        `Código do Cliente: ${dados.codCliente}`;

    document.getElementById('resultadoAcao').textContent = resultado;
});