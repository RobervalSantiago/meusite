// Função para salvar dados no localStorage
function salvarDadosLocalStorage(chave, valor) {
    let dados = JSON.parse(localStorage.getItem(chave)) || [];
    if (!dados.includes(valor)) {
        dados.push(valor);
        localStorage.setItem(chave, JSON.stringify(dados));
    }
}

// Função para carregar sugestões do localStorage
function carregarSugestoes(chave, sugestoesId, valorDigitado) {
    let dados = JSON.parse(localStorage.getItem(chave)) || [];
    let sugestoesDiv = document.getElementById(sugestoesId);
    sugestoesDiv.innerHTML = ""; // Limpa as sugestões anteriores

    // Filtra as sugestões com base no valor digitado
    let sugestoesFiltradas = dados.filter(item => item.toLowerCase().includes(valorDigitado.toLowerCase()));

    if (sugestoesFiltradas.length > 0 && valorDigitado.length > 0) {
        sugestoesDiv.style.display = "block"; // Mostra as sugestões
        sugestoesFiltradas.forEach(item => {
            let div = document.createElement("div");
            div.textContent = item;
            div.classList.add("sugestao-item");
            div.addEventListener("click", function () {
                document.getElementById(chave).value = item; // Preenche o campo com a sugestão
                sugestoesDiv.style.display = "none"; // Oculta as sugestões
            });
            sugestoesDiv.appendChild(div);
        });
    } else {
        sugestoesDiv.style.display = "none"; // Oculta as sugestões se não houver correspondências
    }
}

// Carregar sugestões ao carregar a página
window.addEventListener("load", function () {
    // Inicialmente, as sugestões estão ocultas
    document.getElementById("sugestoesCliente").style.display = "none";
    document.getElementById("sugestoesProduto").style.display = "none";
    document.getElementById("sugestoesBonificado").style.display = "none";
});

// Salvar dados ao preencher os campos
document.getElementById("codRazaoCliente").addEventListener("input", function () {
    carregarSugestoes("codRazaoCliente", "sugestoesCliente", this.value);
});

document.getElementById("codProduto").addEventListener("input", function () {
    carregarSugestoes("codProduto", "sugestoesProduto", this.value);
});

document.getElementById("codProdutoBonificado").addEventListener("input", function () {
    carregarSugestoes("codProdutoBonificado", "sugestoesBonificado", this.value);
});

// Salvar dados ao sair do campo
document.getElementById("codRazaoCliente").addEventListener("change", function () {
    salvarDadosLocalStorage("codRazaoCliente", this.value);
});

document.getElementById("codProduto").addEventListener("change", function () {
    salvarDadosLocalStorage("codProduto", this.value);
});

document.getElementById("codProdutoBonificado").addEventListener("change", function () {
    salvarDadosLocalStorage("codProdutoBonificado", this.value);
});

// Restante do código (funções existentes)
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

    // Mostra os botões de copiar e compartilhar
    document.getElementById('botoesResultado').style.display = 'flex';

    mostrarLoading(false);
    document.getElementById('bonificacaoCampos').style.display = 'block';
});

// Função genérica para copiar texto
function copiarTexto(elementId) {
    navigator.clipboard.writeText(document.getElementById(elementId).textContent)
        .then(() => alert("Texto copiado!"))
        .catch(() => alert("Erro ao copiar texto!"));
}

