"use server";

import connectDB from "@/middlewares/connectDB";
import Route from "@/models/route";

export async function fetchOrders(email, phone) {
    try {
        await connectDB();

        const route = await Route.find({ email, shipping_address_phone: phone });

        if (!route || route.length === 0) {
            return {
                success: false,
                status: 404,
                message: "No orders found"
            }
        }

        const orders = route.map((order) => {
            const status = (order.Pickup_Status === "Not Picked") ? "Not Picked" : (order.Delivery_Status === "Not Delivered") ? "Not Delivered" : "Delivered";
            // console.log(order)
            return {
                orderNumber: order.order_id,
                date: order.created_on,
                customer: order.shipping_address_full_name,
                product: order.line_item_name,
                status: status
            }
        });

        return {
            success: true,
            status: 200,
            message: "Orders fetched",
            orders
        }
    } catch (error) {
        return {
            success: false,
            status: error.status || 500,
            message: error.message || "Internal Server Error",
            error
        }
    }
}