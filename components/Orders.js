"use client";
import React, { useEffect, useState } from 'react';
import Styles from './Orders.module.css';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { authenticate } from '@/server/auth-actions';
import { checkAuth } from '@/redux/features/auth';
import { fetchOrders } from '@/server/order-actions';
import Image from 'next/image';

const parseOrderDate = (date) => {
  const parsedDate = new Date(date);

  const day = parsedDate.getDate().toString().padStart(2, '0');
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
  const year = parsedDate.getFullYear();

  return `${day}/${month}/${year}`;
};

const Orders = () => {
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

  return (
    <div className={Styles.ordersContainer}>
      {ordersData.length > 0 ?
        <div className='overflow-x-scroll' style={{ scrollbarWidth: 'none' }}>
          <h2 className={Styles.header}>Orders List (Customer: {ordersData[0].customer})</h2>
          <table className={Styles.ordersTable}>
            <thead>
              <tr className={Styles.tableHeader}>
                <th>Order ID</th>
                <th className='!text-center'>Product</th>
                <th>Date</th>
                <th>Status</th>
                <th>View Status</th>
              </tr>
            </thead>
            <tbody>
              {ordersData.map((order) => (
                <tr key={order.orderNumber} className={Styles.tableRow}>
                  <td>{order.orderNumber}</td>
                  <td className='flex items-center gap-5 min-w-72'>
                    <Image src={order.imgURL} height={500} width={500} alt={order.product} className={Styles.productImage} />
                    {order.product}
                  </td>
                  <td>{parseOrderDate(order.date)}</td>
                  <td className={Styles[`status${order.status.replace(' ', '')}`]}>{order.status}</td>
                  <td>
                    <button
                      className={Styles.detailsButton}
                      onClick={() => router.push(`/orders/${order.orderNumber}`)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> : <>
          <h2 className={Styles.header}>Orders List</h2>
          <p className='text-center'>No orders found</p>
        </>
      }
    </div>
  );
};

export default Orders;
