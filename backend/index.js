const express = require('express');
const Product = require('./models/product');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const errorHandler = (error, req, res, next) => {
    console.error(error.message);
  
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
  
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
  
    next(error);
  };
  

app.post('/api/products', async (req, res, next) => {
    try {
      const product = new Product(req.body);
      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      next(error);
    }
  });

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
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.json(product);
    } catch (error) {
      next(error);
    }
  });

app.put('/api/products/:id', async (req, res, next) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
          context: 'query',
        }
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.json(updatedProduct);
    } catch (error) {
      next(error);
    }
  });

  app.delete('/api/products/:id', async (req, res, next) => {
    try {
      const result = await Product.findByIdAndDelete(req.params.id);
  
      if (!result) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});