package com.um.edu.uy.entities.ids;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Generated;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomID implements Serializable {
    private String theatre;
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int room_number;
}
