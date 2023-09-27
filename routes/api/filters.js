const express = require("express");
const { authenticate } = require("../../middlewares");
const {
  getCategories,
  getIngredients,
  getGlasses,
} = require("../../controllers/filters");

const router = express.Router();

router.get("/categories", authenticate, getCategories);
router.get("/ingredients", authenticate, getIngredients);
router.get("/glasses", authenticate, getGlasses);

module.exports = router;
