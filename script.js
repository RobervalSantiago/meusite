// Função para salvar dados no localStorage
function salvarDadosLocalStorage(chave, valor) {
    let dados = JSON.parse(localStorage.getItem(chave)) || [];
    if (!dados.includes(valor)) {
        dados.push(valor);
        localStorage.setItem(chave, JSON.stringify(dados));
    }
}

// Função para carregar sugestões do localStorage
function carregarSugestoes(chave, datalistId) {
    let dados = JSON.parse(localStorage.getItem(chave)) || [];
    let datalist = document.getElementById(datalistId);
    datalist.innerHTML = ""; // Limpa as sugestões anteriores
    dados.forEach(item => {
        let option = document.createElement("option");
        option.value = item;
        datalist.appendChild(option);
    });
}

// Carregar sugestões ao carregar a página
window.addEventListener("load", function () {
    carregarSugestoes("clientes", "sugestoesCliente");
    carregarSugestoes("produtos", "sugestoesProduto");
    carregarSugestoes("bonificados", "sugestoesBonificado");
});

// Salvar dados ao preencher os campos
document.getElementById("codRazaoCliente").addEventListener("change", function () {
    salvarDadosLocalStorage("clientes", this.value);
    carregarSugestoes("clientes", "sugestoesCliente");
});

document.getElementById("codProduto").addEventListener("change", function () {
    salvarDadosLocalStorage("produtos", this.value);
    carregarSugestoes("produtos", "sugestoesProduto");
});

document.getElementById("codProdutoBonificado").addEventListener("change", function () {
    salvarDadosLocalStorage("bonificados", this.value);
    carregarSugestoes("bonificados", "sugestoesBonificado");
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

// ... (restante do código)
