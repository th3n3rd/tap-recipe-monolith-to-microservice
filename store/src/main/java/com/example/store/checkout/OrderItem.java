package com.example.store.checkout;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "order_items")
class OrderItem {

    @Id
    private UUID id;

    private String productId;
    private String productModel;
    private String productEdition;
    private BigDecimal productPrice;

    public OrderItem(
        String productId,
        String productModel,
        String productEdition,
        BigDecimal productPrice
    ) {
        this.id = UUID.randomUUID();
        this.productId = productId;
        this.productModel = productModel;
        this.productEdition = productEdition;
        this.productPrice = productPrice;
    }
}
