package com.example.mealstack.service.impl;

import com.example.mealstack.service.CookieService;
import com.example.mealstack.service.TiktokService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.TimeUnit;


@Service
public class TiktokServiceImpl implements TiktokService {

    private static final Logger logger = LoggerFactory.getLogger(TiktokServiceImpl.class);

    private static final String YTDLP_PATH = "D:\\MealStack\\backend\\bin\\yt-dlp.exe";
    private static final Path DOWNLOAD_DIR = Paths.get("D:\\MealStack\\temp_downloads");

    private final CookieService cookieService;

    public TiktokServiceImpl(CookieService cookieService) {
        this.cookieService = cookieService;
    }

    @Override
    public int download(String link, int ignored) {

        try {
            Files.createDirectories(DOWNLOAD_DIR);

            String cookie = cookieService.getRandomCookie();

            ProcessBuilder builder = new ProcessBuilder(
                    YTDLP_PATH,
                    "--cookies", cookie,
                    "--impersonate", "chrome",
                    "--proxy", "socks5://127.0.0.1:9050",
                    "--force-overwrites",
                    "--no-abort-on-error",
                    "-o", DOWNLOAD_DIR.resolve("tiktok_%(id)s.%(ext)s").toString(),
                    link
            );

            builder.redirectErrorStream(true);

            Process process = builder.start();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream())
            );

            String line;
            while ((line = reader.readLine()) != null) {
                logger.info(line);
            }

            boolean finished = process.waitFor(15, TimeUnit.MINUTES);

            if (!finished) {
                process.destroy();
                logger.error("yt-dlp process timed out.");
                return 0;
            }

            return process.exitValue() == 0 ? 1 : 0;

        } catch (Exception e) {
            logger.error("Tiktok download failed", e);
            return 0;
        }
    }
}
