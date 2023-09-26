package com.example.store.checkout;

import com.example.store.common.DomainEvent;

record ItemAddedToCart(ShoppingCart.Item item) implements DomainEvent {}
