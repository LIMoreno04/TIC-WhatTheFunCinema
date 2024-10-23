package com.um.edu.uy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class TicWtfcinemaApplication {

	public static void main(String[] args) {
		ApplicationContext ctx = SpringApplication.run(TicWtfcinemaApplication.class, args);
		TicWtfcinemaApplication app = ctx.getBean(TicWtfcinemaApplication.class);
	}

}


