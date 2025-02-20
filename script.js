document.getElementById('formAcao').addEventListener('submit', function(e) {
    e.preventDefault();

    // Coletar dados
    const dados = {
        razao: document.getElementById('razaoAcao').value,
        codCliente: document.getElementById('codClienteAcao').value,
        produto: document.getElementById('produtoAcao').value,
        codProduto: document.getElementById('codProdutoAcao').value,
        quantidade: parseFloat(document.getElementById('quantidadeAcao').value) || 0,
        precoSistema: parseFloat(document.getElementById('precoSistema').value) || 0,
        precoSolicitado: parseFloat(document.getElementById('precoSolicitado').value) || 0,
        produtoBonificado: document.getElementById('produtoBonificado').value,
        codigoBonificado: document.getElementById('codigoBonificado').value,
        supervisor: document.getElementById('supervisor').value
    };

    // Verifica se os campos necessários foram preenchidos
    if (!dados.razao || !dados.codCliente || !dados.produto || !dados.codProduto || !dados.quantidade ||
        !dados.precoSistema || !dados.precoSolicitado || !dados.produtoBonificado || !dados.codigoBonificado || !dados.supervisor) {
        alert("Preencha todos os campos!");
        return;
    }

    // Cálculos
    const valorPedido = dados.quantidade * dados.precoSistema;
    const investimentoPercentual = ((dados.precoSistema - dados.precoSolicitado) / dados.precoSistema) * 100;
    const qtdBonificada = Math.round((valorPedido * (investimentoPercentual / 100)) / dados.precoSistema);
    const valorBonificacao = (qtdBonificada * dados.precoSistema).toFixed(2);

    // Formatar resultado
    const resultado = `*Solicitação de ação:*\n\n` +
        `Produto: ${dados.produto}\n` +
        `Código do Produto: ${dados.codProduto}\n` +
        `Quantidade: ${dados.quantidade} und\n` +
        `Preço sistema: R$ ${dados.precoSistema.toFixed(2)}\n` +
        `Supervisor: ${dados.supervisor}\n\n` +
        `*Ação*\n\n` +
        `Preço solicitado: R$ ${dados.precoSolicitado.toFixed(2)}\n` +
        `Investimento: ${investimentoPercentual.toFixed(2)} %\n` + // Informação do investimento corrigida
        `Quantidade bonificada: ${qtdBonificada} und\n` +
        `Valor Bonificação: R$ ${valorBonificacao}\n` +
        `Valor pedido: R$ ${valorPedido.toFixed(2)}\n` +
        `Produto Bonificado: ${dados.produtoBonificado}\n` +
        `Código: ${dados.codigoBonificado}\n\n` +
        `Razão: ${dados.razao}\n` +
        `Código do Cliente: ${dados.codCliente}`;

    document.getElementById('resultadoAcao').textContent = resultado;
});

// Função para copiar o resultado
document.getElementById('copiar').addEventListener('click', function() {
    navigator.clipboard.writeText(document.getElementById('resultadoAcao').textContent);
    alert("Texto copiado!");
});

// Função para compartilhar no WhatsApp
document.getElementById('compartilhar').addEventListener('click', function() {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(document.getElementById('resultadoAcao').textContent)}`, '_blank');
});
