require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const checkoutRoutes = require('./routes/checkout');
const cartRoutes = require('./routes/cart');
const profileRoutes = require('./routes/profiles');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/profiles', profileRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

app.listen(PORT, () => {
  console.log(`Pura Backend running on http://localhost:${PORT}`);
});
