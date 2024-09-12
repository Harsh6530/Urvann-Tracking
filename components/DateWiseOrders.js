"use client";
import Image from 'next/image';
import { FaChevronRight as NextIcon, FaChevronDown as DownIcon } from 'react-icons/fa';
import Styles from './DateWiseOrders.module.css';
import { useState } from 'react';
import OrderStatusTimeline from './OrderStatusTimeline';
import { useRouter } from 'next/navigation';

const parseOrderDate = (date) => {
  const parsedDate = new Date(date);

  // Sun, 25 Jul
  return parsedDate.toDateString().slice(0, 3) + ', ' + parsedDate.getDate() + ' ' + parsedDate.toDateString().slice(4, 7);

  // const day = parsedDate.getDate().toString().padStart(2, '0');
  // const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
  // const year = parsedDate.getFullYear();

  // return `${day}/${month}/${year}`;
};

const DateWiseOrders = (props) => {
  const { orders } = props;
  const router = useRouter();

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

  // if all orders are in delivered state then status is delivered
  // if any order is in picked state then status is picked
  Object.keys(groupedOrders).forEach((date) => {
    const status = groupedOrders[date].every((order) => order.status === 'Delivered') ? 'Delivered'
      : groupedOrders[date].some((order) => order.status === 'Picked') ? 'Picked' : 'Order placed';
    groupedOrders[date].status = status;
  });

  const [expandedDate, setExpandedDate] = useState(null);

  return (
    <div>
      {(orders.length > 0 ?
        <>
          {Object.keys(groupedOrders).map((date) => (
            <div
              key={date}
              className={Styles.individualOrder}
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
                  {groupedOrders[date].map((order) => (
                    <div
                      key={order.orderNumber}
                      className={Styles.individualOrderDetail}
                      onClick={() => { router.push(`/order/${order.orderNumber}`) }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5 min-w-72">
                          <Image src={order.imgURL} height={500} width={500} alt={order.product} className={Styles.productImage} />
                          <div>
                            <p className="font-semibold">{order.product}</p>
                            <p className="text-xs text-[#666]">Order placed on {parseOrderDate(order.date)}</p>
                            <p className={Styles[`status${order.status.replace(' ', '')}`] + " text-sm font-medium"}>{order.status}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className='pb-5'>
                    <OrderStatusTimeline status={groupedOrders[date].status} />
                  </div>
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
