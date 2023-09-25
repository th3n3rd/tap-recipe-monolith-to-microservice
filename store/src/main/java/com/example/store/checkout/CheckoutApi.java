package com.example.store.checkout;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@RequiredArgsConstructor
@Controller
class CheckoutApi {

    private final ShoppingCart shoppingCart;
    private final Orders orders;

    @PostMapping("/checkout")
    String startCheckout() {
        var newOrder = shoppingCart.checkout();
        orders.save(newOrder);
        shoppingCart.empty();
        return "redirect:/checkout/%s".formatted(newOrder.getId());
    }

    @PostMapping("/checkout/{orderId}/payments")
    String selectPaymentMethod(@PathVariable UUID orderId, @ModelAttribute SelectPaymentMethod selectPaymentMethod) {
        var order = orders.findById(orderId).orElseThrow();
        order.selectPaymentMethod(selectPaymentMethod.paymentMethod);
        orders.save(order);
        return "redirect:/checkout/%s".formatted(orderId);
    }

    @GetMapping(value = "/checkout/{orderId}")
    String inspectCheckout(@PathVariable UUID orderId, Model model) {
        var order = orders.findById(orderId).orElseThrow();
        model.addAttribute("order", order);
        return "checkout";
    }

    record SelectPaymentMethod(Order.PaymentMethod paymentMethod) {}
}
