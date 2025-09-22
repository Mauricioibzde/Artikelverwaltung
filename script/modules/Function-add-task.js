import { readSelector } from "./Universal-selector.js";

// Formata número como moeda local
function formatCurrency(value) {
  const number = Number(value.replace(/[^0-9.,]/g, '').replace(',', '.'));
  if (isNaN(number)) return '';
  return new Intl.NumberFormat('EUR', { style: 'currency', currency: 'EUR' }).format(number);
}

// Valida inputs
function validateArticle(article) {
  if (!article.name || !article.quantity || !article.price || !article.category) {
    alert("Por favor, preencha todos os campos!");
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

    // Remove tudo que não for número
    value = value.replace(/\D/g, '');

    // Converte para número e divide por 100 (centavos)
    const number = Number(value) / 100;

    // Formata para moeda EURO
    e.target.value = number.toLocaleString('EUR', { style: 'currency', currency: 'EUR' });
  });
}

export function addTask() {
  const btn_add_task = document.getElementById("btnAdd");
  const list = document.querySelector(".liste-of-the-article ul");
  const priceInput = document.getElementById("amount-price");

  // Aplica máscara de moeda no input
  maskCurrencyInput(priceInput);

  btn_add_task.addEventListener("click", () => {
    const article = readSelector();

    if (!validateArticle(article)) return;

    // Formata o preço corretamente
    const formattedPrice = formatCurrency(article.price);

    // Cria novo <li>
    const li = document.createElement("li");
    li.classList.add("li-background-color");
    li.innerHTML = `
      <div class="product-detels">
        <p class="product-name">${article.name}</p>
        <p class="product-quantity">${article.quantity}</p>
        <p class="product-price">${formattedPrice}</p>
        <p class="product-category">${article.category}</p>
      </div>
    `;

    // Cria div de manipulação
    const div = document.createElement("div");
    div.classList.add("product-manipution");

    const btnEdit = document.createElement("button");
    btnEdit.classList.add("edit-btn");
    btnEdit.textContent = "edit";

    const btnDelete = document.createElement("button");
    btnDelete.classList.add("delete-btn");
    btnDelete.textContent = "delete";

    div.appendChild(btnEdit);
    div.appendChild(btnDelete);
    li.appendChild(div);
    list.appendChild(li);

    // Limpa os campos
    document.querySelector("#article-name").value = "";
    document.querySelector("#article-quantity").value = "";
    document.querySelector("#amount-price").value = "";
    document.querySelector("#category").value = "";
  });

  // Função para abrir, editar ou deletar tarefas
  function openDescriptionTask() {
    list.addEventListener("click", (e) => {
      const li = e.target.closest("li");
      if (!li) return;
      const div = li.querySelector(".product-manipution");

      // Toggle da visualização dos botões
      if (e.target.closest(".product-detels")) {
        div.classList.toggle("active");
      }

      // Editar tarefa
      if (e.target.classList.contains("edit-btn")) {
        document.querySelector("#article-name").value = li.querySelector(".product-name").textContent;
        document.querySelector("#article-quantity").value = li.querySelector(".product-quantity").textContent;
        document.querySelector("#amount-price").value = li.querySelector(".product-price").textContent;
        document.querySelector("#category").value = li.querySelector(".product-category").textContent;

        li.remove();
      }

      // Deletar tarefa
      if (e.target.classList.contains("delete-btn")) {
        li.remove();
      }
    });
  }

  openDescriptionTask();
}

addTask();
