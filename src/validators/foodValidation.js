const Joi = require("joi");

const createFoodSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.base": "Food name must be a string.",
    "string.min": "Food name must be at least 2 characters long.",
    "string.max": "Food name must not exceed 50 characters.",
    "any.required": "Food name is required.",
  }),
  category: Joi.string().min(2).max(50).required().messages({
    "string.base": "Category must be a string.",
    "string.min": "Category must be at least 2 characters long.",
    "string.max": "Category must not exceed 50 characters.",
    "any.required": "Category is required.",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number.",
    "number.positive": "Price must be a positive value.",
    "any.required": "Price is required.",
  }),
  popularity: Joi.number().integer().min(1).optional().messages({
    "number.base": "Popularity must be a number.",
    "number.integer": "Popularity must be an integer.",
    "number.min": "Popularity must be at least 1.",
  }),
});

const updateFoodSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional().messages({
    "string.base": "Food name must be a string.",
    "string.min": "Food name must be at least 2 characters long.",
    "string.max": "Food name must not exceed 50 characters.",
  }),
  category: Joi.string().min(2).max(50).optional().messages({
    "string.base": "Category must be a string.",
    "string.min": "Category must be at least 2 characters long.",
    "string.max": "Category must not exceed 50 characters.",
  }),
  price: Joi.number().positive().optional().messages({
    "number.base": "Price must be a number.",
    "number.positive": "Price must be a positive value.",
  }),
  popularity: Joi.number().integer().min(1).optional().messages({
    "number.base": "Popularity must be a number.",
    "number.integer": "Popularity must be an integer.",
    "number.min": "Popularity must be at least 1.",
  }),
});

module.exports = {
  createFoodSchema,
  updateFoodSchema,
};
