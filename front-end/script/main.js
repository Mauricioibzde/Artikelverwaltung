import './modules/customSelect.js';
import './modules/maskCurrencyInput.js';
import './modules/formatQuantity.js';
import './modules/formData.js';
import { loadArticles } from './modules/loadArticles.js';
import { initTutorial } from './modules/tutorial.js';

// Inicializa o tutorial
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTutorial);
} else {
    initTutorial();
}
