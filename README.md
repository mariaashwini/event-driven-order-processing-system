# 📌 Event-Driven Order Processing System

This project was developed as part of an **interview technical assignment**.

The goal was to build a **simple but well-structured order processing system** that demonstrates a clear understanding of **event-driven architecture**, backend design, and basic frontend integration.

The focus of this project is **clean architecture and correct data flow**, not UI design.

📂 **GitHub Repo:** [https://github.com/mariaashwini/event-driven-order-processing-system](https://github.com/mariaashwini/event-driven-order-processing-system)

## 🎯 Objective of the Assignment

- Implement an event-driven backend using NestJS

- Avoid direct service-to-service calls

- Handle order lifecycle using events

- Maintain proper separation between:

     - Orders

     - Inventory

     - Notifications

     - Analytics

- Provide a minimal React frontend to interact with the system

## 🧠 High-Level Flow (How the System Works)

```md 
1. A user creates an order from the frontend

2. Order is saved in the database with PENDING status

3. An OrderCreatedEvent is emitted

4. Inventory service listens to the event:

     - If stock is available → stock is reduced → InventoryReservedEvent

     - If stock is not available → InventoryFailedEvent

5. Orders service listens to inventory events:

     - Reserved → order becomes CONFIRMED

     - Failed → order becomes FAILED

6. Notifications service logs a simulated email message

7. Analytics service updates order statistics
```
All communication between services happens only via events.

## 🏗️ Architecture Overview

```css
Order Created
     │
     ▼
Inventory Service
     │
     ├── Inventory Reserved ──► Order Confirmed ──► Notification + Analytics
     │
     └── Inventory Failed ────► Order Failed ─────► Notification
```
## 🛠️ Tech Stack

Backend

- NestJS
- TypeScript
- MariaDB
- TypeORM
- @nestjs/event-emitter

Frontend

- React
- TypeScript
- React Router
- Fetch API
- Minimal CSS

## 📂 Project Structure

Backend
backend/
 ├── orders/
 ├── inventory/
 ├── products/
 ├── analytics/
 ├── notifications/
 ├── events/
 ├── database/
 └── config/

Frontend
frontend/
 ├── api/
 ├── pages/
 ├── components/
 ├── routes/
 └── types/

## 🗄️ Database Schema (MariaDB)

- products

- orders

- order_items

Key design decisions:

- Product price is copied to order_items.price_at_purchase

- Client-sent prices are not trusted

- Order total is calculated on the backend

## 🔌 REST APIs Implemented

**Orders**

- POST /orders – Create a new order
- GET /orders – List all orders
- GET /orders/:id – Get order details

**Products**

- GET /products – List all products

**Analytics**

- GET /analytics/data – Get total orders & total revenue

## 📊 Analytics Design

- Analytics service listens for OrderConfirmedEvent

- On each event, analytics are recalculated from the database

- In-memory variables are used only as a cache

- This ensures correctness even after server restarts

## 🖥️ Frontend Pages

```md
1. Create Order Page
     - Customer details
     - Product selection
     - Quantity input
     - Live total calculation
2. Orders List Page
     - Order ID
     - Customer name
     - Total amount
     - Status
     - Created date
3. Order Detail Page
     - Order information
     - Items list
     - Current status
4. Analytics Page
     - Total orders count
     - Total revenue
```

UI is intentionally simple to keep focus on logic.

## ⚙️ Setup Instructions
Follow these steps to run the project locally:

```bash
# 1. Clone the repository
git clone https://github.com/mariaashwini/event-driven-order-processing-system.git

# 2. Navigate into the project folder
cd order-processing-system
```

**Backend**

```bash
cd backend
npm install
npm run start
```

Create .env file for backend:

```bash
# App
PORT=3000

# Database (MariaDB)
DB_HOST=localhost
DB_PORT=3307
DB_USERNAME=root
DB_PASSWORD=admin@07
DB_NAME=order_processing_system
```
Ensure MariaDB is running.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```
Create .env file for frontend:

```bash
VITE_API_BASE=http://localhost:3000
```

## ✅ Key Design Decisions

- No direct service-to-service calls

- All cross-service communication via events

- Backend does not trust client-sent prices

- Transactions used for order creation

- Analytics derived from persisted data

## 🧪 What Can Be Tested

- Order with sufficient stock → CONFIRMED

- Order with insufficient stock → FAILED

- Inventory stock decreases correctly

- Notification logs appear in console

- Analytics updates after confirmed orders