"use server";

import connectDB from "@/middlewares/connectDB";
import Route from "@/models/route";
import jwt from "jsonwebtoken";

export async function login(data) {
    try {
        await connectDB();

        const { email, phone } = data;

        const route = await Route.findOne({ email });

        if (!route) {
            return {
                success: false,
                status: 401,
                message: "Invalid Credentials"
            }
        }

        // consider only last 10 digits of phone number (excluding country code)
        const phoneVerified = (phone === route.shipping_address_phone.slice(-10));

        if (!phoneVerified) {
            return {
                success: false,
                status: 401,
                message: "Invalid Credentials"
            }
        }

        const token = jwt.sign({ routeId: route._id, email, phone }, process.env.JWT_SECRET, { expiresIn: "2d" });

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
