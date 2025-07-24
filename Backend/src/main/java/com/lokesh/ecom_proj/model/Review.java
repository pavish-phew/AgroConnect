package com.lokesh.ecom_proj.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import java.util.Date;

@Document(collection = "reviews")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Review {

    @Id
    private String reviewId; 
    private String userName;
    private String productId; 

    private String userId;

    @Min(1)
    @Max(5)
    private int rating; 

    @NotEmpty(message = "Review text cannot be empty")
    private String reviewText;

    private Date timestamp;

    public Review(String productId, String userId, int rating, String reviewText) {
        this.productId = productId;
        this.userId = userId;
        this.rating = rating;
        this.reviewText = reviewText;
        this.timestamp = new Date();
    }

    public void setId(String reviewId2) {
        this.reviewId = reviewId2;
        throw new UnsupportedOperationException("Unimplemented method 'setId'");
    }
}
