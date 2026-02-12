package com.example.mealstack.model;

import java.io.Serializable;
import java.util.Objects;

public class CookbookRecipeId implements Serializable {

    private Long cookbookId;
    private Long recipeId;

    public CookbookRecipeId() {}

    public CookbookRecipeId(Long cookbookId, Long recipeId) {
        this.cookbookId = cookbookId;
        this.recipeId = recipeId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CookbookRecipeId)) return false;
        CookbookRecipeId that = (CookbookRecipeId) o;
        return Objects.equals(cookbookId, that.cookbookId) &&
                Objects.equals(recipeId, that.recipeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cookbookId, recipeId);
    }
}
