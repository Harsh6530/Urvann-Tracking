"use server";

import connectDB from "@/middlewares/connectDB";
import RouteSchema from "@/models/route";
import OrderSchema from "@/models/orders";
import jwt from "jsonwebtoken";

export async function login(data) {
    try {
        const { urvannConn, storeHippoConn } = await connectDB();

        const { email, phone } = data;

        // // get users from urvann app
        // const Route = urvannConn.model('Route', RouteSchema);
        // const route = await Route.findOne({ email });

        // get users from store_hippo
        const Order = storeHippoConn.model('Order', OrderSchema);
        const ordersPlaced = await Order.findOne({ "data.email": email });

        if (/* !route && */ !ordersPlaced) {
            return {
                success: false,
                status: 401,
                message: "Invalid Credentials"
            }
        }

        // consider only last 10 digits of phone number (excluding country code)
        const phoneVerified =
            // (route && phone == route.shipping_address_phone.slice(-10)) ||
            (ordersPlaced && phone == ordersPlaced.data.phone.slice(-10));

        if (!phoneVerified) {
            return {
                success: false,
                status: 401,
                message: "Invalid Credentials"
            }
        }

        const token = jwt.sign({ userId: ordersPlaced.data.user_id, email, phone }, process.env.JWT_SECRET, { expiresIn: "2d" });

        return {
            success: true,
            status: 200,
            message: "Login Successful",
            token
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

export async function authenticate(token) {
    try {
        await connectDB();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return {
            success: true,
            status: 200,
            message: "Authenticated",
            data: {
                email: decoded.email,
                phone: decoded.phone
            }
        }
    }
    catch (error) {
        return {
            success: false,
            status: error.status || 500,
            message: error.message || "Internal Server Error"
        }
    }
}
