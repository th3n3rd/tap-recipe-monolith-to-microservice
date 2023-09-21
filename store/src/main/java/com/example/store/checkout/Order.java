package com.example.store.checkout;

import static java.math.BigDecimal.ZERO;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "orders")
class Order {
    @Id
    private UUID id;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "order_id", nullable = false)
    private Set<OrderItem> items;

    private BigDecimal totalAmount;

    public Order(Set<OrderItem> items) {
        this.id = UUID.randomUUID();
        this.items = items;
        this.totalAmount = ZERO;
        for (var item : items) {
            this.totalAmount = this.totalAmount.add(item.getProductPrice());
        }
    }
}
