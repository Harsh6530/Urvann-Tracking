"use client";
import { FaChevronRight as NextIcon, FaChevronDown as DownIcon } from 'react-icons/fa';
import Styles from './DateWiseOrders.module.css';
import { useState } from 'react';
import OrderStatusTimeline from './OrderStatusTimeline';
import { useRouter } from 'next/navigation';

const parseOrderDate = (date) => {
  const parsedDate = new Date(date);

  // Sun, 25 Jul
  return parsedDate.toDateString().slice(0, 3) + ', ' + parsedDate.getDate() + ' ' + parsedDate.toDateString().slice(4, 7);
};

const getDateString = (date) => {
  // Tuesday, September 10, 2024, 7:03:17 AM to 10092024
  const parsedDate = new Date(date);

  const day = parsedDate.getDate().toString().padStart(2, '0');
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
  const year = parsedDate.getFullYear();

  return `${day}${month}${year}`;
}

const DateWiseOrders = (props) => {
  const { orders, deliveryStatus, isReplacement } = props;
  const router = useRouter();

  orders.sort((a, b) => new Date(b.date) - new Date(a.date));

  // group orders by date
  const groupedOrders = {};
  orders.forEach((order) => {
    const date = parseOrderDate(order.date);
    if (groupedOrders[date]) {
      groupedOrders[date].push(order);
    } else {
      groupedOrders[date] = [order];
    }
  });

  // if any order is in delivered state then status is delivered
  // if any order is in picked state then status is picked
  if (isReplacement) {
    Object.keys(groupedOrders).forEach((date) => {
      const status = groupedOrders[date].some((order) => order.status === 'Replacement Successful') ? 'Replacement Successful'
        : groupedOrders[date].some((order) => order.status === 'Picked') ? 'Picked' : 'Replacement initiated';
      groupedOrders[date].status = status;
    });
  } else {
    Object.keys(groupedOrders).forEach((date) => {
      const status = groupedOrders[date].some((order) => order.status === 'Delivered') ? 'Delivered'
        : groupedOrders[date].some((order) => order.status === 'Picked') ? 'Picked' : 'Order placed';
      groupedOrders[date].status = status;
    });
  }

  const [expandedDate, setExpandedDate] = useState(null);

  console.log(groupedOrders)

  return (
    <div>
      {(orders.length > 0 ?
        <>
          {Object.keys(groupedOrders).map((date) => (
            <div
              key={date}
              className={Styles.individualOrder}
              onClick={(()=>{router.push(`/orders/${groupedOrders[date][0].txn_id}`)})}
            >
              <div
                className='flex items-center justify-between cursor-pointer'
                onClick={() => setExpandedDate(expandedDate === date ? null : date)}
              >
                <div className={Styles.orderSummary}>
                  <p className={Styles.date}>{date}</p>
                  <p className={Styles.totalProducts}>Total products: {groupedOrders[date].length}</p>
                  <p className={Styles.status + " " + Styles[`status${groupedOrders[date].status.replace(' ', '')}`]}>Status: {groupedOrders[date].status}</p>
                </div>

                <div>
                  {expandedDate === date ? <DownIcon /> : <NextIcon />}
                </div>
              </div>
              {expandedDate === date && (
                <div className={Styles.orderDetails}>
                  <div className='py-1'>
                    <OrderStatusTimeline status={groupedOrders[date].status} isReplacement={isReplacement} />
                  </div>
                  <button
                    className={Styles.viewProductsButton}
                    onClick={() => router.push(`/order/${deliveryStatus}/${getDateString(groupedOrders[date][0].date)}`)}
                  >
                    View Products
                  </button>
                </div>
              )}
            </div>
          ))}
        </> : <>
          <p className='text-center'>No orders found</p>
        </>
      )}
    </div>
  )
}

export default DateWiseOrders
