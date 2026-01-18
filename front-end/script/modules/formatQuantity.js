
export const quantityInput = document.getElementById("article-quantity");


// === FUNÇÕES DE FORMATAÇÃO ===





function maskIntegerInput(input) {
    input.addEventListener("input", (e) => {
        let cursorPos = e.target.selectionStart;
        let value = e.target.value.replace(/\D/g, '');
        if (!value) {
            e.target.value = '';
            return;
        }
        const formatted = Number(value).toLocaleString('de-DE');
        e.target.value = formatted;
        const diff = formatted.length - value.length;
        e.target.selectionStart = e.target.selectionEnd = cursorPos + diff;
    });
}
maskIntegerInput(quantityInput);

