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
        `Quantidade: ${dados.quantidade}\n` +
        `Preço sistema: $ ${dados.precoSistema.toFixed(2)}\n` +
        `Supervisor: ${dados.supervisor}\n\n` +
        `*Ação*\n\n` +
        `Preço solicitado: R$ ${dados.precoSolicitado.toFixed(2)}\n` +
        `Investimento: ${investimentoPercentual.toFixed(0)} %\n` +
        `Quantidade bonificada: ${qtdBonificada} und\n` +
        `Valor Bonificação: R$ ${valorBonificacao}\n` +
        `Valor pedido: R$ ${valorPedido.toFixed(2)}\n` +
        `Produto Bonificado: ${dados.produtoBonificado}\n` +
        `Codigo: ${dados.codigoBonificado}\n\n` +
        `Razão: ${dados.razao}\n` +
        `Cod do Cliente: ${dados.codCliente}`;

    document.getElementById('resultadoAcao').textContent = resultado;

    // Ativar botões
    document.getElementById('copiar').style.display = 'block';
    document.getElementById('compartilhar').style.display = 'block';
});

// Copiar resultado para área de transferência
document.getElementById('copiar').addEventListener('click', function() {
    const resultado = document.getElementById('resultadoAcao').textContent;
    navigator.clipboard.writeText(resultado).then(() => {
        alert("Texto copiado para a área de transferência!");
    }).catch(err => {
        console.error("Erro ao copiar:", err);
    });
});

// Compartilhar no WhatsApp
document.getElementById('compartilhar').addEventListener('click', function() {
    const resultado = document.getElementById('resultadoAcao').textContent;
    const mensagemWhatsApp = encodeURIComponent(resultado);
    const url = `https://api.whatsapp.com/send?text=${mensagemWhatsApp}`;
    window.open(url, '_blank');
});
