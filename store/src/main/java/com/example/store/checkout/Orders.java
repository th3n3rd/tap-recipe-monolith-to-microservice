package com.example.store.checkout;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.repository.Repository;

interface Orders extends Repository<Order, UUID> {
    Optional<Order> findById(UUID orderId);
    void save(Order order);
}
