const express = require('express');
const FoodrecipesService = require('./foodrecipes-service');
const foodrecipesRouter = express.Router();
const jsonParser = express.json();
const path = require('path');

const foodrecipeForm = foodrecipes => ({
  id: foodrecipes.id,
  foodname: foodrecipes.foodname,
  ingredients: foodrecipes.ingredients,
  description: foodrecipes.description
});

foodrecipesRouter
  .route('/')
  .get((req,res,next) => {
    const knexInstance = req.app.get('db');

    FoodrecipesService.getAllRecipes(knexInstance)
      .then(foodrecipes => {
        res.json(foodrecipes.map(foodrecipeForm))
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
            message: `Missing food name`
          }
        })
    };

    if(!ingredients) {
      return res
        .status(400)
        .json({
          error: {
            message: `Missing food ingredients`
          }
        })
    };

    if(!description) {
      return res
        .status(400)
        .json({
          error: {
            message: `Missing food description`
          }
        })
    };

    FoodrecipesService.insertRecipes(
      req.app.get('db'),
      newRecipe
    )
      .then(foodrecipes => {
        res
          .status(201)
          .location(path.possix.join(req.originalUrl + `/${foodrecipe.id}`))
          .json(foodrecipeForm(foodrecipes))
      })
      .catch(next)
  });

foodrecipesRouter
  .route('/:foodrecipes_id')
  .all((req, res, next) => {
    const {foodrecipes_id} = req.params;

    FoodrecipesService.getById(
      req.app.get('db'),
      foodrecipes_id
    )
    .then(foodrecipes => {
      if(!foodrecipes) {
        return res.status(404).json({
          error: {
            message: `Food Recipes doesn't exist`
          }
        })
      }
      res.json(foodrecipeForm(foodrecipes))
    })
    .catch(next)
  })
  .get((req, res, next) => {
    res.json(foodrecipeForm(res.foodrecipes))
  })
  .delete((req, res) => {
    const {foodrecipes_id} = req.params;
    
    FoodrecipesService.deleteRecipes(
      req.app.get('db'),
      foodrecipes_id
    )
    .then(foodrecipes => {
      res.status(204).end()
    })
    .catch(next)
  })
  .patch(jsonParser, (req, res, nex) => {
    const {foodrecipes_id} = req.params;
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
      foodrecipes_id,
      foodrecipeToUpdate
    )
    .then(numRowAffected => {
      res.status(204).end()
    })
    .catch(next)

  });


module.exports = foodrecipesRouter;




