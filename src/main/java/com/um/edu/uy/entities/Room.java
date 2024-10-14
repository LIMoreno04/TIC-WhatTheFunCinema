package com.um.edu.uy.entities;
import com.um.edu.uy.enums.ScreeningLanguage;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
@Entity
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int roomNumber;

    @ManyToOne
    @JoinColumn(name = "location")
    private Theatre theatre;

    @NotNull
    private int rows;

    @NotNull
    private int columns;

    @OneToMany(mappedBy = "room",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Screening> screenings;

    public Room() {
        this.rows = 10;
        this.columns = 15;
        this.screenings = new LinkedList<Screening>();
    }

    public Room(int rows, int columns) {
        this.rows = rows;
        this.columns = columns;
        this.screenings = new LinkedList<Screening>();
    }


    public void CreateFunction(LocalDateTime dateAndTime, Movie movie, ScreeningLanguage language) {
        boolean[][] seatsMatrix = new boolean[rows][columns];
        Screening newScreening = new Screening(dateAndTime,movie,seatsMatrix, language);

        screenings.add(newScreening);
    }
}
