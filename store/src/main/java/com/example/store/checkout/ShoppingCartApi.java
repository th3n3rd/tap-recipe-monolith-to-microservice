package com.example.store.checkout;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

@RequiredArgsConstructor
@Controller
class ShoppingCartApi {

    private final ShoppingCart shoppingCart;
    private final PricingBook pricingBook;
    private final PurchasableProductsCatalogue productsCatalogue;
    private final ApplicationEventPublisher eventPublisher;

    @PostMapping(value = "/cart")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void addItem(@ModelAttribute AddItem addItem) {
        var pricing = pricingBook.findByProductIdAndEdition(addItem.productId(), addItem.edition()).orElseThrow();
        var product = productsCatalogue.findById(addItem.productId()).orElseThrow();
        var item = new ShoppingCart.Item(pricing.getProductId(),
            product.getModel(),
            pricing.getEdition(),
            pricing.getPrice()
        );
        shoppingCart.add(item);
        eventPublisher.publishEvent(new ItemAddedToCart(item));
    }

    @DeleteMapping("/cart")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void clear() {
        shoppingCart.empty();
        eventPublisher.publishEvent(new CartCleared());
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

}
