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

    // Função para calcular o resultado
    document.getElementById('formAcao').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Coletar valores do formulário
        const cliente = document.getElementById('codRazaoCliente').value;
        const produto = document.getElementById('codProduto').value;
        const quantidade = parseFloat(document.getElementById('quantidadeAcao').value);
        const precoPalm = parseFloat(document.getElementById('precoSistema').value);
        const produtoBonificado = document.getElementById('codProdutoBonificado').value;
        const quantidadeBonificada = parseFloat(document.getElementById('quantidadeProdutoBonificado').value);
        const valorBonificado = parseFloat(document.getElementById('valorProdutoBonificado').value);

        // Validar campos obrigatórios
        if (!cliente || !produto || !quantidade || !precoPalm || !produtoBonificado || !quantidadeBonificada || !valorBonificado) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }

        // Cálculos
        const valorTotalPedido = quantidade * precoPalm;
        const valorTotalBonificacao = quantidadeBonificada * valorBonificado;
        const diferenca = valorTotalBonificacao - valorTotalPedido;

        // Montar resultado
        const resultado = `
        CLIENTE: ${cliente}
        PRODUTO: ${produto}
        QUANTIDADE: ${quantidade}
        PREÇO UNITÁRIO: R$ ${precoPalm.toFixed(2)}
        VALOR TOTAL PEDIDO: R$ ${valorTotalPedido.toFixed(2)}
        
        BONIFICAÇÃO:
        PRODUTO: ${produtoBonificado}
        QUANTIDADE: ${quantidadeBonificada}
        VALOR UNITÁRIO: R$ ${valorBonificado.toFixed(2)}
        VALOR TOTAL BONIFICAÇÃO: R$ ${valorTotalBonificacao.toFixed(2)}
        
        DIFERENÇA: R$ ${diferenca.toFixed(2)}
        `;

        // Exibir resultado
        const resultadoSection = document.getElementById('resultadoAcaoSection');
        const resultadoDiv = document.getElementById('resultadoAcao');
        const botoesResultado = document.getElementById('botoesResultado');
        
        resultadoDiv.textContent = resultado;
        resultadoSection.style.display = 'block';
        botoesResultado.style.display = 'flex';
    });

    // Botão de copiar resultado
    document.getElementById('copiar').addEventListener('click', () => {
        const resultadoDiv = document.getElementById('resultadoAcao');
        navigator.clipboard.writeText(resultadoDiv.textContent)
            .then(() => alert('Resultado copiado para a área de transferência!'))
            .catch(() => alert('Erro ao copiar o resultado.'));
    });

    // Botão de compartilhar no WhatsApp
    document.getElementById('compartilhar').addEventListener('click', () => {
        const resultadoDiv = document.getElementById('resultadoAcao');
        const texto = encodeURIComponent(resultadoDiv.textContent);
        const url = `https://wa.me/?text=${texto}`;
        window.open(url, '_blank');
    });

    // Registrar o Service Worker para PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker registrado com sucesso!'))
            .catch((error) => console.log('Erro ao registrar Service Worker:', error));
    }
});
