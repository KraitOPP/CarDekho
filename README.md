# CarDekho

**CarDekho** is an online car rental marketplace that allows users to rent cars of various brands and models. It also provides an admin panel to manage vehicles, bookings, testimonials, contact queries, and user subscriptions.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Contributing](#contributing)

## Features
- **User Portal**  
  - Browse car brands, models, and individual vehicles  
  - View detailed vehicle information and availability  
  - Rent cars online by selecting dates, duration, and location  
  - View and manage booking history  
  - Submit and view testimonials and feedback  
  - Manage user profile and preferences

- **Admin Panel**  
  - CRUD operations for car brands, models, and vehicles  
  - View, approve, cancel, and update bookings  
  - Manage user testimonials and subscriptions  
  - Handle contact inquiries and support requests  
  - Dashboard metrics for rentals, revenue, and user activity

## Tech Stack
- **Frontend:** Vite, React, Chakra UI, Redux Toolkit, RTK Query, React Router  
- **Backend:** Node.js, Express.js, MySQL  
- **Authentication:** JWT with HTTP-only cookies  
- **File Uploads:** Multer (for vehicle images)  
- **Notifications:** React Toastify  
- **State Management:** Redux Toolkit, RTK Query

## Prerequisites
- Node.js v16 or higher  
- npm or Yarn  
- MySQL server (v5.7+ recommended)

## Getting Started
1. **Clone the repository**  
   ```bash
   git clone https://github.com/KraitOPP/CarDekho.git
   cd CarDekho
   ```
2. **Install dependencies**  
   - Backend:
     ```bash
     cd backend
     npm install
     ```  
   - Frontend:
     ```bash
     cd ../frontend
     npm install
     ```
3. **Set up the database**  
   - Create a MySQL database, e.g., `cardekho_db`.  
   - (Optional) Run migrations or import `backend/db/schema.sql`.
4. **Configure environment variables**  
   - Copy `.env.example` to `.env` in both `backend` and `frontend` folders.  
   - Update the values as needed (see [Configuration](#configuration)).
5. **Start the development servers**  
   - Backend:
     ```bash
     cd backend
     npm run dev
     ```  
   - Frontend:
     ```bash
     cd ../frontend
     npm run dev
     ```
6. **Access the application**  
   - Frontend: `http://localhost:5173`  
   - Backend API: `http://localhost:8000/api`

## Configuration
### Backend `.env`
```env
PORT=8000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=cardekho_db
JWT_SECRET=your_jwt_secret
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:8000/api
```

## Folder Structure
```
CarDekho/
├─ backend/            # Express API server
│  ├─ src/
│  │  ├─ controllers/   # Request handlers
│  │  ├─ routes/        # API routes
│  │  ├─ middlewares/   # Auth, error handling, file upload
│  │  ├─ db/            # MySQL connection & query utils
│  │  ├─ utils/         # Helper functions
│  │  ├─ app.js         # Express app initialization
│  │  └─ index.js       # Server entry point
│  └─ db/
│     └─ schema.sql     # Database schema

├─ frontend/           # React client
│  ├─ public/          # Static assets
│  ├─ src/
│  │  ├─ components/   # Reusable UI components
│  │  ├─ pages/        # Route-level components
│  │  ├─ store/        # Redux store & slices
│  │  ├─ api/          # RTK Query endpoints
│  │  ├─ styles/       # Global styles/theme
│  │  ├─ App.jsx       # App root component
│  │  └─ main.jsx      # Entry point
│  └─ vite.config.js   # Vite configuration

└─ README.md           # Project documentation
```

## API Endpoints
| Method | Endpoint                 | Access     | Description                        |
|--------|--------------------------|------------|------------------------------------|
| GET    | `/api/brands`            | Public     | List all car brands                |
| POST   | `/api/brands`            | Admin      | Create a new brand                 |
| GET    | `/api/models`            | Public     | List all car models                |
| POST   | `/api/models`            | Admin      | Create a new model                 |
| GET    | `/api/vehicles`          | Public     | List all vehicles                  |
| POST   | `/api/vehicles`          | Admin      | Add a new vehicle                  |
| PUT    | `/api/vehicles/:id`      | Admin      | Update vehicle details             |
| DELETE | `/api/vehicles/:id`      | Admin      | Remove a vehicle                   |
| GET    | `/api/bookings`          | User/Admin | List bookings                      |
| POST   | `/api/bookings`          | User       | Create a new booking               |
| PUT    | `/api/bookings/:id`      | Admin      | Update booking status              |
| GET    | `/api/testimonials`      | Public     | List testimonials                   |
| POST   | `/api/testimonials`      | User       | Submit a testimonial               |
| GET    | `/api/contacts`          | Admin      | List contact inquiries             |
| POST   | `/api/contacts`          | Public     | Submit a contact inquiry           |

## Usage
1. Register or log in as a **User** to browse vehicles and create bookings.  
2. Register or log in as an **Admin** to access management features at `/admin`.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.  
2. Create a feature branch: `git checkout -b feature-name`.  
3. Commit your changes: `git commit -m "feat: description"`.  
4. Push to your branch: `git push origin feature-name`.  
5. Open a Pull Request.

Please ensure code follows existing style conventions and includes relevant tests.

