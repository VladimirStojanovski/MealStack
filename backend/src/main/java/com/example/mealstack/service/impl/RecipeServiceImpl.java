package com.example.mealstack.service.impl;

import com.example.mealstack.model.Recipe;
import com.example.mealstack.repositories.RecipeRepository;
import com.example.mealstack.service.RecipeService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RecipeServiceImpl implements RecipeService {

    private final RecipeRepository recipeRepository;

    public RecipeServiceImpl(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    @Override
    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    @Override
    public Recipe getRecipeById(Long id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found with id " + id));
    }

    @Override
    public Recipe createRecipe(Recipe recipe) {
        recipe.setCreatedAt(LocalDateTime.now());
        return recipeRepository.save(recipe);
    }

    @Override
    public Recipe updateRecipe(Long id, Recipe recipe) {
        Recipe existing = getRecipeById(id);

        existing.setTitle(recipe.getTitle());
        existing.setDescription(recipe.getDescription());
        existing.setSourceUrl(recipe.getSourceUrl());

        return recipeRepository.save(existing);
    }

    @Override
    public void deleteRecipe(Long id) {
        Recipe existing = getRecipeById(id);
        recipeRepository.delete(existing);
    }
}
