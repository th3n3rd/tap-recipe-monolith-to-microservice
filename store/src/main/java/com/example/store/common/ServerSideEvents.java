package com.example.store.common;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
public class ServerSideEvents {
    public static final SseEmitter.SseEventBuilder Heartbeat = SseEmitter.event().comment("heartbeat");
    private final List<SseEmitter> consumers = new CopyOnWriteArrayList<>();

    public SseEmitter newConsumer() {
        var consumer = new SseEmitter(120_000L);
        consumers.add(consumer);
        consumer.onCompletion(() -> consumers.remove(consumer));
        consumer.onTimeout(() -> consumers.remove(consumer));
        return consumer;
    }

    @EventListener
    public void on(DomainEvent event) {
        emit(domainEvent(event));
    }

    @Scheduled(fixedRate = 30_000)
    public void heartbeat() {
        emit(Heartbeat);
    }

    private SseEmitter.SseEventBuilder domainEvent(DomainEvent event) {
        return SseEmitter
            .event()
            .name(convertToEventName(event))
            .data(event);
    }

    private void emit(SseEmitter.SseEventBuilder message) {
        consumers.forEach(consumer -> {
            try {
                consumer.send(message);
            } catch (Exception e) {
                consumer.complete();
            }
        });
    }

    private String convertToEventName(DomainEvent event) {
        var className = event.getClass().getSimpleName();
        return className.replaceAll("([a-z])([A-Z]+)", "$1-$2").toLowerCase();
    }
}
