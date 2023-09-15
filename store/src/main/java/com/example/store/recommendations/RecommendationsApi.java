package com.example.store.recommendations;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RequiredArgsConstructor
@Controller
class RecommendationsApi {

    private final ReadOnlyProductsCatalogue productsCatalogue;

    @GetMapping(value = "/recommendations", produces = "text/fragment+html")
    String listProducts(@RequestParam String productId, Model model) {
        model.addAttribute("products", productsCatalogue.findAllByIdIsNot(productId));
        return "recommendations";
    }

}
