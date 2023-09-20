require("dotenv").config();
const path = require("path");
const fs = require("fs/promises");

const Jimp = require("jimp");
const { User } = require("../models/user");
const { HttpError, controllerWrapper } = require("../helpers");

const { BASE_URL } = process.env;

const getCurrent = async (req, res) => {
  const { name, email } = req.user;

  res.json({
    name,
    email,
  });
};

const updateUser = async (req, res) => {
  const { _id } = req.user;
  const { name } = req.body;

  const updatedData = {
    name,
  };

  if (req.file) {
    updatedData.avatarURL = req.file.path;
  }

  await User.findByIdAndUpdate(_id, updatedData);

  res.json(updatedData);
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  const user = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  );

  res.json({
    email: user.email,
    subscription: user.subscription,
  });
};

module.exports = {
  getCurrent: controllerWrapper(getCurrent),
  updateUser: controllerWrapper(updateUser),
  updateSubscription: controllerWrapper(updateSubscription),
};
