const express = require("express");
const { validateBody, authenticate, upload } = require("../../middlewares");
const {
  getMainPageDrinks,
  getPopularDrinks,
  searchDrinks,
  getDrinkById,
  addOwnDrink,
  removeOwnDrink,
  getOwnDrinks,
  addFavoriteDrink,
  removeFavoriteDrink,
  getFavoriteDrinks,
} = require("../../controllers/drinks");

const router = express.Router();

// drink routes
router.get("/mainpage", authenticate, getMainPageDrinks);
router.get("/popular", authenticate, getPopularDrinks);
router.get("/search", authenticate, searchDrinks);
router.get("/:id", authenticate, getDrinkById);
router.post("/own/add", authenticate, upload.single("drinkThumb"), addOwnDrink);
router.delete("/own/remove/:id", authenticate, removeOwnDrink);
router.get("/own/all", authenticate, getOwnDrinks);
router.post("/favorite/add/:id", authenticate, addFavoriteDrink);
router.delete("/favorite/remove/:id", authenticate, removeFavoriteDrink);
router.get("/favorite/all", authenticate, getFavoriteDrinks);

module.exports = router;
