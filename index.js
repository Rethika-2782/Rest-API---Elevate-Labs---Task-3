/**
 * ╔══════════════════════════════════════════════════════╗
 * ║           BOOKS REST API  —  v2.0.0                  ║
 * ║     Node.js + Express | In-Memory | Full CRUD        ║
 * ╚══════════════════════════════════════════════════════╝
 */

const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = process.env.PORT || 3000;

/* ─────────────────────────────────────────
   IN-MEMORY DATA STORE
───────────────────────────────────────── */
let books = [
  { id: 1, title: 'The Alchemist',           author: 'Paulo Coelho',        genre: 'Fiction',     year: 1988, rating: 4.7 },
  { id: 2, title: '1984',                    author: 'George Orwell',       genre: 'Dystopian',   year: 1949, rating: 4.8 },
  { id: 3, title: 'To Kill a Mockingbird',   author: 'Harper Lee',          genre: 'Classic',     year: 1960, rating: 4.8 },
  { id: 4, title: 'Clean Code',              author: 'Robert C. Martin',    genre: 'Technology',  year: 2008, rating: 4.5 },
  { id: 5, title: 'The Pragmatic Programmer',author: 'David Thomas',        genre: 'Technology',  year: 1999, rating: 4.6 },
  { id: 6, title: 'Sapiens',                 author: 'Yuval Noah Harari',   genre: 'Non-Fiction', year: 2011, rating: 4.4 },
  { id: 7, title: 'Atomic Habits',           author: 'James Clear',         genre: 'Self-Help',   year: 2018, rating: 4.8 },
];
let nextId = 8;

// Request log store (last 50)
const requestLog = [];
const addLog = (method, path, status, ms) => {
  requestLog.unshift({ method, path, status, ms, time: new Date().toISOString() });
  if (requestLog.length > 50) requestLog.pop();
};

/* ─────────────────────────────────────────
   RATE LIMITER (simple in-memory)
───────────────────────────────────────── */
const rateLimitMap = new Map();
const rateLimit = (maxReq = 100, windowMs = 60_000) => (req, res, next) => {
  const key  = req.ip;
  const now  = Date.now();
  const data = rateLimitMap.get(key) || { count: 0, start: now };
  if (now - data.start > windowMs) { data.count = 0; data.start = now; }
  data.count++;
  rateLimitMap.set(key, data);
  res.setHeader('X-RateLimit-Limit',     maxReq);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, maxReq - data.count));
  if (data.count > maxReq) return res.status(429).json(fail('Too many requests — slow down!', 429));
  next();
};

/* ─────────────────────────────────────────
   RESPONSE HELPERS
───────────────────────────────────────── */
const ok   = (data, meta = {}) => ({ success: true,  ...meta, data });
const fail = (message, code = 400) => ({ success: false, error: { code, message } });

/* ─────────────────────────────────────────
   VALIDATORS
───────────────────────────────────────── */
const validateBook = (body, requireAll = true) => {
  const errors = [];
  if (requireAll && !body.title)  errors.push('title is required');
  if (requireAll && !body.author) errors.push('author is required');
  if (body.title  && typeof body.title  !== 'string') errors.push('title must be a string');
  if (body.author && typeof body.author !== 'string') errors.push('author must be a string');
  if (body.year   && (isNaN(body.year) || body.year < 0 || body.year > new Date().getFullYear()))
    errors.push(`year must be between 0 and ${new Date().getFullYear()}`);
  if (body.rating !== undefined && (body.rating < 0 || body.rating > 5))
    errors.push('rating must be between 0 and 5');
  return errors;
};

/* ─────────────────────────────────────────
   GLOBAL MIDDLEWARE
───────────────────────────────────────── */
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(rateLimit(200, 60_000));

// Request timer + logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => addLog(req.method, req.path, res.statusCode, Date.now() - start));
  next();
});

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* ─────────────────────────────────────────
   ROUTES
───────────────────────────────────────── */

// ── API health check
app.get('/api/health', (req, res) => {
  res.json(ok({
    status:    'healthy',
    uptime:    process.uptime().toFixed(2) + 's',
    timestamp: new Date().toISOString(),
    totalBooks: books.length,
  }));
});

// ── GET /api/stats
app.get('/api/stats', (req, res) => {
  const genres = books.reduce((acc, b) => {
    acc[b.genre] = (acc[b.genre] || 0) + 1; return acc;
  }, {});
  const avgRating = (books.reduce((s, b) => s + (b.rating || 0), 0) / books.length).toFixed(2);
  res.json(ok({ totalBooks: books.length, genres, avgRating: parseFloat(avgRating), recentLogs: requestLog.slice(0, 10) }));
});

