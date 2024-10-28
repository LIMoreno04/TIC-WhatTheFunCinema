package com.um.edu.uy.repository;

import com.um.edu.uy.entities.Room;
import com.um.edu.uy.entities.RoomID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, RoomID> {
    //public findBiRoomId(String theatre, int room_number);
}
