package com.um.edu.uy;

import com.um.edu.uy.controllers.UserRestController;
import com.um.edu.uy.entities.User;
import com.um.edu.uy.entities.UserDTO;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.services.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;

import java.util.logging.Handler;

@SpringBootApplication
public class TicWtfcinemaApplication {

	@Autowired
	private UserService userService;

	@Autowired
	private UserRestController userRestController;

	public static void main(String[] args) throws InvalidDataException {
		ApplicationContext ctx = SpringApplication.run(TicWtfcinemaApplication.class, args);
		TicWtfcinemaApplication app = ctx.getBean(TicWtfcinemaApplication.class);
		app.runInCommandLine();
	}

	public void runInCommandLine() throws InvalidDataException {

	}


}


