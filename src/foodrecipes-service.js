const FoodrecipesService = {
  getAllRecipes(knex) {
    return knex.select('*').from('recipes')
  },

  insertRecipes(knex, newRecipes) {
    return knex
      .insert(newRecipes)
      .into('recipes')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(knex, id) {
    return knex.from('recipes').select('*').where('id', id).first()
  },

  deleteRecipes(knex, id) {
    return knex('recipes')
      .where({ id })
      .delete()
  },

  updateRecipes(knex, id, newRecipesFields) {
    return knex('recipes')
      .where({ id })
      .update(newRecipesFields)
  }
};

module.exports = FoodrecipesService;

