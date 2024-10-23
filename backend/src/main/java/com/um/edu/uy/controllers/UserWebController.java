package com.um.edu.uy.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/user")
public class UserWebController {

    @GetMapping("/signup")
    public String alta(){
        return "signup";
    }
}
