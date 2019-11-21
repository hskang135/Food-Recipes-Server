const FoodrecipesService = {
  getAllRecipes(knex) {
    return knex
      .select('*')
      .from('recipes')
  },

  insertRecipes(knex, newRecipe) {
    return knex
      .insert(newRecipe)
      .into('recipes')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(knex, id) {
    return knex
      .from('recipes')
      .select('*')
      .where('id', id)
      .first()
  },

  deleteRecipes(knex, id) {
    return knex
      .from('recipes')
      .where({ id })
      .delete()
  },

  updateRecipes(knex, id, newRecipesFields) {
    return knex
      .from('recipes')
      .where({ id })
      .update(newRecipesFields)
  }
};

module.exports = FoodrecipesService;




