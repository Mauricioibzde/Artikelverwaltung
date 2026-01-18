// === MÁSCARAS OTIMIZADAS ===
 export const priceInput = document.getElementById("amount-price");


function maskCurrencyInput(input) {
    input.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length === 0) value = '0';
        value = value.padStart(3, '0');

        const integerPart = value.slice(0, -2);
        const decimalPart = value.slice(-2);

        e.target.value = `${parseInt(integerPart).toLocaleString('de-DE')},${decimalPart} `;
    });
}

maskCurrencyInput(priceInput);