// Exemplo completo de uso do MongoDB Atlas com Node.js e Mongoose
// Substitua <usuario>, <senha> e <cluster-url> pela sua string de conexão do Atlas

const mongoose = require('mongoose');

// 1. Conexão com o banco de dados MongoDB Atlas
const uri = `mongodb+srv://mauricioibzgang_db_user:Z4S8NMHYycquV1PP@cluster0.4pmoavj.mongodb.net/artikelverwaltung`
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// 2. Definição do schema (estrutura dos documentos na coleção)
const productSchema = new mongoose.Schema({
  name: String,        // Nome do produto/artigo
  price: Number,       // Preço
  quantity: Number,    // Quantidade
  category: String,    // Categoria
  date: { type: Date, default: Date.now } // Data de inserção
});

// 3. Criação do modelo (model) para a coleção 'products'
const Product = mongoose.model('Product', productSchema);

// 4. Função para inserir artigos
async function insertProducts() {
  await Product.insertMany([
    { name: 'Notebook', price: 2500.50, quantity: 5, category: 'Eletrônicos' },
    { name: 'Camiseta', price: 49.90, quantity: 20, category: 'Vestuário' }
  ]);
  console.log('Artigos inseridos!');
}

// 5. Função para buscar todos os artigos
async function findAll() {
  const products = await Product.find();
  console.log('Todos os artigos:', products);
}

// 6. Função para buscar artigos de uma categoria específica
async function findByCategory(category) {
  const products = await Product.find({ category });
  console.log(`Artigos da categoria ${category}:`, products);
}

// 7. Função para atualizar o preço de um artigo
async function updatePrice(name, newPrice) {
  await Product.updateOne({ name }, { $set: { price: newPrice } });
  console.log(`Preço do artigo ${name} atualizado!`);
}

// 8. Função para remover um artigo
async function deleteProduct(name) {
  await Product.deleteOne({ name });
  console.log(`Artigo ${name} removido!`);
}

// 9. Função de agregação: total de artigos por categoria
async function totalByCategory() {
  const result = await Product.aggregate([
    { $group: { _id: '$category', total: { $sum: '$quantity' } } }
  ]);
  console.log('Total de artigos por categoria:', result);
}

// 10. Exemplo de uso das funções acima
async function main() {
  await insertProducts(); // Insere artigos
  await findAll(); // Busca todos
  await findByCategory('Eletrônicos'); // Busca por categoria
  await updatePrice('Notebook', 2400.00); // Atualiza preço
  await deleteProduct('Camiseta'); // Remove artigo
  await totalByCategory(); // Agregação
  mongoose.disconnect(); // Encerra conexão
}

main();
