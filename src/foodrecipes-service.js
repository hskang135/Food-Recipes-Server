const FoodrecipesService = {
  getAllRecipes(knex) {
    return knex
      .select('*')
      .from('foodrecipes')
  },

  insertRecipes(knex, newRecipe) {
    return knex
      .insert(newRecipe)
      .into('foodrecipes')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(knex, id) {
    return knex
      .from('foodrecipes')
      .select('*')
      .where('id', id)
      .first()
  },

  deleteRecipes(knex, id) {
    return knex('foodrecipes')
      .where({ id })
      .delete()
  },

  updateRecipes(knex, id, newRecipesFields) {
    return knex('foodrecipes')
      .where({ id })
      .update(newRecipesFields)
  }
};

module.exports = FoodrecipesService;

