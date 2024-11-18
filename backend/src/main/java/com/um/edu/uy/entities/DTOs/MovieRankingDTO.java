package com.um.edu.uy.entities.DTOs;

import lombok.Data;

@Data
public class MovieRankingDTO {
    private long id;
    private String title;
    private byte[] poster;
    private String PGRating;
    private double rating;

    public MovieRankingDTO(long id, String title, byte[] poster, String PGRating, double rating) {
        this.id = id;
        this.title = title;
        this.poster = poster;
        this.PGRating = PGRating;
        this.rating = rating;
    }
}
