package com.lokesh.ecom_proj.model;

import java.util.*;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// @Document
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user")
public class User {

    @Id
    private String id;
    private String username;
    private String password;
    private String mailId;
    private List<CartItem> cart = new ArrayList<>();


    private String imageName;     
    private String imageType;     
    private byte[] imageData;    

    private List<String> wishlist = new ArrayList<>();  

    private String refreshToken;
}
