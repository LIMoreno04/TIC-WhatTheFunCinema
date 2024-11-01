package com.um.edu.uy.entities.plainEntities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScreeningID implements Serializable {
    private RoomID room;
    private LocalDateTime date_and_time;
}
