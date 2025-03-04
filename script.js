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

    // Lógica para o checkbox "Ação Direta no Preço"
    const acaoDiretaCheckbox = document.getElementById('acaoDireta');
    const bonificacaoSection = document.getElementById('bonificacaoCampos');
    const detalhesBonificacaoSection = document.getElementById('detalhesBonificacaoCampos');
    const precoSolicitadoContainer = document.getElementById('precoSolicitadoContainer');
    const acaoDiretaSection = document.getElementById('acaoDiretaSection');
    const resultadoAcaoSection = document.getElementById('resultadoAcaoSection');

    acaoDiretaCheckbox.addEventListener('change', () => {
        if (acaoDiretaCheckbox.checked) {
            bonificacaoSection.style.display = 'none';
            detalhesBonificacaoSection.style.display = 'none';
            precoSolicitadoContainer.style.display = 'block';
            resultadoAcaoSection.style.display = 'none';
            acaoDiretaSection.style.display = 'none'; // Resetar visibilidade
        } else {
            bonificacaoSection.style.display = 'block';
            detalhesBonificacaoSection.style.display = 'block';
            precoSolicitadoContainer.style.display = 'none';
            acaoDiretaSection.style.display = 'none';
            resultadoAcaoSection.style.display = 'none'; // Resetar visibilidade
        }
    });

    document.getElementById('formAcao').addEventListener('submit', async (e) => {
        e.preventDefault();
        document.getElementById('loading').style.display = 'flex';

        // Validação DINÂMICA dos campos
        let camposObrigatorios = ['codRazaoCliente', 'codProduto', 'quantidadeAcao', 'precoSistema'];
        if (acaoDiretaCheckbox.checked) {
            camposObrigatorios.push('precoSolicitado');
        } else {
            camposObrigatorios.push('codProdutoBonificado', 'quantidadeProdutoBonificado', 'valorProdutoBonificado');
        }

        let camposVazios = false;
        camposObrigatorios.forEach(id => {
            const campo = document.getElementById(id);
            if (!campo.value.trim()) {
                camposVazios = true;
                campo.style.borderColor = '#ff0000';
                if (!campo.nextElementSibling || !campo.nextElementSibling.classList.contains('error-message')) {
                    const erroSpan = document.createElement('span');
                    erroSpan.className = 'error-message';
                    erroSpan.textContent = 'Campo obrigatório!';
                    campo.after(erroSpan);
                }
            } else {
                campo.style.borderColor = '';
                if (campo.nextElementSibling && campo.nextElementSibling.classList.contains('error-message')) {
                    campo.nextElementSibling.remove();
                }
            }
        });

        if (camposVazios) {
            alert('Preencha todos os campos obrigatórios!');
            document.getElementById('loading').style.display = 'none';
            return;
        }

        // Cálculos e exibição do resultado
        const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
        const cliente = document.getElementById('codRazaoCliente').value;
        const produto = document.getElementById('codProduto').value;
        const quantidade = parseFloat(document.getElementById('quantidadeAcao').value);
        const precoPalm = parseFloat(document.getElementById('precoSistema').value);

        if (acaoDiretaCheckbox.checked) {
            const precoSolicitado = parseFloat(document.getElementById('precoSolicitado').value);
            const valorPedido = quantidade * precoPalm;
            const valorComDesconto = quantidade * precoSolicitado;
            const investimento = (((precoPalm - precoSolicitado) / precoPalm) * 100).toFixed(1);
            const valorDesconto = valorPedido - valorComDesconto;

            const resultado = `
*Solicitação de ação:*

Código/Produto: ${produto}
Quantidade: ${quantidade}
Valor pedido: ${formatador.format(valorPedido)}
Preço Sistema: ${formatador.format(precoPalm)}

*Ação Direto no Preço:*

Código/Produto: ${produto}
Preço solicitado: ${formatador.format(precoSolicitado)}
Investimento: ${investimento}%
Valor do desconto: ${formatador.format(valorDesconto)}

Código/Razão do Cliente: ${cliente}
            `;

            document.getElementById('resultadoAcaoDireta').textContent = resultado;
            document.getElementById('acaoDiretaSection').style.display = 'block'; // Exibir a seção correta
            document.getElementById('botoesAcaoDireta').style.display = 'flex';

        } else {
            const produtoBonificado = document.getElementById('codProdutoBonificado').value;
            const quantidadeBonificada = parseFloat(document.getElementById('quantidadeProdutoBonificado').value);
            const valorProdutoBonificado = parseFloat(document.getElementById('valorProdutoBonificado').value);
            const valorPedido = quantidade * precoPalm;
            const valorBonificacao = valorProdutoBonificado * quantidadeBonificada;
            const precoSolicitado = valorPedido / (quantidade + quantidadeBonificada);
            const investimento = ((valorBonificacao / valorPedido) * 100).toFixed(1);

            const resultado = `
*Solicitação de ação:*

Código/Produto: ${produto}
Quantidade: ${quantidade}
Valor pedido: ${formatador.format(valorPedido)}
Preço Sistema: ${formatador.format(precoPalm)}

*Ação*

Código/Produto Bonificado: ${produtoBonificado}
Preço solicitado: ${formatador.format(precoSolicitado)}
Investimento: ${investimento}%
Quantidade bonificada: ${quantidadeBonificada} Und
Valor Bonificação: ${formatador.format(valorBonificacao)}
Preço Final: ${formatador.format(precoSolicitado)}

Código/Razão do Cliente: ${cliente}
            `;

            document.getElementById('resultadoAcao').textContent = resultado;
            document.getElementById('resultadoAcaoSection').style.display = 'block'; // Exibir a seção correta
            document.getElementById('botoesResultado').style.display = 'flex';
        }

        document.getElementById('loading').style.display = 'none';
    });

    // Botões de copiar e compartilhar
    document.getElementById('copiar').addEventListener('click', () => {
        const texto = document.getElementById('resultadoAcao').textContent;
        navigator.clipboard.writeText(texto).then(() => alert('Copiado!'));
    });

    document.getElementById('compartilhar').addEventListener('click', () => {
        const texto = encodeURIComponent(document.getElementById('resultadoAcao').textContent);
        window.open(`https://wa.me/?text=${texto}`, '_blank');
    });

    document.getElementById('copiarAcaoDireta').addEventListener('click', () => {
        const texto = document.getElementById('resultadoAcaoDireta').textContent;
        navigator.clipboard.writeText(texto).then(() => alert('Copiado!'));
    });

    document.getElementById('compartilharAcaoDireta').addEventListener('click', () => {
        const texto = encodeURIComponent(document.getElementById('resultadoAcaoDireta').textContent);
        window.open(`https://wa.me/?text=${texto}`, '_blank');
    });

    // Botões de alternar visibilidade
    document.getElementById('toggleResultadoAcao').addEventListener('click', () => {
        const resultadoDiv = document.getElementById('resultadoAcao');
        const botoesResultado = document.getElementById('botoesResultado');
        const toggleBtn = document.getElementById('toggleResultadoAcao');
        if (resultadoDiv.style.display === 'none') {
            resultadoDiv.style.display = 'block';
            botoesResultado.style.display = 'flex';
            toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar Resultado';
        } else {
            resultadoDiv.style.display = 'none';
            botoesResultado.style.display = 'none';
            toggleBtn.innerHTML = '<i class="fas fa-eye"></i> Mostrar Resultado';
        }
    });

    document.getElementById('toggleAcaoDireta').addEventListener('click', () => {
        const resultadoDiv = document.getElementById('resultadoAcaoDireta');
        const botoesAcaoDireta = document.getElementById('botoesAcaoDireta');
        const toggleBtn = document.getElementById('toggleAcaoDireta');
        if (resultadoDiv.style.display === 'none') {
            resultadoDiv.style.display = 'block';
            botoesAcaoDireta.style.display = 'flex';
            toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar Resultado';
        } else {
            resultadoDiv.style.display = 'none';
            botoesAcaoDireta.style.display = 'none';
            toggleBtn.innerHTML = '<i class="fas fa-eye"></i> Mostrar Resultado';
        }
    });

    document.getElementById('toggleResultadoBonificacao').addEventListener('click', () => {
        const resultadoDiv = document.getElementById('resultadoBonificacao');
        const botoesBonificacao = document.getElementById('botoesBonificacao');
        const toggleBtn = document.getElementById('toggleResultadoBonificacao');
        if (resultadoDiv.style.display === 'none') {
            resultadoDiv.style.display = 'block';
            botoesBonificacao.style.display = 'flex';
            toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar Resultado';
        } else {
            resultadoDiv.style.display = 'none';
            botoesBonificacao.style.display = 'none';
            toggleBtn.innerHTML = '<i class="fas fa-eye"></i> Mostrar Resultado';
        }
    });

    // Sugestões de dados
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

    document.getElementById('formAcao').addEventListener('submit', () => {
        const campos = ['codRazaoCliente', 'codProduto', 'codProdutoBonificado', 'codConsultor', 'observacao'];
        campos.forEach(id => {
            const valor = document.getElementById(id).value;
            if (valor) salvarDados(id, valor);
        });
    });

    ['codRazaoCliente', 'codProduto', 'codProdutoBonificado', 'codConsultor', 'observacao'].forEach(id => {
        document.getElementById(id).addEventListener('focus', () => {
            carregarSugestoes(id, document.getElementById(id));
        });
    });
});
