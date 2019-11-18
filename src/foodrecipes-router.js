const express = require('express');
const FoodrecipesService = require('./foodrecipes-service');

const foodrecipesRouter = express.Router();
const jsonParser = express.json();
const path = require('path');

const foodrecipesForm = foodrecipes => ({
  id: foodrecipes.id,
  foodName: foodrecipes.foodName,
  ingredients: foodrecipes.ingredients,
  description: foodrecipes.description
});

foodrecipesRouter
  .route('/api/foodrecipes')
  .get((req,res,next) => {
    const knexInstance = req.app.get('db');

    FoodrecipesService.getAllRecipes(knexInstance)
      .then(foodrecipes => {
        res.json(foodrecipes.map(foodrecipesForm))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const {foodName, ingredients, description} = req.body;

    if(!foodName) {
      return res.status(400).json({
        error: {
          message: `Missing food name`
        }
      })
    };

    if(!ingredients) {
      return res.status(400).json({
        error: {
          message: `Missing ingredients`
        }
      })
    };

    if(!description) {
      return res.status(400).json({
        error: {
          message: `Missing description`
        }
      })
    };

    const foodrecipe = {
      id,
      foodName,
      ingredients,
      description
    };

    FoodrecipesService.insertRecipes(
      req.app.get('db'),
      foodrecipe
    )
      .then()

  })


  