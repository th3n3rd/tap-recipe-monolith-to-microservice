package com.example.store.checkout;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RequiredArgsConstructor
@Controller
class PricingApis {

    private final PricingBook pricingBook;

    @GetMapping(value = "/pricing/{productId}", produces = "text/fragment+html")
    String pricing(@PathVariable String productId, @RequestParam(defaultValue = "standard") String edition, Model model) {
        model.addAttribute(
            "pricing",
            pricingBook.findByProductIdAndEdition(productId, edition).orElseThrow()
        );
        model.addAttribute("edition", edition);
        return "checkout-buy";
    }

}
