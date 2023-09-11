package com.example.store;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity(name = "greetings")
public class Greeting {
    @Id
    private Long id;
    private String message;
}
