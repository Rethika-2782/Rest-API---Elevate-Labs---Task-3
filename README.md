# 📚 Books REST API

<div align="center">

### Production-Grade REST API with Interactive Dashboard

A powerful RESTful API built using **Node.js** and **Express.js** that provides complete book management functionality with advanced filtering, validation, rate limiting, request logging, and a modern browser-based dashboard.

Perfect for demonstrating backend development, REST principles, API design, middleware implementation, and server-side architecture.

</div>

---

## 🚀 Overview

Books REST API is a feature-rich backend application designed to manage a collection of books through RESTful endpoints while providing a visually appealing dashboard for direct interaction.

The project demonstrates modern backend development practices including middleware architecture, API validation, rate limiting, request monitoring, error handling, and HTTP standards.

---

## ✨ Features

### 📖 Book Management

* Create Books
* Retrieve Books
* Update Books
* Delete Books
* Bulk Delete Support

### 🔍 Advanced Search & Filtering

* Search by title
* Search by author
* Filter by genre
* Sort by multiple fields
* Pagination support

### 🖥 Interactive Dashboard

* Dark-themed UI
* Visual book management
* Browser-based API testing
* No external API client required

### 🛡 Security & Reliability

* Request Rate Limiting
* Input Validation
* Error Handling
* CORS Support
* Health Monitoring

### 📋 Monitoring & Logging

* Request Logging
* Response Time Tracking
* Server Statistics
* Health Endpoint
* Recent Activity Logs

---

# 🛠 Technology Stack

## Backend

* Node.js
* Express.js

## Additional Features

* RESTful Architecture
* Middleware System
* In-Memory Data Storage
* Custom Rate Limiter
* CORS Middleware

## Frontend Dashboard

* HTML5
* CSS3
* JavaScript

---

# 📡 API Endpoints

## Books

| Method | Endpoint         | Description            |
| ------ | ---------------- | ---------------------- |
| GET    | `/api/books`     | Get all books          |
| GET    | `/api/books/:id` | Get book by ID         |
| POST   | `/api/books`     | Create a new book      |
| PUT    | `/api/books/:id` | Replace entire book    |
| PATCH  | `/api/books/:id` | Update specific fields |
| DELETE | `/api/books/:id` | Delete one book        |
| DELETE | `/api/books`     | Bulk delete books      |

---

## Utility Endpoints

| Method | Endpoint      | Description         |
| ------ | ------------- | ------------------- |
| GET    | `/api/stats`  | API statistics      |
| GET    | `/api/logs`   | Recent request logs |
| GET    | `/api/health` | Health check        |

---

# 📚 Sample Book Object

```json
{
  "id": 1,
  "title": "The Alchemist",
  "author": "Paulo Coelho",
  "genre": "Fiction",
  "year": 1988,
  "rating": 4.7
}
```

---

# 🔍 Search & Filtering

Example:

```http
GET /api/books?search=clean&sortBy=rating&order=desc&limit=5
```

Supported Parameters:

| Parameter | Description            |
| --------- | ---------------------- |
| search    | Search title or author |
| genre     | Filter by genre        |
| author    | Filter by author       |
| sortBy    | Sort field             |
| order     | asc / desc             |
| page      | Page number            |
| limit     | Results per page       |

---

# 🛡 Rate Limiting

To prevent abuse, the API includes a custom in-memory rate limiter.

```text
200 requests / minute per IP
```

Rate limit information is returned through:

```http
X-RateLimit-Limit
X-RateLimit-Remaining
X-RateLimit-Reset
```

---

# 📋 Request Logging

Every incoming request records:

* HTTP Method
* Route Path
* Status Code
* Response Time
* Timestamp

Logs can be viewed through:

```http
GET /api/logs
```

---

# 📊 HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Resource Created      |
| 204  | No Content            |
| 400  | Validation Error      |
| 404  | Resource Not Found    |
| 429  | Rate Limit Exceeded   |
| 500  | Internal Server Error |

---

# 📂 Project Structure

```bash
books-rest-api/
│
├── index.js
├── package.json
│
├── public/
│   └── index.html
│
└── README.md
```

---

# ⚡ Quick Start

## Install Dependencies

```bash
npm install
```

## Start Production Server

```bash
npm start
```

## Start Development Server

```bash
npm run dev
```

---

# 🌐 Access Dashboard

Open:

```bash
http://localhost:3000
```

The dashboard allows you to:

* Browse books
* Add new books
* Edit records
* Delete records
* Test API endpoints
* Monitor API responses

---

# 📸 Screenshots

Add your screenshots here:

```md
![Dashboard](images/dashboard.png)

![API Tester](images/api-tester.png)

![Book Management](images/books-page.png)
```

---

# 🎯 Learning Outcomes

This project demonstrates:

* REST API Design
* Express.js Development
* Middleware Architecture
* CRUD Operations
* HTTP Methods & Status Codes
* API Validation
* Search & Pagination
* Rate Limiting
* Request Logging
* Error Handling
* CORS Configuration
* Backend Best Practices

---

# 🎤 Interview Concepts Covered

### REST API

Representational State Transfer architecture using HTTP methods for resource management.

### Middleware

Functions executed during the request-response lifecycle.

### CRUD Operations

Create, Read, Update, Delete resource actions.

### Rate Limiting

Restricts excessive requests from a client.

### CORS

Allows cross-origin communication between applications.

### HTTP Status Codes

Standardized response indicators for API interactions.

---

# 👩‍💻 Author

### Rethika S

Computer Science Engineering Student | Full Stack Developer | Backend Development Enthusiast

Built as part of learning modern REST API development and backend engineering practices.

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

Feedback, suggestions, and contributions are always welcome!
