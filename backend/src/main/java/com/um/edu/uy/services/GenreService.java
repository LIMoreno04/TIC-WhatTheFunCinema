package com.um.edu.uy.services;

import com.um.edu.uy.entities.plainEntities.Genre;
import com.um.edu.uy.repository.GenreRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.lang.classfile.Opcode;
import java.util.Optional;

public class GenreService {

    @Autowired
    private GenreRepository genreRepo;

    public Genre addGenre(Genre genre) {
        if (genreRepo.findByGenreName(genre.getGenreName()).isEmpty()) {
            genreRepo.save(genre);
        }
        return genre;
    }

    public Genre findByGenreName(String genreName) {
        Optional<Genre> result = genreRepo.findByGenreName(genreName);

        if (result.isPresent()) {
            return result.get();
        } else {
            Genre newGenre = Genre.builder()
                    .genreName(genreName)
                    .build();
            return addGenre(newGenre);
        }
    }
}
