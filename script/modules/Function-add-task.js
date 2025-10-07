import { readSelector } from "./Universal-selector.js";

// Função para formatar valores como moeda local (EUR)
function formatCurrency(value) {
  // Remove tudo que não seja número ou vírgula, substitui vírgula por ponto e converte para número
  const number = parsePrice(value);
  if (isNaN(number)) return '';
  // Formata para moeda alemã
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(number);
}

// Função para converter string de preço em número mesmo que seja muito alto
function parsePrice(value) {
  if (!value) return NaN;
  // Remove todos os caracteres que não sejam dígitos ou vírgula
  let cleaned = value.replace(/[^\d,]/g, '');
  // Substitui a última vírgula por ponto decimal
  cleaned = cleaned.replace(/,(\d{0,2})$/, '.$1');
  // Converte para float
  const number = parseFloat(cleaned);
  return number;
}

// Função para validar todos os inputs do artigo
function validateArticle(article) {
  // Checa se todos os campos foram preenchidos
  if (!article.name || !article.quantity || !article.price || !article.category) {
    alert("Por favor, preencha todos os campos!");
    return false;
  }

  // Valida nome: apenas letras e espaços
  const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
  if (!nameRegex.test(article.name)) {
    alert("O nome do produto deve conter apenas letras!");
    return false;
  }

  // Valida preço usando parsePrice
  const priceNumber = parsePrice(article.price);
  if (isNaN(priceNumber) || priceNumber <= 0) {
    alert("Digite um preço válido!");
    return false;
  }

  return true;
}

// Máscara de moeda no input (formato de moeda alemã)
function maskCurrencyInput(input) {
  input.addEventListener("input", (e) => {
    let value = e.target.value;
    // Remove tudo que não for dígito
    value = value.replace(/\D/g, '');
    // Divide por 100 para considerar centavos
    const number = Number(value) / 100;
    // Formata para moeda local
    e.target.value = number.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  });
}

// Bloqueia números e caracteres especiais no input do nome
function maskTextInput(input) {
  input.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
  });
}

// Função principal para adicionar artigos à lista
export function addTask() {
  const btn_add_task = document.getElementById("btnAdd");
  const list = document.querySelector(".liste-of-the-article ul");
  const priceInput = document.getElementById("amount-price");
  const nameInput = document.getElementById("article-name");

  // Aplica máscaras nos inputs
  maskCurrencyInput(priceInput);
  maskTextInput(nameInput);

  // Clique no botão "Adicionar"
  btn_add_task.addEventListener("click", () => {
    const article = readSelector(); // Lê os valores do formulário

    // Valida os dados
    if (!validateArticle(article)) return;

    // Formata preço para exibição
    const formattedPrice = formatCurrency(article.price);

    // Cria novo <li> com os dados do artigo
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

    // Cria div de manipulação (editar/excluir)
    const div = document.createElement("div");
    div.classList.add("product-manipution");

    const btnEdit = document.createElement("button");
    btnEdit.classList.add("edit-btn");
    btnEdit.textContent = "Modify";

    const btnDelete = document.createElement("button");
    btnDelete.classList.add("delete-btn");
    btnDelete.textContent = "Delete";

    div.appendChild(btnEdit);
    div.appendChild(btnDelete);
    li.appendChild(div);
    list.appendChild(li);

    // Limpa os campos do formulário
    nameInput.value = "";
    document.querySelector("#article-quantity").value = "";
    priceInput.value = "";
    document.querySelector("#category").value = "";
  });

  // Função para abrir/fechar opções de cada item
  function openDescriptionTask() {
    list.addEventListener("click", (e) => {
      const li = e.target.closest("li");
      if (!li) return;
      const div = li.querySelector(".product-manipution");

      // Mostra/oculta opções ao clicar no item
      if (e.target.closest(".product-detels")) {
        div.classList.toggle("active");
      }

      // Editar item
      if (e.target.classList.contains("edit-btn")) {
        nameInput.value = li.querySelector(".product-name").textContent;
        document.querySelector("#article-quantity").value = li.querySelector(".product-quantity").textContent;
        priceInput.value = li.querySelector(".product-price").textContent;
        document.querySelector("#category").value = li.querySelector(".product-category").textContent;

        li.remove();
      }

      // Excluir item
      if (e.target.classList.contains("delete-btn")) {
        li.remove();
      }
    });
  }

  openDescriptionTask();
}

// Inicializa a função
addTask();
