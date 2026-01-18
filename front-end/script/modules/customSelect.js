// Função utilitária para obter o valor selecionado do custom select
export function getSelectedCategory() {
  const selected = document.querySelector('#custom-select-category .custom-select-selected');
  return selected ? selected.textContent : '';
}

// Defina as categorias para o select personalizado
const categories = [
  'Elektronik',
  'Haushalt',
  'Kleidung',
  'Bücher',
  'Spielzeug',
    'Sportartikel',
    'Möbel',
    'Lebensmittel',
    'Getränke',
    'Kosmetik'
];



// Custom Select Logic - Dynamic
document.addEventListener('DOMContentLoaded', function () {
  const customSelect = document.getElementById('custom-select-category');
  if (!customSelect) return;
  const selected = customSelect.querySelector('.custom-select-selected');
  const items = customSelect.querySelector('.custom-select-items');

  // Limpa opções existentes
  items.innerHTML = '';
  // Cria opções dinamicamente
  categories.forEach(category => {
    const p = document.createElement("p");
    p.textContent = category;
    items.appendChild(p);
  });

  selected.addEventListener('click', function (e) {
    customSelect.classList.toggle('open');
  });

  items.addEventListener('click', function (e) {
    if (e.target && e.target.nodeName === 'P') {
      selected.textContent = e.target.textContent;
      Array.from(items.children).forEach(opt => opt.classList.remove('same-as-selected'));
      e.target.classList.add('same-as-selected');
      customSelect.classList.remove('open');
    }
  });

  // Fecha o select se clicar fora
  document.addEventListener('click', function (e) {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove('open');
    }
  });
});
