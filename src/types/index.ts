// Shared TypeScript interfaces (replaces Mongoose models)

export interface IUser {
    id?: string;
    _id?: string; // alias for compatibility
    name: string;
    email: string;
    password?: string;
    mobile?: string;
    role: "user" | "deliveryBoy" | "admin";
    image?: string;
    location?: {
        coordinates: [number, number];
    };
    location_lat?: number;
    location_lng?: number;
    socket_id?: string | null;
    socketId?: string | null; // alias
    is_online?: boolean;
    isOnline?: boolean; // alias
    created_at?: string;
    updated_at?: string;
}

export interface IGrocery {
    id?: string;
    _id?: string; // alias for compatibility
    name: string;
    category: string;
    size: string;
    description?: string;
    originalprice: string;
    sellingprice: string;
    unit: string;
    image: string;
    created_at?: string;
    updated_at?: string;
}

export interface IOrderItem {
    product: string;
    name: string;
    sellingPrice: string;
    size: string;
    unit: string;
    image: string;
    quantity: number;
}

export interface IAddress {
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
}

export interface IOrder {
    id?: string;
    _id?: string; // alias for compatibility
    user_id?: string;
    user?: IUser | string;
    items: IOrderItem[];
    is_paid?: boolean;
    isPaid?: boolean; // alias
    total_amount?: number;
    totalAmount?: number; // alias
    payment_method?: "cod" | "online";
    paymentMethod?: "cod" | "online"; // alias
    address: IAddress;
    assignment_id?: string | null;
    assignment?: string | null; // alias
    assigned_delivery_boy_id?: string | null;
    assignedDeliveryBoy?: IUser | string | null; // alias
    status: "pending" | "out for delivery" | "delivered";
    delivery_otp?: string | null;
    deliveryOtp?: string | null; // alias
    delivery_otp_verification?: boolean;
    deliveryOtpVerification?: boolean; // alias
    delivered_at?: string | null;
    deliveredAt?: string | null; // alias
    created_at?: string;
    updated_at?: string;
    createdAt?: string; // alias
    updatedAt?: string; // alias
}

export interface IDeliveryAssignment {
    id?: string;
    _id?: string; // alias for compatibility
    order_id?: string;
    order?: IOrder | string;
    broadcasted_to?: string[];
    brodcastedTo?: string[]; // alias (keeping original spelling)
    assigned_to?: string | null;
    assignedTo?: string | null; // alias
    status: "brodcasted" | "assigned" | "completed";
    accepted_at?: string;
    acceptedAt?: string; // alias
    created_at?: string;
    updated_at?: string;
}

export interface IMessage {
    id?: string;
    _id?: string; // alias for compatibility
    room_id?: string;
    roomId?: string; // alias
    text: string;
    sender_id?: string;
    senderId?: string; // alias
    time?: string;
    created_at?: string;
    updated_at?: string;
}
