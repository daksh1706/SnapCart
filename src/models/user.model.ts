import mongoose from "mongoose";

export interface ISavedAddress {
    _id?: mongoose.Types.ObjectId;
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    isDefault?: boolean;
}

export interface IUser {
    _id?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    mobile?: string;
    role: "user" | "deliveryBoy" | "admin";
    image?: string;
    location?: {
        type: string;
        coordinates: number[];
    };
    socketId?: string | null;
    isOnline?: boolean;
    savedAddresses?: ISavedAddress[];
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: false,
        },
        mobile: {
            type: String,
            required: false,
        },
        role: {
            type: String,
            enum: ["user", "deliveryBoy", "admin"], 
            default: "user",
        },
        image: {
            type: String
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
            coordinates: {
                type: [Number],
                default: [0, 0]
            }
        },
        socketId: {
            type: String,
            default: null
        },
        isOnline: {
            type: Boolean,
            default: false
        },
        savedAddresses: [
            {
                fullName: { type: String, required: true },
                mobile: { type: String, required: true },
                city: { type: String, required: true },
                state: { type: String, required: true },
                pincode: { type: String, required: true },
                fullAddress: { type: String, required: true },
                isDefault: { type: Boolean, default: false }
            }
        ]
    },
    { timestamps: true }
);

userSchema.index({ location: "2dsphere" });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
