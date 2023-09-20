const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");
const emailRegexp = require("../regexp/regexp");

// Schema & model of user - mongoose
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for user"],
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegexp,
      unique: true,
    },
    birthDate: {
      type: Date,
      required: [true, "BirthDate is required"],
    },
    token: {
      type: String,
      default: "",
    },
    avatarURL: {
      type: String,
    },
    subscription: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

// JOI schemas
const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "missing required name field",
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.pattern.base": "Please enter a valid email! e.g. mail@mail.com",
    "any.required": "missing required email field",
  }),
  password: Joi.string().required().messages({
    "any.required": "missing required password field",
  }),
  birthDate: Joi.date().required().messages({
    "any.required": "missing required birthDate field",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.pattern.base": "Please enter a valid email! e.g. mail@mail.com",
    "any.required": "missing required email field",
  }),
  password: Joi.string().required().messages({
    "any.required": "missing required password field",
  }),
});

const schemas = {
  registerSchema,
  loginSchema,
};

// exports
module.exports = {
  User,
  schemas,
};
