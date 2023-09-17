package com.example.store.checkout;

import java.util.Optional;
import org.springframework.data.repository.Repository;

interface PricingBook extends Repository<Pricing, Long> {
    Optional<Pricing> findByProductIdAndEdition(String productId, String edition);
}
