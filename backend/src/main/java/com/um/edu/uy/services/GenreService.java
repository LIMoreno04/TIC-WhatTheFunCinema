package com.um.edu.uy.services;

import com.um.edu.uy.entities.plainEntities.Genre;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.GenreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class GenreService {

    @Autowired
    private GenreRepository genreRepo;

    public Genre addGenre(String genre) {
        if (genreRepo.findByGenreName(genre).isEmpty()) {
            genreRepo.save(Genre.builder().genreName(genre).build());
        }
        return genreRepo.findByGenreName(genre).get();
    }
    public Genre findByGenreName(String genreName) throws InvalidDataException {
        Optional<Genre> result = genreRepo.findByGenreName(genreName);
        if (result.isPresent()) {return result.get();}
        else {throw new InvalidDataException("Genre not found");
        }
    }

    public List<String> findAllGetNames() {return genreRepo.findAllGetNames();}

    public Genre findByGenreNameElseAdd(String genreName) {
        Optional<Genre> result = genreRepo.findByGenreName(genreName);

        if (result.isPresent()) {
            return result.get();
        } else {
            return addGenre(genreName);
        }
    }
}
