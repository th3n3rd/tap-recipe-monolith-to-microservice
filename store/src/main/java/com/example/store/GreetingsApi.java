package com.example.store;

import java.util.List;
import java.util.Random;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
class GreetingsApi {

    private final GreetingsRepository greetingsRepository;

    GreetingsApi(GreetingsRepository greetingsRepository) {
        this.greetingsRepository = greetingsRepository;
    }

    @GetMapping("/greeting")
    public String greet(Model model) {
        var greetings = greetingsRepository.findAll();
        model.addAttribute("greeting", greetings.get(randomIndexIn(greetings)));
        return "greeting";
    }

    private int randomIndexIn(List<Greeting> greetings) {
        return new Random().nextInt(greetings.size());
    }
}
