import { readSelector } from "./Universal-selector.js";

// Formata número como moeda local (EUR)
function formatCurrency(value) {
  const number = Number(value.replace(/[^0-9.,]/g, '').replace(',', '.'));
  if (isNaN(number)) return '';
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(number);
}

// Valida inputs
function validateArticle(article) {
  if (!article.name || !article.quantity || !article.price || !article.category) {
    alert("Por favor, preencha todos os campos!");
    return false;
  }

  // Validação do nome: somente letras e espaços
  const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
  if (!nameRegex.test(article.name)) {
    alert("O nome do produto deve conter apenas letras!");
    return false;
  }

  // Validação de preço
  const priceNumber = Number(article.price.replace(/[^0-9.,]/g, '').replace(',', '.'));
  if (isNaN(priceNumber) || priceNumber <= 0) {
    alert("Digite um preço válido!");
    return false;
  }

  return true;
}

// Máscara de moeda no input
function maskCurrencyInput(input) {
  input.addEventListener("input", (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    const number = Number(value) / 100;
    e.target.value = number.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  });
}

// Bloqueia números e caracteres especiais no nome do artigo
function maskTextInput(input) {
  input.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
  });
}

export function addTask() {
  const btn_add_task = document.getElementById("btnAdd");
  const list = document.querySelector(".liste-of-the-article ul");
  const priceInput = document.getElementById("amount-price");
  const nameInput = document.getElementById("article-name");

  // Aplica máscaras
  maskCurrencyInput(priceInput);
  maskTextInput(nameInput);

  btn_add_task.addEventListener("click", () => {
    const article = readSelector();

    if (!validateArticle(article)) return;

    const formattedPrice = formatCurrency(article.price);

    // Cria novo <li>
    const li = document.createElement("li");
    li.classList.add("li-background-color");
    li.innerHTML = `
      <div class="product-detels" tabindex="0">
        <p class="product-name">${article.name}</p>
        <p class="product-quantity">${article.quantity}</p>
        <p class="product-price">${formattedPrice}</p>
        <p class="product-category">${article.category}</p>
      </div>
    `;

    const div = document.createElement("div");
    div.classList.add("product-manipution");

    const btnEdit = document.createElement("button");
    btnEdit.classList.add("edit-btn");
    btnEdit.textContent = "Edit";

    const btnDelete = document.createElement("button");
    btnDelete.classList.add("delete-btn");
    btnDelete.textContent = "Delete";

    div.appendChild(btnEdit);
    div.appendChild(btnDelete);
    li.appendChild(div);
    list.appendChild(li);

    // Limpa os campos
    nameInput.value = "";
    document.querySelector("#article-quantity").value = "";
    priceInput.value = "";
    document.querySelector("#category").value = "";
  });

  function openDescriptionTask() {
    list.addEventListener("click", (e) => {
      const li = e.target.closest("li");
      if (!li) return;
      const div = li.querySelector(".product-manipution");

      if (e.target.closest(".product-detels")) {
        div.classList.toggle("active");
      }

      if (e.target.classList.contains("edit-btn")) {
        nameInput.value = li.querySelector(".product-name").textContent;
        document.querySelector("#article-quantity").value = li.querySelector(".product-quantity").textContent;
        priceInput.value = li.querySelector(".product-price").textContent;
        document.querySelector("#category").value = li.querySelector(".product-category").textContent;

        li.remove();
      }

      if (e.target.classList.contains("delete-btn")) {
        li.remove();
      }
    });
  }

  openDescriptionTask();
}

addTask();
