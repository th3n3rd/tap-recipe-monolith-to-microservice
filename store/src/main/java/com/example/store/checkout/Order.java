package com.example.store.checkout;

import static java.math.BigDecimal.ZERO;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
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
    @OrderBy(value = "productModel asc")
    private Set<OrderItem> items;

    @Enumerated(EnumType.STRING)
    private State state;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private BigDecimal totalAmount;

    public Order(Set<OrderItem> items) {
        this.id = UUID.randomUUID();
        this.state = State.Placed;
        this.paymentMethod = PaymentMethod.Unspecified;
        this.items = items;
        this.totalAmount = ZERO;
        for (var item : items) {
            this.totalAmount = this.totalAmount.add(item.getProductPrice());
        }
    }

    public void selectPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public boolean isPaymentMethodSpecified() {
        return !paymentMethod.equals(PaymentMethod.Unspecified);
    }

    enum State {
        Unmanaged,
        Placed
    }

    enum PaymentMethod {
        Unspecified,
        OverThePhone
    }
}
