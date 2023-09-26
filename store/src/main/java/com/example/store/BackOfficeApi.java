package com.example.store;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RequiredArgsConstructor
@Controller
class BackOfficeApi {

    private final ServerSideEvents events;

    @GetMapping("/admin")
    String index() {
        return "redirect:/admin/orders";
    }

    @GetMapping(value = "/admin/sse", produces = "text/event-stream")
    SseEmitter listenForEvents() {
        return events.newConsumer();
    }
}
