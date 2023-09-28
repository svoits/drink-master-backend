require("dotenv").config();
const { User } = require("../models/user");
const { controllerWrapper, HttpError, sendEmail } = require("../helpers");

const getCurrent = async (req, res) => {
  const { email, name, avatarURL, token } = req.user;

  res.json({
    token,
    user: {
      email,
      name,
      avatarURL,
    },
  });
};

const updateUser = async (req, res) => {
  const { _id, avatarURL } = req.user;
  const { name } = req.body;

  const updatedData = {
    name,
  };

  if (req.file) {
    updatedData.avatarURL = req.file.path;
  } else {
    updatedData.avatarURL = avatarURL;
  }

  await User.findByIdAndUpdate(_id, updatedData);

  res.json(updatedData);
};

const updateSubscription = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(
      404,
      "User with this email has not been registered yet in Drink Master App. Please register first."
    );
  }

  if (user.subscription) {
    throw HttpError(409, "User already subscribed!");
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { subscription: true },
    { new: true }
  );

  const subscriptionEmail = {
    to: email,
    subject: "Drink Master App Subscription",
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <table style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <tr>
                <td align="center" bgcolor="#4CAF50" style="padding: 10px 0;">
                    <h1 style="color: #fff; font-size: 24px;">Subscription Successful</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px; background-color: #ffffff;">
                    <p style="font-size: 16px; line-height: 1.6;">Dear subscriber,</p>
                    <p style="font-size: 16px; line-height: 1.6;">We are thrilled to confirm that you have successfully subscribed to the <strong>Drink Master App</strong> newsletter. Welcome aboard!</p>
                    <p style="font-size: 16px; line-height: 1.6;">You can now look forward to receiving the latest cocktail recipes, mixology tips, and exciting updates straight to your inbox.</p>
                    <p style="font-size: 16px; line-height: 1.6;">Thank you for choosing to stay connected with us and explore the world of mixology!</p>
                    <p style="font-size: 16px; line-height: 1.6;">Cheers,</p>
                    <p style="font-size: 16px; line-height: 1.6;">The <strong>Drink Master App</strong> Team</p>
                </td>
            </tr>
            <tr>
                <td align="center" bgcolor="#4CAF50" style="padding: 10px 0;">
                    <p style="color: #fff; font-size: 14px; line-height: 1.4;">&copy; 2023 Drink Master App. All rights reserved.</p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `,
  };

  await sendEmail(subscriptionEmail);

  res.json({
    email: updatedUser.email,
    subscription: updatedUser.subscription,
  });
};

module.exports = {
  getCurrent: controllerWrapper(getCurrent),
  updateUser: controllerWrapper(updateUser),
  updateSubscription: controllerWrapper(updateSubscription),
};
