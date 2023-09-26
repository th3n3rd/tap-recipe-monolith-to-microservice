package com.example.store.checkout;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

@RequiredArgsConstructor
@Controller
class OrdersApi {

    private final Orders orders;
    private final ApplicationEventPublisher eventPublisher;

    @GetMapping("/admin/orders")
    String listOrders(Model model) {
        model.addAttribute("orders", orders.findAll());
        return "back-office/orders";
    }

    @PatchMapping("/admin/orders/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void markAs(@PathVariable UUID orderId, @RequestParam Order.State state) {
        var order = orders.findById(orderId).orElseThrow();
        order.markAs(state);
        orders.save(order);
        eventPublisher.publishEvent(new OrderPaid(order.getId()));
    }
}
