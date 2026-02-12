//package com.example.mealstack.model;
//
//import com.example.mealstack.model.enumerations.RecipeTag;
//import jakarta.persistence.*;
//import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.Size;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "recipes")
//public class Recipe {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @NotBlank
//    @Size(max = 100)
//    private String title;
//
//    @Column(columnDefinition = "TEXT")
//    private String description;
//
//    private String sourceUrl;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private RecipeTag tag;
//
//    private LocalDateTime createdAt = LocalDateTime.now();
//
//    public Recipe() {}
//
//    public Recipe(String title, String description, String sourceUrl, RecipeTag tag) {
//        this.title = title;
//        this.description = description;
//        this.sourceUrl = sourceUrl;
//        this.tag = tag;
//        this.createdAt = LocalDateTime.now();
//    }
//
//    // Getters and setters
//    public Long getId() { return id; }
//    public void setId(Long id) { this.id = id; }
//
//    public String getTitle() { return title; }
//    public void setTitle(String title) { this.title = title; }
//
//    public String getDescription() { return description; }
//    public void setDescription(String description) { this.description = description; }
//
//    public String getSourceUrl() { return sourceUrl; }
//    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }
//
//    public RecipeTag getTag() { return tag; }
//    public void setTag(RecipeTag tag) { this.tag = tag; }
//
//    public LocalDateTime getCreatedAt() { return createdAt; }
//    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
//}

package com.example.mealstack.model;

import com.example.mealstack.model.enumerations.RecipeTag;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "recipes")
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String sourceUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecipeTag tag;

    private LocalDateTime createdAt = LocalDateTime.now();

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public Recipe() {}

    public Recipe(String title, String description, String sourceUrl, RecipeTag tag) {
        this.title = title;
        this.description = description;
        this.sourceUrl = sourceUrl;
        this.tag = tag;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public RecipeTag getTag() { return tag; }
    public void setTag(RecipeTag tag) { this.tag = tag; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}