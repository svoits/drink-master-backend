const express = require("express");
const { authenticate, upload } = require("../middlewares");
const {
  getCurrent,
  updateUser,
  updateSubscription,
} = require("../controllers/users");

const router = express.Router();

router.get("/current", authenticate, getCurrent);
router.patch("/update", authenticate, upload.single("avatar"), updateUser);
router.post("/subscribe", authenticate, updateSubscription);

module.exports = router;
