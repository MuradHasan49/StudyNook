# StudyNook – Library Study Room Booking

StudyNook is a premium, full-stack study room booking system designed for university libraries and cooperative workspaces. Students can easily browse available learning spaces, filter listings based on capacity, floor, or necessary amenities (such as whiteboards and projectors), and lock in their reservations with real-time conflict-free slot validation. Study room owners can easily create, manage, and edit their listings.

**Live Client URL**: [https://studynook-client.vercel.app](https://studynook-client.vercel.app)

---

## 🌟 Key Features

* **Conflict-Free Hourly Booking**: Powered by robust backend validation to ensure zero overlapping reservation slots for the same room.
* **JWT Cookie Session Authentication**: Implements HTTP-only JWT cookies to maintain secure sessions that persist reliably through page reloads.
* **Dynamic Search & Multi-Filter Panel**: Instantly search rooms by name, floor selection, maximum hourly rates via range sliders, and active amenities checklist.
* **Interactive Owner Dashboards**: User-friendly panels to list new study spaces (`/add-room`), edit listed attributes, delete rooms, or cancel future bookings with cancellation modals.
* **Premium Responsive Design**: Supports beautiful light/dark theme toggles, smooth keyframe sliding animations, and unified card sizing across mobile, tablet, and desktop views.
* **Google OAuth Simulation**: Instant login bridging that syncs simulated Google authentication directly with the user records database.

---

## 🛠️ Technology Stack

**Frontend (Client)**:
* Next.js 16 (App Router)
* React 19
* Tailwind CSS v4
* Lucide React (Icons)
* React Hot Toast (Notifications)
* Framer Motion (Page Transitions)

**Backend (Server)**:
* Node.js & Express
* Mongoose & MongoDB Atlas
* JSON Web Tokens (JWT) & Cookie Parser
* Bcrypt (Password Hashing)
* Cors & Helmet (Security Headers)

---

## 🚀 Installation & Local Setup

### 1. Backend Server Setup
1. Navigate to the server folder:
   ```bash
   cd a09-server/server
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add your credentials:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_signing_key
   CLIENT_URL=http://localhost:3000
   ```
4. Run the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Client Setup
1. Navigate to the client folder:
   ```bash
   cd a09-client
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the frontend development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) on your web browser.
