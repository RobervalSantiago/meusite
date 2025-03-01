document.addEventListener('DOMContentLoaded', () => {
    // Controle do Tema
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Restaurar tema
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark', savedTheme === 'dark');
    themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>';

    // Sincronização do Checkbox
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

    // Event listeners para checkbox
    document.getElementById('mesmoProduto').addEventListener('change', syncBonificacao);
    document.getElementById('codProduto').addEventListener('input', syncBonificacao);
    document.getElementById('precoSistema').addEventListener('input', syncBonificacao);

    // Limpar formulário
    document.getElementById('limpar').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar o formulário?')) {
            document.getElementById('formAcao').reset();
            syncBonificacao();
            document.querySelectorAll('.result-section').forEach(sec => sec.style.display = 'none');
            document.querySelectorAll('.error-message').forEach(erro => erro.remove());
        }
    });

    // Validação em tempo real
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

    // Cálculo da Ação
    document.getElementById('formAcao').addEventListener('submit', async (e) => {
        e.preventDefault();
        document.getElementById('loading').style.display = 'flex';

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

        // Cálculos e exibição do resultado...
        // (Mantido igual ao código anterior)
    });

    // Botões de Copiar/Compartilhar
    document.getElementById('copiar').addEventListener('click', () => {
        const texto = document.getElementById('resultadoAcao').textContent;
        navigator.clipboard.writeText(texto).then(() => alert('Copiado!'));
    });

    document.getElementById('compartilhar').addEventListener('click', () => {
        const texto = encodeURIComponent(document.getElementById('resultadoAcao').textContent);
        window.open(`https://wa.me/?text=${texto}`, '_blank');
    });

    // Funcionalidade de Sugestões
    function salvarDados(chave, valor) {
        let dados = JSON.parse(localStorage.getItem(chave)) || [];
        if (!dados.includes(valor)) {
            dados.push(valor);
            localStorage.setItem(chave, JSON.stringify(dados));
        }
    }

    function carregarSugestoes(chave, campoInput) {
        const dados = JSON.parse(localStorage.getItem(chave)) || [];
        const datalist = document.createElement('datalist');
        datalist.id = `${chave}-sugestoes`;
        dados.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            datalist.appendChild(option);
        });
        const datalistAntigo = document.getElementById(`${chave}-sugestoes`);
        if (datalistAntigo) datalistAntigo.remove();
        campoInput.setAttribute('list', `${chave}-sugestoes`);
        campoInput.after(datalist);
    }

    // Salvar dados ao enviar
    document.getElementById('formAcao').addEventListener('submit', () => {
        const campos = ['codRazaoCliente', 'codProduto', 'codProdutoBonificado', 'codConsultor', 'observacao'];
        campos.forEach(id => {
            const valor = document.getElementById(id).value;
            if (valor) salvarDados(id, valor);
        });
    });

    // Carregar sugestões ao focar
    ['codRazaoCliente', 'codProduto', 'codProdutoBonificado', 'codConsultor', 'observacao'].forEach(id => {
        document.getElementById(id).addEventListener('focus', () => {
            carregarSugestoes(id, document.getElementById(id));
        });
    });
});
