package com.lokesh.ecom_proj.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;
import com.lokesh.ecom_proj.exception.ResourceNotFoundException;
import com.lokesh.ecom_proj.model.Product;
import com.lokesh.ecom_proj.model.User;
import com.lokesh.ecom_proj.repo.UserRepo;
import com.lokesh.ecom_proj.service.AuthService;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {
    
    @Autowired
    private UserRepo userrepo;

    @Autowired
    private AuthService userService;
    @GetMapping("/{userId}")
    public ResponseEntity<List<String>> getWishlist(@PathVariable String userId) {
        try {
            User user = userService.findById(userId);
            List<String> wishlist = user.getWishlist();
            System.out.println(wishlist);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(null); 
        }
    }
    
    @GetMapping("/products/{userId}")
public ResponseEntity<List<Product>> getWishlistProducts(@PathVariable String userId) {
    try {
        List<Product> products = userService.getWishlistProducts(userId);
        return ResponseEntity.ok(products);
    } catch (Exception e) {
        return ResponseEntity.status(404).body(null); 
    }
}


    @PostMapping("/{userId}")
    public ResponseEntity<?> updateWishlist(@PathVariable String userId, @RequestBody Map<String, String> request) {
        String productId = request.get("productId");
        boolean liked = Boolean.parseBoolean(request.get("liked"));

        if (liked) {
            addToWishlist(userId, productId);
        } else {
            removeFromWishlist(userId, productId);
        }
        return ResponseEntity.ok().build();
    }

    public void addToWishlist(String userId, String productId) {
        User user = userrepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!user.getWishlist().contains(productId)) {
            user.getWishlist().add(productId);
            userrepo.save(user);
        }
    }

    public void removeFromWishlist(String userId, String productId) {
        User user = userrepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.getWishlist().remove(productId);
        userrepo.save(user);
    }
}
