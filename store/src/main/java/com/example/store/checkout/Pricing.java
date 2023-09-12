package com.example.store.checkout;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity(name = "pricing")
class Pricing {
    @Id
    private Long id;

    private String productId;
    private String price;
}
