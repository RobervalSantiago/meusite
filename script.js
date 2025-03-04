document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark', savedTheme === 'dark');
    themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>';

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

    document.getElementById('mesmoProduto').addEventListener('change', syncBonificacao);
    document.getElementById('codProduto').addEventListener('input', syncBonificacao);
    document.getElementById('precoSistema').addEventListener('input', syncBonificacao);

    document.getElementById('limpar').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar o formulário?')) {
            document.getElementById('formAcao').reset();
            syncBonificacao();
            document.querySelectorAll('.result-section').forEach(sec => sec.style.display = 'none');
            document.querySelectorAll('.error-message').forEach(erro => erro.remove());
        }
    });

    const camposObrigatorios = ['codRazaoCliente', 'codProduto', 'quantidadeAcao', 'precoSistema', 'codProdutoBonificado', 'quantidadeProdutoBonificado', 'valorProdutoBonificado'];
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

    // Lógica para o checkbox "Ação Direta no Preço"
    const acaoDiretaCheckbox = document.getElementById('acaoDireta');
    const bonificacaoSection = document.getElementById('bonificacaoCampos');
    const detalhesBonificacaoSection = document.getElementById('detalhesBonificacaoCampos');
    const precoSolicitadoContainer = document.getElementById('precoSolicitadoContainer');

    acaoDiretaCheckbox.addEventListener('change', () => {
        if (acaoDiretaCheckbox.checked) {
            bonificacaoSection.style.display = 'none'; // Oculta a seção de Bonificação
            detalhesBonificacaoSection.style.display = 'none'; // Oculta a seção de Detalhes da Bonificação
            precoSolicitadoContainer.style.display = 'block'; // Mostra o campo de Preço Solicitado
        } else {
            bonificacaoSection.style.display = 'block'; // Mostra a seção de Bonificação
            detalhesBonificacaoSection.style.display = 'block'; // Mostra a seção de Detalhes da Bonificação
            precoSolicitadoContainer.style.display = 'none'; // Oculta o campo de Preço Solicitado
        }
    });

    // Verifica o estado do checkbox ao carregar a página
    if (acaoDiretaCheckbox.checked) {
        bonificacaoSection.style.display = 'none';
        detalhesBonificacaoSection.style.display = 'none';
        precoSolicitadoContainer.style.display = 'block';
    } else {
        bonificacaoSection.style.display = 'block';
        detalhesBonificacaoSection.style.display = 'block';
        precoSolicitadoContainer.style.display = 'none';
    }

    // Restante do código...
});
