package com.um.edu.uy.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Theatre {

    @Id
    private String Location;

    private List<Room> rooms;

}
