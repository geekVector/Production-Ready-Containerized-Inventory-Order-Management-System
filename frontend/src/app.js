import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// ==========================================
// GLOBAL CONFIGURATION (Points to your live Render Backend)
// ==========================================
axios.defaults.baseURL = 'https://inventory-backend-v1-1.onrender.com';

// ==========================================
// STYLED COMPONENTS (Unified Dark Theme)
// ==========================================
const AppLayout = styled.div`
  display: flex;
  background-color: #0b0e14;
  color: #ffffff;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Sidebar = styled.div`
  width: 240px;
  background-color: #121721;
  border-right: 1px solid #1e2633;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Brand = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #3b42f5;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavItem = styled.button`
  background: ${props => props.active ? '#1e2633' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#6c7a89'};
  border: none;
  padding: 12px 16px;
  border-radius: 6px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #1e2633;
    color: #ffffff;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 40px;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const TitleSection = styled.div`
  h1 { margin: 0 0 8px 0; font-size: 28px; font-weight: 700; }
  p { margin: 0; color: #6c7a89; font-size: 14px; }
`;

const PrimaryButton = styled.button`
  background-color: #3b42f5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background-color: #2a31d4; }
`;

const DangerButton = styled(PrimaryButton)`
  background-color: #ef4444;
  &:hover { background-color: #dc2626; }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const Card = styled.div`
  background-color: #121721;
  border: 1px solid #1e2633;
  border-radius: 8px;
  padding: 20px;
`;

const CardTitle = styled.div` font-size: 12px; color: #6c7a89; text-transform: uppercase; margin-bottom: 12px; `;
const CardValue = styled.div` font-size: 28px; font-weight: 700; color: ${props => props.isPrice ? '#10b981' : '#ffffff'}; `;

const FormBlock = styled.form`
  background: #121721;
  border: 1px solid #1e2633;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 500px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  background: #0b0e14;
  border: 1px solid #1e2633;
  color: white;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
`;

const TableSection = styled.div`
  background-color: #121721;
  border: 1px solid #1e2633;
  border-radius: 8px;
  padding: 20px;
`;

const DynamicTable = styled.table` width: 100%; border-collapse: collapse; text-align: left; `;
const Th = styled.th` color: #6c7a89; font-size: 12px; font-weight: 500; padding: 12px; border-bottom: 1px solid #1e2633; text-transform: uppercase; `;
const Td = styled.td` padding: 16px; border-bottom: 1px solid #1e2633; font-size: 14px; `;

// ==========================================
// CORE APPLICATION CONTAINER
// ==========================================
export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Core Data States
  const [summary, setSummary] = useState({ totalProducts: 0, totalOrders: 0, totalCustomers: 0, totalRevenue: 0 });
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Form Management States
  const [productForm, setProductForm] = useState({ name: '', price: '', stock: '' });
  const [customerForm, setCustomerForm] = useState({ name: '', email: '' });
  const [editingProductId, setEditingProductId] = useState(null);

  // Synchronize system data collections
  const syncEcosystemData = async () => {
    try {
      const summaryRes = await axios.get('/api/dashboard/summary');
      const productsRes = await axios.get('/api/products');
      const customersRes = await axios.get('/api/customers');
      
      setSummary(summaryRes.data);
      setProducts(productsRes.data);
      setCustomers(customersRes.data);
      setLoading(false);
    } catch (error) {
      console.error("API sync breakdown:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    syncEcosystemData();
  }, []);

  // Form Submit Operations
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = { name: productForm.name, price: parseFloat(productForm.price), stock: parseInt(productForm.stock) };
    try {
      if (editingProductId) {
        await axios.put(`/api/products/${editingProductId}`, payload);
        setEditingProductId(null);
      } else {
        await axios.post('/api/products', payload);
      }
      setProductForm({ name: '', price: '', stock: '' });
      syncEcosystemData();
    } catch (err) { console.error(err); }
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/customers', customerForm);
      setCustomerForm({ name: '', email: '' });
      syncEcosystemData();
    } catch (err) { console.error(err); }
  };

  const handleProductDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      syncEcosystemData();
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return <AppLayout style={{justifyContent:'center', alignItems:'center'}}>Syncing with live engine layers...</AppLayout>;
  }

  return (
    <AppLayout>
      <Sidebar>
        <Brand>📦 IMS Enterprise</Brand>
        <NavItem active={currentTab === 'dashboard'} onClick={() => setCurrentTab('dashboard')}>📊 Control Panel</NavItem>
        <NavItem active={currentTab === 'products'} onClick={() => setCurrentTab('products')}>📦 Manage Catalog</NavItem>
        <NavItem active={currentTab === 'customers'} onClick={() => setCurrentTab('customers')}>👤 Client Database</NavItem>
      </Sidebar>

      <MainContent>
        {/* ========================================== VIEW 1: DASHBOARD ========================================== */}
        {currentTab === 'dashboard' && (
          <>
            <Header>
              <TitleSection>
                <h1>Inventory Control Panel</h1>
                <p>Real-time supply chain monitoring, metrics, and tracking optimization analytics.</p>
              </TitleSection>
              <PrimaryButton onClick={() => setCurrentTab('products')}>+ Add New Product</PrimaryButton>
            </Header>

            <MetricsGrid>
              <Card><CardTitle>Total SKU Items</CardTitle><CardValue>{summary.totalProducts}</CardValue></Card>
              <Card><CardTitle>Live Customers</CardTitle><CardValue>{summary.totalCustomers}</CardValue></Card>
              <Card><CardTitle>Pending Orders</CardTitle><CardValue>{summary.totalOrders}</CardValue></Card>
              <Card><CardTitle>Gross Valuation</CardTitle><CardValue isPrice>${summary.totalRevenue.toFixed(2)}</CardValue></Card>
            </MetricsGrid>

            <TableSection>
              <h3>Fast-Glance Stock Records</h3>
              <DynamicTable>
                <thead>
                  <tr><Th>ID</Th><Th>Product Name</Th><Th>Unit Price</Th><Th>Current Volume</Th></tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <Td>{p.id}</Td><Td style={{fontWeight:'600'}}>{p.name}</Td><Td>${p.price.toFixed(2)}</Td>
                      <Td style={{color: p.stock < 10 ? '#f59e0b' : '#10b981'}}>{p.stock} Units</Td>
                    </tr>
                  ))}
                </tbody>
              </DynamicTable>
            </TableSection>
          </>
        )}

        {/* ========================================== VIEW 2: PRODUCTS CRUD ========================================== */}
        {currentTab === 'products' && (
          <>
            <Header>
              <TitleSection>
                <h1>Catalog Inventory Pipeline</h1>
                <p>Register new production stock items, edit catalog details, or alter unit volumes.</p>
              </TitleSection>
            </Header>

            <FormBlock onSubmit={handleProductSubmit}>
              <h3>{editingProductId ? '✏️ Edit Selected Item' : '✨ Register New Catalog Entry'}</h3>
              <InputField type="text" placeholder="Item Label Name" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required />
              <InputField type="number" step="0.01" placeholder="MSRP Unit Price ($)" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required />
              <InputField type="number" placeholder="Warehouse Inventory Units" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} required />
              <div style={{display:'flex', gap:'10px'}}>
                <PrimaryButton type="submit">{editingProductId ? 'Update Item Data' : 'Commit To Database'}</PrimaryButton>
                {editingProductId && <DangerButton type="button" onClick={() => { setEditingProductId(null); setProductForm({name:'', price:'', stock:''}); }}>Cancel</DangerButton>}
              </div>
            </FormBlock>

            <TableSection>
              <DynamicTable>
                <thead>
                  <tr><Th>ID</Th><Th>Name</Th><Th>Price</Th><Th>Stock Volume</Th><Th style={{textAlign:'right'}}>Actions Matrix</Th></tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <Td>{p.id}</Td><Td>{p.name}</Td><Td>${p.price.toFixed(2)}</Td><Td>{p.stock} units</Td>
                      <Td style={{textAlign:'right', display:'flex', gap:'8px', justifyContent:'flex-end'}}>
                        <PrimaryButton onClick={() => { setEditingProductId(p.id); setProductForm({name: p.name, price: p.price, stock: p.stock}); }}>Edit</PrimaryButton>
                        <DangerButton onClick={() => handleProductDelete(p.id)}>Delete</DangerButton>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </DynamicTable>
            </TableSection>
          </>
        )}

        {/* ========================================== VIEW 3: CUSTOMERS CRUD ========================================== */}
        {currentTab === 'customers' && (
          <>
            <Header>
              <TitleSection>
                <h1>Client Relations Database</h1>
                <p>View registered clients or attach new accounts to the system matrix.</p>
              </TitleSection>
            </Header>

            <FormBlock onSubmit={handleCustomerSubmit}>
              <h3>👤 Profile New System Client</h3>
              <InputField type="text" placeholder="Full Legal Client Name" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} required />
              <InputField type="email" placeholder="Direct Communication Email Address" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} required />
              <PrimaryButton type="submit">Bind Profile Record</PrimaryButton>
            </FormBlock>

            <TableSection>
              <DynamicTable>
                <thead>
                  <tr><Th>System Account ID</Th><Th>Identified Client Name</Th><Th>Routing Communication Email</Th></tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id}><Td>{c.id}</Td><Td style={{fontWeight:'600'}}>{c.name}</Td><Td>{c.email}</Td></tr>
                  ))}
                </tbody>
              </DynamicTable>
            </TableSection>
          </>
        )}
      </MainContent>
    </AppLayout>
  );
}