// ── GET /api/books  (with search, filter, sort, pagination)
app.get('/api/books', (req, res) => {
  let result = [...books];
  const { search, genre, author, sortBy = 'id', order = 'asc', page = 1, limit = 10 } = req.query;

  if (search)  result = result.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );
  if (genre)   result = result.filter(b => b.genre?.toLowerCase() === genre.toLowerCase());
  if (author)  result = result.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));

  const validSorts = ['id', 'title', 'author', 'year', 'rating'];
  if (validSorts.includes(sortBy)) {
    result.sort((a, b) => {
      const va = a[sortBy], vb = b[sortBy];
      if (typeof va === 'string') return order === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      return order === 'asc' ? va - vb : vb - va;
    });
  }

  const total     = result.length;
  const pageNum   = Math.max(1, parseInt(page));
  const limitNum  = Math.min(50, Math.max(1, parseInt(limit)));
  const paginated = result.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json(ok(paginated, {
    pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
  }));
});

// ── GET /api/books/:id
app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json(fail('Book not found', 404));
  res.json(ok(book));
});

// ── POST /api/books
app.post('/api/books', (req, res) => {
  const errors = validateBook(req.body, true);
  if (errors.length) return res.status(400).json(fail(errors.join('; ')));

  const { title, author, genre = 'Uncategorized', year, rating } = req.body;
  const newBook = {
    id: nextId++, title, author, genre,
    ...(year   !== undefined && { year:   parseInt(year) }),
    ...(rating !== undefined && { rating: parseFloat(rating) }),
    createdAt: new Date().toISOString(),
  };
  books.push(newBook);
  res.status(201).json(ok(newBook, { message: 'Book created successfully' }));
});

// ── PUT /api/books/:id  (full replace)
app.put('/api/books/:id', (req, res) => {
  const idx = books.findIndex(b => b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json(fail('Book not found', 404));

  const errors = validateBook(req.body, true);
  if (errors.length) return res.status(400).json(fail(errors.join('; ')));

  const { title, author, genre = 'Uncategorized', year, rating } = req.body;
  books[idx] = {
    id: books[idx].id, title, author, genre,
    ...(year   !== undefined && { year:   parseInt(year) }),
    ...(rating !== undefined && { rating: parseFloat(rating) }),
    updatedAt: new Date().toISOString(),
  };
  res.json(ok(books[idx], { message: 'Book replaced successfully' }));
});

// ── PATCH /api/books/:id  (partial update)
app.patch('/api/books/:id', (req, res) => {
  const idx = books.findIndex(b => b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json(fail('Book not found', 404));
  if (!Object.keys(req.body).length) return res.status(400).json(fail('No fields provided'));

  const errors = validateBook(req.body, false);
  if (errors.length) return res.status(400).json(fail(errors.join('; ')));

  books[idx] = { ...books[idx], ...req.body, id: books[idx].id, updatedAt: new Date().toISOString() };
  res.json(ok(books[idx], { message: 'Book updated successfully' }));
});

// ── DELETE /api/books/:id
app.delete('/api/books/:id', (req, res) => {
  const idx = books.findIndex(b => b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json(fail('Book not found', 404));
  const [deleted] = books.splice(idx, 1);
  res.json(ok(deleted, { message: 'Book deleted successfully' }));
});

// ── DELETE /api/books  (bulk delete by ids)
app.delete('/api/books', (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json(fail('Provide an array of ids'));
  const before = books.length;
  books = books.filter(b => !ids.includes(b.id));
  res.json(ok({ deleted: before - books.length }, { message: 'Bulk delete complete' }));
});

// ── GET /api/logs
app.get('/api/logs', (req, res) => res.json(ok(requestLog)));

/* ─────────────────────────────────────────
   404 + ERROR HANDLERS
───────────────────────────────────────── */
app.use((req, res) => res.status(404).json(fail(`Cannot ${req.method} ${req.path}`, 404)));

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json(fail('Internal server error', 500));
});

/* ─────────────────────────────────────────
   START
───────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`\n  📚 Books API  →  http://localhost:${PORT}`);
  console.log(`  🖥  Dashboard  →  http://localhost:${PORT}/index.html\n`);
});

module.exports = app;