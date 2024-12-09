const { response } = require("../utils/common");
const { statusCode, responseMessage } = require("../utils/constant");

const validate = (schema) => (req, res, next) => {
  try {
    const { error } = schema.validate(
      { ...req.body, ...req.query, ...req.params },
      { abortEarly: false, stripUnknown: true }
    );

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    next();
  } catch (err) {
    return response(
      false,
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      responseMessage.ERROR_DURING_VALIDATION
    );
  }
};

module.exports = validate;
