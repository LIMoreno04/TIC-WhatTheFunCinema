package com.um.edu.uy.entities.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
public class MoviePreviewDTO {
    private String title;
    private byte[] poster;
    private LocalTime duration;
    private String PGRating;
    private LocalDate releaseDate;
}
