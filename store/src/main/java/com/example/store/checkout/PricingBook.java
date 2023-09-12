package com.example.store.checkout;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
interface PricingBook extends JpaRepository<Pricing, Long> {
    Optional<Pricing> findByProductId(String productId);
}
