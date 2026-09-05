# ⚡ SnapCart — 10-Minute Grocery Delivery Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.IO-Realtime-010101?style=for-the-badge&logo=socket.io" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe" alt="Stripe" />
</p>

---

## 📌 Overview

**SnapCart** is an ultra-fast, modern quick-commerce web application engineered for on-demand grocery delivery in minutes. Built with **Next.js 16 (App Router)**, **React 19**, **Redux Toolkit**, **MongoDB**, and a standalone **Socket.IO Real-Time Server**, SnapCart provides an end-to-end shopping, delivery dispatching, and administrative experience.

---

## ✨ Key Features

### 🛒 Customer Experience
- **Instant Product Search & Filter**: Real-time keyword filtering across names and categories with price/unit sorting.
- **Dynamic Cart & Wishlist**: Persistent cart and wishlist synced via Redux and `localStorage`.
- **Free Delivery Progress & Coupon Engine**: Interactive tiered discount codes, free shipping thresholds, and instant coupon application.
- **Interactive Geolocation Checkout**: Dynamic map picker using **Leaflet / OpenStreetMap** for pin-point address geocoding.
- **Secure Payments**: Integrated **Stripe Checkout** for card payments with automatic fallback for Cash on Delivery (COD).
- **Live Order Tracking & In-App Chat**: Watch the delivery partner move live on Leaflet Maps with real-time customer-to-rider Socket.IO chat.

### 🚴 Delivery Partner Portal
- **Real-Time Assignment Feed**: Instant broadcast of available orders in the area.
- **Live GPS Broadcasting**: Automatic background geolocation sync via Socket.IO directly to the customer map.
- **Secure OTP Verification**: 4-digit automated email delivery OTP code verification before completing handoff.
- **Rider-to-Customer Direct Messaging**: Synchronized, persisted live chat with the customer.

### 🛠️ Admin Suite & Analytics
- **Visual Analytics Dashboard**: Interactive order count, total revenue, and performance charts (hourly, daily, weekly, monthly) powered by **Recharts**.
- **Product Inventory Management**: Add, update, categorized, and delete groceries with cloud-hosted media via **Cloudinary**.
- **Order Pipeline Control**: Real-time order status management (`Pending` ➔ `Out for Delivery` ➔ `Delivered` / `Cancelled`).
- **Staff & User Role Directory**: Manage platform users, assign delivery partner roles, and update profile statuses.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [Next.js 16 (App Router)](https://nextjs.org/), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling & Motion** | [TailwindCSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/) |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/), React Redux |
| **Maps & Geolocation** | [Leaflet](https://leafletjs.com/), [React-Leaflet](https://react-leaflet.js.org/), Leaflet GeoSearch |
| **Database & ORM** | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/), Supabase integration |
| **Authentication** | [NextAuth.js (v5 Beta)](https://authjs.dev/) with Credentials & Google OAuth |
| **Real-Time WebSockets** | [Socket.IO](https://socket.io/) (Dedicated Node.js Express server) |
| **Payments** | [Stripe](https://stripe.com/) Checkout Sessions & API |
| **Media Uploads** | [Cloudinary API](https://cloudinary.com/) |
| **Mailing / OTPs** | [Nodemailer](https://nodemailer.com/) (Gmail SMTP) |

---

## 📁 Directory Structure

```
SnapCart/
├── public/                     # Static assets & SVG icons
├── socketServer/               # Standalone Socket.IO backend
│   ├── index.js                # WebSocket event handlers (location, chat, identity)
│   └── package.json
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Admin pages (add grocery, view orders, manage users)
│   │   ├── api/                # API routes (auth, admin, user, chat, socket, stripe)
│   │   ├── delivery/           # Delivery partner dashboard & profile
│   │   ├── user/               # Customer checkout, cart, my-orders, tracking
│   │   ├── login/              # Authentication login screen
│   │   ├── register/           # Registration screen
│   │   ├── layout.tsx          # Root app layout & providers
│   │   └── page.tsx            # Main marketplace entrypoint
│   ├── components/             # Reusable UI components
│   │   ├── SnapCartLogo.tsx    # Unified SnapCart brand logo & badge
│   │   ├── Nav.tsx             # Main responsive header & navigation
│   │   ├── Footer.tsx          # App footer
│   │   ├── LiveMap.tsx         # Real-time Leaflet delivery tracking map
│   │   ├── CheckoutMap.tsx     # Leaflet interactive address picker
│   │   ├── DeliveryChat.tsx    # Socket.IO live customer/rider chat
│   │   ├── GroceryItemCard.tsx # Product card with quantities & animations
│   │   ├── WishlistDrawer.tsx  # Side drawer for saved items
│   │   └── ...
│   ├── lib/                    # Database connection, mailer, Cloudinary, socket client
│   ├── models/                 # Mongoose schemas (User, Grocery, Order, Coupon, Message)
│   └── redux/                  # Redux slices (cartSlice, wishlistSlice, couponSlice)
├── .env.example                # Sample environment variables
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v18.17.0` or higher
- **pnpm / npm / yarn**: Package manager installed
- **MongoDB**: Local MongoDB instance or MongoDB Atlas URI
- **Cloudinary Account**: For product image uploads
- **Stripe Account**: For payment processing (optional for test mode)

---

### 2. Clone the Repository & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/daksh1706/SnapCart.git
cd SnapCart

# Install Next.js frontend dependencies
npm install

# Install Socket.IO server dependencies
cd socketServer
npm install
cd ..
```

---

### 3. Configure Environment Variables

Create `.env.local` in the root directory:

```env
# 1. Authentication
AUTH_SECRET=your_auth_secret_here
NEXTAUTH_URL=http://localhost:3000

# 2. Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# 3. Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/snapcart?retryWrites=true&w=majority
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 4. Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# 5. Socket Server & Base URL
NEXT_PUBLIC_SOCKET_SERVER=http://localhost:5000
NEXT_BASE_URL=http://localhost:3000

# 6. Nodemailer (OTP / Email service)
EMAIL=your_email@gmail.com
PASS=your_gmail_app_password

# 7. Stripe Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

### 4. Running the Development Servers

Run both the Next.js frontend application and the Socket.IO server:

#### Terminal 1 — Next.js Application:
```bash
npm run dev
# Running on http://localhost:3000
```

#### Terminal 2 — Socket.IO Real-Time Engine:
```bash
cd socketServer
npm start
# Socket server running on http://localhost:5000
```

---

## 📦 Key API Routes

- `POST /api/auth/register` — User registration with hashed credentials
- `GET /api/user/get-groceries` — Product listing with search & category query parameters
- `POST /api/user/order` — Create new order with COD / Stripe payload
- `POST /api/user/payment` — Create Stripe Checkout session
- `POST /api/admin/add-grocery` — Upload grocery with Cloudinary image upload
- `PUT /api/admin/update-order-status/[orderId]` — Admin order pipeline status changes
- `POST /api/delivery/send-delivery-otp` — Send 4-digit verification code to recipient email
- `POST /api/delivery/verify-otp` — Validate delivery OTP and mark order completed
- `POST /api/chat/save` — Persist live chat conversation messages

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).
