package com.um.edu.uy.entities.plainEntities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.*;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Genre {
    @Id
    private String genreName;

    @ManyToMany(mappedBy = "genres")
    private List<Movie> movies;
}
