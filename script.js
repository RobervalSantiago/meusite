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
    const precoSolicitadoContainer = document.getElementById('precoSolicitadoContainer');

    acaoDiretaCheckbox.addEventListener('change', () => {
        if (acaoDiretaCheckbox.checked) {
            bonificacaoSection.style.display = 'none';
            precoSolicitadoContainer.style.display = 'block';
        } else {
            bonificacaoSection.style.display = 'block';
            precoSolicitadoContainer.style.display = 'none';
        }
    });

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

        // Validação do campo "Preço Solicitado" se o checkbox estiver marcado
        if (acaoDiretaCheckbox.checked) {
            const precoSolicitado = document.getElementById('precoSolicitado');
            if (!precoSolicitado.value.trim()) {
                camposVazios = true;
                precoSolicitado.style.borderColor = '#ff0000';
            } else {
                precoSolicitado.style.borderColor = '';
            }
        }

        if (camposVazios) {
            alert('Preencha todos os campos obrigatórios!');
            document.getElementById('loading').style.display = 'none';
            return;
        }

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
        const valorProdutoBonificado = parseFloat(document.getElementById('valorProdutoBonificado').value);

        if (quantidade + quantidadeBonificada === 0) {
            alert('A soma da quantidade e quantidade bonificada não pode ser zero!');
            document.getElementById('loading').style.display = 'none';
            return;
        }

        const valorPedido = quantidade * precoPalm;
        const valorBonificacao = valorProdutoBonificado * quantidadeBonificada;
        const precoSolicitado = valorPedido / (quantidade + quantidadeBonificada);
        const investimento = ((valorBonificacao / valorPedido) * 100).toFixed(1);

        const valorPedidoFormatado = formatador.format(valorPedido);
        const precoSolicitadoFormatado = formatador.format(precoSolicitado);
        const valorBonificacaoFormatado = formatador.format(valorBonificacao);

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
Valor Bonificação: ${valorBonificacaoFormatado}
Preço Final: ${precoSolicitadoFormatado}

Código/Razão do Cliente: ${cliente}
        `;

        const resultadoDiv = document.getElementById('resultadoAcao');
        resultadoDiv.textContent = resultadoAcao;

        document.getElementById('resultadoAcaoSection').style.display = 'block';
        document.getElementById('botoesResultado').style.display = 'flex';
        document.getElementById('bonificacaoCampos').style.display = 'block';

        document.getElementById('loading').style.display = 'none';
    });

    document.getElementById('gerarBonificacao').addEventListener('click', () => {
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

        const formatador = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        const cliente = document.getElementById('codRazaoCliente').value;
        const consultor = document.getElementById('codConsultor').value;
        const pedido = document.getElementById('codPedido').value;
        const produtoBonificado = document.getElementById('codProdutoBonificado').value;
        const quantidadeBonificada = document.getElementById('quantidadeProdutoBonificado').value;
        const valorProdutoBonificado = parseFloat(document.getElementById('valorProdutoBonificado').value);
        const valorBonificacao = valorProdutoBonificado * quantidadeBonificada;
        const observacao = document.getElementById('observacao').value || '';

        const resultadoBonificacao = `
*Cód cliente/razão:* ${cliente}
*Cód/vendedor:* ${consultor}
*Autorizado por:* Fornecedor
*Cód do pedido:* ${pedido}
*Cód/produto:* ${produtoBonificado}
*Quantidade:* ${quantidadeBonificada}
*Valor Bonificação:* ${formatador.format(valorBonificacao)}
*Observação:* ${observacao}
        `;

        const resultadoDiv = document.getElementById('resultadoBonificacao');
        resultadoDiv.textContent = resultadoBonificacao;

        document.getElementById('resultadoBonificacaoSection').style.display = 'block';
        document.getElementById('botoesBonificacao').style.display = 'flex';
    });

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
