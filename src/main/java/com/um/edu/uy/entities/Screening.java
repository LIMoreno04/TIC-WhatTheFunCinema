package com.um.edu.uy.entities;

import com.um.edu.uy.enums.ScreeningLanguage;
import com.um.edu.uy.exceptions.InvalidDataException;
import jakarta.persistence.Entity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@Entity
public class Screening {

    private final LocalDateTime dateAndTime;

    private final Movie movie;

    private ScreeningLanguage language;

    private boolean[][] reservedSeats;

    public Screening(LocalDateTime dateAndTime, Movie movie, boolean[][] reservedSeats, ScreeningLanguage language) {
        this.dateAndTime = dateAndTime;
        this.movie = movie;
        this.reservedSeats = reservedSeats;
        this.language = language;
    }

    public void MakeSingleReservation(int seatRow, int seatColumn) throws InvalidDataException {
        if (seatRow >= reservedSeats.length || seatRow < 0)
            throw new InvalidDataException("Invalid row number");
        else if (seatColumn >= reservedSeats[0].length || seatColumn < 0)
            throw new InvalidDataException("Invalid column number");
        else
            reservedSeats[seatRow][seatColumn] = true;
    }
}
