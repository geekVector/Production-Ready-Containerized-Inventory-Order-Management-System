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

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div>
      <h2>Orders</h2>
      
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Customer</Th>
            <Th>Total Amount</Th>
            <Th>Date</Th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <Td>{order.id}</Td>
              <Td>{order.customer_name}</Td>
              <Td>${order.total_amount.toFixed(2)}</Td>
              <Td>{new Date(order.created_at).toLocaleDateString()}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Orders;
