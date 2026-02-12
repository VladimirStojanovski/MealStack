package com.example.mealstack.service;

import com.example.mealstack.model.Recipe;

import java.util.List;

public interface RecipeService {
    List<Recipe> getAllRecipes();
    Recipe getRecipeById(Long id);
    Recipe createRecipe(Recipe recipe);
    Recipe updateRecipe(Long id, Recipe recipe);
    void deleteRecipe(Long id);
}
