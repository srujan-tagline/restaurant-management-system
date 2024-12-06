const Joi = require("joi");

const manageOrderSchema = Joi.object({
  status: Joi.string().valid("accepted", "rejected").required().messages({
    "string.base": "Status must be a string.",
    "any.only": "Status must be either 'accepted' or 'rejected'.",
    "any.required": "Status is required.",
  }),
});

module.exports = {
  manageOrderSchema,
};
