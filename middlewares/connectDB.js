import mongoose from "mongoose";

const UrvannApp = async () => {
    try {
        const conn = await mongoose.createConnection(process.env.MONGODB_URI);
        // console.log(`MongoDB Connected: ${conn.host} at ${conn.port}`);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
const store_hippo = async () => {
    try {
        const conn = await mongoose.createConnection(process.env.STOREHIPPODB_URI);
        // console.log(`Store Hippo Connected: ${conn.host} at ${conn.port}`);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

const connectDB = async () => {
    const urvannConn = await UrvannApp();
    const storeHippoConn = await store_hippo();
    return { urvannConn, storeHippoConn };
}

export default connectDB;