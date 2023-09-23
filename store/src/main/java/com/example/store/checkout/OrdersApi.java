package com.example.store.checkout;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@RequiredArgsConstructor
@Controller
class OrdersApi {

    private final Orders orders;

    @GetMapping("/admin/orders")
    String listOrders(Model model) {
        model.addAttribute("orders", orders.findAll());
        return "back-office/orders";
    }
}
