BEGIN;

TRUNCATE
  recipes
  RESTART IDENTITY CASCADE;

INSERT INTO recipes (foodname, ingredients, description)

VALUES
  ('Bread', 'Flour, salt, water, yest, sugar, butter', 'Combine all ingreiens in a bowl except flour. Add flour little by litte. Let dough rise for 30 minutes. Bake at 350 about 20 minutes.'),
  ('Cookie', 'Flour, salt, water, yest, oil, baking powder, butter, sugar, eggs', 'Combine dry ingredients in a bowl. Add sugar, eggs and butter. Add chocolate chips if you want. Bake in 350 about 15 minutes.'),
  ('Walnut Cookie', 'Salt, flour, water, yest, walnut, oil, baking powder, butter, sugar, eggs', 'Combine dry ingredients in a bowl. Add sugar, eggs and butter. Add walnuts. Bake in 350 about 15 minutes.'),
  ('Coffee Bread',  'Flour, salt, espresso, water, yest, sugar, butter', 'Combine all ingreiens in a bowl. Add espresso shot. Add flour little by litte. Let dough rise for 30 minutes. Bake at 350 about 20 minutes.'),
  ('Fried Rice', 'Cooked rice, garlic, soy sauce, carrot, onions, eggs', 'Saute onions and garlic in a pan over medium heat, then add other vegetables and cook until color change to light brown. Add rice and soy sauce. At last, add eggs and fried around 5 minutes'),
  ('Mango Juice', 'Mango, water, sugar, ice', 'Wash mango with fresh water and take off mango rind. Put all ingredients in blender and blending for 1-2 minutes.')
;

COMMIT;



