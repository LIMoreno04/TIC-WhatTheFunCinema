package com.um.edu.uy.services;

import com.um.edu.uy.entities.Room;
import com.um.edu.uy.entities.Theatre;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.TheatreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class TheatreService {

    @Autowired
    private TheatreRepository theatreRepo;

    private Theatre addTheatre(String location) throws InvalidDataException {
        if (location == null) {
            throw new InvalidDataException("Ingrese la localidad.");
        }
        Theatre theatre = Theatre.builder()
                .location(location)
                .build();
        return theatreRepo.save(theatre);
    }

    private void addRoomToTheatre(String location, Room room) {
        Optional<Theatre> result = theatreRepo.findByLocation(location);
        if (result.isPresent()) {
            Theatre theatre = result.get();
            theatre.getRooms().add(room);
        }
    }
}
