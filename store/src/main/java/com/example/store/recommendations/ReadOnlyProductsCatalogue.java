package com.example.store.recommendations;


import java.util.List;
import org.springframework.data.repository.Repository;

interface ReadOnlyProductsCatalogue extends Repository<RecommendableProduct, Long> {
    List<RecommendableProduct> findAllByIdIsNot(String productId);
}