// Função genérica para compartilhar no WhatsApp
function compartilharWhatsApp(elementId) {
    const mensagem = document.getElementById(elementId).textContent;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Adicionar eventos de clique para copiar e compartilhar
document.getElementById('copiar').addEventListener('click', () => copiarTexto('resultadoAcao'));
document.getElementById('compartilhar').addEventListener('click', () => compartilharWhatsApp('resultadoAcao'));

document.getElementById('copiarBonificacao').addEventListener('click', () => copiarTexto('resultadoBonificacao'));
document.getElementById('compartilharBonificacao').addEventListener('click', () => compartilharWhatsApp('resultadoBonificacao'));

function validarCampos() {
    const precoSistema = parseFloat(document.getElementById('precoSistema').value);
    const precoSolicitado = parseFloat(document.getElementById('precoSolicitado').value);

    if (precoSolicitado >= precoSistema) {
        document.getElementById('precoSolicitadoHelp').textContent = "O preço solicitado deve ser menor que o preço do sistema.";
        return false;
    }

    return true;
}

function coletarDadosFormulario() {
    return {
        codRazaoCliente: document.getElementById('codRazaoCliente').value.trim(),
        codProduto: document.getElementById('codProduto').value.trim(),
        quantidade: parseFloat(document.getElementById('quantidadeAcao').value) || 0,
        precoSistema: parseFloat(document.getElementById('precoSistema').value) || 0,
        precoSolicitado: parseFloat(document.getElementById('precoSolicitado').value) || 0,
        codProdutoBonificado: document.getElementById('codProdutoBonificado').value.trim(),
        supervisor: document.getElementById('supervisor').value.trim()
    };
}

function calcularResultado(dados) {
    const valorPedido = dados.quantidade * dados.precoSistema;
    const investimentoPercentual = ((dados.precoSistema - dados.precoSolicitado) / dados.precoSistema) * 100;

    // A quantidade bonificada é a porcentagem de desconto aplicada ao valor do pedido
    const qtdBonificada = Math.round((valorPedido * (investimentoPercentual / 100)) / dados.precoSistema;

    const valorBonificacao = (qtdBonificada * dados.precoSistema).toFixed(2);

    return `*Solicitação de ação:*\n\n` +
        `Código/Produto: ${dados.codProduto}\n` +
        `Quantidade do Produto: ${dados.quantidade}\n` +
        `Preço do Palm: R$ ${dados.precoSistema.toFixed(2)}\n\n` +
        `*Ação*\n\n` +
        `Preço solicitado: R$ ${dados.precoSolicitado.toFixed(2)}\n` +
        `Investimento: ${investimentoPercentual.toFixed(0)} %\n` +
        `Quantidade bonificada: ${qtdBonificada} und\n` +
        `Valor Bonificação: R$ ${valorBonificacao}\n` +
        `Valor pedido: R$ ${valorPedido.toFixed(2)}\n` +
        `Código/Produto Bonificado: ${dados.codProdutoBonificado}\n\n` +
        `Código/Razão do Cliente: ${dados.codRazaoCliente}`;
}

function exibirResultado(resultado) {
    // Mostra a seção de resultados da ação
    document.getElementById('resultadoAcaoSection').style.display = 'block';
    // Preenche o conteúdo do resultado
    document.getElementById('resultadoAcao').textContent = resultado;
}

function coletarDadosBonificacao() {
    return {
        codRazaoCliente: document.getElementById('codRazaoCliente').value.trim(),
        supervisor: document.getElementById('supervisor').value.trim(),
        codPedido: document.getElementById('codPedido').value.trim(),
        codProduto: document.getElementById('codProduto').value.trim(),
        quantidade: document.getElementById('quantidadeAcao').value.trim(),
        valorBonificacao: document.getElementById('resultadoAcao').textContent.match(/Valor Bonificação: R\$\s*([\d,.]+)/)[1],
        observacao: document.getElementById('observacao').value.trim()
    };
}

function gerarBonificacao(dados) {
    return `*Bonificação*\n\n` +
        `*Código/Razão do Cliente:* ${dados.codRazaoCliente}\n` +
        `*Consultor:* 1473647 - Roberval Santiago\n` +
        `*Cód do pedido:* ${dados.codPedido}\n` +
        `*Código/Produto Bonificado:* ${document.getElementById('codProdutoBonificado').value.trim()}\n` +
        `*Quantidade:* ${dados.quantidade} UND\n` +
        `*Valor da bonificação:* R$ ${dados.valorBonificacao}\n` +
        `*Observação:* ${dados.observacao || "  "}`;
}

function mostrarLoading(mostrar) {
    document.getElementById('loading').style.display = mostrar ? 'block' : 'none';
}
