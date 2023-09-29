const { controllerWrapper, HttpError } = require("../helpers");
const path = require("path");
const fs = require("fs/promises");
const { differenceInYears } = require("date-fns");
const { Drink } = require("../models/drink");
const { Ingredient } = require("../models/ingredient");

const categoriesPath = path.join(__dirname, "../", "db", "categories.json");

const getMainPageDrinks = async (req, res) => {
  const { birthDate } = req.user;
  const currentDate = new Date();
  const age = differenceInYears(currentDate, birthDate);

  const drinks = {};
  const categories = await fs.readFile(categoriesPath);
  const parsedCategories = JSON.parse(categories);

  for (const category of parsedCategories) {
    drinks[category] = await Drink.find(
      age < 18
        ? {
            category,
            alcoholic: "Non alcoholic",
          }
        : { category }
    )
      .sort({ createdAt: -1 })
      .limit(3);
  }

  res.json(drinks);
};

const getPopularDrinks = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const result = await Drink.aggregate([
    {
      $addFields: {
        popularity: {
          $cond: {
            if: { $isArray: "$users" },
            then: { $size: "$users" },
            else: 0,
          },
        },
      },
    },
    {
      $sort: { popularity: -1 }, // Sort by array length in descending order
    },
  ])
    .skip(skip)
    .limit(limit);

  res.json(result);
};

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

const getDrinkById = async (req, res) => {
  const { id } = req.params;
  const drinkById = await Drink.findById(id);

  if (!drinkById) {
    throw HttpError(404, "Not Found");
  }

  res.json(drinkById);
};

const addOwnDrink = async (req, res) => {
  const { _id: owner } = req.user;
  const { ingredients } = req.body;
  const parsedIngredients = JSON.parse(ingredients);

  let drinkThumb = "";
  if (req.file) {
    drinkThumb = req.file.path;
  }

  const ingredientsArr = [];

  for (const ingredient of parsedIngredients) {
    const ingredientInfo = await Ingredient.findOne({
      title: ingredient.title,
    });

    if (!ingredientInfo) {
      throw HttpError(404, "Not Found");
    }

    const { _id: ingredientId } = ingredientInfo;

    ingredientsArr.push({
      ...ingredient,
      ingredientId,
    });
  }

  const drink = await Drink.create({
    ...req.body,
    owner,
    drinkThumb,
    ingredients: ingredientsArr,
  });

  res.status(201).json(drink);
};

const removeOwnDrink = async (req, res) => {
  const { id } = req.params;
  const { _id: currentUser } = req.user;

  const result = await Drink.findById(id);

  if (!result) {
    throw HttpError(404, "Not Found");
  }

  if (result.owner.toString() !== currentUser.toString()) {
    throw HttpError(403, "User is not authorized to delete this cocktail");
  }

  const removedDrink = await Drink.findByIdAndRemove(id);

  res.json({ message: `${removedDrink.drink} drink successfully removed.` });
};

const getOwnDrinks = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const result = await Drink.find({ owner })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalOwnDrinks = await Drink.countDocuments({ owner });

  res.json({ total: totalOwnDrinks, drinks: result });
};

const addFavoriteDrink = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  const drink = await Drink.findById(id);

  if (!drink) {
    throw HttpError(404, "Not Found");
  }

  if (!drink.users) {
    drink.users = [];
  }

  const isFavorite = drink.users.includes(userId);

  let result;

  if (isFavorite) {
    throw HttpError(409, `${drink.drink} is already in your favorites.`);
  } else {
    result = await Drink.findByIdAndUpdate(
      drink._id,
      { $push: { users: userId } },
      { new: true }
    );
  }

  res.json({ result });
};

const removeFavoriteDrink = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;

  const drink = await Drink.findById(id);

  if (!drink) {
    throw HttpError(404, "Not Found");
  }

  const isFavorite = drink.users.includes(userId);

  let result;

  if (isFavorite) {
    result = await Drink.findByIdAndUpdate(
      drink._id,
      {
        $pull: { users: userId },
      },
      { new: true }
    );
  } else {
    throw HttpError(403, `${drink.drink} is not in your favorites.`);
  }

  res.json({ result });
};

const getFavoriteDrinks = async (req, res) => {
  const { _id: userId } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const result = await Drink.find({
    users: {
      $elemMatch: {
        $eq: userId,
      },
    },
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalOwnDrinks = await Drink.countDocuments({
    users: {
      $elemMatch: {
        $eq: userId,
      },
    },
  });

  res.json({ total: totalOwnDrinks, drinks: result });
};

module.exports = {
  getMainPageDrinks: controllerWrapper(getMainPageDrinks),
  getPopularDrinks: controllerWrapper(getPopularDrinks),
  searchDrinks: controllerWrapper(searchDrinks),
  getDrinkById: controllerWrapper(getDrinkById),
  addOwnDrink: controllerWrapper(addOwnDrink),
  removeOwnDrink: controllerWrapper(removeOwnDrink),
  getOwnDrinks: controllerWrapper(getOwnDrinks),
  addFavoriteDrink: controllerWrapper(addFavoriteDrink),
  removeFavoriteDrink: controllerWrapper(removeFavoriteDrink),
  getFavoriteDrinks: controllerWrapper(getFavoriteDrinks),
};
