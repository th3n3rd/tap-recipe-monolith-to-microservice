package com.example.store;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class MonolithStoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(MonolithStoreApplication.class, args);
	}

}
