const Joi = require("joi");

const createTableSchema = Joi.object({
  number: Joi.number().integer().positive().required().messages({
    "number.base": "Table number must be a number.",
    "number.integer": "Table number must be an integer.",
    "number.positive": "Table number must be positive.",
    "any.required": "Table number is required.",
  }),
});

module.exports = {
  createTableSchema,
};
