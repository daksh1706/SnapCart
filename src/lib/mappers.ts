// Data mappers: Supabase (snake_case) → App (camelCase)
// These maintain _id compatibility with the existing frontend

export function mapUser(user: any): any {
    if (!user) return null;
    return {
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        mobile: user.mobile,
        role: user.role,
        image: user.image,
        location: {
            type: "Point",
            coordinates: [user.location_lat ?? 0, user.location_lng ?? 0]
        },
        location_lat: user.location_lat,
        location_lng: user.location_lng,
        socketId: user.socket_id,
        socket_id: user.socket_id,
        isOnline: user.is_online,
        is_online: user.is_online,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };
}

export function mapGrocery(grocery: any): any {
    if (!grocery) return null;
    return {
        _id: grocery.id,
        id: grocery.id,
        name: grocery.name,
        category: grocery.category,
        size: grocery.size,
        description: grocery.description,
        originalprice: grocery.originalprice,
        sellingprice: grocery.sellingprice,
        unit: grocery.unit,
        image: grocery.image,
        createdAt: grocery.created_at,
        updatedAt: grocery.updated_at,
        created_at: grocery.created_at,
        updated_at: grocery.updated_at,
    };
}

export function mapOrder(order: any): any {
    if (!order) return null;
    return {
        _id: order.id,
        id: order.id,
        user: order.user ? mapUser(order.user) : order.user_id,
        user_id: order.user_id,
        items: order.items ?? [],
        isPaid: order.is_paid,
        is_paid: order.is_paid,
        totalAmount: order.total_amount,
        total_amount: order.total_amount,
        paymentMethod: order.payment_method,
        payment_method: order.payment_method,
        address: order.address,
        assignment: order.assignment_id,
        assignment_id: order.assignment_id,
        assignedDeliveryBoy: order.assigned_delivery_boy
            ? mapUser(order.assigned_delivery_boy)
            : order.assigned_delivery_boy_id ?? null,
        assigned_delivery_boy_id: order.assigned_delivery_boy_id,
        status: order.status,
        deliveryOtp: order.delivery_otp,
        delivery_otp: order.delivery_otp,
        deliveryOtpVerification: order.delivery_otp_verification,
        delivery_otp_verification: order.delivery_otp_verification,
        deliveredAt: order.delivered_at,
        delivered_at: order.delivered_at,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        created_at: order.created_at,
        updated_at: order.updated_at,
    };
}

export function mapDeliveryAssignment(assignment: any): any {
    if (!assignment) return null;
    return {
        _id: assignment.id,
        id: assignment.id,
        order: assignment.order ? mapOrder(assignment.order) : assignment.order_id,
        order_id: assignment.order_id,
        brodcastedTo: assignment.broadcasted_to ?? [],
        broadcasted_to: assignment.broadcasted_to ?? [],
        assignedTo: assignment.assigned_to,
        assigned_to: assignment.assigned_to,
        status: assignment.status,
        acceptedAt: assignment.accepted_at,
        accepted_at: assignment.accepted_at,
        createdAt: assignment.created_at,
        updatedAt: assignment.updated_at,
        created_at: assignment.created_at,
        updated_at: assignment.updated_at,
    };
}

export function mapMessage(message: any): any {
    if (!message) return null;
    return {
        _id: message.id,
        id: message.id,
        roomId: message.room_id,
        room_id: message.room_id,
        text: message.text,
        senderId: message.sender_id,
        sender_id: message.sender_id,
        time: message.time,
        createdAt: message.created_at,
        updatedAt: message.updated_at,
        created_at: message.created_at,
        updated_at: message.updated_at,
    };
}

// Haversine distance formula (returns distance in meters)
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
