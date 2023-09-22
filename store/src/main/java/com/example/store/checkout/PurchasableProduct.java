package com.example.store.checkout;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "products")
class PurchasableProduct {
    @Id
    private String id;

    private String model;
}
