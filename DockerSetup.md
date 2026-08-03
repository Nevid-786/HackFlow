# Clone the Repository
```
git clone https://github.com/Nevid-786/HackFlow.git
```
---

# Project Structure

```
HackFlow
│
├── Backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── Dockerfile
│   └── ...
│
├── Frontend
│   ├── src
│   ├── public
│   ├── Dockerfile
│   └── ...
│
└── docker-compose.yml
```

---

# Running the Application
### Make Sure You are in Root folder of Repository>HackFlow

Build all containers

```bash
docker compose build
```

Start the application


```bash
docker compose up -d
```

Stop the application

```bash
docker compose down
```

---

# Admin Account setup
create account by signup page.
you cant login unless below step is completed
your first user role must be changed to  admin and status to approved  manually by mongo db shell


Approve the user manually.

Open Mongo Shell:

```bash
docker exec -it hackflow-mongo mongosh
```

Select database:

```javascript
use HackFlow
```

Approve the account:
Run

```javascript
db.users.updateOne(
    { email: "admin@gmail.com" },
    {
        $set: {
            status: "approved",
            role:"admin"
        }
    }
)
```

---

# Application URLs

Frontend

```
http://localhost:5173
```

Backend API

```
http://localhost:3000
```

MongoDB

```
mongodb://localhost:27017
```

---

# Docker Containers

The application starts three containers:

| Container | Purpose |
|------------|---------|
| hackflow-frontend | React Application |
| hackflow-backend | Express API |
| hackflow-mongo | MongoDB Database |

---


# Useful Docker Commands

View running containers

```bash
docker ps
```

View logs

```bash
docker logs hackflow-backend
docker logs hackflow-frontend
docker logs hackflow-mongo
```

Restart containers

```bash
docker compose restart
```

Rebuild after dependency changes

```bash
docker compose up --build
```

Remove containers

```bash
docker compose down
```

Remove containers and volumes

```bash
docker compose down -v
```

---

# Access MongoDB

Open Mongo Shell

```bash
docker exec -it hackflow-mongo mongosh
```

---

# Features

- User Authentication
- JWT Access & Refresh Tokens
- Hackathon Management
- Team Creation
- Join Teams
- User Profiles
- Protected Routes
- MongoDB Persistence
- Dockerized Deployment

---

# Development

Whenever source code changes:

```bash
docker compose up --build
```

or simply

```bash
docker compose restart
```

if only application code changed.

---

# Stopping Everything

```bash
docker compose down
```

To completely remove database data

```bash
docker compose down -v
```

---

# License

This project is intended for educational and personal use.