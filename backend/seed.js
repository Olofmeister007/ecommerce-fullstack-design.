require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product');

const products = [
  {
    name: 'iPhone 15',
    price: 1200,
    image: 'https://picsum.photos/seed/iphone/400/300',
    description: 'Latest Apple smartphone with A17 chip',
    category: 'electronics',
    stock: 10,
  },
  {
    name: 'Samsung Galaxy S23',
    price: 950,
    image: 'https://picsum.photos/seed/galaxy/400/300',
    description: 'Flagship Android smartphone',
    category: 'electronics',
    stock: 12,
  },
  {
    name: 'MacBook Pro M3',
    price: 2100,
    image: 'https://picsum.photos/seed/macbook/400/300',
    description: 'High-performance laptop from Apple',
    category: 'electronics',
    stock: 6,
  },
  {
    name: 'Dell XPS 13',
    price: 1400,
    image: 'https://picsum.photos/seed/dell/400/300',
    description: 'Premium ultrabook with sleek design',
    category: 'electronics',
    stock: 9,
  },
  {
    name: 'Sony WH-1000XM5',
    price: 350,
    image: 'https://picsum.photos/seed/headphones/400/300',
    description: 'Noise-cancelling wireless headphones',
    category: 'electronics',
    stock: 15,
  },
  {
    name: 'Nike Air Max',
    price: 150,
    image: 'https://picsum.photos/seed/nike/400/300',
    description: 'Comfortable running shoes',
    category: 'clothing',
    stock: 25,
  },
  {
    name: 'Adidas Hoodie',
    price: 80,
    image: 'https://picsum.photos/seed/hoodie/400/300',
    description: 'Warm and stylish hoodie',
    category: 'clothing',
    stock: 18,
  },
  {
    name: 'Levi’s Jeans',
    price: 90,
    image: 'https://picsum.photos/seed/jeans/400/300',
    description: 'Classic denim jeans',
    category: 'clothing',
    stock: 20,
  },
  {
    name: 'Samsung TV 55"',
    price: 800,
    image: 'https://picsum.photos/seed/tv/400/300',
    description: '4K Ultra HD Smart TV',
    category: 'electronics',
    stock: 8,
  },
  {
    name: 'Gaming Mouse Logitech',
    price: 60,
    image: 'https://picsum.photos/seed/mouse/400/300',
    description: 'High precision gaming mouse',
    category: 'electronics',
    stock: 30,
  },
  {
    name: 'Mechanical Keyboard',
    price: 120,
    image: 'https://picsum.photos/seed/keyboard/400/300',
    description: 'RGB mechanical keyboard',
    category: 'electronics',
    stock: 22,
  },
  {
    name: 'Harry Potter Book Set',
    price: 60,
    image: 'https://picsum.photos/seed/books/400/300',
    description: 'Complete Harry Potter series',
    category: 'books',
    stock: 20,
  },
  {
    name: 'Atomic Habits',
    price: 25,
    image: 'https://picsum.photos/seed/atomic/400/300',
    description: 'Self-improvement bestseller',
    category: 'books',
    stock: 35,
  },
  {
      name: 'Chocolate Box',
      price: 20,
      image: 'https://picsum.photos/seed/chocolate/400/300',
      description: 'Assorted premium chocolates',
      category: 'food',
      stock: 50,
    },
  {
    name: 'Organic Honey',
    price: 15,
    image: 'https://picsum.photos/seed/honey/400/300',
    description: 'Pure organic honey',
    category: 'food',
    stock: 40,
  },
  {
    name: 'Coffee Beans Premium',
    price: 18,
    image: 'https://picsum.photos/seed/coffee/400/300',
    description: 'Rich roasted coffee beans',
    category: 'food',
    stock: 28,
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');

    await Product.deleteMany({}); // clear existing data
    // insert new data
    await Product.insertMany(products);

    console.log('Database seeded successfully');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error(err);
  });