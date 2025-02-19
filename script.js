document.getElementById('coletaForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    // Coleta dos dados do formulário
    const formData = {
        razaoSocial: document.getElementById('razaoSocial').value,
        codigoCliente: document.getElementById('codigoCliente').value,
        codigoPedido: document.getElementById('codigoPedido').value,
        codigoProduto: document.getElementById('codigoProduto').value,
        produto: document.getElementById('produto').value,
        quantidade: document.getElementById('quantidade').value,
        valorBonificacao: document.getElementById('valorBonificacao').value,
    };

    // Validação básica (exemplo: campos não podem estar vazios)
    if (
        !formData.razaoSocial ||
        !formData.codigoCliente ||
        !formData.codigoPedido ||
        !formData.codigoProduto ||
        !formData.produto ||
        !formData.quantidade ||
        !formData.valorBonificacao
    ) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Formatar a mensagem
    const mensagem = `Bonificação\n\n` +
        `Razão: ${formData.razaoSocial}\n` +
        `Cod do Cliente: ${formData.codigoCliente}\n` +
        `Consultor: Roberval Santiago\n` +
        `Cod do Consultor: 1453647\n` +
        `Cód do pedido: ${formData.codigoPedido}\n` +
        `Produto: ${formData.produto}\n` +
        `Cod do Produto: ${formData.codigoProduto}\n` +
        `Quantidade: ${formData.quantidade} Unidades\n` +
        `Valor da bonificação: R$ ${parseFloat(formData.valorBonificacao).toFixed(2)}`;

    // Codificar a mensagem para uso na URL
    const mensagemCodificada = encodeURIComponent(mensagem);

    // Redirecionar para o WhatsApp
    const linkWhatsApp = `https://wa.me/5588992848215?text=${mensagemCodificada}`;
    window.open(linkWhatsApp, '_blank');
});