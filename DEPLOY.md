# 🚀 MS Collection E-Commerce — Production Deployment Guide

This document provides a comprehensive, step-by-step guide to deploying the **MS Collection** (Sikar, Rajasthan, India) full-stack MERN + Razorpay e-commerce platform to a live production environment.

---

## 🏗️ System Architecture & Technology Stack

- **Frontend**: React 18 + Vite, Vanilla CSS + Tailwind tokens, Lucide Icons, Axios, Razorpay Checkout SDK.
- **Backend**: Node.js + Express.js API, MongoDB Mongoose ODM, Helmet security headers, Express Rate Limiter.
- **Payment Gateway**: Razorpay (INR currency (`₹`), secure HMAC SHA-256 signature verification, raw webhook event processing).
- **Database**: MongoDB Atlas (Cloud-hosted NoSQL cluster with atomic `$inc` stock reservation).

---

## 📋 Prerequisites & Required Accounts

Before beginning deployment, ensure you have active accounts on the following platforms:
1. **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**: For cloud database hosting.
2. **[Razorpay Dashboard](https://dashboard.razorpay.com/)**: For live INR payment gateway credentials & webhooks.
3. **Backend Cloud Hosting**: e.g., **[Render](https://render.com/)**, **[Railway](https://railway.app/)**, or **AWS/DigitalOcean VPS**.
4. **Frontend Cloud Hosting**: e.g., **[Vercel](https://vercel.com/)**, **[Netlify](https://www.netlify.com/)**, or **Cloudflare Pages**.

---

## 🗄️ Step 1: Database Setup (MongoDB Atlas)

1. **Create a Cluster**: Log into MongoDB Atlas and deploy a Free Tier (`M0`) or Production cluster.
2. **Create Database User**:
   - Go to **Database Access** under Security.
   - Add a new user with **Read and write to any database** privileges.
   - Record your `username` and strong `password`.
3. **Configure Network Access (IP Whitelist)**:
   - Go to **Network Access** under Security.
   - Click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`). *(This is required for dynamic cloud hosting providers like Render/Vercel).*
4. **Get Connection String**:
   - Click **Connect** on your cluster -> **Drivers** -> **Node.js**.
   - Copy the `mongodb+srv://...` URI string. Replace `<username>` and `<password>` with your actual credentials and append `/mscollection` before the `?` query parameters:
     ```text
     mongodb+srv://admin_user:YourSecretPass@cluster0.abcde.mongodb.net/mscollection?retryWrites=true&w=majority
     ```

---

## 💳 Step 2: Razorpay Payment Gateway Setup

1. **Switch to Live Mode**: Log into the [Razorpay Dashboard](https://dashboard.razorpay.com/) and toggle from **Test Mode** to **Live Mode** (complete KYC if prompted).
2. **Generate API Keys**:
   - Navigate to **Account & Settings > API Keys**.
   - Click **Generate Key** to produce your `Key ID` and `Key Secret`. Keep these secure.
3. **Configure Webhook Listener**:
   - Navigate to **Account & Settings > Webhooks**.
   - Click **Add New Webhook**.
   - **Webhook URL**: Enter your live backend API URL:
     ```text
     https://your-backend-api.onrender.com/api/orders/webhook
     ```
   - **Secret**: Enter a custom secure string (e.g., `MySuperSecretRazorpayWebhookKey2026`). Save this exact string for your backend `.env` (`RAZORPAY_WEBHOOK_SECRET`).
   - **Active Events**: Check the following essential events:
     - `order.paid`
     - `payment.captured`
     - `payment.failed`

---

## ⚙️ Step 3: Backend API Deployment (Node.js / Express)

### 3.1 Environment Variables (`backend/.env`)
On your cloud hosting dashboard (Render / Railway / VPS), configure the following environment variables for the backend service:

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<db_user>:<db_password>@cluster0.abcde.mongodb.net/mscollection?retryWrites=true&w=majority
JWT_SECRET=your_ultra_secure_random_string_at_least_32_characters_long
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=MySuperSecretRazorpayWebhookKey2026
```

### 3.2 Deployment Instructions (Example: Render / Railway)
1. Connect your GitHub repository containing the `backend/` directory.
2. **Root Directory**: `backend`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start` (or `node src/server.js`)
5. **Health Check**: Once deployed, visit `https://your-backend-api.onrender.com/api/health` in your browser. You should receive:
   ```json
   { "status": "ok", "timestamp": "2026-07-16T...", "env": "production" }
   ```

### 3.3 Initial Database Seeding (First-Time Setup Only)
To create initial product catalogs, categories, and the default admin account on your production MongoDB database, run the seeder script once via your cloud provider's console/terminal or locally against the production `MONGO_URI`:

```powershell
cd backend
npm run seed
```

> **IMPORTANT**: The seeder creates your primary administrator account:
> - **Email**: `admin@mscollection.com`
> - **Password**: `adminpassword123`
> 
> *Immediately log into the Admin Dashboard (`/admin`) after launch and change or replace this default account password.*

---

## 🌐 Step 4: Frontend Deployment (React + Vite)

### 4.1 Environment Variables (`frontend/.env`)
On your frontend hosting dashboard (Vercel / Netlify / Cloudflare Pages), configure the API endpoint pointing to your newly deployed backend:

```env
VITE_API_URL=https://your-backend-api.onrender.com/api
```

### 4.2 Build & Deploy Instructions (Example: Vercel)
1. Import your GitHub repository into Vercel and select the `frontend` folder as the **Root Directory**.
2. **Framework Preset**: Vite
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`
6. Click **Deploy**. Vercel will build the optimized static bundle and assign your SSL domain (e.g., `https://mscollection.vercel.app`).

### 4.3 Handling Single Page Application (SPA) Routing
If deploying to a static host other than Vercel (e.g., Netlify), ensure React Router URLs don't return `404` on page refresh:
- **Netlify**: Create a `frontend/public/_redirects` file containing:
  ```text
  /*    /index.html   200
  ```

---

## ✅ Step 5: Post-Deployment Verification Checklist

After both frontend and backend are live, execute the following end-to-end verification steps:

- [ ] **Home & Catalog Load**: Visit your frontend domain. Verify the MS Collection storefront hero image loads clearly, brand identity displays `Sikar, Rajasthan`, and products display prices in `₹... INR`.
- [ ] **User Registration & Login**: Create a new customer account to confirm JWT tokens generate and save to `localStorage` (`mscollection_user`).
- [ ] **Cart & Promo Codes**: Add an item to the shopping bag. Verify free shipping calculation updates (`₹2,000 INR threshold`) and apply coupon `MSCOLLECTION10` for a 10% discount.
- [ ] **Razorpay Checkout Verification**:
  1. Proceed to checkout and submit shipping details for Sikar, Rajasthan (`332001`).
  2. Click **Proceed to Payment via Razorpay**. Confirm the official Razorpay modal opens displaying **MS Collection** and INR currency.
  3. Complete a transaction using live UPI or card.
  4. Verify you are automatically redirected to your `/order/:id` confirmation page showing `Order Status: Paid`.
- [ ] **Webhook & Inventory Deduction Check**:
  - In Razorpay Dashboard under **Webhooks**, check the execution history for `order.paid` to ensure a `200 OK` response was returned by your server.
  - Check the Admin Portal or database to confirm the product's `countInStock` decreased atomically by the ordered quantity.
- [ ] **Admin Portal Security**: Log into `/admin` using `admin@mscollection.com`. Confirm product creation, stock updates, and order dispatch status changes (`Processing` -> `Shipped` -> `Delivered`) function without issues.

---

## 🔒 Security & Maintenance Notes

1. **CORS Configuration**: By default, `server.js` allows CORS across browsers. If you wish to restrict API access strictly to your custom domain, update `cors()` in `backend/src/server.js`:
   ```javascript
   app.use(cors({
     origin: ['https://mscollection.vercel.app', 'https://www.mscollection.com'],
     credentials: true
   }));
   ```
2. **Rate Limiting**: Rate limiting (`express-rate-limit`) is active on `/api/` endpoints (100 requests per 15 minutes per IP) to mitigate brute-force and DDoS attempts.
3. **Database Backups**: Enable automatic daily or weekly snapshots within MongoDB Atlas under **Backup** settings.
