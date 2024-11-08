package com.um.edu.uy.entities.ids;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomID implements Serializable {
    private String theatre;
    private int room_number;
}
