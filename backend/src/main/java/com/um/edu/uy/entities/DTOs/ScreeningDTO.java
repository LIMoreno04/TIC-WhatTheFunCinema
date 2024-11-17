package com.um.edu.uy.entities.DTOs;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScreeningDTO {
    @NotNull
    long movieId;
    String movieTitle;
    @NotNull
    int screeningPrice;
    @NotNull
    LocalDateTime date_and_time;
    @NotNull
    int roomNumber;
    @NotNull
    String theatre;
    @NotNull
    String language;


    public ScreeningDTO(long movieId, int screeningPrice, LocalDateTime date_and_time, int roomNumber, String theatre, String language) {
        this.movieId = movieId;
        this.screeningPrice = screeningPrice;
        this.date_and_time = date_and_time;
        this.roomNumber = roomNumber;
        this.theatre = theatre;
        this.language = language;
    }
}
