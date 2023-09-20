package com.example.store.checkout;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@RequiredArgsConstructor
@Controller
class CheckoutApi {

    private final ShoppingCart shoppingCart;

    @PostMapping("/checkout")
    String startCheckout() {
        shoppingCart.empty();
        return "redirect:/checkout/123";
    }

    @GetMapping(value = "/checkout/123", produces = "text/html")
    String completedCheckout() {
        return "checkout";
    }

    @GetMapping(value = "/checkout/123", produces = "text/fragment+html")
    String successfullyCompletedCheckout() {
        return "checkout-success";
    }
}
