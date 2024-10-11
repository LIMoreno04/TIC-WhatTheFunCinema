package com.um.edu.uy.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Theatre {

    @NotNull
    @Id
    private String Location;

    private List<Room> rooms;

}
