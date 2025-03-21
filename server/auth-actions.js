"use server";

import connectDB from "@/middlewares/connectDB";
import RouteSchema from "@/models/route";
import OrderSchema from "@/models/orders";
import jwt from "jsonwebtoken";

export async function login(data) {
    try {
        const { urvannConn, storeHippoConn } = await connectDB();

        const { email, phone } = data;

        // Get users from store_hippo
        const Order = storeHippoConn.model("Order", OrderSchema);

        const ordersPlaced = await Order.findOne({ "data.email": email }).lean();
        
        if (!ordersPlaced) {
            return {
                success: false,
                status: 401,
                message: "Invalid Credentials",
            };
        }
        
        // Consider only last 10 digits of phone number (excluding country code)
        const phoneVerified = phone == ordersPlaced.data.shipping_address.phone.slice(-10);

        if (!phoneVerified) {
            return {
                success: false,
                status: 401,
                message: "Invalid Credentials",
            };
        }

        const token = jwt.sign(
            { userId: ordersPlaced.data.user_id, email, phone },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        );

        console.log(token);

        return {
            success: true,
            status: 200,
            message: "Login Successful",
            token,
        };
    } catch (error) {
        return {
            success: false,
            status: error.status || 500,
            message: error.message || "Internal Server Error",
            error,
        };
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
                phone: decoded.phone,
            },
        };
    } catch (error) {
        return {
            success: false,
            status: error.status || 500,
            message: error.message || "Internal Server Error",
        };
    }
}
