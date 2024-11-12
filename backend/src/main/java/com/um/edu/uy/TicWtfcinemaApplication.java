package com.um.edu.uy;

import com.um.edu.uy.controllers.UserRestController;
import com.um.edu.uy.entities.plainEntities.Employee;
import com.um.edu.uy.entities.plainEntities.Genre;
import com.um.edu.uy.entities.plainEntities.Movie;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.services.CustomerService;
import com.um.edu.uy.services.EmployeeService;
import com.um.edu.uy.services.MovieService;
import com.um.edu.uy.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

@SpringBootApplication
public class TicWtfcinemaApplication {

	@Autowired
	private EmployeeService employeeService;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private MovieService movieService;

	public static void main(String[] args) throws InvalidDataException, IOException {
		ApplicationContext ctx = SpringApplication.run(TicWtfcinemaApplication.class, args);
		TicWtfcinemaApplication app = ctx.getBean(TicWtfcinemaApplication.class);
		app.runInCommandLine();
	}

	public void runInCommandLine() throws InvalidDataException, IOException {
		try {
			Employee admin = employeeService.findEmployee("admin@admin.com");
			System.out.println("Admin email: " + admin.getEmail() + "\nAdmin password: " + admin.getPassword());
		} catch (InvalidDataException e) {
			Employee admin = employeeService.addEmployee("admin@admin.com", "admin", "admin", LocalDate.of(1989, 4, 12), "+0", "7777777", "CI", "Uruguay", "00000000", "Admin@admin777", " ");
			System.out.println("Admin email: " + admin.getEmail() + "\nAdmin password: " + admin.getPassword());
		}
	}

	public byte[] loadPosterFromFile(String filePath) throws IOException {
		File file = new File(filePath);
		return Files.readAllBytes(file.toPath());
	}

	public static void retrievePoster(int movieId) {
		String url = "jdbc:postgresql://proy-tic1.c50wqgs4suxk.us-east-1.rds.amazonaws.com:5432/proy-tic1";
		String user = "tic1grp13";
		String password = "tic1grp13";
		String query = "SELECT lo_get(poster) AS poster_data FROM movie WHERE id = ?";

		try (Connection conn = DriverManager.getConnection(url, user, password);
			 PreparedStatement stmt = conn.prepareStatement(query)) {

			// Establece el id de la película
			stmt.setInt(1, movieId);
			ResultSet rs = stmt.executeQuery();

			if (rs.next()) {
				byte[] posterData = rs.getBytes("poster_data");

				if (posterData != null) {
					// Guardar el póster en un archivo
					try (FileOutputStream fos = new FileOutputStream("alien_poster.jpg")) {
						fos.write(posterData);
						System.out.println("Imagen descargada como alien_poster.jpg");
					}
				} else {
					System.out.println("No se encontró póster para esta película.");
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}


