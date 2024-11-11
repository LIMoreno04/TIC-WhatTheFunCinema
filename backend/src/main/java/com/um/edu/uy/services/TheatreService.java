package com.um.edu.uy.services;

import com.um.edu.uy.entities.plainEntities.Room;
import com.um.edu.uy.entities.plainEntities.Theatre;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.RoomRepository;
import com.um.edu.uy.repository.TheatreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
@Service
public class TheatreService {

    @Autowired
    private TheatreRepository theatreRepo;
    @Autowired
    private RoomRepository roomRepo;

    public Theatre findByLocation(String location) throws InvalidDataException {
        if(theatreRepo.findById(location).isEmpty()) {
        throw new InvalidDataException("Theatre not found.");
        } else {
            return theatreRepo.findById(location).get();
        }
    }
    public List<Theatre> findAll() { return theatreRepo.findAll(); }

    public List<Room> findAllRooms(String location) throws InvalidDataException {return roomRepo.findAllByTheatre(findByLocation(location)).orElse(new LinkedList<>()); }

    public Theatre addTheatre(String location) throws InvalidDataException {
        if (location == null) {
            throw new InvalidDataException("Ingrese la localidad.");
        }
        if (theatreRepo.findByLocationIgnoreCase(location).isPresent()) {
            throw new InvalidDataException("Ya se tiene registro de esa sucursal.");
        }
        Theatre theatre = Theatre.builder()
                .location(location)
                .rooms(new LinkedList<>())
                .build();
        return theatreRepo.save(theatre);
    }

    public void addRoomToTheatre(String location, int rows, int cols) throws InvalidDataException {
        Optional<Theatre> result = theatreRepo.findByLocationIgnoreCase(location);
        if (result.isPresent()) {
            Theatre theatre = result.get();
            int roomNumber = theatre.getRooms()!=null ? theatre.getRooms().size()+1 : 1;
            Room room = Room.builder()
                    .theatre(theatre)
                    .room_number(roomNumber)
                    .columns(cols)
                    .rows(rows)
                    .build();
            theatre.getRooms().add(room);
            theatreRepo.save(theatre);
        } else {throw new InvalidDataException("Sucursal no existe.");}
    }

    public void addTheatreWithRooms(String location, int numberOfRooms) throws InvalidDataException {
        addTheatre(location);
        for (int i = 0; i < numberOfRooms; i++) {
            addRoomToTheatre(location,10,15);
        }
    }
}
