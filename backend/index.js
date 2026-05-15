const express  = require('express');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
require('dotenv').config(); // ← reads JWT_SECRET from .env

const Product              = require('./models/product');
const User                 = require('./models/User');
const { verifyToken, verifyAdmin } = require('./middleware/auth');
console.log("verifyToken:", typeof verifyToken);
console.log("verifyAdmin:", typeof verifyAdmin);
// console.log("createProduct:", typeof createProduct);

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// ════════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES — new
// ════════════════════════════════════════════════════════════════════════════════

app.post('/api/auth/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ name, email, password: hashed });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════════════════════
// PRODUCT ROUTES — public reads, admin-only writes (your existing logic kept)
// ════════════════════════════════════════════════════════════════════════════════

// Public ─────────────────────────────────────────────────────────────────────
app.get('/api/products', async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    next(error);
  }
});

app.get('/api/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Admin only ─────────────────────────────────────────────────────────────────
// verifyToken checks JWT, verifyAdmin checks role === "admin"

app.post('/api/products', verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
});

app.put('/api/products/:id', verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, context: 'query' }
    );
    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/products/:id', verifyToken, verifyAdmin, async (req, res, next) => {
  
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Product not found' });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// ════════════════════════════════════════════════════════════════════════════════
// ERROR HANDLER — your existing one, unchanged
// ════════════════════════════════════════════════════════════════════════════════
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError')
    return res.status(400).json({ error: 'Invalid ID format' });

  if (error.name === 'ValidationError')
    return res.status(400).json({ error: error.message });

  next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});