import { priceInput } from "./maskCurrencyInput.js";
import { nameInput } from "./maskTextInput.js";
import { quantityInput } from "./formatQuantity.js";  
import { getSelectedCategory } from '../modules/customSelect.js';


// Listener para exibir todos os valores no console ao enviar o formulário


	const form = document.getElementById('article-form');
	form.addEventListener('submit', async function(e) {
		e.preventDefault();
		const nome = nameInput.value;
		const quantidade = quantityInput.value;
		const preco = priceInput.value;
		const categoria = getSelectedCategory();

        if (!nome || !quantidade || !preco || categoria === 'Select category') {
            alert('Please fill in all fields!');
            return;
        }

       // Send data to the REST API created in the backend
       await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nome,
                quantity: parseFloat(quantidade.replace(/\./g, '').replace(',', '.')), // convert to number
                price: parseFloat(preco.replace(/\./g, '').replace(',', '.')), // convert to number
                category: categoria
            })
        })
        .then(response => response.json())
        .then(data => {
            alert('Article registered successfully!');
            console.log('Success:', data);
        })
        .catch((error) => {
            alert('Error registering article.');
            console.error('Error:', error);
        });
        



		console.log('Article Name:', nome);
		console.log('Quantity:', quantidade);
		console.log('Price:', preco);
		console.log('Category:', categoria);

        // Aqui você pode adicionar a lógica para enviar os dados para o backend ou processá-los conforme necessário

	});
