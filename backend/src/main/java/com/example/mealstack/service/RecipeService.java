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