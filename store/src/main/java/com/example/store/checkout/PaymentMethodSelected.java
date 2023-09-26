package com.example.store.checkout;

import com.example.store.common.DomainEvent;
import java.util.UUID;

record PaymentMethodSelected(
    UUID orderId,
    Order.PaymentMethod paymentMethod
) implements DomainEvent {}
