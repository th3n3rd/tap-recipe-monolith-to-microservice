package com.example.store.products;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
interface ProductsCatalogue extends JpaRepository<Product, String> {}
