package com.example.store.products;

import java.util.Optional;
import org.springframework.data.repository.Repository;

interface ProductsCatalogue extends Repository<Product, String> {
    Optional<Product> findById(String productId);
}
