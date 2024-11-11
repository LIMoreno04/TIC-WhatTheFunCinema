package com.um.edu.uy.entities.plainEntities;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.um.edu.uy.entities.ids.RoomID;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.LinkedList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@Builder
@ToString
@IdClass(RoomID.class)
@Entity
public class Room {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "theatre", referencedColumnName = "location")
    private Theatre theatre;

    @Id
    private int room_number;

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


}
