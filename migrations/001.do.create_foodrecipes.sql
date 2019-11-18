CREATE TABLE foodrecipes (
  id SERIAL PRIMARY KEY,
  foodName TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  description TEXT NOT NULL
)