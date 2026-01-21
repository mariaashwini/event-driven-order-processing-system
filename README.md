# 📌 Event-Driven Order Processing System

Built a simple **order processing system** that demonstrates proper use of **event-driven architecture** using NestJs event emitter.

ReactJS, Typescript and MySQL.

The focus of this project is system design, data consistency, and service decoupling, rather than UI complexity.

🎯 Objective of the Assignment

Build an order processing workflow similar to real e-commerce systems

Implement event-driven communication between services

Ensure data consistency using database transactions

Demonstrate clear separation of responsibilities

Provide a simple but functional frontend to consume APIs

✨ Key Features
🔹 Backend (NestJS)

Create orders with multiple items

Inventory validation and stock reservation

Event-driven workflow using domain events

Automatic order status transitions:

PENDING → CONFIRMED

PENDING → FAILED

Notification service (simulated email logging)

Analytics service (total orders & revenue)

Database-driven analytics refresh

DTO validation and error handling

Transaction-safe order creation

🔹 Frontend (React + TypeScript)

View all orders

View order details with item breakdown

Create new orders

View analytics (total orders & revenue)

Clean API abstraction layer

Minimal CSS (focus on logic & architecture)

🧠 System Architecture (Event-Driven)
Order Created
     │
     ▼
Inventory Service
     │
     ├── Inventory Reserved ──► Order Confirmed ──► Notification + Analytics
     │
     └── Inventory Failed ────► Order Failed ─────► Notification

Design Principles Applied

Loose coupling between services

Events trigger actions, not direct method calls

Database as source of truth

Analytics refreshed based on domain events

🛠️ Tech Stack
Backend

Framework: NestJS

Database: MySQL

ORM: TypeORM

Architecture: Event-Driven Architecture

Validation: class-validator

Events: @nestjs/event-emitter

Frontend

Framework: React

Language: TypeScript

Routing: React Router

API Handling: Fetch API

Styling: Minimal CSS

📂 Project Structure
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

🔌 API Endpoints
Orders

POST /orders – Create a new order

GET /orders – Get all orders

GET /orders/:id – Get order details

Products

GET /products – List all products

Analytics

GET /analytics/data – Get total orders & total revenue

⚙️ Analytics Design Decision

Analytics service listens to order confirmation events

Events trigger analytics refresh

Analytics data is recalculated from the database

In-memory storage is used only as a cache

Ensures accuracy and consistency, even after restarts

⚡ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/mariaashwini/event-driven-order-processing-system.git
cd event-driven-order-processing-system

2️⃣ Backend Setup
cd backend
npm install
npm run start


Create .env file:

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=yourpassword
DB_NAME=order_processing_system

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

🧪 Key Technical Highlights

Orders are created inside database transactions

Product prices are not trusted from the client

Inventory checks happen asynchronously via events

Analytics data is derived from persisted data

Clear separation between:

Domain logic

Infrastructure

Presentation layer

👩‍💻 Developer Notes

This project was designed to demonstrate backend architecture and system thinking, rather than UI polish.
All major decisions are intentional and align with real-world backend practices.

👤 Author

Maria Ashwini
Full-Stack Developer
React | NestJS | MySQL

GitHub: https://github.com/mariaashwini