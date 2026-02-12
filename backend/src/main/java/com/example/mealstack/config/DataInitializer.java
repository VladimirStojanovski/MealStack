package com.example.mealstack.config;

import com.example.mealstack.model.Recipe;
import com.example.mealstack.model.Role;
import com.example.mealstack.model.User;
import com.example.mealstack.model.enumerations.ERole;
import com.example.mealstack.repositories.RecipeRepository;
import com.example.mealstack.repositories.RoleRepository;
import com.example.mealstack.repositories.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.Set;
import com.example.mealstack.model.enumerations.RecipeTag;

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

        createUserIfNotExists(
                "VladimirAdmin",
                "vladimiradmin@example.com",
                "VladimirAdmin123",
                Set.of(adminRole, userRole)
        );

        createUserIfNotExists(
                "PavelAdmin",
                "paveladmin@example.com",
                "PavelAdmin123",
                Set.of(adminRole, userRole)
        );

        createUserIfNotExists(
                "VladimirUser",
                "vladimiruser@example.com",
                "VladimirUser123",
                Set.of(userRole)
        );

        createUserIfNotExists(
                "PavelUser",
                "paveluser@example.com",
                "PavelUser123",
                Set.of(userRole)
        );

        mockRecipe(
                "recipe 1",
                "Description for recipe 1",
                "https://www.instagram.com/@bakingfey/video/7480967376327003414?is_from_webapp=1&sender_device=pc&web_id=7605639884845794833",
                RecipeTag.LUNCH
        );

        mockRecipe(
                "recipe 2",
                "Description for recipe 2",
                "https://www.tiktok.com/@bakingfey/video/7480967376327003414?is_from_webapp=1&sender_device=pc&web_id=7605639884845794833",
                RecipeTag.DESSERT
        );

        mockRecipe(
                "recipe 3",
                "Description for recipe 3",
                "https://www.tiktok.com/@bakingfey/video/7480967376327003414?is_from_webapp=1&sender_device=pc&web_id=7605639884845794833",
                RecipeTag.BREAKFAST
        );
    }

    private Role getOrCreateRole(ERole roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName)));
    }

    private void mockRecipe(String title, String description, String sourceUrl, RecipeTag tag) {
        Recipe recipe = new Recipe(title, description, sourceUrl, tag);
        recipeRepository.save(recipe);
    }

    private void createUserIfNotExists(String username, String email, String password, Set<Role> roles) {
        if (userRepository.findByUsername(username).isEmpty()) {
            User user = new User(username, email, passwordEncoder.encode(password));
            user.setRoles(roles);
            userRepository.save(user);
        }
    }
}