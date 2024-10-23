package com.um.edu.uy.services;

import com.um.edu.uy.entities.Snack;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.SnackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SnackService {

    @Autowired
    private SnackRepository snackRepo;

    public Snack addSnack(String snackName, String descrition) throws InvalidDataException {
        if (snackName == null || descrition == null) {
            throw new InvalidDataException("Datos invalidos.");
        }
        return null;
    }
}
