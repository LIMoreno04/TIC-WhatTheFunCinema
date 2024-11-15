package com.um.edu.uy.repository;

import com.um.edu.uy.entities.plainEntities.Movie;
import com.um.edu.uy.entities.plainEntities.Room;
import com.um.edu.uy.entities.plainEntities.Screening;
import com.um.edu.uy.entities.ids.ScreeningID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ScreeningRepository extends JpaRepository<Screening, ScreeningID> {

//    @Query("""
//        SELECT CASE WHEN COUNT(s) = 0 THEN TRUE ELSE FALSE END
//        FROM Screening s
//        WHERE s.theatre = :theatre
//          AND s.roomNumber = :roomNumber
//          AND (
//              s.date_and_time BETWEEN :startDateTime AND :endDateTime
//              OR s.date_and_time + s.duration BETWEEN :startDateTime AND :endDateTime
//              OR :startDateTime BETWEEN s.date_and_time AND s.date_and_time + s.duration
//          )
//    """)
//    boolean isAvailable(
//            @Param("theatre") String theatre,
//            @Param("roomNumber") int roomNumber,
//            @Param("startDateTime") LocalDateTime startDateTime,
//            @Param("endDateTime") LocalDateTime endDateTime
//    );


}
