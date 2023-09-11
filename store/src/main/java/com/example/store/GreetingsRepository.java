package com.example.store;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GreetingsRepository extends JpaRepository<Greeting, Long> {}
