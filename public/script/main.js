// script/main.js

const btnAdd = document.getElementById("btnAdd");
const resultList = document.getElementById("result-to-print");
const priceInput = document.getElementById("amount-price");
const nameInput = document.getElementById("article-name");
const quantityInput = document.getElementById("article-quantity");

let articles = [];

// === LOG INICIAL ===
console.log("🟢 Página carregada. Lista inicial de artigos:");
console.table(articles);

// === FUNÇÕES DE FORMATAÇÃO ===
function formatCurrency(value) {
    return Number(value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

function formatQuantity(value) {
    return Number(value).toLocaleString('de-DE');
}

// === FUNÇÃO AUXILIAR: MOSTRA OS ARTIGOS FORMATADOS NO CONSOLE ===
function logFormattedArticles(message) {
    console.log(message);
    const formatted = articles.map((a, i) => ({
        "#": i + 1,
        Nome: a.name,
        Quantidade: formatQuantity(a.quantity),
        Preço: formatCurrency(a.price),
        Categoria: a.category
    }));
    console.table(formatted);
}

// === MÁSCARAS OTIMIZADAS ===
function maskCurrencyInput(input) {
    input.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, ''); // remove tudo que não é número
        if (value.length === 0) value = '0';
        value = value.padStart(3, '0'); // garante 2 casas decimais

        const integerPart = value.slice(0, -2);
        const decimalPart = value.slice(-2);

        e.target.value = `${parseInt(integerPart).toLocaleString('de-DE')},${decimalPart} €`;
    });
}

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

function maskTextInput(input) {
    input.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    });
}

// === APLICA MÁSCARAS INICIAIS ===
maskCurrencyInput(priceInput);
maskTextInput(nameInput);
maskIntegerInput(quantityInput);

// === FUNÇÕES HTTP ===
const API_URL = "http://localhost:3000/articles";

async function fetchArticles() {
    try {
        const res = await fetch(API_URL);
        articles = await res.json();
        renderArticles();
    } catch (err) {
        console.error("Erro ao buscar artigos:", err);
    }
}

async function addArticle(article) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(article)
        });
        const newArticle = await res.json();
        articles.push(newArticle);
        renderArticles();
    } catch (err) {
        console.error("Erro ao adicionar artigo:", err);
    }
}

async function updateArticle(id, updatedData) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });
        await fetchArticles();
    } catch (err) {
        console.error("Erro ao atualizar artigo:", err);
    }
}

async function deleteArticle(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        await fetchArticles();
    } catch (err) {
        console.error("Erro ao remover artigo:", err);
    }
}

// === UTILITÁRIO PARA EDIÇÃO ===
function applyMasksToEditInputs(editDiv) {
    const editPriceInput = editDiv.querySelector(".edit-price");
    const editNameInput = editDiv.querySelector(".edit-name");
    const editQuantityInput = editDiv.querySelector(".edit-quantity");

    if (editPriceInput && !editPriceInput.dataset.masked) {
        maskCurrencyInput(editPriceInput);
        editPriceInput.dataset.masked = true;
    }
    if (editNameInput && !editNameInput.dataset.masked) {
        maskTextInput(editNameInput);
        editNameInput.dataset.masked = true;
    }
    if (editQuantityInput && !editQuantityInput.dataset.masked) {
        maskIntegerInput(editQuantityInput);
        editQuantityInput.dataset.masked = true;
    }
}

