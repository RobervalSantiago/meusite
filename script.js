document.getElementById('formAcao').addEventListener('submit', function (e) {
    e.preventDefault();
    mostrarLoading(true);

    if (!validarCampos()) {
        mostrarLoading(false);
        return;
    }

    const dados = coletarDadosFormulario();
    const resultado = calcularResultado(dados);
    exibirResultado(resultado);

    mostrarLoading(false);
    document.getElementById('bonificacaoCampos').style.display = 'block';
});

document.getElementById('gerarBonificacao').addEventListener('click', function () {
    const codPedido = document.getElementById('codPedido').value.trim();

    // Validação do campo obrigatório
    if (codPedido === "") {
        document.getElementById('codPedidoHelp').textContent = "Este campo é obrigatório.";
        return;
    } else {
        document.getElementById('codPedidoHelp').textContent = "";
    }

    // Coletar dados e gerar bonificação
    const dados = coletarDadosBonificacao();
    const
