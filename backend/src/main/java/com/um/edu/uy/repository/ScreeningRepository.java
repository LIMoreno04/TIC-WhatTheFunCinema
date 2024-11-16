package com.um.edu.uy.repository;

import com.um.edu.uy.entities.plainEntities.Movie;
import com.um.edu.uy.entities.plainEntities.Room;
import com.um.edu.uy.entities.plainEntities.Screening;
import com.um.edu.uy.entities.ids.ScreeningID;
import com.um.edu.uy.entities.plainEntities.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ScreeningRepository extends JpaRepository<Screening, ScreeningID> {

    @Query(value = " SELECT s.room_number, s.date_and_time, m.duration, m.title " +
            " FROM screening s CROSS JOIN Movie m " +
            " WHERE s.theatre = :thtre AND " +
            " ((s.date_and_time + m.duration::INTERVAL BETWEEN :sdt AND :edt) " +
            " OR (s.date_and_time BETWEEN :sdt AND :edt) " +
            " OR (s.date_and_time < :sdt AND s.date_and_time + m.duration::INTERVAL > :edt)) ",
            nativeQuery = true)
    public Optional<List<Object[]>> screeningsBetween(@Param("sdt") LocalDateTime startingDateTime,
                                                       @Param("edt") LocalDateTime endingDateTime,
                                                       @Param("thtre") String theatre);

    @Query(value = " SELECT s.room_number, s.date_and_time, m.duration " +
            " FROM screening s CROSS JOIN Movie m " +
            " WHERE s.theatre = :thtre AND s.room_number = :n" +
            " ((s.date_and_time + m.duration::INTERVAL BETWEEN :sdt AND :edt) " +
            " OR (s.date_and_time BETWEEN :sdt AND :edt) " +
            " OR (s.date_and_time < :sdt AND s.date_and_time + m.duration::INTERVAL > :edt)) ",
            nativeQuery = true)
    public Optional<List<Object[]>> isRoomAvailable(@Param("sdt") LocalDateTime startingDateTime,
                                                      @Param("edt") LocalDateTime endingDateTime,
                                                      @Param("thtre") String theatre, @Param("n") int roomNumber);


}
