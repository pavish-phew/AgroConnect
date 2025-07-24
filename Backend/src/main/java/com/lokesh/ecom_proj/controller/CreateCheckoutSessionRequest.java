package com.lokesh.ecom_proj.controller;

import com.lokesh.ecom_proj.model.Product;
import java.util.List;

public class CreateCheckoutSessionRequest {
    private List<Product> products;

    // Getters and setters for 'products'
    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
}
