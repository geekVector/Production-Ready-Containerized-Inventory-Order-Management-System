const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS so your React application can communicate with this API safely
app.use(cors());
app.use(express.json());

// ==========================================
// MOCK DATA STORAGE (Central In-Memory State)
// ==========================================
let customers = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

let products = [
  { id: 1, name: 'Lenovo Legion Monitor', price: 249.99, stock: 15 },
  { id: 2, name: 'DualSense Edge Controller', price: 199.99, stock: 8 }
];

let orders = [
  { id: 1001, customer_name: 'John Doe', total_amount: 249.99, created_at: new Date('2026-05-15').toISOString() },
  { id: 1002, customer_name: 'Jane Smith', total_amount: 399.98, created_at: new Date().toISOString() }
];

// ==========================================
// SYSTEM CHECK ROUTES
// ==========================================
app.get('/health', (req, res) => res.json({ status: 'Backend API is running cleanly' }));
app.get('/api/data', (req, res) => res.json({ message: 'Backend data response' }));

// ==========================================
// DASHBOARD ENDPOINT (Used by dashboard.js)
// ==========================================
app.get('/api/dashboard/summary', (req, res) => {
  // Dynamically calculate cumulative stats directly from live data updates
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  
  res.json({
    totalProducts: products.length,
    totalOrders: orders.length,
    totalCustomers: customers.length,
    totalRevenue: totalRevenue
  });
});

// ==========================================
// CUSTOMER CRUD OPERATIONS (Used by Customer.js)
// ==========================================
app.get('/api/customers', (req, res) => res.json(customers));

app.post('/api/customers', (req, res) => {
  const newCustomer = {
    id: customers.length ? Math.max(...customers.map(c => c.id)) + 1 : 1,
    name: req.body.name,
    email: req.body.email
  };
  customers.push(newCustomer);
  res.status(201).json(newCustomer);
});

app.put('/api/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = customers.findIndex(c => c.id === id);
  if (index !== -1) {
    customers[index] = { id, name: req.body.name, email: req.body.email };
    res.json(customers[index]);
  } else {
    res.status(404).json({ error: 'Customer not found' });
  }
});

app.delete('/api/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  customers = customers.filter(c => c.id !== id);
  res.json({ message: 'Customer successfully deleted' });
});

// ==========================================
// PRODUCT CRUD OPERATIONS (Used by product.js)
// ==========================================
app.get('/api/products', (req, res) => res.json(products));

app.post('/api/products', (req, res) => {
  const newProduct = {
    id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name: req.body.name,
    price: parseFloat(req.body.price),
    stock: parseInt(req.body.stock)
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = {
      id,
      name: req.body.name,
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock)
    };
    res.json(products[index]);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  res.json({ message: 'Product successfully deleted from catalog' });
});

// ==========================================
// ORDER OPERATIONS (Used by Orders.js)
// ==========================================
app.get('/api/orders', (req, res) => res.json(orders));

app.listen(port, () => {
  console.log(`Backend production engine running on port ${port}`);
});