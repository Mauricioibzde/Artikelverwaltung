// API RESTful para artigos usando Express e MongoDB Atlas
// Instale as dependências: npm install express mongoose cors

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../front-end')));

// Conexão com o MongoDB Atlas
const uri = 'mongodb+srv://mauricioibzgang_db_user:Z4S8NMHYycquV1PP@cluster0.4pmoavj.mongodb.net/artikelverwaltung';
mongoose.connect(uri);

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  category: String,
  date: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', productSchema);

// Rota para inserir um novo artigo
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Rota para buscar todos os artigos
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Rota para buscar artigos por categoria
app.get('/api/products/category/:category', async (req, res) => {
  const products = await Product.find({ category: req.params.category });
  res.json(products);
});

// Rota para atualizar um artigo (Nome, Quantidade, Preço, Categoria)
app.put('/api/products/:name', async (req, res) => {
  try {
    const { name, quantity, price, category } = req.body;
    // Atualiza buscando pelo nome antigo (req.params.name)
    // Se o nome foi alterado, ele será atualizado no banco também
    const updatedProduct = await Product.findOneAndUpdate(
      { name: req.params.name },
      { name, quantity, price, category },
      { new: true } // Retorna o documento atualizado
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Artigo não encontrado." });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para remover um artigo
app.delete('/api/products/:name', async (req, res) => {
  const result = await Product.deleteOne({ name: req.params.name });
  res.json(result);
});

// Rota de agregação: total de artigos por categoria
app.get('/api/products/aggregate/totalByCategory', async (req, res) => {
  const result = await Product.aggregate([
    { $group: { _id: '$category', total: { $sum: '$quantity' } } }
  ]);
  res.json(result);
});

// Inicia o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
