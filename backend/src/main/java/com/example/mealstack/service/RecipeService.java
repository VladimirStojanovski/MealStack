//package com.example.mealstack.service;
//
//import com.example.mealstack.model.Recipe;
//
//import java.util.List;
//
//public interface RecipeService {
//    List<Recipe> getAllRecipes();
//    Recipe getRecipeById(Long id);
//    Recipe createRecipe(Recipe recipe);
//    Recipe updateRecipe(Long id, Recipe recipe);
//    void deleteRecipe(Long id);
//}


package com.example.mealstack.service;

import com.example.mealstack.model.Recipe;

import java.util.List;

public interface RecipeService {
    List<Recipe> getAllRecipesForCurrentUser();
    Recipe getRecipeByIdForCurrentUser(Long id);
    Recipe createRecipeForCurrentUser(Recipe recipe);
    Recipe updateRecipeForCurrentUser(Long id, Recipe recipe);
    void deleteRecipeForCurrentUser(Long id);
}