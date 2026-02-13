package com.example.mealstack.service.impl;

import com.example.mealstack.service.TorService;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.concurrent.TimeUnit;

@Service
public class TorServiceImpl implements TorService {

    private Process torProcess;

    private final String torPath = "D:\\MealStack\\backend\\tor\\tor.exe";
    private final int socksPort = 9050;
    private final int controlPort = 9051;

    private final int bootstrapTimeout = 120;

    @Override
    public boolean start() {
        try {
            if (isRunning()) {
                System.out.println("Tor already running.");
                return true;
            }

            ProcessBuilder builder = new ProcessBuilder(
                    torPath,
                    "--SocksPort", String.valueOf(socksPort),
                    "--ControlPort", String.valueOf(controlPort),
                    "--CookieAuthentication", "0"
            );

            builder.redirectErrorStream(true);
            torProcess = builder.start();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(torProcess.getInputStream())
            );

            String line;
            long startTime = System.currentTimeMillis();
            System.out.println("Starting Tor...");

            while ((line = reader.readLine()) != null) {
                System.out.println(line);

                if (line.contains("Bootstrapped 100%")) {
                    System.out.println("Tor started successfully.");
                    return true;
                }

                if (System.currentTimeMillis() - startTime > bootstrapTimeout * 1000) {
                    System.out.println("Tor bootstrap timeout after " + bootstrapTimeout + " seconds.");
                    return false;
                }
            }

            return false;

        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean rotateIp() {
        try {
            if (!isRunning()) {
                System.out.println("Tor not running. Starting it...");
                if (!start()) return false;
            }

            try (Socket socket = new Socket("127.0.0.1", controlPort);
                 PrintWriter writer = new PrintWriter(socket.getOutputStream(), true);
                 BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()))) {

                writer.println("AUTHENTICATE \"\"");
                String response = reader.readLine();

                if (response == null || !response.startsWith("250")) {
                    System.out.println("Tor authentication failed: " + response);
                    return false;
                }

                writer.println("SIGNAL NEWNYM");
                response = reader.readLine();

                if (response != null && response.startsWith("250")) {
                    System.out.println("IP rotated successfully. Waiting for new circuit...");
                    TimeUnit.SECONDS.sleep(5);
                    return true;
                } else {
                    System.out.println("IP rotation failed: " + response);
                    return false;
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean stop() {
        try {
            if (torProcess != null && torProcess.isAlive()) {
                torProcess.destroy();
                torProcess = null;
                System.out.println("Tor stopped.");
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean isRunning() {
        return torProcess != null && torProcess.isAlive();
    }
}
