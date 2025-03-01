// Módulo de Utilidades
const Utils = (() => {
    const debounce = (func, delay = 300) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const showToast = (message, type = 'info') => {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'toast';
        toast.classList.add('show', type);
        setTimeout(() => toast.classList.remove('show'), 3000);
    };

    const loadTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
    };

    return { debounce, showToast, loadTheme };
})();

// Módulo de Validação
const Validator = (() => {
    const validateField = (fieldId, value) => {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}Help`);

        field.classList.remove('input-valid', 'input-error');
        errorElement.textContent = '';

        if (!value.trim()) {
            field.classList.add('input-error');
            errorElement.textContent = 'Campo obrigatório';
            return false;
        }

        if (fieldId.includes('quantidade') && value <= 0) {
            field.classList.add('input-error');
            errorElement.textContent = 'Valor deve ser maior que zero';
            return false;
        }

        field.classList.add('input-valid');
        return true;
    };

    return { validateField };
})();

// Módulo Principal
document.addEventListener('DOMContentLoaded', () => {
    Utils.loadTheme();

    // Validação em tempo real
    const fieldsToValidate = [
        'codRazaoCliente', 'codProduto', 'quantidadeAcao',
        'precoSistema', 'codProdutoBonificado',
        'quantidadeProdutoBonificado', 'valorProdutoBonificado'
    ];

    fieldsToValidate.forEach(field => {
        document.getElementById(field).addEventListener('input', Utils.debounce(e => {
            Validator.validateField(field, e.target.value);
        }));
    });

    // Evento de Copiar
    const copyHandler = (elementId) => {
        navigator.clipboard.writeText(document.getElementById(elementId).textContent)
            .then(() => Utils.showToast('Texto copiado!', 'success'))
            .catch(() => Utils.showToast('Erro ao copiar!', 'error'));
    };

    // Evento de Compartilhar no WhatsApp
    const shareOnWhatsApp = (elementId) => {
        const message = document.getElementById(elementId).textContent;
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    // Eventos de clique para copiar e compartilhar
    document.getElementById('copiar').addEventListener('click', () => copyHandler('resultadoAcao'));
    document.getElementById('compartilhar').addEventListener('click', () => shareOnWhatsApp('resultadoAcao'));

    document.getElementById('copiarBonificacao').addEventListener('click', () => copyHandler('resultadoBonificacao'));
    document.getElementById('compartilharBonificacao').addEventListener('click', () => shareOnWhatsApp('resultadoBonificacao'));

    // Evento de Limpar
    document.getElementById('limpar').addEventListener('click', function () {
        document.getElementById('formAcao').reset();
        document.getElementById('resultadoAcaoSection').style.display = 'none';
        document.getElementById('bonificacaoCampos').style.display = 'none';
        document.getElementById('resultadoBonificacaoSection').style.display = 'none';
        document.getElementById('botoesResultado').style.display = 'none';
        document.getElementById('botoesBonificacao').style.display = 'none';
        // Limpar as sugestões
        document.getElementById('sugestoesCliente').innerHTML = "";
        document.getElementById('sugestoesProduto').innerHTML = "";
        document.getElementById('sugestoesBonificado').innerHTML = "";
    });

    // Alternar Tema
    document.querySelector('.theme-toggle').addEventListener('click', () => {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
});

// Service Worker com pré-cache
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('SW registrado:', registration);
                registration.update();
            })
            .catch(error => console.log('Falha no SW:', error));
    });
}
