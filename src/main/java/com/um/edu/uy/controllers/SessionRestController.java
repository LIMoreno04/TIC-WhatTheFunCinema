package com.um.edu.uy.controllers;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SessionRestController {

    @GetMapping("/session")
    public String session(HttpSession session) {
        session.setAttribute("user", "JohnDoe");
        return "Session ID: " + session.getId();
    }

    @GetMapping("/session/user")
    public String getUser(HttpSession session) {

        return "User: " + session.getAttribute("user");
    }
}
