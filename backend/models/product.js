const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URI;

mongoose.connect(url)
.then(()=> {
    console.log('Connected to MongoDB');
})
.catch((err)=> {
    console.log(err);
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
  },

  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },

  image: {
    type: String,
    required: [true, 'Image URL is required'],
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description should be at least 10 characters'],
  },

  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['electronics', 'clothing', 'food', 'books', 'other'], // customize as needed
  },

  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
}, {
  timestamps: true // adds createdAt & updatedAt
});

productSchema.set('toJSON', {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
    },
  });



module.exports = mongoose.model('Product', productSchema);


