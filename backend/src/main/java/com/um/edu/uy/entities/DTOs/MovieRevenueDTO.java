package com.um.edu.uy.entities.DTOs;

import com.um.edu.uy.entities.plainEntities.Genre;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class MovieRevenueDTO {
    private long id;
    private String title;
    private byte[] poster;
    private String PGRating;
    private int revenue;

    public MovieRevenueDTO(long id, String title, byte[] poster, String PGRating, int revenue) {
        this.id = id;
        this.title = title;
        this.poster = poster;
        this.PGRating = PGRating;
        this.revenue = revenue;
    }
}