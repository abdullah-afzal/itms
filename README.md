# ITMS (Integrated Task Management System)

A full-stack monorepo application designed for internal task management, built with **Node.js (Express)**, **TypeScript**, **React**, and **Prisma ORM**.

## Getting Started

### Prerequisites

* **Node.js**
* **npm**

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/abdullah-afzal/itms
cd itms
```


2. **Install dependencies**
This project uses NPM Workspaces; running install at the root handles both backend and frontend.
```bash
npm run install-all
```


3. **Environment Configuration**
Run the setup script to initialize `.env` files from examples:
```bash
npm run setup
```


*Note: Open `backend/.env` and `frontend/.env` to update your database credentials and JWT secrets.*
4. **Database Initialization & Seeding**
Generate the Prisma client and populate the database with initial data:
```bash
# Ensure your database is running before seeding
npm run seed
```


5. **Build and Start**
```bash
npm run build
npm run start
```

**Default Credentials:**
* **Email:** `admin@example.com`
* **Password:** `admin123`

---

## Development & Testing

### Development Mode

Runs both frontend and backend concurrently with hot-reloading:

```bash
npm run dev
```

### Running Tests

Automated tests are partitioned by workspace:

```bash
# Run Backend Integration Tests (Jest)
npm run test:backend

# Run Frontend Component Tests
npm run test:frontend
```

---

## API Documentation

### Authentication

| Endpoint | Method | Description | Auth Required |
| --- | --- | --- | --- |
| `/auth/register` | `POST` | Create a new user account | No |
| `/auth/login` | `POST` | Authenticate and receive JWT | No |

### Users

| Endpoint | Method | Description | Auth Required |
| --- | --- | --- | --- |
| `/users` | `GET` | Retrieve list of all users | Yes |
| `/users/me` | `GET` | Get current authenticated user profile | Yes |

### Tasks

| Endpoint | Method | Description | Auth Required |
| --- | --- | --- | --- |
| `/tasks` | `GET` | List all tasks (Optional query: `?status=...`) | Yes |
| `/tasks` | `POST` | Create a new task | Yes |
| `/tasks/:id` | `PUT` | Update an existing task | Yes |
| `/tasks/:id` | `DELETE` | Remove a task | Yes |

---

## System Architecture

### Database Design

The project utilizes **Prisma ORM** for type-safe database access. The schema is designed to facilitate a 1-to-many relationship between Users and Tasks.

### Security Implementation

* **JWT Authorization:** All routes (except `/auth/*`) are protected via a `Bearer` token strategy.
* **Authorization Header:** Requests to protected routes must include:
`Authorization: Bearer <your_jwt_token>`
* **Internal Access Model:** Designed for internal organizational use. Registration is open, and all authenticated users share visibility of the global task pool.

---

## Tradeoffs & Design Decisions

1. **Flat Authorization Logic:** * *Decision:* All authenticated users can view/edit all tasks.
* *Tradeoff:* Simpler implementation but lacks granular Role-Based Access Control (RBAC). This assumes a high-trust internal environment.

2. **Registration Workflow:**
* *Decision:* Immediate access upon registration (no admin approval).
* *Tradeoff:* Streamlines onboarding for internal teams but requires network-level security (VPN/Firewall) if deployed in a sensitive environment.
