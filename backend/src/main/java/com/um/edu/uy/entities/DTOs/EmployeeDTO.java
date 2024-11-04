package com.um.edu.uy.entities.DTOs;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeDTO extends UserDTO {
    protected String Address;
}
