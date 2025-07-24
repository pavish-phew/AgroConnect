package com.lokesh.ecom_proj.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.lokesh.ecom_proj.model.Product;
import com.lokesh.ecom_proj.model.User;
import com.lokesh.ecom_proj.repo.ProductRepo;
import com.lokesh.ecom_proj.repo.UserRepo;
import com.lokesh.ecom_proj.service.JWTService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private UserRepo userRepo; 
    @Autowired
    private ProductRepo productRepo; 
    @Autowired
    private JWTService jwtService;

    @PutMapping("/update-username/{userId}")
    public ResponseEntity<User> updateProfileName(
            @PathVariable String userId, 
            @RequestBody String username) {

        System.out.println("User ID: " + userId + ", New Username: " + username);
        User user = userRepo.getUserById(userId);
        user.setUsername(username);
        userRepo.save(user); 
        return ResponseEntity.ok(user);
    }
    @GetMapping
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            String username = jwtService.extractUserName(token);
            User user = userRepo.findByUsername(username);
            if (user == null) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }
            List<Product> products = productRepo.findByUserId(user.getId());
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("products", products);

            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/upload-photo")
    public ResponseEntity<String> uploadProfilePhoto(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        try {
            String authorizationHeader = request.getHeader("Authorization");
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7);
                String username = jwtService.extractUserName(token);
                User user = userRepo.findByUsername(username);
                if (user == null) {
                    return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
                }
                user.setImageName(file.getOriginalFilename());
                user.setImageType(file.getContentType());
                user.setImageData(file.getBytes());
                userRepo.save(user);

                return ResponseEntity.ok("Profile image uploaded successfully");
            }

            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image");
        }
    }

    @GetMapping("/profile-photo")
public ResponseEntity<Map<String, String>> getProfilePhoto(HttpServletRequest request) {
    String authorizationHeader = request.getHeader("Authorization");

    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
        String token = authorizationHeader.substring(7);
        String username = jwtService.extractUserName(token);
        User user = userRepo.findByUsername(username);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (user.getImageData() != null) {
            String base64Image = java.util.Base64.getEncoder().encodeToString(user.getImageData());
            Map<String, String> response = new HashMap<>();
            response.put("imageType", user.getImageType());
            response.put("imageData", base64Image);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
}

}
