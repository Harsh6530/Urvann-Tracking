"use server";

import connectDB from "@/middlewares/connectDB";
import RouteSchema from "@/models/route";
import photoSchema from "@/models/photo";
import OrderSchema from "@/models/orders";

export async function fetchOrders(email, phone) {
    try {
        const { urvannConn, storeHippoConn } = await connectDB();

        // // get orders from urvann app
        // const Route = urvannConn.model('Route', RouteSchema);
        // const response = await Route.find(
        //     { email, /* shipping_address_phone: { $regex: phone.slice(-10) } */ },
        //     'order_id created_on shipping_address_phone shipping_address_full_name line_item_name line_item_sku Pickup_Status metafield_delivery_status metafield_order_type'
        // ).lean();

        // const routes = response.filter(route => route.shipping_address_phone.toString().slice(-10) === phone.toString().slice(-10));

        // get orders from store_hippo
        const Order = storeHippoConn.model('Order', OrderSchema);
        const ordersPlaced = await Order.find({ "data.email": email, /* "data.phone": phone */ });

        if (/* !routes || */ !ordersPlaced) {
            return {
                success: false,
                status: 404,
                message: "No orders found"
            };
        }

        // Extract unique SKUs for batch fetching images
        // const skusFromUrvannApp = routes.map(route => route.line_item_sku);
        const skusFromOrdersPlaced = ordersPlaced.map(order => order.data.items.map(item => item.sku));
        const skusFromOrdersPlacedFlat = [].concat(...skusFromOrdersPlaced); // convert 2D array to 1D array
        const skus = [...new Set([/* ...skusFromUrvannApp, */ ...skusFromOrdersPlacedFlat])];

        // Fetch all photos in one query using the extracted SKUs
        const Photo = urvannConn.model('Photo', photoSchema);
        const photos = await Photo.find({ sku: { $in: skus } }, 'sku image_url').lean();
        const photoMap = photos.reduce((acc, photo) => {
            acc[photo.sku] = photo.image_url;
            return acc;
        }, {});

        const orders = ordersPlaced.map((order) => {
            // const status = order.Pickup_Status === "Not Picked"
            //     ? (order.metafield_order_type === "Replacement" ? "Replacement initiated" : "Order placed")
            //     : order.metafield_delivery_status === "Z-Delivered"
            //         ? "Delivered"
            //         : order.metafield_delivery_status === "Z-Replacement Successful"
            //             ? "Replacement Successful"
            //             : order.Pickup_Status === "Picked"
            //                 ? "Picked"
            //                 : "Delivery Failed";

            return order.data.items.map((item) => {
                return {
                    date: order.receivedAt || new Date(), // get today's date if no date is found
                    customer: order.data.billing_address.full_name,
                    product: item.name,
                    imgURL: photoMap[item.sku] || null,
                    status: "Order placed",
                    type: ""
                };
            });

            // // Get image URL from the photoMap using SKU
            // const imgURL = photoMap[order.line_item_sku] || null;

            // return {
            //     orderNumber: order.order_id,
            //     date: order.created_on || new Date(), // get today's date if no date is found
            //     customer: order.shipping_address_full_name,
            //     product: order.line_item_name,
            //     imgURL,
            //     status,
            //     type: order.metafield_order_type
            // };
        });

        const ordersFlat = [].concat(...orders); // convert 2D array to 1D array

        return {
            success: true,
            status: 200,
            message: "Orders fetched",
            orders: ordersFlat
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
        const { urvannConn } = await connectDB();

        const Photo = urvannConn.model('Photo', photoSchema);

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
