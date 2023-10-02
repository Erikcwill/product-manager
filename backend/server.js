// backend/server.js

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
});

const Product = mongoose.model('Product', ProductSchema);

app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const { name } = req.body;
  const product = new Product({ name });
  await product.save();
  res.json(product);
});

app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndRemove(id);
  res.json({ message: 'Product removed successfully' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
