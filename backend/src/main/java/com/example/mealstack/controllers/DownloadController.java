package com.example.mealstack.controllers;

import com.example.mealstack.service.DownloadService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@RestController
@RequestMapping("/api/download")
public class DownloadController {

    private final DownloadService downloadService;
    private static final Path TEMP_DOWNLOADS = Paths.get("D:\\MealStack\\temp_downloads");

    public DownloadController(DownloadService downloadService) {
        this.downloadService = downloadService;
    }

    @PostMapping("/tiktok")
    public ResponseEntity<byte[]> downloadTiktok(@RequestBody List<String> links) {
        String result = downloadService.downloadTiktok(links);

        if (result.startsWith("No videos") || result.startsWith("Download failed")) {
            return ResponseEntity.badRequest()
                    .body(result.getBytes());
        }

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            try (ZipOutputStream zos = new ZipOutputStream(baos)) {
                Files.list(TEMP_DOWNLOADS)
                        .filter(p -> p.toString().endsWith(".mp4"))
                        .forEach(p -> {
                            try {
                                zos.putNextEntry(new ZipEntry(p.getFileName().toString()));
                                Files.copy(p, zos);
                                zos.closeEntry();
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        });
            }

            Files.list(TEMP_DOWNLOADS)
                    .filter(p -> p.toString().endsWith(".mp4"))
                    .forEach(p -> {
                        try { Files.delete(p); } catch (IOException ignored) {}
                    });

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"videos.zip\"")
                    .body(baos.toByteArray());

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating zip file".getBytes());
        }
    }
}
