import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleAddProduct = () => {
    axios.post('http://localhost:5000/api/products', {
      name: newProduct,
      price: parseFloat(newPrice.replace(',', '.')), // Formate o preço para um número com ponto decimal
      category: newCategory,
    })
      .then((response) => {
        setProducts([...products, response.data]);
        setNewProduct('');
        setNewPrice('');
        setNewCategory('');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleRemoveProduct = (productId) => {
    axios.delete(`http://localhost:5000/api/products/${productId}`)
      .then(() => {
        setProducts(products.filter((product) => product._id !== productId));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Gerenciamento de Produtos</h1>
      <div>
        <input
          type="text"
          placeholder="Digite o nome do produto"
          value={newProduct}
          onChange={(e) => setNewProduct(e.target.value)}
        />
        <input
          type="text"
          placeholder="Digite o preço do produto (exemplo: 10,59)"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Digite a categoria do produto"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddProduct}>Adicionar Produto</button>
      </div>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <strong>Nome:</strong> {product.name}<br />
            <strong>Preço:</strong> R$ {parseFloat(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<br />
            <strong>Categoria:</strong> {product.category}<br />
            <button onClick={() => handleRemoveProduct(product._id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManagement;
