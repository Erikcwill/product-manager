import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');

  // Fetch products from the backend on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  // Function to add a new product
  const addProduct = () => {
    axios.post('http://localhost:5000/api/products', { name: newProduct })
      .then((response) => {
        console.log("Resposta do servidor após adicionar produto:", response.data); // Adicione esta linha para depuração
        setProducts([...products, response.data]);
        setNewProduct('');
      })
      .catch((error) => {
        console.error('Error adding product:', error);
      });
  };

  // Function to remove a product
  const removeProduct = (productId) => {
    console.log("ID do produto a ser removido:", productId); // Adicione esta linha para depuração
    axios.delete(`http://localhost:5000/api/products/${productId}`)
      .then(() => {
        setProducts(products.filter(product => product._id !== productId));
      })
      .catch((error) => {
        console.error('Error removing product:', error);
      });
  };

  return (
    <div>
      <h1>Product Manager</h1>
      <div>
        <input
          type="text"
          placeholder="Enter product name"
          value={newProduct}
          onChange={(e) => setNewProduct(e.target.value)}
        />
        <button onClick={addProduct}>Add Product</button>
      </div>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name}
            <button onClick={() => removeProduct(product._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManager;
