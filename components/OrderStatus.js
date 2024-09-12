"use client";
import React, { useEffect, useState } from 'react';
import Styles from './OrderStatus.module.css';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '@/redux/features/auth';
import { authenticate } from '@/server/auth-actions';
import { fetchOrders } from '@/server/order-actions';
import Image from 'next/image';
import OrderStatusTimeline from './OrderStatusTimeline';

const OrderStatus = (props) => {
  const { orderId } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const token = useSelector(state => state.auth.userToken);
  const [order, setOrder] = useState(null);

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
        setOrder(response.orders.find(order => order.orderNumber === parseInt(orderId)));
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

  if (!order) {
    return <p className={Styles.error}>Order not found</p>;
  }

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
        <p><strong>Status:</strong> <span className={Styles[`status${order.status.replace(' ', '')}`] + " font-semibold"}>{order.status}</span></p>
      </div>
      <OrderStatusTimeline status={order.status} />
    </div>
  );
};

export default OrderStatus;
