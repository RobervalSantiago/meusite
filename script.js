document.getElementById('formAcao').addEventListener('submit', function (e) {
    e.preventDefault();

    // Coletar dados do formulário
    const dados = {
        razao: document.getElementById('razaoAcao').value.trim(),
        codCliente: document.getElementById('codClienteAcao').value.trim(),
        produto: document.getElementById('produtoAcao').value.trim(),
        codProduto: document.getElementById('codProdutoAcao').value.trim(),
        quantidade: parseFloat(document.getElementById('quantidadeAcao').value) || 0,
        precoSistema: parseFloat(document.getElementById('precoSistema').value) || 0,
        precoSolicitado: parseFloat(document.getElementById('precoSolicitado').value) || 0,
        produtoBonificado: document.getElementById('produtoBonificado').value.trim(),
        codigoBonificado: document.getElementById('codigoBonificado').value.trim(),
        supervisor: document.getElementById('supervisor').value.trim()
    };

    // Validar se os campos obrigatórios foram preenchidos
    let isValid = true;
    const fields = [
        { id: 'razaoAcao', value: dados.razao, help: 'razaoAcaoHelp' },
        { id: 'codClienteAcao', value: dados.codCliente, help: 'codClienteAcaoHelp', pattern: /^\d+$/ },
        { id: 'produtoAcao', value: dados.produto, help: 'produtoAcaoHelp' },
        { id: 'codProdutoAcao', value: dados.codProduto, help: 'codProdutoAcaoHelp', pattern: /^\d+$/ },
        { id: 'quantidadeAcao', value: dados.quantidade, help: 'quantidadeAcaoHelp', min: 1 },
        { id: 'precoSistema', value: dados.precoSistema, help: 'precoSistemaHelp', min: 0 },
        { id: 'precoSolicitado', value: dados.precoSolicitado, help: 'precoSolicitadoHelp', min: 0 },
        { id: 'produtoBonificado', value: dados.produtoBonificado, help: 'produtoBonificadoHelp' },
        { id: 'codigoBonificado', value: dados.codigoBonificado, help: 'codigoBonificadoHelp', pattern: /^\d+$/ },
        { id: 'supervisor', value: dados.supervisor, help: 'supervisorHelp' }
    ];

    fields.forEach(field => {
        const inputElement = document.getElementById(field.id);
        const errorMessage = document.getElementById(field.help);
        if (field.value === "" || field.value === 0) {
            errorMessage.textContent = "Este campo é obrigatório.";
            inputElement.setAttribute('aria-invalid', 'true');
            isValid = false;
        } else if (field.pattern && !field.pattern.test(field.value)) {
            errorMessage.textContent = "Valor inválido.";
            inputElement.setAttribute('aria-invalid', 'true');
            isValid = false;
        } else if (field.min !== undefined && field.value < field.min) {
            errorMessage.textContent = `O valor deve ser maior ou igual a ${field.min}.`;
            inputElement.setAttribute('aria-invalid', 'true');
            isValid = false;
        } else {
            errorMessage.textContent = "";
            inputElement.setAttribute('aria-invalid', 'false');
        }
    });

    // Verificar se o preço solicitado é menor que o preço do sistema
    if (dados.precoSolicitado >= dados.precoSistema) {
        document.getElementById('precoSolicitadoHelp').textContent = "O preço solicitado deve ser menor que o preço do sistema.";
        document.getElementById('precoSolicitado').setAttribute('aria-invalid', 'true');
        isValid = false;
    }

    if (!isValid) return;

    // Cálculos necessários
    const valorPedido = dados.quantidade * dados.precoSistema;
    const investimentoPercentual = ((dados.precoSistema - dados.precoSolicitado) / dados.precoSistema) * 100;
    const qtdBonificada = Math.round((valorPedido * (investimentoPercentual / 100)) / dados.precoSistema);
    const valorBonificacao = (qtdBonificada * dados.precoSistema).toFixed(2);

    // Formatar resultado no modelo solicitado
    const resultado = `*Solicitação de ação:*\n\n` +
        `Nome do Produto: ${dados.produto}\n` +
        `Código do Produto: ${dados.codProduto}\n` +
        `Quantidade do Produto: ${dados.quantidade}\n` +
        `Preço do Palm: R$ ${dados.precoSistema.toFixed(2)}\n\n` +
        `*Ação*\n\n` +
        `Preço solicitado: R$ ${dados.precoSolicitado.toFixed(2)}\n` +
        `Investimento: ${investimentoPercentual.toFixed(0)} %\n` +
        `Quantidade bonificada: ${
