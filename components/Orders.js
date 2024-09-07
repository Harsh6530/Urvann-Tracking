"use client";
import React from 'react';
import Styles from './Orders.module.css';
import { useRouter } from 'next/navigation';

const ordersData = [
  { id: "1", orderNumber: 'A001', date: '2024-09-01', customer: 'John Doe', status: 'Not Picked' },
  { id: "2", orderNumber: 'A002', date: '2024-09-02', customer: 'Jane Smith', status: 'Picked' },
  { id: "3", orderNumber: 'A003', date: '2024-09-03', customer: 'Alice Johnson', status: 'Delivered' },
  { id: "4", orderNumber: 'A004', date: '2024-09-04', customer: 'Bob Johnson', status: 'Not Picked' },
  { id: "5", orderNumber: 'A005', date: '2024-09-05', customer: 'Sarah Davis', status: 'Picked' },
  // Add more orders as needed
];

const Orders = () => {
  const router = useRouter();

  const handleOrderClick = (orderId) => {
    router.push(`/orders/${orderId}`);
  };

  return (
    <div className={Styles.ordersContainer}>
      <h2 className={Styles.header}>Orders List</h2>
      <table className={Styles.ordersTable}>
        <thead>
          <tr className={Styles.tableHeader}>
            <th>Order #</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Status</th>
            <th>View Status</th>
          </tr>
        </thead>
        <tbody>
          {ordersData.map((order) => (
            <tr key={order.id} className={Styles.tableRow}>
              <td>{order.orderNumber}</td>
              <td>{order.date}</td>
              <td>{order.customer}</td>
              <td className={Styles[`status${order.status.replace(' ', '')}`]}>{order.status}</td>
              <td>
                <button
                  className={Styles.detailsButton}
                  onClick={() => handleOrderClick(order.id)}
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
