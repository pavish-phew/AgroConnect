package com.lokesh.ecom_proj.Oauth;

public class AuthResponse {
    private String token;        // Access token
    private String refreshToken; // Refresh token
    private String userId;       // User ID

    public AuthResponse(String token, String userId, String refreshToken) {
        if (token == null || token.isEmpty()) {
            throw new IllegalArgumentException("Access Token cannot be null or empty");
        }
        if (refreshToken == null || refreshToken.isEmpty()) {
            throw new IllegalArgumentException("Refresh Token cannot be null or empty");
        }
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }

        this.token = token;
        this.refreshToken = refreshToken;
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public String getUserId() {
        return userId;
    }

    @Override
    public String toString() {
        return "AuthResponse{" +
                "token='" + token + '\'' +
                ", refreshToken='" + refreshToken + '\'' +
                ", userId='" + userId + '\'' +
                '}';
    }
}
