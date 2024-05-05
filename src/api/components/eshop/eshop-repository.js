// eshop-repository.js
const { Product } = require('../../../models');

/**
 * Get list of products
 * @returns {Promise} Array of products
 */
async function getProducts() {
  return await Product.find({});
}

/**
 * Get product detail by ID
 * @param {string} id - Product ID
 * @returns {Promise} Product object
 */
async function getProduct(id) {
  return await Product.findById(id);
}

/**
 * Create a new product
 * @param {string} name - Product name
 * @param {number} price - Product price
 * @param {string} description - Product description
 * @returns {Promise} Boolean indicating success or failure
 */
async function createProduct(name, price, description) {
  const newProduct = new Product({
    name,
    price,
    description,
  });

  try {
    await newProduct.save();
    return true;
  } catch (error) {
    console.error('Failed to create product:', error);
    return false;
  }
}

/**
 * Update a product by ID
 * @param {string} id - Product ID
 * @param {object} updatedFields - Fields to update
 * @returns {Promise} Boolean indicating success or failure
 */
async function updateProduct(id, updatedFields) {
  try {
    const result = await Product.updateOne(
      { _id: id },
      { $set: updatedFields }
    );
    return result.nModified > 0;
  } catch (error) {
    console.error('Failed to update product:', error);
    return false;
  }
}

/**
 * Delete a product by ID
 * @param {string} id - Product ID
 * @returns {Promise} Boolean indicating success or failure
 */
async function deleteProduct(id) {
  try {
    const result = await Product.deleteOne({ _id: id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Failed to delete product:', error);
    return false;
  }
}
// Implementasi fungsi repository lainnya sesuai kebutuhan

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  // Tambahkan fungsi repository lainnya di sini
};
