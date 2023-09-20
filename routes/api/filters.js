const express = require("express");
const { validateBody, authenticate, upload } = require("../../middlewares");

const router = express.Router();

router.get("/categories", authenticate);
router.get("/ingredients", authenticate);
router.get("/glasses", authenticate);

module.exports = router;
