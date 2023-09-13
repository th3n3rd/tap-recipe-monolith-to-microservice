package com.example.store.products;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
class ProductsApi {

    private final ProductsCatalogue productsCatalogue;

    @GetMapping("/products/{productId}")
    String productDetails(@PathVariable String productId, @RequestParam(defaultValue = "standard") String edition, Model model) {
        model.addAttribute("product", productsCatalogue.findById(productId).orElseThrow());
        model.addAttribute("edition", edition);
        return "product";
    }

}
