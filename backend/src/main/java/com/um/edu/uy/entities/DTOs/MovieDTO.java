package com.um.edu.uy.entities.DTOs;

import lombok.Data;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Getter
public class MovieDTO {
    private long id;
    private String title;
    private String duration;
    private String description;
    private String releaseDate;
    private String director;
    private List<String> genres;
    private Boolean currentlyOnDisplay;
    private MultipartFile poster;
    private String PGRating;
}
