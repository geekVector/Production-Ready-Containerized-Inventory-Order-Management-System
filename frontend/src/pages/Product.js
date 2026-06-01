import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const Th = styled.th`
  background-color: #f8f9fa;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;

  &:hover {
    background-color: #0056b3;
  }
`;

const ProductForm = styled.form`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Product = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (editingId) {
        await axios.put(`/api/products/${editingId}`, formattedData);
        setEditingId(null);
      } else {
        await axios.post('/api/products', formattedData);
      }
      fetchProducts();
      setFormData({ name: '', price: '', stock: '' });
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setFormData({ name: product.name, price: product.price, stock: product.stock });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div>
      <h2>Products Inventory</h2>
      
      <ProductForm onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
        <Input
          type="text"
          placeholder="Product Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Price ($)"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          required
        />
        <Input
          type="number"
          placeholder="Stock Quantity"
          value={formData.stock}
          onChange={(e) => setFormData({...formData, stock: e.target.value})}
          required
        />
        <Button type="submit">
          {editingId ? 'Update Product' : 'Add Product'}
        </Button>
        {editingId && (
          <Button type="button" onClick={() => {
            setEditingId(null);
            setFormData({ name: '', price: '', stock: '' });
          }}>
            Cancel
          </Button>
        )}
      </ProductForm>

      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Price</Th>
            <Th>Stock Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <Td>{product.id}</Td>
              <Td>{product.name}</Td>
              <Td>${product.price.toFixed(2)}</Td>
              <Td>{product.stock} units</Td>
              <Td>
                <Button onClick={() => handleEdit(product)}>Edit</Button>
                <Button onClick={() => handleDelete(product.id)}>Delete</Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Product;