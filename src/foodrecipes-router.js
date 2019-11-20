const express = require('express');
const FoodrecipesService = require('./foodrecipes-service');
const foodrecipesRouter = express.Router();
const jsonParser = express.json();
const path = require('path');

const foodrecipeForm = recipes => ({
  id: recipes.id,
  foodname: recipes.foodname,
  ingredients: recipes.ingredients,
  description: recipes.description
});

foodrecipesRouter
  .route('/')
  .get((req,res,next) => {
    const knexInstance = req.app.get('db');

    FoodrecipesService.getAllRecipes(knexInstance)
      .then(recipes => {
        res.json(recipes.map(foodrecipeForm))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const {foodname, ingredients, description} = req.body;
    const newRecipe = { foodname, ingredients, description };

    if(!foodname) {
      return res
        .status(400)
        .json({
          error: {
            message: `Missing foodname`
          }
        })
    };

    if(!ingredients) {
      return res
        .status(400)
        .json({
          error: {
            message: `Missing ingredients`
          }
        })
    };

    if(!description) {
      return res
        .status(400)
        .json({
          error: {
            message: `Missing description`
          }
        })
    };

    FoodrecipesService.insertRecipes(
      req.app.get('db'),
      newRecipe
    )
      .then(recipes => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${recipes.id}`))
          .json(foodrecipeForm(recipes))
      })
      .catch(next)
  });

foodrecipesRouter
  .route('/:id')
  .all((req, res, next) => {
    const {id} = req.params;

    FoodrecipesService.getById(
      req.app.get('db'),
      id
    )
    .then(recipes => {
      if(!recipes) {
        return res.status(404).json({
          error: {
            message: `Food Recipes doesn't exist`
          }
        })
      }
      res.json(foodrecipeForm(recipes))
    })
    .catch(next)
  })
  .get((req, res, next) => {
    res.json(foodrecipeForm(res.recipes))
  })
  .delete((req, res) => {
    const {recipes_id} = req.params;
    
    FoodrecipesService.deleteRecipes(
      req.app.get('db'),
      recipes_id
    )
    .then(recipes => {
      res.status(204).end()
    })
    .catch(next)
  })
  .patch(jsonParser, (req, res, nex) => {
    const {ecipes_id} = req.params;
    const {foodname, ingredients, description} = req.body;
    const foodrecipeToUpdate = {foodname, ingredients, description};
    const requiredFields = {foodname, ingredients, description};

    const numberOfValues = Object.values(foodrecipeToUpdate).filter(Boolean).length;
    if(numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either foodname, ingredients, or description`
        }
      })
    }

    FoodrecipesService.updateRecipes(
      res.app.get('db'),
      recipes_id,
      foodrecipeToUpdate
    )
    .then(numRowAffected => {
      res.status(204).end()
    })
    .catch(next)

  });


module.exports = foodrecipesRouter;




