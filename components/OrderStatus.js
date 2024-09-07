"use client";
import React from 'react';
import Styles from './OrderStatus.module.css';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

// Same orders data or fetched from a backend/API
const ordersData = [
  { id: "1", orderNumber: 'A001', date: '2024-09-01', customer: 'John Doe', status: 'Not Picked' },
  { id: "2", orderNumber: 'A002', date: '2024-09-02', customer: 'Jane Smith', status: 'Picked' },
  { id: "3", orderNumber: 'A003', date: '2024-09-03', customer: 'Alice Johnson', status: 'Delivered' },
  { id: "4", orderNumber: 'A004', date: '2024-09-04', customer: 'Bob Johnson', status: 'Not Picked' },
  { id: "5", orderNumber: 'A005', date: '2024-09-05', customer: 'Sarah Davis', status: 'Picked' },
];

const statusSteps = ['Not Picked', 'Picked', 'Delivered'];

const OrderStatus = (props) => {
  const { orderId } = props;
  const router = useRouter();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    router.push('/login');
  }

  const order = ordersData.find((order) => order.id === orderId);

  if (!order) {
    return <p className={Styles.error}>Order not found</p>;
  }

  const currentStatusIndex = statusSteps.indexOf(order.status);

  // Filter the steps to only include up to and including the current status
  const relevantSteps = statusSteps.slice(0, currentStatusIndex + 1);

  return (
    <div className={Styles.statusContainer}>
      <button className={Styles.backButton} onClick={() => { router.push('/orders') }}>
        Back
      </button>
      <h2 className={Styles.header}>Order Status</h2>
      <div className={Styles.orderDetails}>
        <p><strong>Order Number:</strong> {order.orderNumber}</p>
        <p><strong>Date:</strong> {order.date}</p>
        <p><strong>Customer:</strong> {order.customer}</p>
        <p><strong>Status:</strong> <span className={Styles[`status${order.status.replace(' ', '')}`]}>{order.status}</span></p>
      </div>
      <div className={Styles.statusTimeline}>
        {relevantSteps.map((step, index) => (
          <div
            key={step}
            className={`${Styles.statusStep} ${index === currentStatusIndex ? Styles.completed : ''}`}
          >
            <div className={Styles.stepCircle}></div>
            <span className={Styles.stepLabel}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatus;
