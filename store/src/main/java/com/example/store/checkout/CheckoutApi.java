package com.example.store.checkout;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

@RequiredArgsConstructor
@Controller
class CheckoutApi {

    private final ShoppingCart shoppingCart;
    private final Orders orders;
    private final ApplicationEventPublisher eventPublisher;

    @PostMapping("/checkout")
    String startCheckout() {
        var newOrder = shoppingCart.checkout();
        orders.save(newOrder);
        shoppingCart.empty();
        eventPublisher.publishEvent(new OrderPlaced(newOrder.getId()));
        return "redirect:/checkout/%s".formatted(newOrder.getId());
    }

    @PatchMapping("/checkout/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void selectPaymentMethod(@PathVariable UUID orderId, @RequestParam Order.PaymentMethod paymentMethod) {
        var order = orders.findById(orderId).orElseThrow();
        order.selectPaymentMethod(paymentMethod);
        orders.save(order);
        eventPublisher.publishEvent(new PaymentMethodSelected(
            order.getId(),
            order.getPaymentMethod()
        ));
    }

    @GetMapping(value = "/checkout/{orderId}")
    String inspectCheckout(@PathVariable UUID orderId, Model model) {
        var order = orders.findById(orderId).orElseThrow();
        model.addAttribute("order", order);
        return "storefront/checkout";
    }

}
