const express = require("express");
const { validateBody, authenticate } = require("../middlewares");
const { schemas } = require("../models/user");
const { signup, signin, signout } = require("../controllers/auth");

const router = express.Router();

router.post("/signup", validateBody(schemas.registerSchema), signup);
router.post("/signin", validateBody(schemas.loginSchema), signin);
router.post("/signout", authenticate, signout);

module.exports = router;
