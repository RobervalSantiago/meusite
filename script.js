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

// Função para validar campos
function validarCampos() {
    const codRazaoCliente = document.getElementById('codRazaoCliente').value.trim();
    const codProduto = document.getElementById('codProduto').value.trim();
    const quantidade = document.getElementById('quantidadeAcao').value.trim();
    const precoSistema = parseFloat(document.getElementById('precoSistema').value);
    const precoSolicitado = parseFloat(document.getElementById('precoSolicitado').value);
    const codProdutoBonificado = document.getElementById('codProdutoBonificado').value.trim();
    const valorProdutoBonificado = parseFloat(document.getElementById('valorProdutoBonificado').value);
    const supervisor = document.getElementById('supervisor').value.trim();
    const consultor = document.getElementById('consultor').value.trim();

    // Validação dos campos obrigatórios
    if (!codRazaoCliente) {
        document.getElementById('codRazaoClienteHelp').textContent = "Código/Razão do Cliente é obrigatório.";
        return false;
    }

    if (!codProduto) {
        document.getElementById('codProdutoHelp').textContent = "Código/Produto é obrigatório.";
        return false;
    }

    if (!quantidade || quantidade <= 0) {
        document.getElementById('quantidadeAcaoHelp').textContent = "Quantidade do Produto é obrigatória.";
        return false;
    }

    if (!precoSistema || precoSistema <= 0) {
        document.getElementById('precoSistemaHelp').textContent = "Preço do Palm é obrigatório.";
        return false;
    }

    if (!codProdutoBonificado) {
        document.getElementById('codProdutoBonificadoHelp').textContent = "Código/Produto Bonificado é obrigatório.";
        return false;
    }

    if (!supervisor) {
        document.getElementById('supervisorHelp').textContent = "Supervisor é obrigatório.";
        return false;
    }

    if (!consultor) {
        document.getElementById('consultorHelp').textContent = "Consultor é obrigatório.";
        return false;
    }

    // Validação dos campos "precoSolicitado" e "valorProdutoBonificado"
    if (!precoSolicitado && !valorProdutoBonificado) {
        document.getElementById('precoSolicitadoHelp').textContent = "Preço Solicitado ou Valor do Produto Bonificado é obrigatório.";
        document.getElementById('valorProdutoBonificadoHelp').textContent = "Preço Solicitado ou Valor do Produto Bonificado é obrigatório.";
        return false;
    } else {
        document.getElementById('precoSolicitadoHelp').textContent = "";
        document.getElementById('valorProdutoBonificadoHelp').textContent = "";
    }

    // Validação adicional para garantir que o preço solicitado seja menor que o preço do sistema
    if (precoSolicitado && precoSolicitado >= precoSistema) {
        document.getElementById('precoSolicitadoHelp').textContent = "O preço solicitado deve ser menor que o preço do sistema.";
        return false;
    }

    console.log("Todos os campos estão válidos.");
    return true;
}

// Função para coletar dados do formulário
function coletarDadosFormulario() {
    return {
        codRazaoCliente: document.getElementById('codRazaoCliente').value.trim(),
        codProduto: document.getElementById('codProduto').value.trim(),
        quantidade: parseFloat(document.getElementById('quantidadeAcao').value) || 0,
        precoSistema: parseFloat(document.getElementById('precoSistema').value) || 0,
        precoSolicitado: parseFloat(document.getElementById('precoSolicitado').value) || 0,
        codProdutoBonificado: document.getElementById('codProdutoBonificado').value.trim(),
        valorProdutoBonificado: parseFloat(document.getElementById('valorProdutoBonificado').value) || 0,
        supervisor: document.getElementById('supervisor').value.trim(),
        consultor: document.getElementById('consultor').value.trim()
    };
}

// Função para calcular o resultado
function calcularResultado(dados) {
    console.log("Dados recebidos para cálculo:", dados);

    // Cálculo do valor do pedido
    const valorPedido = dados.quantidade * dados.precoSistema;

    // Cálculo da quantidade bonificada
    let quantidadeBonificada;
    if (dados.precoSolicitado) {
        quantidadeBonificada = (valorPedido - (dados.quantidade * dados.precoSolicitado)) / dados
