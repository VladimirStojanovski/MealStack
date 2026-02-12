package com.example.mealstack.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({"message", "current", "total", "skipped"})
public record DownloadProgress(
        @NotBlank @NotNull String message,
        @Min(1) int current,
        @Min(1) int total,
        boolean skipped
) {
    @JsonProperty("progressPercentage")
    public double progressPercentage() {
        return ((double) current / total) * 100;
    }

    public static DownloadProgress downloading(int current, int total) {
        validateIndices(current, total);
        return new DownloadProgress("Downloading...", current, total, false);
    }

    public static DownloadProgress completed(int current, int total) {
        validateIndices(current, total);
        return new DownloadProgress("Download completed", current, total, false);
    }

    public static DownloadProgress skipped(int current, int total, String reason) {
        validateIndices(current, total);
        return new DownloadProgress("Skipped: " + reason, current, total, true);
    }

    public static DownloadProgress error(int current, int total, String error) {
        validateIndices(current, total);
        return new DownloadProgress("Error: " + (error != null ? error : "Unknown error"),
                current, total, false);
    }

    public static DownloadProgress allComplete(int total) {
        return new DownloadProgress("All downloads completed!", total, total, false);
    }

    public static DownloadProgress editingStarted(int total) {
        return new DownloadProgress("Editing videos - adding text overlay", total, total, false);
    }

    public static DownloadProgress editing(int current, int total, String message) {
        return new DownloadProgress(message, current, total, false);
    }


    private static void validateIndices(int current, int total) {
        if (current < 1 || total < 1 || current > total) {
            throw new IllegalArgumentException(
                    String.format("Invalid download indices: current=%d, total=%d", current, total)
            );
        }
    }
}