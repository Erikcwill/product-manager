// src/components/ProductManagement.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');

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
    axios.post('http://localhost:5000/api/products', { name: newProduct })
      .then((response) => {
        setProducts([...products, response.data]);
        setNewProduct('');
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
      <h1>Product Management</h1>
      <div>
        <input
          type="text"
          placeholder="Enter product name"
          value={newProduct}
          onChange={(e) => setNewProduct(e.target.value)}
        />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.name}
            <button onClick={() => handleRemoveProduct(product._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManagement;
