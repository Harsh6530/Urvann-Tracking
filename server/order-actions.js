"use server";

import connectDB from "@/middlewares/connectDB";
import Route from "@/models/route";
import Photo from "@/models/photo";

export async function fetchOrders(email, phone) {
    try {
        await connectDB();

        const routes = await Route.find(
            { email, shipping_address_phone: { $regex: phone.slice(-10) } },
            'order_id created_on shipping_address_full_name line_item_name line_item_sku Pickup_Status Delivery_Status'
        ).lean();

        if (!routes || routes.length === 0) {
            return {
                success: false,
                status: 404,
                message: "No orders found"
            };
        }

        // Extract unique SKUs for batch fetching images
        const skus = routes.map(route => route.line_item_sku);

        // Fetch all photos in one query using the extracted SKUs
        const photos = await Photo.find({ sku: { $in: skus } }, 'sku image_url').lean();
        const photoMap = photos.reduce((acc, photo) => {
            acc[photo.sku] = photo.image_url;
            return acc;
        }, {});

        const orders = routes.map((order) => {
            const status = order.Pickup_Status === "Not Picked"
                ? "Order placed"
                : order.Delivery_Status === "Not Delivered"
                    ? "Not Delivered"
                    : "Delivered";

            // Get image URL from the photoMap using SKU
            const imgURL = photoMap[order.line_item_sku] || null;

            return {
                orderNumber: order.order_id,
                date: order.created_on,
                customer: order.shipping_address_full_name,
                product: order.line_item_name,
                imgURL,
                status
            };
        });

        return {
            success: true,
            status: 200,
            message: "Orders fetched",
            orders
        };
    } catch (error) {
        return {
            success: false,
            status: error.status || 500,
            message: error.message || "Internal Server Error",
            error
        };
    }
}

export async function fetchImageURL(sku) {
    try {
        await connectDB();

        // Fetching a single image with .lean() for optimization
        const photo = await Photo.findOne({ sku }).lean();

        if (!photo) {
            return {
                success: false,
                status: 404,
                message: "No image found"
            };
        }

        return {
            success: true,
            status: 200,
            message: "Image fetched",
            imgURL: photo.image_url
        };
    } catch (error) {
        return {
            success: false,
            status: error.status || 500,
            message: error.message || "Internal Server Error",
            error
        };
    }
}
