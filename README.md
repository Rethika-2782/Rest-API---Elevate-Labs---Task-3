# 📚 Books REST API

> A production-grade REST API built with **Node.js + Express** — featuring full CRUD, search & filtering, rate limiting, request logging, and a **live interactive dashboard**.

---

## ✨ What Makes This Stand Out

| Feature | Description |
|---|---|
| 🖥 **Live Dashboard** | Beautiful dark-mode UI at `/` — browse, add, edit, delete books visually |
| 🧪 **Built-in API Tester** | Test every endpoint directly in the browser — no Postman needed |
| 🔍 **Search & Filter** | Query by title, author, genre with sorting + pagination |
| 🛡 **Rate Limiting** | In-memory rate limiter (200 req/min) with `X-RateLimit-*` headers |
| 📋 **Request Logger** | Every request is logged with method, path, status, and response time |
| ✅ **Input Validation** | Field-level validation with descriptive error messages |
| 🔀 **PUT + PATCH** | Full replace (PUT) and partial update (PATCH) both supported |
| 🗑 **Bulk Delete** | `DELETE /api/books` with an array of IDs |
| 🌐 **CORS Ready** | Global CORS middleware — works with any frontend |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open the dashboard
open http://localhost:3000
```

For development with auto-reload:
```bash
npm run dev
```

---

## 📡 API Reference

### Base URL: `http://localhost:3000`

### Book Object
```json
{
  "id":     1,
  "title":  "The Alchemist",
  "author": "Paulo Coelho",
  "genre":  "Fiction",
  "year":   1988,
  "rating": 4.7
}
```

---

### Endpoints

#### `GET /api/books`
Returns all books. Supports query parameters:

| Param    | Type   | Description                        |
|----------|--------|------------------------------------|
| `search` | string | Filter by title or author          |
| `genre`  | string | Filter by exact genre              |
| `author` | string | Filter by author (partial match)   |
| `sortBy` | string | `id`, `title`, `author`, `year`, `rating` |
| `order`  | string | `asc` or `desc`                    |
| `page`   | number | Page number (default: 1)           |
| `limit`  | number | Results per page (max: 50)         |

**Example:**
```
GET /api/books?search=clean&sortBy=rating&order=desc&limit=5
```

**Response:**
```json
{
  "success": true,
  "pagination": { "total": 1, "page": 1, "limit": 5, "pages": 1 },
  "data": [
    { "id": 4, "title": "Clean Code", "author": "Robert C. Martin", "genre": "Technology", "year": 2008, "rating": 4.5 }
  ]
}
```

---

#### `GET /api/books/:id`
Get a single book by ID.

```
GET /api/books/1
```

---

#### `POST /api/books`
Create a new book. `title` and `author` are required.

```json
POST /api/books
{
  "title":  "Dune",
  "author": "Frank Herbert",
  "genre":  "Sci-Fi",
  "year":   1965,
  "rating": 4.9
}
```

**Response `201`:**
```json
{ "success": true, "message": "Book created successfully", "data": { "id": 8, ... } }
```

---

#### `PUT /api/books/:id`
Fully replace a book (all fields required).

```json
PUT /api/books/8
{ "title": "Dune Messiah", "author": "Frank Herbert", "genre": "Sci-Fi", "year": 1969, "rating": 4.6 }
```

---

#### `PATCH /api/books/:id`
Partially update a book (only send fields to change).

```json
PATCH /api/books/8
{ "rating": 5.0 }
```

---

#### `DELETE /api/books/:id`
Delete a single book.

```
DELETE /api/books/8
```

---

#### `DELETE /api/books`
Bulk delete by array of IDs.

```json
DELETE /api/books
{ "ids": [6, 7, 8] }
```

---

#### `GET /api/stats`
Returns total books, genre breakdown, average rating, and recent request logs.

#### `GET /api/health`
Returns server status, uptime, and timestamp.

#### `GET /api/logs`
Returns the last 50 request log entries.

---

## 📊 HTTP Status Codes

| Code  | Meaning               | When Used                        |
|-------|-----------------------|----------------------------------|
| `200` | OK                    | Successful GET, PATCH, PUT, DELETE |
| `201` | Created               | Successful POST                  |
| `204` | No Content            | OPTIONS preflight                |
| `400` | Bad Request           | Validation error                 |
| `404` | Not Found             | Book ID doesn't exist            |
| `429` | Too Many Requests     | Rate limit exceeded              |
| `500` | Internal Server Error | Unexpected error                 |

---

## 🗂 Project Structure

```
books-rest-api/
├── index.js          # Server, routes, middleware — all in one
├── package.json      # Dependencies & scripts
├── public/
│   └── index.html    # Live interactive dashboard
└── README.md         # This file
```

---

## 🔑 Interview-Ready Answers (Key Concepts)

**REST** — Representational State Transfer; stateless, resource-based architecture using HTTP.

**Middleware** — Functions that execute in the request-response cycle (`express.json()`, rate limiter, logger, CORS).

**HTTP Methods** — GET (read), POST (create), PUT (full update), PATCH (partial update), DELETE (remove).

**CORS** — Cross-Origin Resource Sharing; headers that allow other domains to call your API.

**Status Codes** — Standardised numbers communicating the result of an HTTP request.

**Rate Limiting** — Capping requests per IP per time window to prevent abuse.




images : 

![
](<Screenshot 2026-06-03 185711.png>)

![alt text](<Screenshot 2026-06-03 185727.png>)

![alt text](<Screenshot 2026-06-03 185742.png>)