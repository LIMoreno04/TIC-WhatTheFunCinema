package com.um.edu.uy.repository;

import com.um.edu.uy.entities.DTOs.MovieRevenueDTO;
import com.um.edu.uy.entities.plainEntities.Reservation;
import com.um.edu.uy.entities.ids.ReservationId;
import com.um.edu.uy.entities.plainEntities.Screening;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, ReservationId> {
    Optional<Reservation> findByScreeningAndColAndRow(Screening screening, Integer col, Integer row);
    List<Reservation> findAllByScreening(Screening screening);

    @Query("SELECT r.screening.room.theatre,r.screening.room.room_number,r.screening.date_and_time,r.screening.movie.title,r.row,r.col, r.screening.screeningPrice" +
            " FROM Reservation r WHERE r.customer.email =:e")
    public Optional<List<Object[]>> findAllByCustomerEmail(@Param("e") String email);

    @Query("""
    SELECT new com.um.edu.uy.entities.DTOs.MovieRevenueDTO(m.Id, m.title, m.poster, m.PGRating, SUM(s.screeningPrice))
    FROM Reservation r
    JOIN r.screening s
    JOIN s.movie m
    GROUP BY s.movie.Id
    ORDER BY SUM(s.screeningPrice) DESC
       """)
    public List<MovieRevenueDTO> findMoviesWithHighestRevenue();
}
