package com.lokesh.ecom_proj.service;


import com.lokesh.ecom_proj.model.Review;
import com.lokesh.ecom_proj.model.User;
import com.lokesh.ecom_proj.repo.ReviewRepository;
import com.lokesh.ecom_proj.repo.UserRepo;
import com.lokesh.ecom_proj.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public List<Review> getReviewsByProductId(String productId) {
        return reviewRepository.findByProductId(productId);
    }

    @Override
    public Review addReview(Review review) {
        return reviewRepository.save(review);
    }

    @Override
    public Review getReviewById(String productId, String reviewId) {
        return reviewRepository.findByIdAndProductId(reviewId, productId);
    }

    @Override
    public Review updateReview(String productId, String reviewId, Review review) {
        review.setId(reviewId);
        review.setProductId(productId);
        return reviewRepository.save(review);
    }

    @Override
    public void deleteReview(String productId, String reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    @Autowired
    private UserRepo userrapo;

    public String getUserNameById(String userId) {
        return userrapo.findById(userId)
            .map(User::getUsername) 
            .orElse("Unknown User");
    }
}