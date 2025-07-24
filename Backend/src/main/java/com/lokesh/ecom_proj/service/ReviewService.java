package com.lokesh.ecom_proj.service;

import com.lokesh.ecom_proj.model.Review;

import java.util.List;

public interface ReviewService {
    List<Review> getReviewsByProductId(String productId);
    Review addReview(Review review);
    Review getReviewById(String productId, String reviewId);
    Review updateReview(String productId, String reviewId, Review review);
    void deleteReview(String productId, String reviewId);
    String getUserNameById(String userId);
}
