import Image from 'next/image';
import { FaChevronRight as NextIcon } from 'react-icons/fa';
import Styles from './DateWiseOrders.module.css';

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
  return (
    <div>
      {(orders.length > 0 ?
        <>
          {orders.map((order) => (
            <div
              key={order.orderNumber}
              className={Styles.individualOrder}
              onClick={() => router.push(`/orders/${order.orderNumber}`)}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-5 min-w-72'>
                  <Image src={order.imgURL} height={500} width={500} alt={order.product} className={Styles.productImage} />
                  <div>
                    <p className='font-semibold text-lg'>{order.product}</p>
                    <p className='text-sm'>Order placed on {parseOrderDate(order.date)}</p>
                    <p className={Styles[`status${order.status.replace(' ', '')}`]}>{order.status}</p>
                  </div>
                </div>
                <div>
                  <NextIcon />
                </div>
              </div>
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
