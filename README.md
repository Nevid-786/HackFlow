# HackFlow

HackFlow is a full-stack web application for discovering, organizing, and managing hackathons. Users can explore hackathons, create teams, join teams, and manage their profiles through a modern web interface.

---

# Tech Stack

## Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

## DevOps
- Docker
- Docker Compose

---

# Prerequisites

Install the following before running the project:

- Docker Desktop
- Git

Verify the installation:

```bash
docker --version
docker compose version
git --version
```

---

# Clone the Repository

```bash
git clone https://github.com/Nevid-786/HackFlow.git
cd HackFlow
```

---

# Project Structure

```
HackFlow
│
├── Backend
│   ├── controllers
│   ├── DB
│   ├── middleWare
│   ├── models
│   ├── routes
│   ├── Dockerfile
│   └── ...
│
├── Frontend
│   ├── public
│   ├── src
│   ├── Dockerfile
│   └── ...
│
├── docker-compose.yml
└── README.md
```

---

# Running the Application

Make sure you are inside the project root directory.

## 1. Build the Docker images

```bash
docker compose build
```

## 2. Start the application

```bash
docker compose up -d
```

## 3. Verify the containers

```bash
docker ps
```

You should see three running containers:

- hackflow-frontend
- hackflow-backend
- hackflow-mongo

---

# Default Admin Account

On the first startup, HackFlow automatically creates an administrator account.

Use the following credentials:

**Email**

```text
admin@gmail.com
```

**Password**

```text
admin123
```

> The admin account is created only if one does not already exist.

---

# Application URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| MongoDB | mongodb://localhost:27017 |

---

# Docker Containers

| Container | Purpose |
|-----------|---------|
| hackflow-frontend | React Frontend |
| hackflow-backend | Express Backend |
| hackflow-mongo | MongoDB Database |

---

# Useful Docker Commands

### View running containers

```bash
docker ps
```

### View logs

```bash
docker logs hackflow-backend
docker logs hackflow-frontend
docker logs hackflow-mongo
```

### Restart containers

```bash
docker compose restart
```

### Rebuild after code or dependency changes

```bash
docker compose up --build
```

### Stop containers

```bash
docker compose down
```

### Stop containers and remove MongoDB data

```bash
docker compose down -v
```

---

# Access MongoDB Shell

```bash
docker exec -it hackflow-mongo mongosh
```

Switch to the project database:

```javascript
use HackFlow
```

View collections:

```javascript
show collections
```

View users:

```javascript
db.users.find().pretty()
```

---

# Features

- Secure User Authentication
- JWT Access & Refresh Tokens
- Admin Dashboard
- Hackathon Management
- Team Creation
- Team Management
- User Profiles
- Protected Routes
- MongoDB Data Persistence
- Dockerized Deployment

---

# Development

Whenever Dockerfiles or dependencies change:

```bash
docker compose up --build
```

For normal development after code changes:

```bash
docker compose restart
```

---

# Stopping the Application

Stop all running containers:

```bash
docker compose down
```

Remove containers along with MongoDB data:

```bash
docker compose down -v
```

---

# License

This project is intended for educational and personal use.

---

# Author

**Nevid Alam**

GitHub: https://github.com/Nevid-786