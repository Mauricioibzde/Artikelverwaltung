// Variável de estado (removida a persistência automática para pedir senha sempre)
// let isAdminLoggedIn = false; 

// Função auxiliar para pedir senha
function checkPermission() {
    return new Promise((resolve) => {
        // Removida verificação de sessão anterior
        // if (isAdminLoggedIn) { resolve(true); return; }

        const modal = document.getElementById('security-modal');
        const input = document.getElementById('admin-password');
        const confirmBtn = document.getElementById('confirm-security');
        const cancelBtn = document.getElementById('cancel-security');
        const closeBtn = document.getElementById('close-security-modal');

        modal.style.display = 'flex';
        input.value = '';
        input.focus();

        const handleConfirm = () => {
             // SENHA MESTRA DEFINIDA AQUI (Ex: "admin123")
            if (input.value === 'admin123') {
                // isAdminLoggedIn = true; // Não salva mais na sessão
                modal.style.display = 'none';
                cleanup();
                resolve(true);
            } else {
                alert('Senha incorreta!');
                input.value = '';
                input.focus();
            }
        };

        const handleCancel = () => {
            modal.style.display = 'none';
            cleanup();
            resolve(false);
        };

        const cleanup = () => {
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
            closeBtn.removeEventListener('click', handleCancel);
            // Remove enter key listener if added logic
        };

        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
        closeBtn.addEventListener('click', handleCancel);
        
        // Pressionar Enter para confirmar
        input.onkeydown = (e) => {
            if(e.key === 'Enter') handleConfirm();
            if(e.key === 'Escape') handleCancel();
        };
    });
}

// Função para carregar e exibir os artigos na lista do front-end
export async function loadArticles() {
  const ul = document.getElementById('result-to-print');
  ul.innerHTML = '';
  try {
    const response = await fetch('/api/products');
    const articles = await response.json();
    if (articles.length === 0) {
      ul.innerHTML = '<li><p>Nenhum artigo cadastrado.</p></li>';
      return;
    }
    let totalQuantity = 0;
    let totalPrice = 0;

    articles.forEach(article => {
      // Ignora artigos inválidos (sem nome ou com dados corrompidos)
      if (!article.name || article.name === 'null' || !article.price) return;

      // Formata data e hora
      const addedDate = article.date ? new Date(article.date) : new Date();
      const dateStr = addedDate.toLocaleDateString('de-DE'); // ou 'de-DE'
      const timeStr = addedDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

      // Calcula o total desta linha (Preço Unitário * Quantidade)
      const lineTotal = article.price * article.quantity;

      totalQuantity += 1; // Contagem de artigos (linhas)
      totalPrice += lineTotal; // Soma do valor total de estoque
    
      const li = document.createElement('li');
      
      // Cria o conteúdo do li imediatamente
      li.innerHTML = `
        <p>${article.name}</p>
        <p>${article.quantity}</p>
        <p>€ ${lineTotal.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p>${article.category}</p>
         <div class="display-edit-delete">
             <div>
                <button class="edit-btn" title="Editar"></button>
                <button class="delete-btn" title="Excluir"></button>
             </div>
             <div class="article-meta-info">
                 <span>${dateStr}</span>
                 <span>${timeStr} Uhr</span>
                 <span> - Stk.-Preis: ${Number(article.price).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</span>
             </div>
         </div>
      `;
      
      // Adiciona o li à lista na tela
      ul.appendChild(li);

      // Evento para mostrar/esconder os botões ao clicar na linha
      li.addEventListener('click', (e) => {
        // Não fecha se clicar nos próprios botões
        if (e.target.closest('button')) return;
        
        li.classList.toggle('selected');
        const actionDiv = li.querySelector('.display-edit-delete');
        actionDiv.classList.toggle('active');
      });

      // Configura o botão de Excluir
      li.querySelector('.delete-btn').addEventListener('click', async (e) => {
        e.stopPropagation(); // Evita acionar o click do li

        const hasPermission = await checkPermission();
        if (!hasPermission) return;

        if(confirm(`Deseja realmente excluir o artigo "${article.name}"?`)) {
            await fetch(`/api/products/${encodeURIComponent(article.name)}`, {
            method: 'DELETE'
            });
            await loadArticles();
        }
      });

      // Configura o botão de Editar
      li.querySelector('.edit-btn').addEventListener('click', async (e) => {
        e.stopPropagation(); // Evita acionar o click do li

        const hasPermission = await checkPermission();
        if (!hasPermission) return;

        // Abrir modal de edição
        const modal = document.getElementById('edit-modal');
        modal.style.display = 'flex';
        // Preencher campos
        document.getElementById('edit-name').value = article.name;
        document.getElementById('edit-quantity').value = article.quantity;
        document.getElementById('edit-price').value = article.price;
        document.getElementById('edit-category').value = article.category;

        // Salvar edição
        const editForm = document.getElementById('edit-article-form');
        editForm.onsubmit = async function(e) {
          e.preventDefault();
          const newName = document.getElementById('edit-name').value;
          const newQuantity = parseFloat(document.getElementById('edit-quantity').value);
          const newPrice = parseFloat(document.getElementById('edit-price').value);
          const newCategory = document.getElementById('edit-category').value;
          // Atualiza todos os campos do artigo
          await fetch(`/api/products/${encodeURIComponent(article.name)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName, quantity: newQuantity, price: newPrice, category: newCategory })
          });
          modal.style.display = 'none';
          await loadArticles();
        };
        // Cancelar edição
        document.getElementById('cancel-edit').onclick = function() {
          modal.style.display = 'none';
        };
        document.getElementById('close-modal').onclick = function() {
          modal.style.display = 'none';
        };
      });
    });

    // Atualiza totais na tela
    document.getElementById('total-articles').textContent = totalQuantity;
    document.getElementById('total-price').textContent = '€ ' + totalPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  } catch (err) {
    ul.innerHTML = '<li><p>Erro ao carregar artigos.</p></li>';
    console.error(err);
  }
}

// Carrega os artigos ao abrir a página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadArticles);
} else {
  loadArticles();
}


