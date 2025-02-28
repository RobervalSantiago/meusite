document.addEventListener('DOMContentLoaded', () => {
    // Função para sincronizar os campos de bonificação
    const syncBonificacao = () => {
        const produtoInput = document.getElementById('codProduto');
        const bonificadoInput = document.getElementById('codProdutoBonificado');
        const precoPalm = document.getElementById('precoSistema');
        const valorBonificado = document.getElementById('valorProdutoBonificado');
        const mesmoProdutoCheckbox = document.getElementById('mesmoProduto');

        if (mesmoProdutoCheckbox.checked) {
            bonificadoInput.value = produtoInput.value;
            valorBonificado.value = precoPalm.value;
            [bonificadoInput, valorBonificado].forEach(field => {
                field.disabled = true;
                field.style.opacity = '0.7';
            });
        } else {
            [bonificadoInput, valorBonificado].forEach(field => {
                field.value = '';
                field.disabled = false;
                field.style.opacity = '1';
            });
        }
    };

    // Event listeners para sincronização
    document.getElementById('mesmoProduto').addEventListener('change', syncBonificacao);
    document.getElementById('codProduto').addEventListener('input', syncBonificacao);
    document.getElementById('precoSistema').addEventListener('input', syncBonificacao);

    // ... (outro código existente mantido)
});

// Registrar o Service Worker para PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('Service Worker registrado com sucesso!'))
        .catch((error) => console.log('Erro ao registrar Service Worker:', error));
}
