package com.example.store.checkout;

import com.example.store.common.DomainEvent;
import java.util.UUID;

record OrderPlaced(UUID orderId) implements DomainEvent {}
