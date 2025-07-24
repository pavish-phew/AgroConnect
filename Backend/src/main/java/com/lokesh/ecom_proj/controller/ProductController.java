package com.lokesh.ecom_proj.controller;

import com.lokesh.ecom_proj.model.Product;
import com.lokesh.ecom_proj.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductService service;

    // Get products by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Product>> getProductsByUserId(@PathVariable String userId) {
        List<Product> products = service.getProductsByUserId(userId);
        return products.isEmpty() ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Get all products
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return new ResponseEntity<>(service.getAllProducts(), HttpStatus.OK);
    }

    // Get product by ID
    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable String id) {
        Product product = service.getProductById(id);
        return product != null ? new ResponseEntity<>(product, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Add new product
    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestPart Product product,
                                        @RequestPart MultipartFile imageFile, String userId) {
        try {
            Product addedProduct = service.addProduct(product, imageFile, userId);
            return new ResponseEntity<>(addedProduct, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get product image by product ID
    @GetMapping("/product/{productId}/image")
    public ResponseEntity<byte[]> getImageByProductId(@PathVariable String productId) {
        Product product = service.getProductById(productId);
        if (product == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        byte[] imageFile = product.getImageDate();
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(product.getImageType()))
                .body(imageFile);
    }

    // Update product by ID
    @PutMapping("/product/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable String id, 
                                                @RequestPart Product product,
                                                @RequestPart MultipartFile imageFile, String currentUserId) {
        if (!currentUserId.equals(product.getUserId())) {
            return new ResponseEntity<>("You do not have permission to update this product", HttpStatus.FORBIDDEN);
        }

        try {
            Product updatedProduct = service.updateProduct(id, product, imageFile);
            return updatedProduct != null ? new ResponseEntity<>("Product updated successfully", HttpStatus.OK)
                                          : new ResponseEntity<>("Product update failed", HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to update product image", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete product by ID
    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable String id) {
        Product product = service.getProductById(id);
        if (product != null) {
            service.deleteProduct(id);
            return new ResponseEntity<>("Product deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        }
    }

    // Search products by keyword
    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        List<Product> products = service.searchProducts(keyword);
        return products.isEmpty() ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Increment product view count
    @PostMapping("products/{id}/view")
    public ResponseEntity<Product> viewProduct(@PathVariable String id) {
        Product updatedProduct = service.incrementViewCount(id);
        return updatedProduct != null ? ResponseEntity.ok(updatedProduct) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
