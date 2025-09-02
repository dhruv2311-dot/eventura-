# 🎉 Eventura – Event Management Platform

🚀 **Quick Links**  
- 🌐 [Frontend Deployment (Netlify)](https://eventura-23.netlify.app)  
- 🎨 [Figma Design]([https://your-figma-link.com](https://www.figma.com/design/VTpYgGhHaIuRfob33itg2p/codinggita?node-id=124-532&t=vtIPVwzy8GVvCr3a-1))  
- 📑 [API Documentation]([https://your-api-doc-link.com](https://documenter.getpostman.com/view/39189509/2sAYX3s4Dc))  

---

## 📌 About
**Eventura** is a modern, full-stack **Event Management Platform** designed to simplify event discovery, booking, and management.  
It features a seamless user experience, authentication with **Auth0**, a robust booking system, live chat, an admin panel, and powerful utilities like a **budget estimator** and **ticket receipts**.

---

## ✨ Features
- 🔑 **Authentication** – Secure login with **Auth0** (landing page public, other pages protected).  
- 📅 **Events & Venues** – Dynamically fetched from MongoDB, displayed with filters and carousel navigation.  
- 📝 **Booking System** – Book events/venues with status management: `Pending`, `Confirmed`, `Cancelled`.  
- 💳 **Payment Gateway** – Integrated on the "My Booking" page.  
- 📊 **Event Budget Estimator** – Estimate costs for venue, catering, décor, and more.  
- 🎟️ **Ticket Receipts** – Downloadable receipt with event ID, user ID, payment ID, and order date.  
- 💬 **Live Chat** – Real-time messaging between users and admin using **Socket.io + MongoDB**.  
- 🛠️ **Admin Panel** – Manage categories, venues, and products with **NeoMorphic (Soft UI)** theme.  

---

## 🚀 Live Demo
- 🌐 **Frontend (Netlify)**: [eventura-23.netlify.app](https://eventura-23.netlify.app)  

---

## 🛠️ Tech Stack
| Layer       | Technology               |
|-------------|--------------------------|
| Frontend    | React, Tailwind CSS, Netlify |
| Backend     | Node.js, Express, Render |
| Database    | MongoDB                  |
| Auth        | Auth0                    |
| Realtime    | Socket.io                |
| UI Design   | Neo-morphic theme        |
| Utilities   | Cloudinary, Budget Estimator, PDF Receipts |

---

## 🎯 Usage

🖥️ Open the landing page → Browse events & venues  
🔐 Login with Auth0 → Unlock booking system  
📅 Book an event/venue → Check under "My Booking"  
✍️ Confirm/Cancel booking → Status updates accordingly  
💳 Pay for booking → Download digital receipt  
💬 Chat live with admin for queries  
🛠️ Admin panel → Manage categories, venues, products  

---

## 🗺️ Roadmap

- [ ] Add real payment gateway integration  
- [ ] Implement admin role management  
- [ ] Persistent live chat with typing indicators  
- [ ] Event recommendations using AI  

---

## 🛠️ Tech Stack

### **Frontend**
- React.js + Tailwind CSS  
- Shadcn/UI + Lucide React (icons)  
- Framer Motion (animations)  

### **Backend**
- Node.js + Express.js  
- MongoDB (with Cloudinary for image uploads)  
- Socket.io (real-time chat)  

### **Auth & Deployment**
- Auth0 (authentication)  
- Netlify (frontend hosting)  
- Render (backend hosting)  

---

## 🚀 Getting Started

### 🔧 Prerequisites
- Node.js & npm  
- MongoDB instance  
- Auth0 account  

### ⚡ Installation
```bash
# Clone the repository
git clone https://github.com/your-username/eventura.git

# Navigate to project directory
cd eventura

# Install dependencies
npm install

# Start development server
npm run dev
---

