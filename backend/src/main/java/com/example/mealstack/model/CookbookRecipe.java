package com.example.mealstack.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cookbook_recipes")
@IdClass(CookbookRecipeId.class)
public class CookbookRecipe {

    @Id
    private Long cookbookId;

    @Id
    private Long recipeId;

    private LocalDateTime addedAt = LocalDateTime.now();

    public CookbookRecipe() {}

    public CookbookRecipe(Long cookbookId, Long recipeId) {
        this.cookbookId = cookbookId;
        this.recipeId = recipeId;
        this.addedAt = LocalDateTime.now();
    }

    // Getters and setters
    public Long getCookbookId() { return cookbookId; }
    public void setCookbookId(Long cookbookId) { this.cookbookId = cookbookId; }

    public Long getRecipeId() { return recipeId; }
    public void setRecipeId(Long recipeId) { this.recipeId = recipeId; }

    public LocalDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(LocalDateTime addedAt) { this.addedAt = addedAt; }
}
