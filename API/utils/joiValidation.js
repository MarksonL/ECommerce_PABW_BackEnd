const Joi = require("joi");

// Skema validasi untuk input pengguna
const userSchema = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  alamat: Joi.string().allow(null, ""),
  nomorTelepon: Joi.string().allow(null, ""),
  role: Joi.string().uppercase().valid("PENGGUNA", "ADMIN", "KURIR").required(),
});

const registrationSchema = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { userSchema, registrationSchema };
