package com.um.edu.uy.services;

import com.um.edu.uy.entities.ids.RoomID;
import com.um.edu.uy.entities.ids.ScreeningID;
import com.um.edu.uy.entities.plainEntities.*;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepo;
    @Autowired
    private MovieRepository movieRepo;
    @Autowired
    private TheatreRepository theatreRepo;
    @Autowired
    private ScreeningRepository screeningRepo;

    @Autowired
    private MovieService movieService;
    @Autowired
    private ReservationRepository reservationRepo;

    @Transactional
    public void addScreening(long movieId,
                             int screeningPrice,
                             LocalDateTime date_and_time,
                             int roomNumber,
                             String theatre,
                             String language) throws InvalidDataException {

        Movie movie = movieService.findById(movieId);
        Room room = findByTheatreAndRoomNumber(theatre, roomNumber);

        // Check if the screening already exists
        Optional<Screening> existingScreening = screeningRepo.findById(new ScreeningID(new RoomID(theatre,roomNumber),date_and_time));
        if (existingScreening.isPresent()) {
            throw new InvalidDataException("A screening already exists for the specified room and time.");
        }

        // Create and save new screening
        Screening newScreening = Screening.builder()
                .movie(movie)
                .screeningPrice(screeningPrice)
                .language(language)
                .date_and_time(date_and_time)
                .room(room)
                .build();

        room.getScreenings().add(newScreening);
        roomRepo.save(room);
        movie.getScreenings().add(newScreening);
        movieRepo.save(movie);
    }

    public Boolean isRoomAvailable(LocalDateTime start, LocalDateTime end, String theatre, int roomNumber){
        Optional<List<Object[]>> opt = screeningRepo.isRoomAvailable(start,end,theatre,roomNumber);
        return (opt.isEmpty() || opt.get().isEmpty());
    }

    @Transactional
    public Screening findScreeningById(String theatre,int roomNumber,LocalDateTime date_and_time) throws InvalidDataException {
        return screeningRepo.findByIdMyself(theatre,roomNumber,date_and_time).orElseThrow(()->new InvalidDataException("Función inexistente."));
    }


    public List<Reservation> getAllReservations(Screening screening) throws InvalidDataException {
        Optional<Screening> screeningResult = screeningRepo.findById(new ScreeningID(new RoomID(screening.getRoom().getTheatre().getLocation(), screening.getRoom().getRoom_number()), screening.getDate_and_time()));
        if (screeningResult.isEmpty()) {
            throw new InvalidDataException("screening not found.");
        } else {
            return reservationRepo.findAllByScreening(screening);
        }

    }

    public boolean checkIfSeatIsAvailable(Screening screening, int col, int row) throws InvalidDataException{
        Optional<Screening> screeningResult = screeningRepo.findById(new ScreeningID(new RoomID(screening.getRoom().getTheatre().getLocation(), screening.getRoom().getRoom_number()), screening.getDate_and_time()));
        if (screeningResult.isEmpty()) {
            throw new InvalidDataException("screening not found.");
        } else {
            Optional<Reservation> reservationResult = reservationRepo.findByScreeningAndColAndRow(screening, col, row);
            if (reservationResult.isEmpty()){
                return true;}
            else {
                return false;}
        }
    }

    public Room findByTheatreAndRoomNumber(String theatreLocation, int room) throws InvalidDataException {
        Optional<Theatre> theatreOpt = theatreRepo.findById(theatreLocation);
        if (theatreOpt.isEmpty()) {
            throw new InvalidDataException("theatre not found.");
        }
        Optional<Room> result = roomRepo.findByTheatreAndRoomNumber(theatreOpt.get(),room);

        if (result.isEmpty()) {
            throw new InvalidDataException("Room not found.");
        } else {
            System.out.println("hola desde room service");
            return result.get();
        }
    }

}
