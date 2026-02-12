//package com.example.mealstack.controllers;
//
//import com.example.mealstack.model.Recipe;
//import com.example.mealstack.service.RecipeService;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/recipes")
//public class RecipeController {
//
//    private final RecipeService recipeService;
//
//    public RecipeController(RecipeService recipeService) {
//        this.recipeService = recipeService;
//    }
//
//    @GetMapping
//    public ResponseEntity<List<Recipe>> getAllRecipes() {
//        List<Recipe> recipes = recipeService.getAllRecipes();
//        return ResponseEntity.ok(recipes);
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<Recipe> getRecipe(@PathVariable Long id) {
//        Recipe recipe = recipeService.getRecipeById(id);
//        return ResponseEntity.ok(recipe);
//    }
//
//    @PostMapping
//    public ResponseEntity<Recipe> createRecipe(@RequestBody Recipe recipe) {
//        Recipe created = recipeService.createRecipe(recipe);
//        return ResponseEntity.ok(created);
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<Recipe> updateRecipe(@PathVariable Long id, @RequestBody Recipe recipe) {
//        Recipe updated = recipeService.updateRecipe(id, recipe);
//        return ResponseEntity.ok(updated);
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
//        recipeService.deleteRecipe(id);
//        return ResponseEntity.noContent().build();
//    }
//}


package com.example.mealstack.controllers;

import com.example.mealstack.model.Recipe;
import com.example.mealstack.service.RecipeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @GetMapping
    public ResponseEntity<?> getAllRecipes() {
        try {
            List<Recipe> recipes = recipeService.getAllRecipesForCurrentUser();
            return ResponseEntity.ok(recipes);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipe(@PathVariable Long id) {
        try {
            Recipe recipe = recipeService.getRecipeByIdForCurrentUser(id);
            return ResponseEntity.ok(recipe);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createRecipe(@RequestBody Recipe recipe) {
        try {
            Recipe created = recipeService.createRecipeForCurrentUser(recipe);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecipe(@PathVariable Long id, @RequestBody Recipe recipe) {
        try {
            Recipe updated = recipeService.updateRecipeForCurrentUser(id, recipe);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable Long id) {
        try {
            recipeService.deleteRecipeForCurrentUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}