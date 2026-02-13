package com.example.mealstack.service.impl;

import com.example.mealstack.service.CookieService;
import org.springframework.stereotype.Service;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.TimeUnit;

@Service
public class CookieServiceImpl implements CookieService {

    private static final Path COOKIE_DIR = Paths.get("cookies");
    private static final String CURL_PATH = "D:\\MealStack\\backend\\bin\\curl.exe";

    @Override
    public boolean generateCookie() {
        try {
            Files.createDirectories(COOKIE_DIR);

            Path file = COOKIE_DIR.resolve("cookie_" + System.currentTimeMillis() + ".txt");

            ProcessBuilder builder = new ProcessBuilder(
                    CURL_PATH,
                    "-c", file.toString(),
                    "-b", file.toString(),
                    "-L", "https://www.tiktok.com",
                    "--compressed",
                    "--insecure"
            );

            builder.redirectErrorStream(true);

            Process process = builder.start();

            boolean finished = process.waitFor(30, TimeUnit.SECONDS);

            if (!finished) {
                process.destroy();
                return false;
            }

            return Files.exists(file) && Files.size(file) > 0;

        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public String getRandomCookie() {
        try {
            return Files.list(COOKIE_DIR)
                    .filter(p -> p.toString().endsWith(".txt"))
                    .findAny()
                    .orElseThrow()
                    .toString();
        } catch (Exception e) {
            throw new RuntimeException("No cookies available");
        }
    }
}
