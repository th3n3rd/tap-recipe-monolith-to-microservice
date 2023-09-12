package com.example.store.checkout;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RequiredArgsConstructor
@Controller
class PricingApis {

    private final PricingBook pricingBook;

    @GetMapping("/pricing/{productId}")
    String pricing(@PathVariable String productId, Model model) {
        model.addAttribute(
            "pricing",
            pricingBook.findByProductId(productId).orElseThrow()
        );
        return "checkout-buy";
    }

}
