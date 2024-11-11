package com.um.edu.uy.entities.DTOs;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NewTheatreDTO {
    @NotNull
    private String location;
    private int numberOfRooms;
}
