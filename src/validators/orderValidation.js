const Joi = require("joi");

const manageOrderSchema = Joi.object({
  status: Joi.string().valid("accepted", "rejected").required().messages({
    "string.base": "Status must be a string.",
    "any.only": "Status must be either 'accepted' or 'rejected'.",
    "any.required": "Status is required.",
  }),
});

const placeOrderSchema = Joi.object({
  tableNumber: Joi.number().required(),
  items: Joi.array()
    .items(
      Joi.object({
        foodId: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
      })
    )
    .min(1)
    .required(),
});

module.exports = {
  manageOrderSchema,
  placeOrderSchema
};
