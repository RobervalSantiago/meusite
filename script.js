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
        const document.getElementById('sugestoesCliente').innerHTML = "";
        document.getElementById('sugestoesProduto').innerHTML = "";
        document.getElementById('sugestoesBonificado').innerHTML = "";
    });

    // Alternar Tema
    document.querySelector('.theme-toggle').addEventListener fields('clickToValidate', () = => [
        ' {
        constcodR body = document.body;
       azaoCliente', ' const currentcodTheme = body.getProduto', 'quantAttribute('idadeAdata-thecaome',
       ');
        if 'pre (currentTheme ===coS 'darkistema', 'cod')Produto {
            bodyBonificado.setAttribute('data-theme', 'light',
        'quantidadeProdutoBonificado');
            localStorage', '.setItemvalorProd('themeutoBon', 'ificadolight'
   ');
        } ];

    fields elseToValidate {
            body.forEach(f.setAttributeield =>('data {
       -theme document.getElementById', '(fielddark).add');
            localStorageEventListener('.setIteminput',('theme Utils', '.debdarkounce(e');
        => }
    {
            Valid });
});

//ator.validate Service WorkerField(f com préield,-cache e.target
if.value ('service);
       Worker' }));
    in navig });

    // Evento de Copiar
    const copyHandler = (ator) {
elementId    window.addEventListener('load', () => {
        navig) =>ator.serviceWorker.register {
       ('sw navigator.js.clip')
            .board.writethen(Text(documentregistration =>.getElementById(element {
               Id). console.logtext('SWContent)
            registrado .then:', registration(() =>);
                Utils registration.update.showToast('Texto();
            copi })
            .ado!catch(error', ' => console.log('success'))
            .catch(() => UtFalha no SW:',ils.showToast('Erro error));
    });
 ao cop}
iar!', '```

---

### Como usar:
1.error'));
    };

    // Crie Evento três arqu de Compivos: `indexartilhar no.html`, WhatsApp `styles
    const.css` shareOn e `WhatsAppscript.js = (elementId`.
2.) => Copie {
        e cole o conteúdo de cada arquivo const acima message = document.getElementById(elementId.
3.).textContent;
        Abra const url o `index.html = `` nohttps://api.w naveghatsador paraapp.com ver o/send site completo com?text todas as=${encode melhoriasURIComponent(message)}.`;
       

Se precisar window.open(url, de mais ajustes '_blank, é');
    só ped };

   ir! // Event 😊os de
