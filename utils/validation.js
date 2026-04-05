const Joi = require("joi");

module.exports.recordSchema = Joi.object({
    amount: Joi.number().required().min(1),
    type: Joi.string().valid("income", "expense").required(),
    category: Joi.string().required(),
    note: Joi.string().allow("")
});