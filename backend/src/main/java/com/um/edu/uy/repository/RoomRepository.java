package com.um.edu.uy.repository;

import com.um.edu.uy.entities.plainEntities.Room;
import com.um.edu.uy.entities.plainEntities.RoomID;
import com.um.edu.uy.entities.plainEntities.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, RoomID> {
    public Optional<List<Room>> findAllByTheatre(Theatre theatre);
}
