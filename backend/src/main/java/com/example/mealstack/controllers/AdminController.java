package com.example.mealstack.controllers;

import com.example.mealstack.model.User;
import com.example.mealstack.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserRepository userRepository;

    public AdminController(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/refresh-cookie")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> refreshTikTokCookie() {
        try {
            String backendDir = System.getProperty("user.dir") + "/backend";
            String scriptPath = backendDir + "/scripts/fetchTikTokCookie.js";

            System.out.println("Script path: " + scriptPath);
            System.out.println("Working Directory: " + System.getProperty("user.dir"));

            File scriptFile = new File(scriptPath);
            if (!scriptFile.exists()) {
                return ResponseEntity.status(500).body("❌ Script not found at: " + scriptPath);
            }

            ProcessBuilder processBuilder = new ProcessBuilder("node", scriptPath);
            processBuilder.directory(new File(backendDir));
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("Script Output: " + line);
            }

            int exitCode = process.waitFor();

            if (exitCode == 0) {
                return ResponseEntity.ok("✅ Cookie refreshed successfully.");
            } else {
                return ResponseEntity.status(500).body("❌ Cookie script failed. Exit code: " + exitCode);
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("❌ Error: " + e.getMessage());
        }
    }
}
