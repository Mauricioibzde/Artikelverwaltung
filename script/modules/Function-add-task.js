const btnAdd = document.getElementById("btnAdd");
const resultList = document.getElementById("result-to-print");

let articles = [];

// Formata preço em moeda
function formatCurrency(value) {
  return Number(value).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

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
      <p>${article.quantity}</p>
      <p>${formatCurrency(article.price)}</p>
      <p>${article.category}</p>
    `;

    const editDiv = document.createElement("div");
    editDiv.classList.add("edit-div");
    editDiv.style.display = "none";
    editDiv.innerHTML = `
      <input type="text" value="${article.name}" class="edit-name">
      <input type="number" value="${article.quantity}" class="edit-quantity">
      <input type="number" step="0.01" value="${article.price}" class="edit-price">
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
    };

    // Cancelar
    cancelBtn.onclick = () => {
      displayDiv.style.display = "flex";
      editDiv.style.display = "none";
      editBtn.style.display = "inline-block";
      deleteBtn.style.display = "inline-block";
      saveBtn.style.display = "none";
      cancelBtn.style.display = "none";
    };

    // Salvar
    saveBtn.onclick = () => {
      const newName = editDiv.querySelector(".edit-name").value.trim();
      const newQuantity = parseInt(editDiv.querySelector(".edit-quantity").value);
      const newPrice = parseFloat(editDiv.querySelector(".edit-price").value);
      const newCategory = editDiv.querySelector(".edit-category").value;

      if (!newName || !newCategory || isNaN(newQuantity) || newQuantity <= 0 || isNaN(newPrice) || newPrice <= 0) {
        alert("Preencha todos os campos corretamente!");
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
  const name = document.getElementById("article-name").value.trim();
  const quantity = parseInt(document.getElementById("article-quantity").value);
  const price = parseFloat(document.getElementById("amount-price").value);
  const category = document.getElementById("category").value;

  if (!name || !category || isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  articles.push({ name, quantity, price, category });

  document.getElementById("article-name").value = "";
  document.getElementById("article-quantity").value = "";
  document.getElementById("amount-price").value = "";
  document.getElementById("category").value = "";

  renderArticles();
};
