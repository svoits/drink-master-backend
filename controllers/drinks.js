const { controllerWrapper, HttpError } = require("../helpers");
const path = require("path");
const fs = require("fs/promises");
const { differenceInYears } = require("date-fns");
const { Drink } = require("../models/drink");

const categoriesPath = path.join(__dirname, "../", "db", "categories.json");

const getMainPageDrinks = async (req, res) => {
  const { birthDate } = req.user;

  const currentDate = new Date();

  const age = differenceInYears(currentDate, birthDate);

  const drinks = {};

  const categories = await fs.readFile(categoriesPath);
  const parsedCategories = JSON.parse(categories);

  if (age >= 18) {
    for (const category of parsedCategories) {
      drinks[category] = await Drink.find({
        category,
      })
        .sort({ createdAt: -1 })
        .limit(3);
    }
  } else {
    for (const category of parsedCategories) {
      drinks[category] = await Drink.find({
        category,
        alcoholic: "Non alcoholic",
      })
        .sort({ createdAt: -1 })
        .limit(3);
    }
  }

  res.json(drinks);
};

const getPopularDrinks = async (req, res) => {};

const searchDrinks = async (req, res) => {
  const { category, ingredient, query, page = 1, limit = 10 } = req.query;
  const { birthDate } = req.user;

  const skip = (page - 1) * limit;
  const currentDate = new Date();
  const queryConfig = {};
  const age = differenceInYears(currentDate, birthDate);

  if (category) {
    queryConfig.category = category;
  }
  if (ingredient) {
    queryConfig.ingredients = { $elemMatch: { title: ingredient } };
  }
  if (query) {
    queryConfig.drink = { $regex: query, $options: "i" };
  }
  if (age < 18) {
    queryConfig.alcoholic = "Non alcoholic";
  }

  const total = await Drink.countDocuments(queryConfig);

  const drinks = await Drink.find(queryConfig, null, { skip, limit }).sort({
    createdAt: -1,
  });

  if (!total) {
    throw HttpError(404, "Not Found");
  }

  res.json({ total, drinks });
};

module.exports = {
  getMainPageDrinks: controllerWrapper(getMainPageDrinks),
  getPopularDrinks: controllerWrapper(getPopularDrinks),
  searchDrinks: controllerWrapper(searchDrinks),
};

// const drinks = {
//   "Ordinary Drink": [{ cocktail }, { cocktail }, { cocktail }],

//   Cocktail: [{ cocktail }, { cocktail }, { cocktail }],

//   Shake: [{ cocktail }, { cocktail }, { cocktail }],
// };
