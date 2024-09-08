"use client";
import React, { useEffect, useState } from 'react';
import Styles from './OrderStatus.module.css';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '@/redux/features/auth';
import { authenticate } from '@/server/auth-actions';
import { fetchOrders } from '@/server/order-actions';
import Image from 'next/image';

const statusSteps = ['Not Picked', 'Picked', 'Delivered'];

const OrderStatus = (props) => {
  const { orderId } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const token = useSelector(state => state.auth.userToken);
  const [ordersData, setOrdersData] = useState([]);

  if (!isAuthenticated) {
    router.push('/login');
  }

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const getOrders = async () => {
    const user = await authenticate(token);

    if (user.success) {
      const { email, phone } = user.data;
      const response = await fetchOrders(email, phone);

      if (response.success) {
        setOrdersData(response.orders);
      } else {
        console.error(response.message);
      }
    } else {
      console.error(user.message);
    }
  }

  useEffect(() => {
    getOrders();
    /* eslint-disable-next-line */
  }, []);

  const order = ordersData.find((order) => order.orderNumber === orderId);

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
        <Image src={order.imgURL} height={500} width={500} alt={order.product} className={Styles.productImage} />
        <p><strong>Order Number:</strong> {order.orderNumber}</p>
        <p><strong>Product:</strong> {order.product}</p>
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
