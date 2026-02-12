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
            // Construct the correct path
            String backendDir = System.getProperty("user.dir") + "/backend";
            String scriptPath = backendDir + "/scripts/fetchTikTokCookie.js";

            System.out.println("Script path: " + scriptPath);
            System.out.println("Working Directory: " + System.getProperty("user.dir"));

            // Verify the file exists
            File scriptFile = new File(scriptPath);
            if (!scriptFile.exists()) {
                return ResponseEntity.status(500).body("❌ Script not found at: " + scriptPath);
            }

            // Build and run the process
            ProcessBuilder processBuilder = new ProcessBuilder("node", scriptPath);
            processBuilder.directory(new File(backendDir)); // Set working directory to backend folder
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

            // Read output (important to prevent deadlocks)
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
