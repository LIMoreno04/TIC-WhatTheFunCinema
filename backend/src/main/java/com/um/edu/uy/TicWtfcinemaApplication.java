package com.um.edu.uy;

import com.um.edu.uy.controllers.UserRestController;
import com.um.edu.uy.entities.plainEntities.Employee;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.services.EmployeeService;
import com.um.edu.uy.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import java.time.LocalDate;

@SpringBootApplication
public class TicWtfcinemaApplication {

	@Autowired
	private EmployeeService employeeService;

	@Autowired
	private UserRestController userRestController;

	public static void main(String[] args) throws InvalidDataException {
		ApplicationContext ctx = SpringApplication.run(TicWtfcinemaApplication.class, args);
		TicWtfcinemaApplication app = ctx.getBean(TicWtfcinemaApplication.class);
		app.runInCommandLine();
	}

	public void runInCommandLine() throws InvalidDataException {
		try {
			Employee admin = employeeService.findEmployee("admin@admin.com");
			System.out.println("Admin email: " + admin.getEmail() + "\nAdmin password: " + admin.getPassword());
		} catch (InvalidDataException e) {
			Employee admin = employeeService.addEmployee("admin@admin.com","admin","admin", LocalDate.of(1989,4,12),"+0","7777777","CI","Uruguay","00000000","Admin@admin777"," ");
			System.out.println("Admin email: " + admin.getEmail() + "\nAdmin password: " + admin.getPassword());
		}
	}


}


