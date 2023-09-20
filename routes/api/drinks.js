const express = require("express");
const { validateBody, authenticate, upload } = require("../../middlewares");
const {
  getMainPageDrinks,
  getPopularDrinks,
  searchDrinks,
} = require("../../controllers/drinks");

const router = express.Router();

router.get("/mainpage", authenticate, getMainPageDrinks);
router.get("/popular", authenticate, getPopularDrinks);
router.get("/search", authenticate, searchDrinks);
router.get("/:id", authenticate);
router.post("/own/add", authenticate);
router.delete("/own/remove", authenticate);
router.get("/own", authenticate);
router.post("/favorite/add", authenticate);
router.delete("/favorite/remove", authenticate);
router.get("/favorite", authenticate);

module.exports = router;
