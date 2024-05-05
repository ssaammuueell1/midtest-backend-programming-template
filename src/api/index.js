const express = require('express');
const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const eshop = require('./components/eshop/eshop-route');

module.exports = () => {
  const app = express.Router();

  // Panggil middleware untuk authentication dan users
  authentication(app);
  users(app);

  // Panggil middleware untuk eshop (produk)
  eshop(app);

  return app;
};
