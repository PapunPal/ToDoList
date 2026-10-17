# Rails Todo App

A full-stack Todo application built with **Ruby on Rails 8 API** (backend) and **React + TypeScript + Vite** (frontend), using **JWT authentication** via Devise.

## 🛠 Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend | Ruby on Rails 8.1 (API mode) |
| Frontend | React 18 + TypeScript + Vite |
| Auth | Devise + devise-jwt |
| Database | PostgreSQL |
| Styling | Tailwind CSS |

## 📁 Project Structure

```
RailsTodoApp/
├── Backend/      # Rails API
└── Frontend/     # React + Vite app
```

## 🚀 Getting Started

### Prerequisites

- Ruby 4.0+
- Node.js 18+
- PostgreSQL 15+

---

### Backend Setup

```bash
cd Backend

# Copy environment variables
cp .env.example .env
# Edit .env and fill in your POSTGRES_PASSWORD

# Install gems
bundle install

# Create and migrate database
rails db:create
rails db:migrate

# Start the server (runs on http://localhost:3000)
rails s
```

---

### Frontend Setup

```bash
cd Frontend

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start dev server (runs on http://localhost:5173)
npm run dev
```

---

## 🔐 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register a new user | No |
| POST | `/login` | Login and get JWT token | No |
| DELETE | `/logout` | Logout | Yes |
| GET | `/api/v1/todo_lists` | Get all todos | Yes |
| POST | `/api/v1/todo_lists` | Create a todo | Yes |
| PATCH | `/api/v1/todo_lists/:id` | Update a todo | Yes |
| DELETE | `/api/v1/todo_lists/:id` | Delete a todo | Yes |

### Auth Header
All authenticated requests require:
```
Authorization: Bearer <your_jwt_token>
```

### Signup Example
```json
POST /signup
{
  "user": {
    "email": "user@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }
}
```

---

## ⚙️ Environment Variables

### Backend (`Backend/.env`)
```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
```

### Frontend (`Frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:3000
```

---

## 📝 License

MIT
