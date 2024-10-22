"use client";
import React, { useEffect, useState } from 'react';
import Styles from './AllOrders.module.css';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { authenticate } from '@/server/auth-actions';
import { checkAuth } from '@/redux/features/auth';
import { fetchOrders } from '@/server/order-actions';
import DateWiseOrders from './DateWiseOrders';
import Loading from './Loading';

const Orders = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const token = useSelector(state => state.auth.userToken);

  const [ordersPendingData, setOrdersPendingData] = useState([]);
  const [ordersDeliveredData, setOrdersDeliveredData] = useState([]);
  const [ordersReplacementData, setOrdersReplacementData] = useState([]);

  const [view, setView] = useState('pending'); // State to toggle between 'pending', 'delivered' and 'replacement'
  const [loading, setLoading] = useState(true);

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
        setOrdersPendingData(response.orders.filter(order => order.status !== 'Delivered' && order.type !== 'Replacement'));
        setOrdersDeliveredData(response.orders.filter(order => order.status === 'Delivered' && order.type !== 'Replacement'));
        setOrdersReplacementData(response.orders.filter(order => order.type === 'Replacement'));
      } else {
        console.error(response.message);
      }
    } else {
      console.error(user.message);
    }

    setLoading(false);
  }

  useEffect(() => {
    getOrders();
    /* eslint-disable-next-line */
  }, []);

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className={Styles.ordersContainer}>
      <h2 className={Styles.header}>All Orders</h2>

      <div className={Styles.navButtons}>
        <button
          className={`${Styles.navButton} ${view === 'pending' ? Styles.active : ''}`}
          onClick={() => setView('pending')}
        >
          Pending Orders
        </button>
        <button
          className={`${Styles.navButton} ${view === 'delivered' ? Styles.active : ''}`}
          onClick={() => setView('delivered')}
        >
          Delivered Orders
        </button>
        <button
          className={`${Styles.navButton} ${view === 'replacement' ? Styles.active : ''}`}
          onClick={() => setView('replacement')}
        >
          Replacement Orders
        </button>
      </div>

      {view === 'pending' ? <DateWiseOrders orders={ordersPendingData} deliveryStatus={'pending'} isReplacement={false} /> :
        view === 'delivered' ? <DateWiseOrders orders={ordersDeliveredData} deliveryStatus={'delivered'} isReplacement={false} /> :
          <DateWiseOrders orders={ordersReplacementData} isReplacement={true} />
      }
    </div>
  );
};

export default Orders;
