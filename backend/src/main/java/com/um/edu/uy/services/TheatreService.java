package com.um.edu.uy.services;

import com.um.edu.uy.entities.DTOs.ReservationDTO;
import com.um.edu.uy.entities.DTOs.ScreeningDTO;
import com.um.edu.uy.entities.ids.RoomID;
import com.um.edu.uy.entities.ids.ScreeningID;
import com.um.edu.uy.entities.plainEntities.Reservation;
import com.um.edu.uy.entities.plainEntities.Room;
import com.um.edu.uy.entities.plainEntities.Screening;
import com.um.edu.uy.entities.plainEntities.Theatre;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.RoomRepository;
import com.um.edu.uy.repository.ScreeningRepository;
import com.um.edu.uy.repository.TheatreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
@Service
public class TheatreService {

    @Autowired
    private TheatreRepository theatreRepo;
    @Autowired
    private RoomRepository roomRepo;

    @Autowired
    private ScreeningRepository screeningRepo;

    public Theatre findByLocation(String location) throws InvalidDataException {
        if(theatreRepo.findById(location).isEmpty()) {
        throw new InvalidDataException("Theatre not found.");
        } else {
            return theatreRepo.findById(location).get();
        }
    }
    public List<Theatre> findAll() { return theatreRepo.findAll(); }

    public List<String> findAllLocations() {return theatreRepo.findAllLocations();}

    public List<Integer> findAllRooms(String location) throws InvalidDataException {return roomRepo.findNumbersByTheatre(findByLocation(location)).orElse(new LinkedList<>()); }

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


    @Transactional
    public Object[] getReservations(String theatre, int roomNumber, LocalDateTime date_and_time) throws InvalidDataException {
        Screening screening = screeningRepo.findById(new ScreeningID(new RoomID(theatre,roomNumber),date_and_time)).orElseThrow(()->new InvalidDataException("screening not found."));
        Object[] toSend = new Object[] {screening.getRoom().getRows(),screening.getRoom().getColumns(),null,roomNumber, screening.getScreeningPrice()};
        List<ReservationDTO> reservationDTOS = new LinkedList<>();
        for(Reservation reservation : screening.getReservations()) {
            reservationDTOS.add(new ReservationDTO(theatre,roomNumber,date_and_time,reservation.getCol(),reservation.getRow()));
        }
        toSend[2] = reservationDTOS;
        return toSend;
    }




}