// === RENDERIZA LISTA ===
function renderArticles() {
    resultList.innerHTML = "";

    articles.forEach((article, index) => {
        const li = document.createElement("li");
        li.classList.add("article-item");

        const displayDiv = document.createElement("div");
        displayDiv.classList.add("display-div");
        displayDiv.innerHTML = `
            <p>${article.name}</p>
            <p>${formatQuantity(article.quantity)}</p>
            <p>${formatCurrency(article.price)}</p>
            <p>${article.category}</p>
        `;

        const editDiv = document.createElement("div");
        editDiv.classList.add("edit-div");
        editDiv.style.display = "none";
        editDiv.innerHTML = `
            <input type="text" value="${article.name}" class="edit-name">
            <input type="text" value="${formatQuantity(article.quantity)}" class="edit-quantity">
            <input type="text" value="${formatCurrency(article.price)}" class="edit-price">
            <select class="edit-category">
                <option value="Drinks" ${article.category === "Drinks" ? "selected" : ""}>Drinks</option>
                <option value="Cigarettes" ${article.category === "Cigarettes" ? "selected" : ""}>Cigarettes</option>
                <option value="Sweets" ${article.category === "Sweets" ? "selected" : ""}>Sweets</option>
                <option value="Fruits" ${article.category === "Fruits" ? "selected" : ""}>Fruits</option>
            </select>
        `;

        const buttonDiv = document.createElement("div");
        buttonDiv.classList.add("button-div");
        buttonDiv.innerHTML = `
            <button class="edit-btn">Editar</button>
            <button class="delete-btn">Remover</button>
            <button class="save-btn" style="display:none;">Salvar</button>
            <button class="cancel-btn" style="display:none;">Cancelar</button>
        `;

        li.appendChild(displayDiv);
        li.appendChild(editDiv);
        li.appendChild(buttonDiv);
        resultList.appendChild(li);

     li.addEventListener("click", (e) => {
    const target = e.target;
    if (
        target.tagName !== "INPUT" &&
        target.tagName !== "SELECT" &&
        !target.classList.contains("edit-btn") &&
        !target.classList.contains("save-btn") &&
        !target.classList.contains("cancel-btn") &&
        !target.classList.contains("delete-btn")
    ) {
        buttonDiv.classList.toggle("active");
    }
});

        const editBtn = buttonDiv.querySelector(".edit-btn");
        const deleteBtn = buttonDiv.querySelector(".delete-btn");
        const saveBtn = buttonDiv.querySelector(".save-btn");
        const cancelBtn = buttonDiv.querySelector(".cancel-btn");

        // === Editar ===
        editBtn.onclick = () => {
            displayDiv.style.display = "none";
            editDiv.style.display = "flex";
            editBtn.style.display = "none";
            deleteBtn.style.display = "none";
            saveBtn.style.display = "inline-block";
            cancelBtn.style.display = "inline-block";
            applyMasksToEditInputs(editDiv);
        };

        // === Cancelar ===
        cancelBtn.onclick = () => {
            editDiv.style.display = "none";
            displayDiv.style.display = "grid";
            saveBtn.style.display = "none";
            cancelBtn.style.display = "none";
            editBtn.style.display = "inline-block";
            deleteBtn.style.display = "inline-block";
        };

        // === Salvar ===
   // === Salvar ===
saveBtn.onclick = async () => {
    const newName = editDiv.querySelector(".edit-name").value.trim();
    let newQuantity = editDiv.querySelector(".edit-quantity").value.replace(/\./g, '');
    newQuantity = parseInt(newQuantity);

    let newPrice = editDiv.querySelector(".edit-price").value.replace(/[^\d,]/g, '').replace(',', '.');
    newPrice = parseFloat(newPrice);

    const newCategory = editDiv.querySelector(".edit-category").value;

    const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
    if (!newName || !nameRegex.test(newName) || !newCategory || isNaN(newQuantity) || newQuantity <= 0 || isNaN(newPrice) || newPrice <= 0) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    // Confirmação antes de salvar
    const confirmSave = confirm("Tem certeza que deseja alterar este artigo?");
    if (!confirmSave) return;

    await updateArticle(article.id, {
        name: newName,
        quantity: newQuantity,
        price: newPrice,
        category: newCategory
    });
};

// === Remover ===
deleteBtn.onclick = async () => {
    // Confirmação antes de excluir
    const confirmDelete = confirm("Tem certeza que deseja excluir este artigo?");
    if (!confirmDelete) return;

    await deleteArticle(article.id);
};


   // === Remover ===
deleteBtn.onclick = async () => {
    // Confirmação antes de excluir
    const confirmDelete = confirm("Tem certeza que deseja excluir este artigo?");
    if (!confirmDelete) return;

    await deleteArticle(article.id);
};
    });

    logFormattedArticles("📋 Lista atualizada:");
}

// === Adicionar artigo ===
btnAdd.onclick = async (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    let quantity = quantityInput.value.replace(/\./g, '');
    quantity = parseInt(quantity);

    let price = priceInput.value.replace(/[^\d,]/g, '').replace(',', '.');
    price = parseFloat(price);

    const category = document.getElementById("category").value;

    const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
    if (!name || !nameRegex.test(name) || !category || isNaN(quantity) || quantity <= 0 || quantity > 10000000 || isNaN(price) || price <= 0) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    await addArticle({ name, quantity, price, category });

    nameInput.value = "";
    quantityInput.value = "";
    priceInput.value = "";
    document.getElementById("category").value = "";
};

// === Inicializar ===
fetchArticles();
