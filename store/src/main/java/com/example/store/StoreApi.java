package com.example.store;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
class StoreApi {

    @GetMapping("/")
    String index() {
        return "redirect:/products/eicher";
    }

}
