package com.um.edu.uy.services;

import com.um.edu.uy.entities.*;
import com.um.edu.uy.enums.ScreeningLanguage;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.MovieRepository;
import com.um.edu.uy.repository.ReservationRepository;
import com.um.edu.uy.repository.RoomRepository;
import com.um.edu.uy.repository.ScreeningRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepo;
    @Autowired
    private ScreeningRepository screeningRepo;

    @Autowired
    private MovieRepository movieRepo;
    @Autowired
    private ReservationRepository reservationRepo;

    public void addScreeningToRoom(String theatreLocation, int roomNumber, long movieID, String language, LocalDateTime date_and_time) throws InvalidDataException{
        Optional<Room> roomResult = roomRepo.findById(new RoomID(theatreLocation,roomNumber));
        Optional<Movie> movieResult = movieRepo.findById(movieID);
        if (movieResult.isEmpty()){
            throw new InvalidDataException("movie not found.");
        } else if (roomResult.isEmpty()) {
            throw new InvalidDataException("room not found.");
        }
        else{
            Room room = roomResult.get();
            Movie movie = movieResult.get();
            Screening newScreening = Screening.builder().
                    movie(movie).
                    room(room).
                    language(language).
                    date_and_time(date_and_time).
                    build();
            screeningRepo.save(newScreening);
        }
    }
    public List<Reservation> getAllReservations(Screening screening) throws InvalidDataException {
       Optional<Screening> screeningResult = screeningRepo.findById(new ScreeningID(new RoomID(screening.getRoom().getTheatre().getLocation(),screening.getRoom().getRoom_number()),screening.getDate_and_time()));
       if (screeningResult.isEmpty()) {
           throw new InvalidDataException("screening not found.");
       } else {
           return reservationRepo.findAllByScreening(screening);
       }

    }

}
