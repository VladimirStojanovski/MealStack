package com.example.mealstack.service;

public interface TorService {
    boolean start();
    boolean rotateIp();
    boolean stop();
    boolean isRunning();
}
