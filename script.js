document.addEventListener('DOMContentLoaded', () => {
    // 1. Controle do Tema
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

    // 2. Sincronização do Checkbox
    const syncBonificacao = () => {
        const produtoInput = document.getElementById('codProduto');
        const bonificadoInput = document.getElementById('codProdutoBonificado');
        const precoPalm = document.getElementById('precoSistema');
        const valorBonificado = document.getElementById('valorProdutoBonificado');
        const checkbox = document.getElementById('mesmoProduto');

        if (checkbox.checked) {
            bonificadoInput.value = produtoInput.value;
            valorBonificado.value = precoPalm.value;
            [bonificadoInput, valorBonificado].forEach(campo => {
                campo.disabled = true;
                campo.style.opacity = '0.7';
            });
        } else {
            [bonificadoInput, valorBonificado].forEach(campo => {
                campo.value = '';
                campo.disabled = false;
                campo.style.opacity = '1';
            });
        }
    };

    // Event listeners para o checkbox
    document.getElementById('mesmoProduto').addEventListener('change', syncBonificacao);
    document.getElementById('codProduto').addEventListener('input', syncBonificacao);
    document.getElementById('precoSistema').addEventListener('input', syncBonificacao);

    // 3. Limpar Formulário
    document.getElementById('limpar').addEventListener('click', () => {
        document.getElementById('formAcao').reset();
        syncBonificacao();
        document.querySelectorAll('.result-section').forEach(sec => sec.style.display = 'none');
    });

    // 4. Cálculo da Ação (Funcionalidade Principal)
    document.getElementById('formAcao').addEventListener('submit', (e) => {
        e.preventDefault();

        // Validar campos
        const camposObrigatorios = [
            'codRazaoCliente', 'codProduto', 'quantidadeAcao', 
            'precoSistema', 'codProdutoBonificado', 'quantidadeProdutoBonificado', 
            'valorProdutoBonificado'
        ];

        let camposVazios = false;
        camposObrigatorios.forEach(id => {
            const campo = document.getElementById(id);
            if (!campo.value.trim()) {
                camposVazios = true;
                campo.style.borderColor = '#ff0000';
            } else {
                campo.style.borderColor = '';
            }
        });

        if (camposVazios) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }

        // Coletar dados
        const cliente = document.getElementById('codRazaoCliente').value;
        const produto = document.getElementById('codProduto').value;
        const quantidade = parseFloat(document.getElementById('quantidadeAcao').value);
        const precoPalm = parseFloat(document.getElementById('precoSistema').value);
        const produtoBonificado = document.getElementById('codProdutoBonificado').value;
        const quantidadeBonificada = parseFloat(document.getElementById('quantidadeProdutoBonificado').value);
        const valorBonificado = parseFloat(document.getElementById('valorProdutoBonificado').value);

        // Cálculos
        const valorPedido = (quantidade * precoPalm).toFixed(2).replace('.', ',');
        const investimento = (((precoPalm - valorBonificado) / precoPalm) * 100).toFixed(1);
        const precoFinal = valorBonificado.toFixed(2).replace('.', ',');

        // Montar resultado
        const resultadoAcao = `
*Solicitação de ação:*

Código/Produto: ${produto}
Quantidade: ${quantidade}
Valor pedido: R$ ${valorPedido}
Preço Sistema: R$ ${precoPalm.toFixed(2).replace('.', ',')}

*Ação*

Código/Produto Bonificado: ${produtoBonificado}
Preço solicitado: R$ ${precoFinal}
Investimento: ${investimento}%
Quantidade bonificada: ${quantidadeBonificada} Und
Valor Bonificação: R$ ${valorBonificado.toFixed(2).replace('.', ',')}
Preço Final: R$ ${precoFinal}

Código/Razão do Cliente: ${cliente}
        `;

        // Exibir resultado
        const resultadoDiv = document.getElementById('resultadoAcao');
        resultadoDiv.innerHTML = resultadoAcao
            .replace(/\n/g, '<br>')
            .replace(/\*(.*?)\*/g, '<b>$1</b>');

        document.getElementById('resultadoAcaoSection').style.display = 'block';
        document.getElementById('botoesResultado').style.display = 'flex';
        document.getElementById('bonificacaoCampos').style.display = 'block';
    });

    // 5. Geração da Bonificação
    document.getElementById('gerarBonificacao').addEventListener('click', () => {
        // Validar campos
        const camposObrigatorios = ['codConsultor', 'codPedido'];
        let camposVazios = false;

        camposObrigatorios.forEach(id => {
            const campo = document.getElementById(id);
            if (!campo.value.trim()) {
                camposVazios = true;
                campo.style.borderColor = '#ff0000';
            } else {
                campo.style.borderColor = '';
            }
        });

        if (camposVazios) {
            alert('Preencha o código do consultor e do pedido!');
            return;
        }

        // Coletar dados
        const cliente = document.getElementById('codRazaoCliente').value;
        const consultor = document.getElementById('codConsultor').value;
        const pedido = document.getElementById('codPedido').value;
        const produtoBonificado = document.getElementById('codProdutoBonificado').value;
        const quantidadeBonificada = document.getElementById('quantidadeProdutoBonificado').value;
        const valorBonificado = parseFloat(document.getElementById('valorProdutoBonificado').value).toFixed(2).replace('.', ',');
        const observacao = document.getElementById('observacao').value || '';

        // Montar resultado
        const resultadoBonificacao = `
*Cód cliente/razão:* ${cliente}
*Cód/vendedor:* ${consultor}
*Autorizado por:* Fornecedor
*Cód do pedido:* ${pedido}
*Cód/produto:* ${produtoBonificado}
*Quantidade:* ${quantidadeBonificada}
*Valor Bonificação:* R$ ${valorBonificado}
*Observação:* ${observacao}
        `;

        // Exibir resultado
        const resultadoDiv = document.getElementById('resultadoBonificacao');
        resultadoDiv.innerHTML = resultadoBonificacao
            .replace(/\n/g, '<br>')
            .replace(/\*(.*?)\*/g, '<b>$1</b>');

        document.getElementById('resultadoBonificacaoSection').style.display = 'block';
        document.getElementById('botoesBonificacao').style.display = 'flex';
    });

    // 6. Botões de Copiar e Compartilhar
    document.getElementById('copiar').addEventListener('click', () => {
        const texto = document.getElementById('resultadoAcao').textContent;
        navigator.clipboard.writeText(texto).then(() => alert('Copiado!'));
    });

    document.getElementById('compartilhar').addEventListener('click', () => {
        const texto = encodeURIComponent(document.getElementById('resultadoAcao').textContent);
        window.open(`https://wa.me/?text=${texto}`, '_blank');
    });

    document.getElementById('copiarBonificacao').addEventListener('click', () => {
        const texto = document.getElementById('resultadoBonificacao').textContent;
        navigator.clipboard.writeText(texto).then(() => alert('Copiado!'));
    });

    document.getElementById('compartilharBonificacao').addEventListener('click', () => {
        const texto = encodeURIComponent(document.getElementById('resultadoBonificacao').textContent);
        window.open(`https://wa.me/?text=${texto}`, '_blank');
    });
});
