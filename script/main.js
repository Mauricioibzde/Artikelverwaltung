// script/main.js

const btnAdd = document.getElementById("btnAdd");
const resultList = document.getElementById("result-to-print");
const priceInput = document.getElementById("amount-price");
const nameInput = document.getElementById("article-name");
const quantityInput = document.getElementById("article-quantity");

let articles = [];

// Formata número em moeda alemã
function formatCurrency(value) {
    return Number(value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

// Máscara de moeda em tempo real
function maskCurrencyInput(input) {
    input.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.padStart(3, '0');
        const integerPart = value.slice(0, -2);
        const decimalPart = value.slice(-2);
        e.target.value = `${parseInt(integerPart).toLocaleString('de-DE')},${decimalPart} €`;
    });
}

// Máscara de texto para aceitar apenas letras e espaços
function maskTextInput(input) {
    input.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    });
}

// Máscara de número inteiro com separador de milhar (pontos)
function maskIntegerInput(input) {
    input.addEventListener("input", (e) => {
        let cursorPosition = e.target.selectionStart;
        let value = e.target.value.replace(/\D/g, '');
        if (value === "") {
            e.target.value = "";
            return;
        }
        const formattedValue = Number(value).toLocaleString('de-DE'); // ponto como separador
        e.target.value = formattedValue;
        e.target.selectionStart = e.target.selectionEnd = cursorPosition + (formattedValue.length - value.length);
    });
}

// Aplica máscaras aos inputs principais
maskCurrencyInput(priceInput);
maskTextInput(nameInput);
maskIntegerInput(quantityInput);

// Renderiza lista de artigos
function renderArticles() {
    resultList.innerHTML = "";

    articles.forEach((article, index) => {
        const li = document.createElement("li");
        li.classList.add("article-item");

        const displayDiv = document.createElement("div");
        displayDiv.classList.add("display-div");
        displayDiv.innerHTML = `
            <p>${article.name}</p>
            <p>${article.quantity.toLocaleString('de-DE')}</p>
            <p>${formatCurrency(article.price)}</p>
            <p>${article.category}</p>
        `;

        const editDiv = document.createElement("div");
        editDiv.classList.add("edit-div");
        editDiv.style.display = "none";
        editDiv.innerHTML = `
            <input type="text" value="${article.name}" class="edit-name">
            <input type="text" value="${article.quantity.toLocaleString('de-DE')}" class="edit-quantity">
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

         displayDiv.addEventListener("click",() => {
                console.log("click")

                buttonDiv.classList.toggle("active")


            })

        const editBtn = buttonDiv.querySelector(".edit-btn");
        const deleteBtn = buttonDiv.querySelector(".delete-btn");
        const saveBtn = buttonDiv.querySelector(".save-btn");
        const cancelBtn = buttonDiv.querySelector(".cancel-btn");

        // Editar
        editBtn.onclick = () => {
            displayDiv.style.display = "none";
            editDiv.style.display = "flex";
            editBtn.style.display = "none";
            deleteBtn.style.display = "none";
            saveBtn.style.display = "inline-block";
            cancelBtn.style.display = "inline-block";

            const editPriceInput = editDiv.querySelector(".edit-price");
            const editNameInput = editDiv.querySelector(".edit-name");
            const editQuantityInput = editDiv.querySelector(".edit-quantity");

            // Aplica a mesma máscara de todos os inputs
            maskCurrencyInput(editPriceInput);
            maskTextInput(editNameInput);
            maskIntegerInput(editQuantityInput);


           
        };

        // Cancelar
        cancelBtn.onclick = () => {

          // Oculta a edição
    editDiv.style.display = "none";

    // Mostra novamente o display original
    displayDiv.style.display = "grid";

    // Esconde os botões de salvar/cancelar
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";

    // Mostra os botões principais do item (Editar/Remover)
    editBtn.style.display = "inline-block";
    deleteBtn.style.display = "inline-block";

    // Remove a classe active caso os botões estejam toggleados
    buttonDiv.classList.remove("active");
        };

        // Salvar
        saveBtn.onclick = () => {
            const newName = editDiv.querySelector(".edit-name").value.trim();
            let newQuantity = editDiv.querySelector(".edit-quantity").value.replace(/\./g, '');
            newQuantity = parseInt(newQuantity);

            let newPrice = editDiv.querySelector(".edit-price").value.replace(/[^\d,]/g, '').replace(',', '.');
            newPrice = parseFloat(newPrice);

            const newCategory = editDiv.querySelector(".edit-category").value;

            const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
            if (!newName || !nameRegex.test(newName) || !newCategory || isNaN(newQuantity) || newQuantity <= 0 || newQuantity > 10000000 || isNaN(newPrice) || newPrice <= 0) {
                alert("Preencha todos os campos corretamente! Quantidade máxima: 10.000.000");
                return;
            }

            articles[index] = {
                name: newName,
                quantity: newQuantity,
                price: newPrice,
                category: newCategory
            };

            renderArticles();
        };

        // Remover
        deleteBtn.onclick = () => {
            articles.splice(index, 1);
            renderArticles();
        };
    });
}

// Adicionar artigo
btnAdd.onclick = () => {
    const name = nameInput.value.trim();
    let quantity = quantityInput.value.replace(/\./g, '');
    quantity = parseInt(quantity);

    let price = priceInput.value.replace(/[^\d,]/g, '').replace(',', '.');
    price = parseFloat(price);

    const category = document.getElementById("category").value;

    const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
    if (!name || !nameRegex.test(name) || !category || isNaN(quantity) || quantity <= 0 || quantity > 10000000 || isNaN(price) || price <= 0) {
        alert("Preencha todos os campos corretamente! Quantidade máxima: 10.000.000");
        return;
    }

    articles.push({ name, quantity, price, category });

    // Limpar formulário
    nameInput.value = "";
    quantityInput.value = "";
    priceInput.value = "";
    document.getElementById("category").value = "";

    renderArticles();



    
};


