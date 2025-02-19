document.getElementById('formAcao').addEventListener('submit', function(e) {
    e.preventDefault();

    const resultado = `*Solicitação de ação:*\n\nProduto: ${document.getElementById('produtoAcao').value}\nCódigo: ${document.getElementById('codProdutoAcao').value}\nQuantidade: ${document.getElementById('quantidadeAcao').value} und\nPreço sistema: R$ ${document.getElementById('precoSistema').value}\nSupervisor: ${document.getElementById('supervisor').value}\n\n*Ação*\n\nPreço solicitado: R$ ${document.getElementById('precoSolicitado').value}\nProduto Bonificado: ${document.getElementById('produtoBonificado').value}\nCódigo: ${document.getElementById('codigoBonificado').value}`;

    document.getElementById('resultadoAcao').textContent = resultado;
});

document.getElementById('copiar').addEventListener('click', function() {
    navigator.clipboard.writeText(document.getElementById('resultadoAcao').textContent);
    alert("Texto copiado!");
});

document.getElementById('compartilhar').addEventListener('click', function() {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(document.getElementById('resultadoAcao').textContent)}`, '_blank');
});
