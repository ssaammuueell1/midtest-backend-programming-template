// eshop-route.js
const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const eshopControllers = require('./eshop-controller');
const eshopValidator = require('./eshop-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/eshop', route);

  // Get list of products
  route.get('/products', eshopControllers.getProducts);

  // Get product detail
  route.get('/products/:id', eshopControllers.getProduct);

  // Create product
  route.post(
    '/products',
    authenticationMiddleware,
    celebrate(eshopValidator.createProduct),
    eshopControllers.createProduct
  );

  // Update product
  route.put(
    '/products/:id',
    authenticationMiddleware,
    celebrate(eshopValidator.updateProduct),
    eshopControllers.updateProduct
  );

  // Delete product
  route.delete(
    '/products/:id',
    authenticationMiddleware,
    eshopControllers.deleteProduct
  );
};
