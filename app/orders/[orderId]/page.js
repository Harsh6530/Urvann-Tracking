import OrderStatus from '@/components/OrderStatus'

const OrderDetails = ({ params }) => {
  const { orderId } = params;
  return (
    <OrderStatus orderId={orderId} />
  )
}

export default OrderDetails
