package com.um.edu.uy.entities.plainEntities;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Theatre {

    @Id
    private String location;
    @OneToMany(mappedBy = "theatre", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY)
    private List<Room> rooms;

}
