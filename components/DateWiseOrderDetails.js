"use client";
import Image from 'next/image';
import Styles from './DateWiseOrderDetails.module.css';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '@/redux/features/auth';
import { authenticate } from '@/server/auth-actions';
import { fetchOrders } from '@/server/order-actions';
import { useEffect, useState } from 'react';
import Loading from './Loading';

const parseOrderDate = (date) => {
  const parsedDate = new Date(date);

  // Sun, 25 Jul
  return parsedDate.toDateString().slice(0, 3) + ', ' + parsedDate.getDate() + ' ' + parsedDate.toDateString().slice(4, 7);
};

const getDateString = (date) => {
  const parsedDate = new Date(date);

  const day = parsedDate.getDate().toString().padStart(2, '0');
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
  const year = parsedDate.getFullYear();

  return `${day}${month}${year}`;
}

const DateWiseOrderDetails = (props) => {
  const { dateString, isDelivered } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const token = useSelector(state => state.auth.userToken);
  const [orders, setOrders] = useState([]);
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
        setOrders(response.orders.filter(order => getDateString(order.date) === dateString && (isDelivered ? order.status === 'Delivered' : order.status !== 'Delivered')));
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
    )
  }

  return (
    <div className={Styles.ordersContainer}>
      <button className={Styles.backButton} onClick={() => { router.push('/orders') }}>
        Back
      </button>
      <p className={Styles.header}>Orders on {parseOrderDate(orders[0]?.date)}</p>
      {orders.length > 0 ?
        <>
          {orders.map((order, i) => (
            <div
              key={i}
              className={Styles.individualOrder}
            >
              <div className='flex items-center gap-5 min-w-72'>
                {order.imgURL ? 
                  <Image src={order.imgURL} height={500} width={500} alt={order.product} className={Styles.productImage} />
                  : 
                  <div className='w-[70px] text-xs text-center text-[#808080]'>Image not found</div>
                }
                <div>
                  <p className='font-semibold text-lg'>{order.product}</p>
                  <p className='text-sm'>Order Number: {order.orderNumber}</p>
                  <p className={Styles[`status${order.status.replace(' ', '')}`] + " font-semibold"}>Status: {order.status}</p>
                </div>
              </div>
            </div>
          ))}
        </> : <>
          <p className='text-center'>No orders found</p>
        </>
      }
    </div>
  )
}

export default DateWiseOrderDetails
