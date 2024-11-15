package com.um.edu.uy.repository;

import com.um.edu.uy.entities.plainEntities.Room;
import com.um.edu.uy.entities.ids.RoomID;
import com.um.edu.uy.entities.plainEntities.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, RoomID> {

    @Query("SELECT r.room_number FROM Room r WHERE r.theatre = :t ")
    public Optional<List<Integer>> findNumbersByTheatre(@Param("t") Theatre theatre);

    @Query("SELECT r FROM Room r WHERE r.theatre = :t AND r.room_number = :n")
    public Optional<Room> findByTheatreAndRoomNumber(@Param("t") Theatre theatre, @Param("n") int roomNumber);
}
