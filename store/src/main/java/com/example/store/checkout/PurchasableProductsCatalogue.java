package com.example.store.checkout;

import java.util.Optional;
import org.springframework.data.repository.Repository;

interface PurchasableProductsCatalogue extends Repository<PurchasableProduct, String> {
    Optional<PurchasableProduct> findById(String id);
}
