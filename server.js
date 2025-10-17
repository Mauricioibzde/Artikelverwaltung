// server.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// === MIDDLEWARES ===
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // HTML/JS na pasta public

// === CONEXÃO COM SQLITE3 ===
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) return console.error(err.message);
    console.log('Conectado ao banco SQLite3.');
});

// Criar tabela se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL
    )
`);

// ===================== ROTAS =====================

// Listar artigos
app.get('/articles', (req, res) => {
    db.all('SELECT * FROM articles', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Adicionar artigo
app.post('/articles', (req, res) => {
    const { name, quantity, price, category } = req.body;

    // Validação básica
    if (!name || typeof name !== "string" || !quantity || isNaN(quantity) || !price || isNaN(price) || !category) {
        return res.status(400).json({ error: "Dados inválidos" });
    }

    db.run(
        'INSERT INTO articles (name, quantity, price, category) VALUES (?, ?, ?, ?)',
        [name, quantity, price, category],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, name, quantity, price, category });
        }
    );
});

// Atualizar artigo
app.put('/articles/:id', (req, res) => {
    const { name, quantity, price, category } = req.body;
    const id = req.params.id;

    if (!name || typeof name !== "string" || !quantity || isNaN(quantity) || !price || isNaN(price) || !category) {
        return res.status(400).json({ error: "Dados inválidos" });
    }

    db.run(
        'UPDATE articles SET name = ?, quantity = ?, price = ?, category = ? WHERE id = ?',
        [name, quantity, price, category, id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: "Artigo não encontrado" });
            res.json({ id, name, quantity, price, category });
        }
    );
});

// Remover artigo
app.delete('/articles/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM articles WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Artigo não encontrado" });
        res.json({ message: "Artigo removido com sucesso" });
    });
});

// ===================== ENCERRAMENTO SEGURO =====================
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) console.error(err.message);
        console.log('Conexão com SQLite3 encerrada.');
        process.exit(0);
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
