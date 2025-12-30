import mongoose from "mongoose";

const mongodbUrl = process.env.MONGODB_URL;

if (!mongodbUrl) {
    throw new Error("MONGODB_URL is not defined in environment variables");
}
declare global {
    var mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
    if (cached.conn) {
        console.log("Using cached database connection");
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(mongodbUrl, opts).then((mongoose) => {
            console.log("New database connection established");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        console.error("Database connection error:", error);
        throw error;
    }
};

export default connectDb;