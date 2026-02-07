# Slotify Class Scheduler

Slotify Class Scheduler is a modern, full-stack application designed to streamline class scheduling and booking management. Built with a robust backend and a dynamic, responsive frontend, it provides an intuitive experience for both administrators and students.

## 🚀 Features

- **Dynamic Scheduling**: Create and manage class schedules efficiently.
- **Monthly Seeding**: Automatically generate schedules for an entire month.
- **User Bookings**: Users can easily book available slots and manage their reservations.
- **Real-time Updates**: Interactive UI reflecting current booking statuses and availability.
- **Authentication**: Secure user login and signup using JWT and bcrypt.
- **Responsive Design**: Fully optimized for desktop and mobile devices.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Yup](https://github.com/jquense/yup)
- **API Client**: [Axios](https://axios-http.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📁 Project Structure

```text
slotify-class-scheduler/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # UI components (Schedule, Common, etc.)
│   │   ├── services/       # API integration
│   │   ├── store/          # Redux state management
│   │   └── utils/          # Helper functions
├── server/                 # Express backend
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth and error handling
│   │   ├── routes/         # API endpoints
│   │   └── index.ts        # Entry point
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the `server` directory and add your database URL and secret:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/slotify"
   PORT=8008
   JWT_SECRET="your_secret_key"
   ```

4. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:8008/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Auth
- `POST /api/register` - Create a new user account
- `POST /api/login` - Authenticate user and get token

### Schedules
- `GET /api/schedules` - Fetch all available schedules
- `POST /api/schedules` - Create a new schedule (Admin)
- `POST /api/schedules/seed` - Seed schedules for a month

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/user/:userId` - Get bookings for a specific user
- `DELETE /api/bookings/:id` - Cancel a booking

## 📄 License

This project is licensed under the ISC License.
