package com.lokesh.ecom_proj.repo;


import com.lokesh.ecom_proj.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByProductId(String productId);
    Review findByIdAndProductId(String id, String productId);
}