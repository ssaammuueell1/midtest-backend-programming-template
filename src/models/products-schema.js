const productSchema = {
  name: String,
  description: {
    type: String,
    default: '',
  },
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
};

module.exports = productSchema;
