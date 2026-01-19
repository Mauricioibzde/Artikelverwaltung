// State variable (automatic persistence removed to always ask for password)
// let isAdminLoggedIn = false; 

// Helper function to request password
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
             // MASTER PASSWORD DEFINED HERE (Ex: "admin123")
            if (input.value === 'admin123') {
                // isAdminLoggedIn = true; // Não salva mais na sessão
                modal.style.display = 'none';
                cleanup();
                resolve(true);
            } else {
                alert('Incorrect password!');
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
        
        // Press Enter to confirm
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
      ul.innerHTML = '<li><p>No articles registered.</p></li>';
      return;
    }
    let totalQuantity = 0;
    let totalPrice = 0;

    articles.forEach(article => {
      // Ignore invalid articles (without name or corrupted data)
      if (!article.name || article.name === 'null' || !article.price) return;

      // Format date and time
      const addedDate = article.date ? new Date(article.date) : new Date();
      const dateStr = addedDate.toLocaleDateString('en-US'); // or 'de-DE'
      const timeStr = addedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      // Calculate the total for this line (Unit Price * Quantity)
      const lineTotal = article.price * article.quantity;

      totalQuantity += 1; // Count of articles (rows)
      totalPrice += lineTotal; // Sum of total stock value
    
      const li = document.createElement('li');
      
      // Cria o conteúdo do li imediatamente
      li.innerHTML = `
        <p>${article.name}</p>
        <p>${article.quantity}</p>
        <p>€ ${lineTotal.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p>${article.category}</p>
         <div class="display-edit-delete">
             <div>
                <button class="edit-btn" title="Edit"></button>
                <button class="delete-btn" title="Delete"></button>
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

      // Event to show/hide buttons when clicking on the row
      li.addEventListener('click', (e) => {
        // Don't close if clicking on the buttons themselves
        if (e.target.closest('button')) return;
        
        li.classList.toggle('selected');
        const actionDiv = li.querySelector('.display-edit-delete');
        actionDiv.classList.toggle('active');
      });

      // Configure the Delete button
      li.querySelector('.delete-btn').addEventListener('click', async (e) => {
        e.stopPropagation(); // Prevent triggering the li click

        const hasPermission = await checkPermission();
        if (!hasPermission) return;

        if(confirm(`Are you sure you want to delete the article "${article.name}"?`)) {
            await fetch(`/api/products/${encodeURIComponent(article.name)}`, {
            method: 'DELETE'
            });
            await loadArticles();
        }
      });

      // Configure the Edit button
      li.querySelector('.edit-btn').addEventListener('click', async (e) => {
        e.stopPropagation(); // Prevent triggering the li click

        const hasPermission = await checkPermission();
        if (!hasPermission) return;

        // Open edit modal
        const modal = document.getElementById('edit-modal');
        modal.style.display = 'flex';
        // Fill in fields
        document.getElementById('edit-name').value = article.name;
        document.getElementById('edit-quantity').value = article.quantity;
        document.getElementById('edit-price').value = article.price;
        document.getElementById('edit-category').value = article.category;

        // Save edit
        const editForm = document.getElementById('edit-article-form');
        editForm.onsubmit = async function(e) {
          e.preventDefault();
          const newName = document.getElementById('edit-name').value;
          const newQuantity = parseFloat(document.getElementById('edit-quantity').value);
          const newPrice = parseFloat(document.getElementById('edit-price').value);
          const newCategory = document.getElementById('edit-category').value;
          // Update all article fields
          await fetch(`/api/products/${encodeURIComponent(article.name)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName, quantity: newQuantity, price: newPrice, category: newCategory })
          });
          modal.style.display = 'none';
          await loadArticles();
        };
        // Cancel edit
        document.getElementById('cancel-edit').onclick = function() {
          modal.style.display = 'none';
        };
        document.getElementById('close-modal').onclick = function() {
          modal.style.display = 'none';
        };
      });
    });

    // Update totals on screen
    document.getElementById('total-articles').textContent = totalQuantity;
    document.getElementById('total-price').textContent = '€ ' + totalPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  } catch (err) {
    ul.innerHTML = '<li><p>Error loading articles.</p></li>';
    console.error(err);
  }
}

// Load articles when opening the page
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadArticles);
} else {
  loadArticles();
}


