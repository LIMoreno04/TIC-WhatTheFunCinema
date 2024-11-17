package com.um.edu.uy.entities.DTOs;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReservationDTO {

    private String theatre;
    private int roomNumber;
    private LocalDateTime date_and_time;
    private int col;
    private int row;

    public ReservationDTO(String theatre, int roomNumber, LocalDateTime date_and_time, int col, int row) {
        this.theatre = theatre;
        this.roomNumber = roomNumber;
        this.date_and_time = date_and_time;
        this.col = col;
        this.row = row;
    }
}
