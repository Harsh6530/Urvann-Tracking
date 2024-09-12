import DateWiseOrderDetails from '@/components/DateWiseOrderDetails';

const OrderDetails = ({ params }) => {
  const dateString = params.slug[1];
  const status = params.slug[0];
  const isDelivered = status === 'delivered';

  return (
    <DateWiseOrderDetails dateString={dateString} isDelivered={isDelivered} />
  )
}

export default OrderDetails
