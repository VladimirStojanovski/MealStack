package com.example.mealstack.service.impl;

import com.example.mealstack.model.Recipe;
import com.example.mealstack.model.User;
import com.example.mealstack.repositories.RecipeRepository;
import com.example.mealstack.repositories.UserRepository;
import com.example.mealstack.service.RecipeService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RecipeServiceImpl implements RecipeService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    public RecipeServiceImpl(RecipeRepository recipeRepository, UserRepository userRepository) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        }
        throw new RuntimeException("User not authenticated");
    }

    @Override
    public List<Recipe> getAllRecipesForCurrentUser() {
        User currentUser = getCurrentUser();
        return recipeRepository.findByUser(currentUser);
    }

    @Override
    public Recipe getRecipeByIdForCurrentUser(Long id) {
        User currentUser = getCurrentUser();
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found with id " + id));

        if (!recipe.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to access this recipe");
        }

        return recipe;
    }

    @Override
    @Transactional
    public Recipe createRecipeForCurrentUser(Recipe recipe) {
        User currentUser = getCurrentUser();
        recipe.setUser(currentUser);
        recipe.setCreatedAt(LocalDateTime.now());
        return recipeRepository.save(recipe);
    }

    @Override
    @Transactional
    public Recipe updateRecipeForCurrentUser(Long id, Recipe recipe) {
        User currentUser = getCurrentUser();
        Recipe existing = getRecipeByIdForCurrentUser(id);

        existing.setTitle(recipe.getTitle());
        existing.setDescription(recipe.getDescription());
        existing.setSourceUrl(recipe.getSourceUrl());
        existing.setTag(recipe.getTag());

        return recipeRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteRecipeForCurrentUser(Long id) {
        Recipe existing = getRecipeByIdForCurrentUser(id);
        recipeRepository.delete(existing);
    }
}