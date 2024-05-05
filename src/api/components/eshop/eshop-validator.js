const Joi = require('joi');

module.exports = {
  createProduct: {
    body: Joi.object().keys({
      name: Joi.string().required(),
      price: Joi.number().min(0).required(),
      description: Joi.string().allow('').optional(),
    }),
  },

  updateProduct: {
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
    body: Joi.object().keys({
      name: Joi.string().optional(),
      price: Joi.number().min(0).optional(),
      description: Joi.string().allow('').optional(),
    }),
  },

  getProduct: {
    params: Joi.object().keys({
      productId: Joi.string().required(),
    }),
  },

  deleteProduct: {
    params: Joi.object().keys({
      productId: Joi.string().required(),
    }),
  },
};
