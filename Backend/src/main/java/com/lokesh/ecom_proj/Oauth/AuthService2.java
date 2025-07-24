package com.lokesh.ecom_proj.Oauth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.lokesh.ecom_proj.task.configurer;

import java.util.concurrent.CompletableFuture;

@Service
public class AuthService2 {

    @Value("${chronify.google.oauth.token_uri}")
    private String tokenUri;

    private String clientSecret = configurer.getGoogleClientSecret();
    private String clientId = configurer.getGoogleClientKey();

    @Value("${chronify.google.oauth.redirect_uri}")
    private String redirectUri;

    private final WebClient webClient;

    // Constructor Injection for WebClient
    public AuthService2(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(tokenUri).build();
    }

    public GoogleOAuthTokenResponse getGoogleOAuthTokens(String code) {
        try {
            // Token request
            GoogleOAuthTokenResponse tokenResponse = webClient.post()
                    .uri(uriBuilder -> uriBuilder.path("")
                            .queryParam("code", code)
                            .queryParam("client_id", clientId)
                            .queryParam("client_secret", clientSecret)
                            .queryParam("redirect_uri", redirectUri)
                            .queryParam("grant_type", "authorization_code")
                            .build())
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .retrieve()
                    .bodyToMono(GoogleOAuthTokenResponse.class)
                    .block(); // Blocking here as it waits for the token response

            if (tokenResponse != null) {
                System.out.println("Access Token: " + tokenResponse.getAccessToken());
                System.out.println("Refresh Token: " + tokenResponse.getRefreshToken());
                System.out.println("ID Token: " + tokenResponse.getIdToken());
            }

            return tokenResponse;
        } catch (Exception e) {
            System.out.println("Error in AuthService while getting tokens: " + e.getMessage());
            return null;
        }
    }

    public CompletableFuture<String> getGoogleUserInfo(String idToken, String accessToken) {
        String googleDataUrl = "https://www.googleapis.com/oauth2/v1/userinfo";
        try {
            return CompletableFuture.supplyAsync(() -> {
                try {
                    return webClient.get()
                            .uri(uriBuilder -> uriBuilder.path(googleDataUrl)
                                    .queryParam("alt", "json")
                                    .queryParam("access_token", accessToken)
                                    .build())
                            .header("Authorization", "Bearer " + idToken)
                            .retrieve()
                            .bodyToMono(String.class)
                            .block(); // Blocking here for simplicity, use non-blocking in production if needed
                } catch (Exception e) {
                    System.out.println("Error getting Google user info: " + e.getMessage());
                    return null;
                }
            });
        } catch (Exception e) {
            System.out.println("Error in getGoogleUserInfo method: " + e.getMessage());
            return CompletableFuture.completedFuture(null);
        }
    }
}
