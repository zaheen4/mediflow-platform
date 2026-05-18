# Rewrite README for Node.js Backend

## Goal
The README incorrectly instructs users to set up a Python backend. The actual backend is Node.js/Express. Rewrite the entire README to reflect the correct stack.

## Files to Touch
- `README.md`

## Current State
README says:
- Install Python
- Create venv with `python -m venv mediflowenv`
- `pip install -r requirements.txt`
- Run with `python app.py`

All of this is wrong — the backend is Node.js.

## Steps

1. Replace the entire `README.md` with:

```markdown
# Mediflow - Installation & Deployment Guide

## Prerequisites
Before setting up the project, ensure you have the following installed:

### 1. Node.js & NPM
Download and install from [Node.js official website](https://nodejs.org/).
Verify installation:
```sh
node -v
npm -v
```

### 2. MySQL
Install MySQL from [MySQL official website](https://www.mysql.com/).
Ensure MySQL is running and accessible.

---

## Project Setup

### 1. Clone the Repository
```sh
git clone https://github.com/zaheen4/mediflow-react-app.git
cd mediflow-react-app
```

### 2. Install Frontend Dependencies
```sh
npm install
```

### 3. Install Backend Dependencies
```sh
cd mediflow-backend
npm install
cd ..
```

---

## Database Setup

### 1. Import the SQL File
```sh
mysql -u root -p < mediflow-backend/mediflowdb.sql
```
Enter your MySQL root password when prompted.

### 2. Configure Environment Variables

#### Backend
Create a `.env` file in `mediflow-backend/`:
```
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=mediflowdb
SECRET_KEY=your_secret_key
JWT_EXPIRATION=1h
```

Or copy the template:
```sh
cp mediflow-backend/.env.example mediflow-backend/.env
```

#### Frontend
Create a `.env` file in the project root:
```
VITE_API_BASE_URL=http://localhost:5000
```

Or copy the template:
```sh
cp .env.example .env
```

---

## Running the Application

### 1. Start the Backend
```sh
cd mediflow-backend
npm start
```
Server runs on `http://localhost:5000`

### 2. Start the Frontend (in a new terminal)
```sh
npm run dev
```
App runs on `http://localhost:5173`

---

## Default Admin Account
After importing the SQL file, a default admin account is available:
- **Username**: `Admin99`
- **Password**: Check the SQL dump for the hashed password (you'll need to set your own or register a new admin)

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login and receive JWT token |

### Equipment (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/equipment` | Get all equipment |
| GET | `/equipment/:id` | Get single equipment |

### Equipment (Admin Only — requires Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/add-equipment` | Add new equipment |
| PUT | `/modify-equipment/:id` | Update equipment |
| DELETE | `/delete-equipment/:id` | Delete equipment |

---

## Additional Notes
- Ensure MySQL is running before starting the backend
- The `.env` files contain sensitive data and are excluded from version control
- Use `.env.example` files as templates for configuration
```

## Verification
- README should accurately describe the Node.js backend setup
- No references to Python, venv, pip, or `python app.py`
- API documentation table is included
- Default admin account info is mentioned
