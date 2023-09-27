const express = require("express");
const { authenticate, upload, validateBody } = require("../middlewares");
const {
  getCurrent,
  updateUser,
  updateSubscription,
} = require("../controllers/users");
const { schemas } = require("../models/user");

const router = express.Router();

router.get("/current", authenticate, getCurrent);
router.patch("/update", authenticate, upload.single("avatar"), updateUser);
router.post(
  "/subscribe",
  authenticate,
  validateBody(schemas.subscriptionSchema),
  updateSubscription
);

module.exports = router;
