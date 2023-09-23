package com.example.store;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
class BackOfficeApi {

    @GetMapping("/admin")
    String index() {
        return "redirect:/admin/orders";
    }

}
