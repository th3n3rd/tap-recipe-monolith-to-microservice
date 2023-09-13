package com.example.store.recommendations;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "products")
class RecommendableProduct {
    @Id
    private String id;
    private String model;
    private String imageUrl;
}
