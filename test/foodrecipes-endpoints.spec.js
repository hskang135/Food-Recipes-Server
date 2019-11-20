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
  before('clean the table', () => db.raw('TRUNCATE recipes RESTART IDENTITY CASCADE'));
  afterEach('cleanup',() => db.raw('TRUNCATE recipes RESTART IDENTITY CASCADE'));

  //GET PASS
  describe(`GET /api/recipes`, () => {
    context(`Given no recipes`, () => {
      it(`Responds with 200 and empty list`, () => {
        return supertest(app)
          .get('/api/recipes')
          .expect(200, [])
      })
    });

    context(`Given recipes in database`, () => {
      const testRecipes = makeRecipesArray();

      beforeEach(`Insert Food Recipes`, () => {
        return db
          .into('recipes')
          .insert(testRecipes)
      })

      it('Responds with 200 and get all store', () => {
        return supertest(app)
          .get('/api/recipes')
          .expect(200, testRecipes)
      })
    });

  });

  describe(`GET /api/recipes/:id`, () => {
    context(`Given no food recipes`, () => {
      it(`Responds with 404`, () => {
        const RecipesId = 123456;

        return supertest(app)
          .get(`/api/recipes/${RecipesId}`)
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
          .into('recipes')
          .insert(testRecipes)
      })

      it('Responds with 200 and specified food recipes', () => {
        const RecipesId = 2;
        const expectedRecipes = testRecipes[RecipesId - 1];

        return supertest(app)
          .get(`/api/recipes/${RecipesId}`)
          .expect(200, expectedRecipes)
      })
    })

  });

  //POST NEED
  describe(`POST /api/recipes`, () => {
    it(`Creates recipes with 201 responds and add new recipe`, function() {
      const newRecipe = {
        foodname: 'food name',
        ingredients: 'food ingredients',
        description: 'food description'
      };

      return supertest(app)
        .post('/api/recipes')
        .send(newRecipe)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.foodname).to.eql(newRecipe.foodname)
          expect(res.body.ingredients).to.eql(newRecipe.ingredients)
          expect(res.body.description).to.eql(newRecipe.description)
          expect(res.headers.location).to.eql(`/api/recipes/${res.body.id}`)
        })
        .then(res => 
          supertest(app)
            .get(`/api/recipes/${res.body.id}`)
            .expect(res.body)
        )
    });

    const requiredFields = ['foodname', 'ingredients', 'description'];

    requiredFields.forEach(field => {
      const newRecipe = {
        foodname: 'Test food name',
        ingredients: 'Test food ingredients',
        description: 'Test food description'
      }

      it(`response wiht 400 and an error message when somthing missing`, () => {
        delete newRecipe[field]
        
        return supertest(app)
        .post('/api/recipes')
        .send(newRecipe)
        .expect(400, {
          error: { message: `Missing ${field}` }
        })
      })
    })

  });
  
  





});