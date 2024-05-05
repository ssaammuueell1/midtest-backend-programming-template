// eshop-service.js
const eshopRepository = require('./eshop-repository');

/**
 * Get list of products
 * @returns {Promise} Array of products
 */
async function getProducts() {
  return await eshopRepository.getProducts();
}

/**
 * Get product detail by ID
 * @param {string} id - Product ID
 * @returns {Promise} Product object
 */
async function getProduct(id) {
  return await eshopRepository.getProduct(id);
}

/**
 * Create a new product
 * @param {string} name - Product name
 * @param {number} price - Product price
 * @param {string} description - Product description
 * @returns {Promise} Boolean indicating success or failure
 */
async function createProduct(name, price, description) {
  return await eshopRepository.createProduct(name, price, description);
}

/**
 * Handle update product request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middleware
 * @returns {object} Response object or pass an error to the next route
 */
async function updateProduct(id, name, price, description) {
  const updatedFields = { name, price, description };
  return await eshopRepository.updateProduct(id, updatedFields);
}

/**
 * Delete a product by ID
 * @param {string} id - Product ID
 * @returns {Promise} Boolean indicating success or failure
 */
async function deleteProduct(id) {
  return await eshopRepository.deleteProduct(id);
}

// Implementasi fungsi service lainnya sesuai kebutuhan

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  // Tambahkan fungsi service lainnya di sini
};
