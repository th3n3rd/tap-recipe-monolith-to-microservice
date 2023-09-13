package com.example.store.checkout;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@RequiredArgsConstructor
@Controller
class ShoppingCartApis {

    private final ShoppingCart shoppingCart = new ShoppingCart();
    private final PricingBook pricingBook;

    @PostMapping(value = "/cart")
    ResponseEntity<?> addItem(@ModelAttribute AddItem addItem) {
        var pricing = pricingBook.findByProductIdAndEdition(addItem.productId(), addItem.edition()).orElseThrow();
        shoppingCart.add(new ShoppingCart.Item(pricing.getProductId(), pricing.getPrice()));
        return ResponseEntity
            .noContent()
            .header("HX-Trigger", "update-cart")
            .build();
    }

    @DeleteMapping("/cart")
    ResponseEntity<?> clear() {
        shoppingCart.empty();
        return ResponseEntity
            .noContent()
            .header("HX-Trigger", "update-cart")
            .build();
    }

    @GetMapping("/cart")
    String listItems(Model model) {
        model.addAttribute("cart", shoppingCart);
        return "checkout-minicart";
    }

    record AddItem(String productId, String edition) {}
}
