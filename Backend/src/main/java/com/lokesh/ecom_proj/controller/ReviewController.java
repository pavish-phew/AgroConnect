package com.lokesh.ecom_proj.controller;

import com.lokesh.ecom_proj.model.Review;
import com.lokesh.ecom_proj.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<Review>> getReviews(@PathVariable String productId) {
        System.out.println(productId);
        List<Review> reviews = reviewService.getReviewsByProductId(productId);
        System.out.println("This is the product's review : "+reviews);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping
public ResponseEntity<?> addReview(@PathVariable String productId, @RequestBody Review review) {
    review.setTimestamp(new Date());
    review.setUserName(reviewService.getUserNameById(review.getUserId()));
    if (review == null || review.getRating() <= 0 || review.getReviewText() == null || review.getReviewText().isEmpty()) {
        return ResponseEntity.badRequest().body("Invalid review data.");
    }

    review.setProductId(productId); 
    System.out.println(review);
    
    try {
        Review savedReview = reviewService.addReview(review);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving review.");
    }
}


    @GetMapping("/{reviewId}")
    public ResponseEntity<Review> getReviewById(@PathVariable String productId, @PathVariable String reviewId) {
        Review review = reviewService.getReviewById(productId, reviewId);
        return ResponseEntity.ok(review);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<Review> updateReview(@PathVariable String productId, @PathVariable String reviewId, @RequestBody Review review) {
        Review updatedReview = reviewService.updateReview(productId, reviewId, review);
        return ResponseEntity.ok(updatedReview);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable String productId, @PathVariable String reviewId) {
        reviewService.deleteReview(productId, reviewId);
        return ResponseEntity.noContent().build();
    }
}
