package com.um.edu.uy.entities.DTOs;

import com.um.edu.uy.entities.plainEntities.Genre;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
public class MoviePreviewDTO {
    private String title;
    private byte[] poster;
    private LocalTime duration;
    private String PGRating;
    private LocalDate releaseDate;
    private List<Genre> genres;

    public MoviePreviewDTO(String title, byte[] poster, LocalTime duration, String PGRating, LocalDate releaseDate) {
        this.title = title;
        this.poster = poster;
        this.duration = duration;
        this.PGRating = PGRating;
        this.releaseDate = releaseDate;
    }
}
