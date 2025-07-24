package com.lokesh.ecom_proj.Oauth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.lokesh.ecom_proj.model.User;
import com.lokesh.ecom_proj.repo.UserRepo;
import com.lokesh.ecom_proj.service.JWTService;

@Service
public class AuthService3 {

    @Autowired
    private UserRepo repo;

    @Autowired
    private JWTService jwtService;

    // BCrypt password encoder for secure password storage
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public User register(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        // Encode the password before saving the user
        user.setPassword(encoder.encode(user.getPassword()));

        repo.save(user);
        return user;
    }

    public AuthResponse verify(User user, String refreshToken) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        User foundUser = repo.findByMailId(user.getMailId());
        if (foundUser != null) {
            // Verify the username matches
            if (user.getUsername().equals(foundUser.getUsername())) {
                // Generate a new access token
                String token = jwtService.generateToken(foundUser.getUsername());

                // Update the refresh token if it's new
                if (refreshToken != null && !refreshToken.equals(foundUser.getRefreshToken())) {
                    foundUser.setRefreshToken(refreshToken);
                    repo.save(foundUser); // Save the updated user with the new refresh token
                }

                return new AuthResponse(token, foundUser.getId(), foundUser.getRefreshToken());
            } else {
                throw new RuntimeException("Bad Credentials");
            }
        } else {
            throw new RuntimeException("User Not Found");
        }
    }
}
