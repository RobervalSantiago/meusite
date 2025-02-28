document.getElementById('bonificarMesmoProduto').addEventListener('change', function () {
    if (this.checked) {
        document.getElementById('codProdutoBonificado').value = document.getElementById('codProduto').value;
        document.getElementById('valorProdutoBonificado').value = document.getElementById('precoSistema').value;
    } else {
        document.getElementById('codProdutoBonificado').value = '';
        document.getElementById('valorProdutoBonificado').value = '';
    }
});

document.getElementById('codProduto').addEventListener('input', function () {
    if (document.getElementById('bonificarMesmoProduto').checked) {
        document.getElementById('codProdutoBonificado').value = this.value;
    }
});

document.getElementById('precoSistema').addEventListener('input', function () {
    if (document.getElementById('bonificarMesmoProduto').checked) {
        document.getElementById('valorProdutoBonificado').value = this.value;
    }
});

document.getElementById('formAcao').addEventListener('submit', function (e) {
    e.preventDefault();
    alert("FormulÃ¡rio enviado! LÃ³gica de cÃ¡lculo deve ser aplicada aqui.");
});

document.getElementById('limpar').addEventListener('click', function () {
    if (confirm("Deseja realmente limpar todos os campos?")) {
        document.getElementById('formAcao').reset();
    }
});
