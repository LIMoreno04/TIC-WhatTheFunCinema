package com.um.edu.uy.services;

import com.um.edu.uy.entities.User;
import com.um.edu.uy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepo;

    public List<User> getAll()
    {
        return userRepo.findAll();
    }

    public User addUser(String email, String name) {
        User newUser = User.builder()
                .email(email)
                .firstName(name)
                .build();
        return userRepo.save(newUser);
    }

}
