const express = require('express');
const FoodrecipesService = require('./foodrecipes-service');
const foodrecipesRouter = express.Router();
const jsonParser = express.json();
const path = require('path');

const foodrecipesForm = foodrecipe => ({
  id: foodrecipe.id,
  foodName: foodrecipe.foodName,
  ingredients: foodrecipe.ingredients,
  description: foodrecipe.description
});

foodrecipesRouter
  .route('/api/foodrecipes')
  .get((req,res,next) => {
    const knexInstance = req.app.get('db');

    FoodrecipesService.getAllRecipes(knexInstance)
      .then(recipes => {
        res.json(recipes.map(foodrecipesForm))
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
          message: `Missing food ingredients`
        }
      })
    };

    if(!description) {
      return res.status(400).json({
        error: {
          message: `Missing food description`
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
      .then(foodrecipe => {
        res
          .status(201)
          .location(path.possix.join(req.originalUrl + `/${foodrecipe.id}`))
          .json(foodrecipesForm(foodrecipe))
      })
      .catch(next)

  });

foodrecipesRouter
  .route('/:foodrecipes_id')
  .all((req, res, next) => {
    FoodrecipesService.getById(
      req.app.get('db'),
      req.params.foodrecipes_id
    )
    .then(foodrecipe => {
      if(!foodrecipe) {
        return res.status(404).json({
          error: {
            message: `Food Recipes doesn't exist`
          }
        })
      }
      res.json(foodrecipesForm(foodrecipe))
    })
    .catch(next)
  })
  .get((req, res, next) => {
    res.json(foodrecipesForm(res.foodrecipe))
  })
  .delete((req, res) => {
    FoodrecipesService.deleteRecipes(
      req.app.get('db'),
      req.params.foodrecipes_id
    )
    .then(recipes => {
      res.status(204).end()
    })
    .catch(next)
  })
  //.patch


