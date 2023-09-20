require("dotenv").config();
const path = require("path");
const fs = require("fs/promises");

const Jimp = require("jimp");
const { User } = require("../models/user");
const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");

const { BASE_URL } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const getCurrent = async (req, res) => {
  const { name, email } = req.user;

  res.json({
    name,
    email,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  Jimp.read(tempUpload)
    .then((image) => {
      image.resize(250, 250).quality(90).write(resultUpload);
    })
    .catch((err) => {
      throw HttpError(400, err);
    });

  fs.unlink(tempUpload);

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
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

const verification = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOneAndUpdate(
    { verificationToken },
    { verificationToken: null, verify: true }
  );

  if (!user) {
    throw HttpError(404, "Not Found");
  }

  res.json({
    message: "Verification successful",
  });
};

const resendVerification = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verificationEmail = {
    to: ["95.ssh.ssh@gmail.com"],
    // to: [email], // only verified emails can be as a recipient
    subject: "Verification email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify email</a>`,
  };

  await sendEmail(verificationEmail);

  res.json({
    message: "Verification email sent",
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  updateSubscription: ctrlWrapper(updateSubscription),
  verification: ctrlWrapper(verification),
  resendVerification: ctrlWrapper(resendVerification),
};
