const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://erikcwill:DWipznRYfU8Lm3Rf@databases.xpmudft.mongodb.net/databases?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number, // Novo campo para preço
  category: String, // Novo campo para categoria
});

const Product = mongoose.model('Product', ProductSchema);

app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const { name, price, category } = req.body;

  // Verifique se o nome não está vazio
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'O campo "Nome" é obrigatório.' });
  }

  // Verifique se o preço é um número válido
  if (isNaN(price) || price < 0) {
    return res.status(400).json({ error: 'O campo "Preço" deve ser um número válido maior ou igual a zero.' });
  }

  // Verifique se a categoria não está vazia
  if (!category || category.trim() === '') {
    return res.status(400).json({ error: 'O campo "Categoria" é obrigatório.' });
  }

  const product = new Product({ name, price, category });

  try {
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ocorreu um erro ao adicionar o produto.' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndRemove(id);
  res.json({ message: 'Produto removido com sucesso' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`O servidor está rodando na porta ${PORT}`);
});
