package com.example.store.products;

record ProductDetails(Product product, String edition) {
    String productId() {
        return product.getId();
    }

    String model() {
        return product.getModel();
    }

    String imageUrl() {
        return isPlatinum() ? product.getPlatinumImageUrl() : product.getImageUrl();
    }

    boolean isPlatinum() {
        return "platinum".equals(edition);
    }

    String otherEdition() {
        return isPlatinum() ? "standard" : "platinum";
    }

    String platinumImageUrl() {
        return product.getPlatinumImageUrl();
    }
}
