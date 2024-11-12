package com.um.edu.uy.entities.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@AllArgsConstructor
public class MovieDTO {
    private long id;
    private String title;
    private String duration;
    private String description;
    private String releaseDate;
    private String director;
    private List<String> genres;
    private String poster;
    private String PGRating;
}
