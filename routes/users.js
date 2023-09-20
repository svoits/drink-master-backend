const express = require("express");
const { authenticate } = require("../middlewares");

const router = express.Router();

router.get("/current", authenticate);
router.patch("/update", authenticate);
router.post("/subscribe", authenticate);

module.exports = router;
