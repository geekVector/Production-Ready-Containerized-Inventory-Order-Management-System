import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const Card = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  border-left: 5px solid ${props => props.color || '#007bff'};
`;

const CardTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #6c757d;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
`;

const CardValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #212529;
`;

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const fetchSummaryData = async () => {
    try {
      const response = await axios.get('/api/dashboard/summary');
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
    }
  };

  return (
    <div>
      <h2>Dashboard Overview</h2>
      <Grid>
        <Card color="#28a745">
          <CardTitle>Total Revenue</CardTitle>
          <CardValue>${summary.totalRevenue.toFixed(2)}</CardValue>
        </Card>
        
        <Card color="#007bff">
          <CardTitle>Products in Catalog</CardTitle>
          <CardValue>{summary.totalProducts}</CardValue>
        </Card>

        <Card color="#ffc107">
          <CardTitle>Orders Processed</CardTitle>
          <CardValue>{summary.totalOrders}</CardValue>
        </Card>

        <Card color="#17a2b8">
          <CardTitle>Active Customers</CardTitle>
          <CardValue>{summary.totalCustomers}</CardValue>
        </Card>
      </Grid>
    </div>
  );
};

export default Dashboard;