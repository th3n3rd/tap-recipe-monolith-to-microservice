package com.example.store.products;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "products")
class Product {
    @Id
    private String id;

    private String model;
    private String imageUrl;
    private String platinumImageUrl;
}
