package com.um.edu.uy.services;

import com.um.edu.uy.entities.plainEntities.Movie;
import com.um.edu.uy.entities.plainEntities.Room;
import com.um.edu.uy.entities.plainEntities.Screening;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.RoomRepository;
import com.um.edu.uy.repository.ScreeningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class ScreeningService {

    @Autowired
    private ScreeningRepository screeningRepo;

    @Autowired
    private MovieService movieService;

    @Autowired
    private RoomService roomService;

    public void addScreening(long movieId,
                                  int screeningPrice,
                                  LocalDateTime date_and_time,
                                  int roomNumber,
                                  String theatre,
                                  String language) throws InvalidDataException {

        Movie movie = movieService.findById(movieId);
        Room room = roomService.findByTheatreAndRoomNumber(theatre, roomNumber);
        System.out.println( "\n"+ movie +"\n"+ theatre + " -- " + roomNumber +"\n"+ date_and_time.toString() +"\n"+ screeningPrice +"\n"+ language +"\n");

//        if (!roomService.isAvailable(theatre,roomNumber,date_and_time,date_and_time.plus((Duration.ofHours(movie.getDuration().getHour()).plusMinutes(movie.getDuration().getMinute())))))
//        {
//            throw new InvalidDataException("Room not available.");
//        }
        Screening newScreening = Screening.builder().
                movie(movie).
                screeningPrice(screeningPrice).
                language(language).
                date_and_time(date_and_time).
                room(room).build();

        screeningRepo.save(newScreening);
    }

}
