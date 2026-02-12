package com.example.mealstack.service.impl;

import com.example.mealstack.service.CookieService;
import com.example.mealstack.service.DownloadService;
import com.example.mealstack.service.TiktokService;
import com.example.mealstack.service.TorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class DownloadServiceImpl implements DownloadService {

    private static final Logger logger =
            LoggerFactory.getLogger(DownloadServiceImpl.class);

    private final TorService torService;
    private final TiktokService tiktokService;
    private final CookieService cookieService;

    public DownloadServiceImpl(
            TorService torService,
            TiktokService tiktokService,
            CookieService cookieService
    ) {
        this.torService = torService;
        this.tiktokService = tiktokService;
        this.cookieService = cookieService;
    }

    @Override
    public String downloadTiktok(java.util.List<String> links) {

        try {

            if (links == null || links.isEmpty()) {
                return "No links provided.";
            }

            if (links.size() > 10) {
                return "Maximum 10 links allowed.";
            }

            if (!torService.start()) {
                return "Could not start TOR.";
            }

            if (!torService.rotateIp()) {
                return "Could not rotate TOR IP.";
            }

            cookieService.generateCookie();

            int totalDownloaded = 0;

            for (String link : links) {

                int downloaded = tiktokService.download(link, 1);
                totalDownloaded += downloaded;

                torService.rotateIp();
            }

            torService.stop();

            if (totalDownloaded == 0) {
                return "No videos were downloaded.";
            }

            return "Successfully downloaded " + totalDownloaded + " videos.";

        } catch (Exception e) {
            logger.error("TikTok download failed", e);
            return "Download failed due to unexpected error.";
        }
    }
}
