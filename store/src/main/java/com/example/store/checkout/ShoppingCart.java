package com.example.store.checkout;

import static java.math.BigDecimal.ZERO;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Repository;

@Repository
class ShoppingCart {
    private final List<Item> items = new ArrayList<>();
    private BigDecimal total = ZERO;

    void add(Item item) {
        items.add(item);
        total = total.add(item.price);
    }

    public int size() {
        return items.size();
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }

    public BigDecimal total() {
        return total;
    }

    public void empty() {
        items.clear();
        total = ZERO;
    }

    public Order checkout() {
        return new Order(
            items
                .stream()
                .map(it -> new OrderItem(
                    it.productId,
                    it.edition,
                    it.price
                ))
                .collect(Collectors.toSet())
        );
    }

    record Item(String productId, String edition, BigDecimal price) {}
}
