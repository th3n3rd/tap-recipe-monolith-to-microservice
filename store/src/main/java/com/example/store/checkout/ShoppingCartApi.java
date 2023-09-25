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
class ShoppingCartApi {

    private final ShoppingCart shoppingCart;
    private final PricingBook pricingBook;
    private final PurchasableProductsCatalogue productsCatalogue;

    @PostMapping(value = "/cart")
    ResponseEntity<?> addItem(@ModelAttribute AddItem addItem) {
        var pricing = pricingBook.findByProductIdAndEdition(addItem.productId(), addItem.edition()).orElseThrow();
        var product = productsCatalogue.findById(addItem.productId()).orElseThrow();
        shoppingCart.add(new ShoppingCart.Item(
            pricing.getProductId(),
            product.getModel(),
            pricing.getEdition(),
            pricing.getPrice())
        );
        return event("item-added-to-cart");
    }

    @DeleteMapping("/cart")
    ResponseEntity<?> clear() {
        shoppingCart.empty();
        return event("cart-cleared");
    }

    @GetMapping(value = "/cart", produces = "text/fragment+html")
    String summary(Model model) {
        model.addAttribute("cart", shoppingCart);
        return "storefront/checkout-minicart";
    }

    @GetMapping(value = "/cart", produces = "text/html")
    String listItems(Model model) {
        model.addAttribute("cart", shoppingCart);
        return "storefront/checkout-fullcart";
    }

    record AddItem(String productId, String edition) {}

    private ResponseEntity<Object> event(String event) {
        return ResponseEntity
            .noContent()
            .header("HX-Trigger", "cart-updated", event)
            .build();
    }
}
