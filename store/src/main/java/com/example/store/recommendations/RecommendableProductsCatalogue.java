package com.example.store.recommendations;


import java.util.List;
import org.springframework.data.repository.Repository;

interface RecommendableProductsCatalogue extends Repository<RecommendableProduct, String> {
    List<RecommendableProduct> findAllByIdIsNot(String productId);
}
