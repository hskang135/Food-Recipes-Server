const knex = require('knex');
const app = require('../src/app');
const { makeRecipesArray } = require('./foodrecipes.fixtures');

describe('Food Recipes Endpoints', function() {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  });

  after('disconnect from db', () => db.destroy());
  before('clean the table', () => db.raw('TRUNCATE foodrecipes RESTART IDENTITY CASCADE'));
  afterEach('cleanup',() => db.raw('TRUNCATE foodrecipes RESTART IDENTITY CASCADE'));

  describe.only(`GET /api/foodrecipes`, () => {
    context(`Given no recipes`, () => {
      it(`Responds with 200 and empty list`, () => {
        return supertest(app)
          .get('/api/foodrecipes')
          .expect(200, [])
      })
    });

    context(`Given recipes in database`, () => {
      const testRecipes = makeRecipesArray();

      beforeEach(`Insert Food Recipes`, () => {
        return db
          .into('foodrecipes')
          .insert(testRecipes)
      })

      it('Responds with 200 and get all store', () => {
        return supertest(app)
          .get('/api/foodrecipes')
          .expect(200, testRecipes)
      })
    });

  });

  describe(`GET /api/foodrecipes/:id`, () => {
    context(`Given no food recipes`, () => {
      it(`Responds with 404`, () => {
        const RecipesId = 123456;

        return supertest(app)
          .get(`/api/foodrecipes/${RecipesId}`)
          .expect(404, {
            error: {
              message: `Food Recipes doesn't exist`
            }
          })
      })
    });

    context(`Given recipes in database`, () => {
      const testRecipes = makeRecipesArray();

      beforeEach(`Insert Food Recipes`, () => {
        return db
          .into('foodrecipes')
          .insert(testRecipes)
      })

      it('Responds with 200 and specified food recipes', () => {
        const RecipesId = 2;
        const expectedRecipes = testRecipes[RecipesId - 1];

        return supertest(app)
          .get(`/api/foodrecipes/${RecipesId}`)
          .expect(200, expectedRecipes)
      })
    })
  })







});