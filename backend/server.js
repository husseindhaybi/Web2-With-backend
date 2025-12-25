const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your-secret-key-change-in-production';

// ================= DB =================
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'restaurant_db',
  port: 3307,
});

// ================= MULTER =================
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    ext && mime ? cb(null, true) : cb(new Error('Images only'));
  }
});

// serve images
app.use('/uploads', express.static('uploads'));

// ================= AUTH MIDDLEWARE =================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// ================= AUTH =================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, full_name, phone, address } = req.body;

    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (username,email,password,full_name,phone,address) VALUES (?,?,?,?,?,?)',
      [username, email, hashedPassword, full_name, phone, address]
    );

    const token = jwt.sign(
      { id: result.insertId, username, email, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (!users.length) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ success: true, token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// ================= ORDERS =================
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, total_amount } = req.body;
    const user_id = req.user.id;

    const [result] = await pool.query(
      'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
      [user_id, total_amount, 'pending']
    );

    const orderId = result.insertId;

    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.quantity, item.price]
      );
    }

    res.json({ success: true, orderId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// ================= ADMIN ORDERS =================
app.get('/api/admin/orders', authenticateToken, isAdmin, async (req, res) => {
  const [orders] = await pool.query(`
    SELECT o.*, u.username, u.email, u.phone,
    GROUP_CONCAT(JSON_OBJECT(
      'name', m.name,
      'quantity', oi.quantity,
      'price', oi.price
    )) as items
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN menu_items m ON oi.menu_item_id = m.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `);

  res.json({ success: true, orders });
});

// ================= MENU =================
app.get('/api/admin/menu', authenticateToken, isAdmin, async (req, res) => {
  const [items] = await pool.query('SELECT * FROM menu_items ORDER BY id DESC');
  res.json({ success: true, items });
});

// ✅ ADD MENU ITEM (WITH MULTER)
app.post(
  '/api/admin/menu',
  authenticateToken,
  isAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      const { name, description, price, category } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      const [result] = await pool.query(
        'INSERT INTO menu_items (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)',
        [name, description, price, category, image]
      );

      res.json({ success: true, itemId: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  }
);



app.delete(
  '/api/admin/menu/:id',
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT image FROM menu_items WHERE id = ?',
        [req.params.id]
      );

      if (rows.length && rows[0].image) {
        const filePath = rows[0].image.replace('/uploads/', 'uploads/');
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      await pool.query('DELETE FROM menu_items WHERE id = ?', [req.params.id]);

      res.json({ success: true });
    } catch (error) {
      console.error('Delete menu error:', error);
      res.status(500).json({ success: false });
    }
  }
);

app.put(
  '/api/admin/menu/:id',
  authenticateToken,
  isAdmin,
  upload.single('image'),
  async (req, res) => {
    try {
      const { name, description, price, category } = req.body;
      const image = req.file
        ? `/uploads/${req.file.filename}`
        : req.body.image;

      await pool.query(
        'UPDATE menu_items SET name=?, description=?, price=?, category=?, image=? WHERE id=?',
        [name, description, price, category, image, req.params.id]
      );

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  }
);
app.put(
  '/api/admin/orders/:id/status',
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;

      console.log('Updating order', req.params.id, 'to', status);

      await pool.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, req.params.id]
      );

      res.json({ success: true });
    } catch (error) {
      console.error('Update status error:', error);
      res.status(500).json({ success: false });
    }
  }
);

app.get('/api/menu', async (req, res) => {
  try {
    const [items] = await pool.query(
      'SELECT * FROM menu_items ORDER BY id DESC LIMIT 3'
    );
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.get('/api/menu', async (req, res) => {
  try {
    const [items] = await pool.query(
      'SELECT * FROM menu_items ORDER BY id DESC'
    );
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false });
    }

    await pool.query(
      'INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email, phone, message]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    res.status(500).json({ success: false });
  }
});

// ================= ADMIN: GET CONTACT MESSAGES =================
app.get(
  "/api/admin/messages",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const [messages] = await pool.query(
        "SELECT * FROM contact_messages ORDER BY created_at DESC"
      );
      res.json({ success: true, messages });
    } catch (error) {
      console.error("Fetch messages error:", error);
      res.status(500).json({ success: false });
    }
  }
);

// ================= ADMIN: DELETE MESSAGE =================
app.delete(
  "/api/admin/messages/:id",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      await pool.query(
        "DELETE FROM contact_messages WHERE id = ?",
        [req.params.id]
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  }
);


app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, status FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true, order: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});



// ================= SERVER =================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
