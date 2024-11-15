package com.um.edu.uy.entities.DTOs;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ScreeningDTO {
    @NotNull
    long movieId;
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
}
