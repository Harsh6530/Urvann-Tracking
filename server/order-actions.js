"use server";

import connectDB from "@/middlewares/connectDB";
import Route from "@/models/route";
import Photo from "@/models/photo";

export async function fetchOrders(email, phone) {
    try {
        await connectDB();

        const route = await Route.find({ email, shipping_address_phone: { $regex: phone.slice(-10) } });

        if (!route || route.length === 0) {
            return {
                success: false,
                status: 404,
                message: "No orders found"
            }
        }

        const orders = await Promise.all(route.map(async (order) => {
            const status = (order.Pickup_Status === "Not Picked") ? "Order placed" : (order.Delivery_Status === "Not Delivered") ? "Not Delivered" : "Delivered";

            const imgURLResponse = await fetchImageURL(order.line_item_sku);
            const imgURL = imgURLResponse.success ? imgURLResponse.imgURL : null;

            return {
                orderNumber: order.order_id,
                date: order.created_on,
                customer: order.shipping_address_full_name,
                product: order.line_item_name,
                imgURL,
                status
            };
        }));

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

export async function fetchImageURL(sku) {
    try {
        await connectDB();

        const photo = await Photo.findOne({ sku });

        if (!photo) {
            return {
                success: false,
                status: 404,
                message: "No image found"
            }
        }

        return {
            success: true,
            status: 200,
            message: "Image fetched",
            imgURL: photo.image_url
        }
    }
    catch (error) {
        return {
            success: false,
            status: error.status || 500,
            message: error.message || "Internal Server Error",
            error
        }
    }
}