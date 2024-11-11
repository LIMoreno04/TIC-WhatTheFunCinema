package com.um.edu.uy.entities.DTOs;

import com.um.edu.uy.entities.validators.ValidPassword;
import lombok.Data;

@Data
public class PasswordChangeDTO {
    @ValidPassword
    private String newPassword;

    private String oldPassword;
}
