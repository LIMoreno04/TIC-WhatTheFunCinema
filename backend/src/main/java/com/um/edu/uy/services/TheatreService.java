package com.um.edu.uy.services;

import com.um.edu.uy.entities.plainEntities.Room;
import com.um.edu.uy.entities.plainEntities.Theatre;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.RoomRepository;
import com.um.edu.uy.repository.TheatreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class TheatreService {

    @Autowired
    private TheatreRepository theatreRepo;
    @Autowired
    private RoomRepository roomRepo;

    public List<Theatre> findAll() { return theatreRepo.findAll(); }

    public List<Room> findAllRooms(String location) {return roomRepo.findAllByTheatre(location); }

    public Theatre addTheatre(String location) throws InvalidDataException {
        if (location == null) {
            throw new InvalidDataException("Ingrese la localidad.");
        }
        Theatre theatre = Theatre.builder()
                .location(location)
                .build();
        return theatreRepo.save(theatre);
    }

    public void addRoomToTheatre(String location, int rows, int cols) {
        Optional<Theatre> result = theatreRepo.findByLocation(location);
        if (result.isPresent()) {
            Theatre theatre = result.get();
            Room room = Room.builder()
                    .theatre(theatre)
                    .columns(cols)
                    .rows(rows)
                    .build();
            theatre.getRooms().add(room);
        }
    }

    public void addTheatreWithRooms(String location, int numberOfRooms) throws InvalidDataException {
        addTheatre(location);
        for (int i = 0; i < numberOfRooms; i++) {
            addRoomToTheatre(location,10,15);
        }
    }
}
