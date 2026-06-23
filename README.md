# StudyNook – Library Study Room Booking

> A smart library study room booking platform where users can discover, manage, and reserve study spaces.

[![https://study-nook-gold.vercel.app/](https://img.shields.io/badge/Live-Website-success?style=for-the-badge&logo=vercel)](#) 
[![https://github.com/MuradHasan49/StudyNook-Server](https://img.shields.io/badge/GitHub-Server_Repo-blue?style=for-the-badge&logo=github)](#)

**Live Website:** [https://study-nook-gold.vercel.app/]  
**Server Repository:** [https://github.com/MuradHasan49/StudyNook-Server]  

---

## 📖 Project Overview

StudyNook is a comprehensive full-stack MERN application designed to streamline the process of finding and booking study rooms in university and public libraries. It allows users to:

- Browse available study rooms
- Search and filter rooms
- Create their own room listings
- Book rooms for specific dates and time slots
- Manage personal listings and bookings
- Prevent double booking using conflict detection

---

## ✨ Features

- **Responsive Design:** Optimized for mobile, tablet, and desktop viewing.
- **Authentication:** Secure JWT authentication using HTTP-only cookies.
- **Social Login:** Quick and easy Google OAuth login support.
- **Private Routes:** Secure routing to protect sensitive user pages.
- **User System:** Complete user registration, login, and session management.
- **Room Management (CRUD):** Add, update, read, and delete study rooms seamlessly.
- **Authorization:** Strict room owner authorization for modifications.
- **Search & Filter:** Search rooms by name or filter by specific amenities.
- **Showcase:** Dynamic display of the latest room listings on the homepage.
- **Detailed Views:** Comprehensive room details page showing availability.
- **Booking System:** Intuitive booking flow with date and time selection.
- **Conflict Prevention:** Intelligent backend logic to prevent overlapping reservations.
- **Dashboards:** Dedicated "My Bookings" and "My Listings" management panels.
- **Cancellations:** Hassle-free booking cancellation system.
- **Notifications:** Real-time toast notifications for user feedback.
- **UX Enhancements:** Engaging loading states and a custom 404 Not Found page.
- **Theming:** Full dark/light mode support for user preference.

---

## 🛠 Technology Stack

### Frontend
- **Next.js**
- **React.js**
- **React Router**
- **Tailwind CSS**
- **Axios / Fetch API**
- **React Hook Form**
- **React Hot Toast**
- **Framer Motion**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **JWT (JSON Web Tokens)**
- **Cookie Parser**
- **CORS**

### Authentication
- JWT stored securely in HTTP-only cookies
- Google OAuth Integration

### Deployment
- **Frontend:** Vercel
- **Backend:** Render

---

## 🗺 Application Pages

**Public Pages:**
- Home Page
- All Rooms Page
- Login Page
- Register Page

**Private Pages:**
- Add Room
- My Listings
- Room Details Booking
- My Bookings

---

## 📅 Booking System Explanation

The StudyNook booking system ensures a smooth and conflict-free reservation process:
- **Selection:** Users pick a preferred date, start time, and end time.
- **Calculation:** The total cost is calculated automatically based on the room's hourly rate and duration.
- **Validation:** The backend rigorously checks existing bookings for the specified room.
- **Prevention:** Overlapping reservations are strictly prevented, guaranteeing exclusive access.
- **Management:** Users retain full control and can cancel their future bookings at any time.

## 🔐 Environment Variables

To run this project locally, create `.env` files in both the client and server directories with the following variables.

> **Warning:** Never expose environment variables publicly!

### Client (`.env`)
```env
NEXT_PUBLIC_API_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MONGODB_URI=
```

### Server (`.env`)
```env
PORT=
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=
```

---

## 🚀 Installation Guide

### Client Setup

```bash
git clone https://github.com/MuradHasan49/StudyNook
cd StudyNook
npm install
npm run dev
```

### Server Setup

```bash
git clone https://github.com/MuradHasan49/StudyNook-Server
cd StudyNook-Server
npm install
npm run dev
```

---

## 📡 API Overview

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and issue JWT
- `POST /api/auth/logout` - Clear HTTP-only authentication cookie

### Rooms
- `GET /api/rooms` - Retrieve all rooms
- `GET /api/rooms/:id` - Retrieve a specific room
- `POST /api/rooms` - Create a new room listing
- `PUT /api/rooms/:id` - Update an existing room listing
- `DELETE /api/rooms/:id` - Delete a room listing

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/my-bookings` - Retrieve current user's bookings
- `PATCH /api/bookings/:id/cancel` - Cancel an existing booking

---

## 🛡 Security Measures

- **JWT Verification:** Middleware intercepts and verifies tokens on all protected routes.
- **HTTP-Only Cookies:** Tokens are stored securely to mitigate XSS vulnerability risks.
- **Protected Routes:** Both client-side React routes and server-side API endpoints are protected.
- **Owner-Based Authorization:** Strict checks ensure users can only modify or delete their own data.
- **Input Validation:** Server-side validation guarantees safe and expected data formats.

---

## 🎨 Design

- **Unique Modern UI:** A visually striking, glassmorphism-inspired interface.
- **Responsive Layout:** A flawless experience across mobile, tablet, and desktop breakpoints.
- **Consistent Card Design:** Uniform aesthetic for room listings and statistical dashboards.
- **Modern Navigation:** Intuitive routing combined with smooth animated transitions.
- **User-Friendly Experience:** Clear calls-to-action, micro-interactions, and instant feedback.

---

## 🔮 Future Improvements

- Online payment integration (e.g., Stripe)
- Email notifications for booking confirmations
- Admin dashboard for platform moderation
- Interactive room availability calendar view
- Advanced analytics for room owners

---

## 👨‍💻 Author

**Created by:** Murad Hasan

