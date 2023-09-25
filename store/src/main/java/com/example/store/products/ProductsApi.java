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

    @GetMapping(value = "/products/{productId}", produces = "text/html")
    String product(@PathVariable String productId, @RequestParam(defaultValue = "standard") String edition, Model model) {
        model.addAttribute("productId", productId);
        model.addAttribute("edition", edition);
        return "storefront/product";
    }

    @GetMapping(value = "/products/{productId}", produces = "text/fragment+html")
    String productDetails(@PathVariable String productId, @RequestParam(defaultValue = "standard") String edition, Model model) {
        var product = productsCatalogue.findById(productId).orElseThrow();
        model.addAttribute("details", new ProductDetails(product, edition));
        return "storefront/product-details";
    }
}
