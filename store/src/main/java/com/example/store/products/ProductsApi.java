package com.example.store.products;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
@RequiredArgsConstructor
class ProductsApi {

    private final ProductsCatalogue productsCatalogue;

    @GetMapping("/products/{productId}/{edition}")
    String productDetails(@PathVariable String productId, @PathVariable String edition, Model model) {
        model.addAttribute("product", productsCatalogue.findById(productId).orElseThrow());
        model.addAttribute("edition", edition);
        return "product";
    }

}
