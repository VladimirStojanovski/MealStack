//package com.example.mealstack.repositories;
//
//import com.example.mealstack.model.Recipe;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//@Repository
//public interface RecipeRepository extends JpaRepository<Recipe, Long> {
//}


package com.example.mealstack.repositories;

import com.example.mealstack.model.Recipe;
import com.example.mealstack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByUser(User user);
    List<Recipe> findByUserId(Long userId);
}