import OrderStatus from '@/components/OrderStatus'

// Same orders data or fetched from a backend/API
const ordersData = [
  { id: "1", orderNumber: 'A001', date: '2024-09-01', customer: 'John Doe', status: 'Not Picked' },
  { id: "2", orderNumber: 'A002', date: '2024-09-02', customer: 'Jane Smith', status: 'Picked' },
  { id: "3", orderNumber: 'A003', date: '2024-09-03', customer: 'Alice Johnson', status: 'Delivered' },
  { id: "4", orderNumber: 'A004', date: '2024-09-04', customer: 'Bob Johnson', status: 'Not Picked' },
  { id: "5", orderNumber: 'A005', date: '2024-09-05', customer: 'Sarah Davis', status: 'Picked' },
];

export async function generateStaticParams() {
  try {
    return ordersData.map((order) => ({
      orderId: order.id,
    }))
  }
  catch (error) {
    return Response.json({ status: error.status, error: error.message })
  }
}

const OrderDetails = ({ params }) => {
  const { orderId } = params;
  return (
    <OrderStatus orderId={orderId} />
  )
}

export default OrderDetails
