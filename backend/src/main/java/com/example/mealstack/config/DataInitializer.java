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
                "admin@example.com",
                "VladimirAdmin123",
                Set.of(adminRole, userRole)
        );

        createUserIfNotExists(
                "VladimirUser",
                "user@example.com",
                "VladimirUser123",
                Set.of(userRole)
        );

        mockRecipe(
                "recept1",
                "ovoa e desc za recept 1",
                "www.kuromi",
                "www.pakuromi"
        );
    }

    private Role getOrCreateRole(ERole roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName)));
    }

    private void mockRecipe(String title, String description, String sourceUrl, String thumbnailUrl) {
        Recipe recipe = new Recipe(title, description, sourceUrl, thumbnailUrl);
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