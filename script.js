document.addEventListener('DOMContentLoaded', () => {
    // Função para alternar o tema
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Restaurar tema salvo
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark', savedTheme === 'dark');
    themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

    // Função para sincronizar os campos de bonificação
    const syncBonificacao = () => {
        const produtoInput = document.getElementById('codProduto');
        const bonificadoInput = document.getElementById('codProdutoBonificado');
        const precoPalm = document.getElementById('precoSistema');
        const valorBonificado = document.getElementById('valorProdutoBonificado');
        const checkbox = document.getElementById('mesmoProduto');

        // Atualizar apenas se o checkbox estiver marcado
        if (checkbox.checked) {
            bonificadoInput.value = produtoInput.value;
            valorBonificado.value = precoPalm.value;
            
            // Aplicar estilo e estado
            [bonificadoInput, valorBonificado].forEach(campo => {
                campo.disabled = true;
                campo.style.opacity = '0.7';
            });
        } else {
            // Resetar campos
            [bonificadoInput, valorBonificado].forEach(campo => {
                campo.value = '';
                campo.disabled = false;
                campo.style.opacity = '1';
            });
        }
    };

    // Event listeners para sincronização
    document.getElementById('mesmoProduto').addEventListener('change', syncBonificacao);
    document.getElementById('codProduto').addEventListener('input', syncBonificacao);
    document.getElementById('precoSistema').addEventListener('input', syncBonificacao);

    // Limpar formulário
    document.getElementById('limpar').addEventListener('click', () => {
        document.getElementById('formAcao').reset();
        syncBonificacao(); // Atualizar campos de bonificação após limpar
    });

    // Registrar o Service Worker para PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker registrado com sucesso!'))
            .catch((error) => console.log('Erro ao registrar Service Worker:', error));
    }
});
