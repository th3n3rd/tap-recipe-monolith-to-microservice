package com.example.store.recommendations;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RequiredArgsConstructor
@Controller
class RecommendationsApi {

    private final ReadOnlyProductsCatalogue productsCatalogue;

    @GetMapping("/recommendations/{productId}")
    String listProducts(@PathVariable String productId, Model model) {
        model.addAttribute("products", productsCatalogue.findAllByIdIsNot(productId));
        return "recommendations";
    }

}
