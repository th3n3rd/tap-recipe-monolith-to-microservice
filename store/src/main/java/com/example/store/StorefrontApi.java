package com.example.store;

import com.example.store.common.ServerSideEvents;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RequiredArgsConstructor
@Controller
class StorefrontApi {

    private final ServerSideEvents events;

    @GetMapping("/")
    String index() {
        return "redirect:/products/eicher";
    }

    @GetMapping(value = "/sse", produces = "text/event-stream")
    SseEmitter listenForEvents() {
        return events.newConsumer();
    }
}
