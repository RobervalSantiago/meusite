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

    // Função para calcular a ação (FORMATO SOLICITADO)
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

        // Validar campos
        if (!cliente || !produto || !quantidade || !precoPalm || !produtoBonificado || !quantidadeBonificada || !valorBonificado) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }

        // Cálculos da ação
        const valorTotalPedido = quantidade * precoPalm;
        const investimento = ((precoPalm - valorBonificado) / precoPalm) * 100;
        const precoFinal = valorBonificado;

        // Montar resultado da ação no formato solicitado
        const resultadoAcao = `
        *Solicitação de ação:*

        Código/Produto: ${produto}
        Quantidade: ${quantidade}
        Valor pedido: R$ ${valorTotalPedido.toFixed(2).replace('.', ',')}
        Preço Sistema: R$ ${precoPalm.toFixed(2).replace('.', ',')}

        *Ação*

        Código/Produto Bonificado: ${produtoBonificado}
        Preço solicitado: R$ ${precoFinal.toFixed(2).replace('.', ',')}
        Investimento: ${investimento.toFixed(1)}%
        Quantidade bonificada: ${quantidadeBonificada} Und
        Valor Bonificação: R$ ${valorBonificado.toFixed(2).replace('.', ',')}
        Preço Final: R$ ${precoFinal.toFixed(2).replace('.', ',')}

        Código/Razão do Cliente: ${cliente}
        `;

        // Exibir resultado
        document.getElementById('resultadoAcao').innerHTML = resultadoAcao
            .replace(/\n/g, '<br>')  // Quebras de linha
            .replace(/\*/g, '<b>').replace(/\*/g, '</b>');  // Negrito para asteriscos

        // Exibir seção de resultado
        document.getElementById('resultadoAcaoSection').style.display = 'block';
        document.getElementById('botoesResultado').style.display = 'flex';

        // Exibir campos da bonificação (pedido e consultor)
        document.getElementById('bonificacaoCampos').style.display = 'block';
    });

    // Função para gerar a bonificação (FORMATO SOLICITADO)
    document.getElementById('gerarBonificacao').addEventListener('click', () => {
        // Coletar dados extras
        const consultor = document.getElementById('codConsultor').value;
        const pedido = document.getElementById('codPedido').value;
        const observacao = document.getElementById('observacao').value;
        const produtoBonificado = document.getElementById('codProdutoBonificado').value;
        const quantidadeBonificada = parseFloat(document.getElementById('quantidadeProdutoBonificado').value);
        const valorBonificado = parseFloat(document.getElementById('valorProdutoBonificado').value);

        // Validar campos
        if (!consultor || !pedido || !produtoBonificado || !quantidadeBonificada || !valorBonificado) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }

        // Montar resultado da bonificação no formato solicitado
        const resultadoBonificacao = `
        *Cód cliente/razão:* ${document.getElementById('codRazaoCliente').value}
        *Cód/vendedor:* ${consultor}
        *Autorizado por:* Fornecedor
        *Cód do pedido:* ${pedido}
        *Cód/produto:* ${produtoBonificado}
        *Quantidade:* ${quantidadeBonificada}
        *Valor Bonificação:* R$ ${valorBonificado.toFixed(2).replace('.', ',')}
        *Observação:* ${observacao || ''}
        `;

        // Exibir resultado
        document.getElementById('resultadoBonificacao').innerHTML = resultadoBonificacao
            .replace(/\n/g, '<br>')  // Quebras de linha
            .replace(/\*/g, '<b>').replace(/\*/g, '</b>');  // Negrito para asteriscos

        // Exibir seção de resultado
        document.getElementById('resultadoBonificacaoSection').style.display = 'block';
        document.getElementById('botoesBonificacao').style.display = 'flex';
    });

    // Botão de copiar resultado da ação
    document.getElementById('copiar').addEventListener('click', () => {
        const resultadoDiv = document.getElementById('resultadoAcao');
        navigator.clipboard.writeText(resultadoDiv.textContent)
            .then(() => alert('Resultado copiado para a área de transferência!'))
            .catch(() => alert('Erro ao copiar o resultado.'));
    });

    // Botão de compartilhar no WhatsApp (resultado da ação)
    document.getElementById('compartilhar').addEventListener('click', () => {
        const resultadoDiv = document.getElementById('resultadoAcao');
        const texto = encodeURIComponent(resultadoDiv.textContent);
        const url = `https://wa.me/?text=${texto}`;
        window.open(url, '_blank');
    });

    // Botão de copiar resultado da bonificação
    document.getElementById('copiarBonificacao').addEventListener('click', () => {
        const resultadoDiv = document.getElementById('resultadoBonificacao');
        navigator.clipboard.writeText(resultadoDiv.textContent)
            .then(() => alert('Resultado copiado para a área de transferência!'))
            .catch(() => alert('Erro ao copiar o resultado.'));
    });

    // Botão de compartilhar no WhatsApp (resultado da bonificação)
    document.getElementById('compartilharBonificacao').addEventListener('click', () => {
        const resultadoDiv = document.getElementById('resultadoBonificacao');
        const texto = encodeURIComponent(resultadoDiv.textContent);
        const url = `https://wa.me/?text=${texto}`;
        window.open(url, '_blank');
    });
});
