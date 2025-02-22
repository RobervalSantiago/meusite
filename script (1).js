document.getElementById('formAcao').addEventListener('submit', function(e) {
    e.preventDefault();

    // Coletar dados do formulário
    const dados = {
        razao: document.getElementById('razaoAcao').value.trim(),
        codCliente: document.getElementById('codClienteAcao').value.trim(),
        produto: document.getElementById('produtoAcao').value.trim(),
        codProduto: document.getElementById('codProdutoAcao').value.trim(),
        quantidade: parseFloat(document.getElementById('quantidadeAcao').value) || 0,
        precoSistema: parseFloat(document.getElementById('precoSistema').value) || 0,
        precoSolicitado: parseFloat(document.getElementById('precoSolicitado').value) || 0,
        produtoBonificado: document.getElementById('produtoBonificado').value.trim(),
        codigoBonificado: document.getElementById('codigoBonificado').value.trim(),
        supervisor: document.getElementById('supervisor').value.trim()
    };

    // Validar se os campos obrigatórios foram preenchidos
    if (Object.values(dados).some(valor => valor === "" || valor === 0)) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    // Cálculos necessários
    const valorPedido = dados.quantidade * dados.precoSistema;
    const investimentoPercentual = ((dados.precoSistema - dados.precoSolicitado) / dados.precoSistema) * 100;
    const qtdBonificada = Math.round((valorPedido * (investimentoPercentual / 100)) / dados.precoSistema);
    const valorBonificacao = (qtdBonificada * dados.precoSistema).toFixed(2);

    // Formatar resultado no modelo solicitado
    const resultado = `*Solicitação de ação:*\n\n` +
        `Nome do Produto: ${dados.produto}\n` +
        `Código do Produto: ${dados.codProduto}\n` +
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
        `Razão do Cliente: ${dados.razao}\n` +
        `Código do Cliente: ${dados.codCliente}`;

    // Exibir resultado formatado na tela
    document.getElementById('resultadoAcao').textContent = resultado;
});

// Função para copiar o resultado
document.getElementById('copiar').addEventListener('click', function() {
    navigator.clipboard.writeText(document.getElementById('resultadoAcao').textContent);
    alert("Texto copiado!");
});

// Função para compartilhar no WhatsApp
document.getElementById('compartilhar').addEventListener('click', function() {
    const mensagem = document.getElementById('resultadoAcao').textContent;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
});
