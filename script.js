document.addEventListener('DOMContentLoaded', () => {
    // 1. Controle do Tema
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Restaurar tema salvo
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark', savedTheme === 'dark');
    themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>';

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
        if (confirm('Tem certeza que deseja limpar o formulário?')) {
            document.getElementById('formAcao').reset();
            syncBonificacao();
            document.querySelectorAll('.result-section').forEach(sec => sec.style.display = 'none');
            document.querySelectorAll('.error-message').forEach(erro => erro.remove());
        }
    });

    // 4. Validação em Tempo Real
    const camposObrigatorios = [
        'codRazaoCliente', 'codProduto', 'quantidadeAcao', 
        'precoSistema', 'codProdutoBonificado', 'quantidadeProdutoBonificado', 
        'valorProdutoBonificado'
    ];

    camposObrigatorios.forEach(id => {
        const campo = document.getElementById(id);
        campo.addEventListener('input', () => {
            const erro = campo.nextElementSibling;
            if (!campo.value.trim()) {
                if (!erro || !erro.classList.contains('error-message')) {
                    const erroSpan = document.createElement('span');
                    erroSpan.className = 'error-message';
                    erroSpan.textContent = 'Campo obrigatório!';
                    campo.after(erroSpan);
                }
            } else if (erro && erro.classList.contains('error-message')) {
                erro.remove();
            }
        });
    });

    // 5. Cálculo da Ação (Funcionalidade Principal)
    document.getElementById('formAcao').addEventListener('submit', async (e) => {
        e.preventDefault();

        // Mostrar spinner
        document.getElementById('loading').style.display = 'flex';

        // Validar campos
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
            document.getElementById('loading').style.display = 'none';
            return;
        }

        // Coletar dados
        const formatador = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        const cliente = document.getElementById('codRazaoCliente').value;
        const produto = document.getElementById('codProduto').value;
        const quantidade = parseFloat(document.getElementById('quantidadeAcao').value);
        const precoPalm = parseFloat(document.getElementById('precoSistema').value);
        const produtoBonificado = document.getElementById('codProdutoBonificado').value;
        const quantidadeBonificada = parseFloat(document.getElementById('quantidadeProdutoBonificado').value);
        const valorBonificado = parseFloat(document.getElementById('valorProdutoBonificado').value);

        // Verificar divisão por zero
        if (quantidade + quantidadeBonificada === 0) {
            alert('A soma da quantidade e quantidade bonificada não pode ser zero!');
            document.getElementById('loading').style.display = 'none';
            return;
        }

        // Cálculos ajustados
        const valorPedido = quantidade * precoPalm;
        const precoSolicitado = valorPedido / (quantidade + quantidadeBonificada); // Cálculo corrigido
        const investimento = ((valorBonificado / valorPedido) * 100).toFixed(1);

        // Formatar valores
        const valorPedidoFormatado = formatador.format(valorPedido);
        const precoSolicitadoFormatado = formatador.format(precoSolicitado);
        const valorBonificadoFormatado = formatador.format(valorBonificado);

        // Montar resultado
        const resultadoAcao = `
*Solicitação de ação:*

Código/Produto: ${produto}
Quantidade: ${quantidade}
Valor pedido: ${valorPedidoFormatado}
Preço Sistema: ${formatador.format(precoPalm)}

*Ação*

Código/Produto Bonificado: ${produtoBonificado}
Preço solicitado: ${precoSolicitadoFormatado}
Investimento: ${investimento}%
Quantidade bonificada: ${quantidadeBonificada} Und
Valor Bonificação: ${valorBonificadoFormatado}
Preço Final: ${precoSolicitadoFormatado}

Código/Razão do Cliente: ${cliente}
        `;

        // Exibir resultado
        const resultadoDiv = document.getElementById('resultadoAcao');
        resultadoDiv.textContent = resultadoAcao;

        document.getElementById('resultadoAcaoSection').style.display = 'block';
        document.getElementById('botoesResultado').style.display = 'flex';
        document.getElementById('bonificacaoCampos').style.display = 'block';

        // Esconder spinner
        document.getElementById('loading').style.display = 'none';
    });

    // 6. Geração da Bonificação
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
        const formatador = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        const cliente = document.getElementById('codRazaoCliente').value;
        const consultor = document.getElementById('codConsultor').value;
        const pedido = document.getElementById('codPedido').value;
        const produtoBonificado = document.getElementById('codProdutoBonificado').value;
        const quantidadeBonificada = document.getElementById('quantidadeProdutoBonificado').value;
        const valorBonificado = parseFloat(document.getElementById('valorProdutoBonificado').value);
        const observacao = document.getElementById('observacao').value || '';

        // Montar resultado
        const resultadoBonificacao = `
*Cód cliente/razão:* ${cliente}
*Cód/vendedor:* ${consultor}
*Autorizado por:* Fornecedor
*Cód do pedido:* ${pedido}
*Cód/produto:* ${produtoBonificado}
*Quantidade:* ${quantidadeBonificada}
*Valor Bonificação:* ${formatador.format(valorBonificado)}
*Observação:* ${observacao}
        `;

        // Exibir resultado
        const resultadoDiv = document.getElementById('resultadoBonificacao');
        resultadoDiv.textContent = resultadoBonificacao;

        document.getElementById('resultadoBonificacaoSection').style.display = 'block';
        document.getElementById('botoesBonificacao').style.display = 'flex';
    });

    // 7. Botões de Copiar e Compartilhar
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
