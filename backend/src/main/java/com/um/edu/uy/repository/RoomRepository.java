package com.um.edu.uy.repository;

import com.um.edu.uy.entities.plainEntities.Room;
import com.um.edu.uy.entities.plainEntities.RoomID;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, RoomID> {
    public List<Room> findAllByTheatre(String theatre);
}
