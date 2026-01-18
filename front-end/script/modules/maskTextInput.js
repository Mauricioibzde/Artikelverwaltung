export const nameInput = document.getElementById("article-name");

function maskTextInput(input) {
    input.addEventListener("input", (e) => {
        //e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    });
}

// === APLICA MÁSCARAS INICIAIS ===

maskTextInput(nameInput);