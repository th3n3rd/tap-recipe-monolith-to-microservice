package com.example.store.checkout;

import com.example.store.common.DomainEvent;
import java.util.UUID;

record OrderPaid(UUID orderId) implements DomainEvent {}
