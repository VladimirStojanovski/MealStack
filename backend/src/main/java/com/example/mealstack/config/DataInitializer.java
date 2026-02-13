package com.example.mealstack.config;

import com.example.mealstack.model.Recipe;
import com.example.mealstack.model.Role;
import com.example.mealstack.model.User;
import com.example.mealstack.model.enumerations.ERole;
import com.example.mealstack.model.enumerations.RecipeTag;
import com.example.mealstack.repositories.RecipeRepository;
import com.example.mealstack.repositories.RoleRepository;
import com.example.mealstack.repositories.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.Set;

@Component
public class DataInitializer {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final RecipeRepository recipeRepository;

    public DataInitializer(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            RecipeRepository recipeRepository
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.recipeRepository = recipeRepository;
    }

    @PostConstruct
    @Transactional
    public void init() {
        Role adminRole = getOrCreateRole(ERole.ROLE_ADMIN);
        Role userRole = getOrCreateRole(ERole.ROLE_USER);

        User vladimirAdmin = createUserIfNotExists(
                "VladimirAdmin",
                "vladimiradmin@example.com",
                "VladimirAdmin123",
                Set.of(adminRole, userRole)
        );

        User pavelAdmin = createUserIfNotExists(
                "PavelAdmin",
                "paveladmin@example.com",
                "PavelAdmin123",
                Set.of(adminRole, userRole)
        );

        User vladimirUser = createUserIfNotExists(
                "VladimirUser",
                "vladimiruser@example.com",
                "VladimirUser123",
                Set.of(userRole)
        );

        User pavelUser = createUserIfNotExists(
                "PavelUser",
                "paveluser@example.com",
                "PavelUser123",
                Set.of(userRole)
        );

        createUserIfNotExists(
                "TestUser1",
                "testuser1@gmail.com",
                "Test1User123",
                Set.of(userRole)
        );

        createUserIfNotExists(
                "TestUser2",
                "testuser2@gmail.com",
                "Test2User123",
                Set.of(userRole)
        );

        createUserIfNotExists(
                "TestUser3",
                "testuser3@gmail.com",
                "Test3User123",
                Set.of(userRole)
        );

        mockRecipe(
                vladimirUser,
                "Vladimir's Lunch Recipe",
                "Description for lunch recipe",
                "https://www.instagram.com/@bakingfey/video/7480967376327003414",
                RecipeTag.LUNCH
        );

        mockRecipe(
                vladimirUser,
                "Vladimir's Dessert Recipe",
                "Description for dessert recipe",
                "https://www.tiktok.com/@bakingfey/video/7480967376327003414",
                RecipeTag.DESSERT
        );

        mockRecipe(
                vladimirUser,
                "Vladimir's Breakfast Recipe",
                "Description for breakfast recipe",
                "https://www.tiktok.com/@bakingfey/video/7480967376327003414",
                RecipeTag.BREAKFAST
        );

        mockRecipe(
                vladimirUser,
                "Vladimir's Snack Recipe",
                "Description for user recipe",
                "https://www.instagram.com/@bakingfey/video/7480967376327003414",
                RecipeTag.SNACK
        );

        mockRecipe(
                vladimirUser,
                "Vladimir's Protein Recipe",
                "Description for user recipe",
                "https://www.tiktok.com/@bakingfey/video/7480967376327003414",
                RecipeTag.PROTEIN
        );

        mockRecipe(
                pavelUser,
                "Pavel's Protein Recipe",
                "Description for user recipe",
                "https://www.tiktok.com/@bakingfey/video/7480967376327003414",
                RecipeTag.PROTEIN
        );

        mockRecipe(
                pavelUser,
                "Pavel's Lunch Recipe",
                "Description for user recipe",
                "https://www.tiktok.com/@bakingfey/video/7480967376327003414",
                RecipeTag.LUNCH
        );
    }

    private Role getOrCreateRole(ERole roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName)));
    }

    private void mockRecipe(User user, String title, String description, String sourceUrl, RecipeTag tag) {
        if (recipeRepository.findByUser(user).stream().noneMatch(r -> r.getTitle().equals(title))) {
            Recipe recipe = new Recipe(title, description, sourceUrl, tag);
            recipe.setUser(user);
            recipeRepository.save(recipe);
        }
    }

    private User createUserIfNotExists(String username, String email, String password, Set<Role> roles) {
        return userRepository.findByUsername(username)
                .orElseGet(() -> {
                    User user = new User(username, email, passwordEncoder.encode(password));
                    user.setRoles(roles);
                    return userRepository.save(user);
                });
    }
}