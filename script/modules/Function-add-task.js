import { readSelector } from "./Universal-selector.js";

export function addTask() {
    const btn_add_task = document.getElementById("btnAdd");
    const list = document.querySelector(".liste-of-the-article ul");

    btn_add_task.addEventListener("click", () => {
        const article = readSelector();

        if (!article.name || !article.quantity || !article.price || !article.category) {
            alert("Por favor, preencha todos os campos!");
            return;
        }




        // Cria novo <li> com a estrutura existente
        const li = document.createElement("li");
        li.classList.add("li-background-color")
        li.innerHTML = `
            <div class="product-detels">
                <p>${article.name}</p>
                <p>${article.quantity}</p>
                <p>${article.price}</p>
                <p>${article.category}</p>
            </div>
            <div class="product-manipution">
                <button class="edit-btn">edit</button>
                <button class="delete-btn">delete</button>
            </div>
        `;
        
        
        ;

        // Adiciona à lista
        list.appendChild(li);

        // Limpa os campos
        document.querySelector("#article-name").value = "";
        document.querySelector("#article-quantity").value = "";
        document.querySelector("#amount-price").value = "";
        document.querySelector("#category").value = "";
    });




    


    
}

addTask()





