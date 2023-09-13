package com.example.store;

import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@RequiredArgsConstructor
@Controller
class StoreApi {

    private final Environment env;

    @GetMapping("/")
    String index(Model model) {
        model.addAttribute("liveReload", env.matchesProfiles("default"));
        return "index";
    }

}
