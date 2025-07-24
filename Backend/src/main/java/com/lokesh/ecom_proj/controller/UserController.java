package com.lokesh.ecom_proj.controller;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lokesh.ecom_proj.Oauth.AuthService2;
import com.lokesh.ecom_proj.Oauth.AuthService3;
import com.lokesh.ecom_proj.Oauth.GoogleOAuthTokenResponse;
import com.lokesh.ecom_proj.model.User;
import com.lokesh.ecom_proj.repo.UserRepo;
import com.lokesh.ecom_proj.service.AuthResponse;
import com.lokesh.ecom_proj.service.AuthService;
import com.lokesh.ecom_proj.service.JWTService;
import com.lokesh.ecom_proj.service.MyUserDetailsService;
import com.lokesh.ecom_proj.task.configurer;

import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import java.util.*;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@RestController
public class UserController {

    @Value("${chronify.google.oauth.redirect_uri}")
    private String redirectUri;

    @Value("${chronify.google.oauth.auth_uri}")
    private String authUri;

    // @Value("${chronify.google.oauth.client_id}")
    // private String clientId;
    
    private String clientId = configurer.getGoogleClientKey();
    
    private String clientSecret = configurer.getGoogleClientSecret();
    // @Value("${chronify.google.oauth.client_secret}")
    // private String clientSecret;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepo userrepo;

    @Autowired
    private JWTService jwtservice;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @GetMapping("/")
    public String getMethodName() {
        return "Hello";
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return authService.register(user);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody User user) {
        AuthResponse authResponse = authService.verify(user);
        return ResponseEntity.ok(authResponse);
    }

    @CrossOrigin(origins = "http://172.16.2.211:5173", allowedHeaders = "*", methods = { RequestMethod.GET,
            RequestMethod.OPTIONS })
    @GetMapping("/login")
    public Map<String, String> login() {
        try {
            StringBuilder queryString = new StringBuilder();
            queryString.append("redirect_uri=")
                    .append(URLEncoder.encode(redirectUri, StandardCharsets.UTF_8))
                    .append("&client_id=").append(URLEncoder.encode(clientId, StandardCharsets.UTF_8))
                    .append("&scope=").append(URLEncoder.encode("email profile openid", StandardCharsets.UTF_8))
                    .append("&access_type=offline")
                    .append("&response_type=code")
                    .append("&prompt=consent");

            URI uri = URI.create(authUri + "?" + queryString.toString());

            Map<String, String> response = new HashMap<>();
            response.put("url", uri.toString());
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.singletonMap("error", "Error generating URL");
        }
    }

    @Autowired
    private AuthService2 authServic2;

    @Autowired
    private AuthService3 authServic3;

    @PostMapping("/oauth/google")
    public ResponseEntity<Map<String, Object>> handleGoogleCallback(@RequestParam String code) {
        Map<String, Object> response = new HashMap<>();

        System.out.println("code : " + code);
        try {
            // Use the service to get tokens
            GoogleOAuthTokenResponse tokenResponse = authServic2.getGoogleOAuthTokens(code);

            if (tokenResponse != null) {
                // Extract user info from token response
                String userInfoJson = authServic2
                        .getGoogleUserInfo(tokenResponse.getIdToken(), tokenResponse.getAccessToken()).get();

                // Parse the userInfo JSON into an object
                Map<String, Object> userInfo = new ObjectMapper().readValue(userInfoJson, HashMap.class);

                String email = (String) userInfo.get("email");
                String name = (String) userInfo.get("name");
                String picture = (String) userInfo.get("picture");

                // Check if the user already exists in the database
                User existingUser = userrepo.findByMailId(email);
                if (existingUser == null) {
                    // If user does not exist, create a new user
                    User newUser = new User();
                    newUser.setMailId(email);
                    newUser.setUsername(name);
                    newUser.setImageName(picture);
                    newUser.setRefreshToken(tokenResponse.getRefreshToken());

                    // Save user to MongoDB
                    userrepo.save(newUser);
                } else {
                    // If user exists, update their details (optional)
                    try {
                        byte[] imageBytes = convertImageToBytes(picture);
                        existingUser.setUsername(name);
                        existingUser.setImageName(picture);
                    } catch (IOException e) {
                        e.printStackTrace();
                        // Handle error
                    }
                    userrepo.save(existingUser);
                }
                com.lokesh.ecom_proj.Oauth.AuthResponse authResponse = authServic3.verify(existingUser, tokenResponse.getRefreshToken());
                System.out.println("JWT TOKEN : " + authResponse.getToken());
                response.put("userInfo", userInfo); // Add user info to response
                response.put("message", "Login successful");
                response.put("authResponse", authResponse);
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            System.out.println("Error In Getting id_tokens: " + e.getMessage());
            response.put("error", "Failed to login with Google");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        response.put("error", "Invalid Google login attempt");
        return ResponseEntity.badRequest().body(response);
    }

    public byte[] convertImageToBytes(String imageUrl) {
        try {
            URL url = new URL(imageUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoInput(true);
            connection.connect();

            try (InputStream input = connection.getInputStream();
                    ByteArrayOutputStream output = new ByteArrayOutputStream()) {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = input.read(buffer)) != -1) {
                    output.write(buffer, 0, bytesRead);
                }
                return output.toByteArray();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } 
    }

    @GetMapping("/getusername/{userId}")
    public String getUsername(@PathVariable String userId) {
        User user = userrepo.getUserById(userId);
        return user != null ? user.getUsername() : "User not found";
    }

    @PostMapping("/jwtcheck")
    public ResponseEntity<?> jwtCheck(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String username = jwtservice.extractUserName(token);
            if (username != null) {
                UserDetails userDetails = myUserDetailsService.loadUserByUsername(username);
                if (jwtservice.validateToken(token, userDetails)) {
                    return ResponseEntity.ok(Collections.singletonMap("message", "JWT token is valid."));
                }
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
    }

}

// package com.lokesh.ecom_proj.controller;

// import java.util.Collections;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;

// import com.lokesh.ecom_proj.model.User;
// import com.lokesh.ecom_proj.repo.UserRepo;
// import com.lokesh.ecom_proj.service.AuthResponse;
// import com.lokesh.ecom_proj.service.AuthService;
// import com.lokesh.ecom_proj.service.JWTService;
// import com.lokesh.ecom_proj.service.MyUserDetailsService;

// import jakarta.servlet.http.HttpServletRequest;

// @RestController
// public class UserController {

// @GetMapping("/")
// public String getMethodName() {
// System.out.println("Connecting from the phone: ****************");
// return new String("Hello");
// }

// @Autowired
// private AuthService authService;
// @PostMapping("/register")
// public User register(@RequestBody User user) {
// System.out.println(user);
// return authService.register(user);
// }

// @PostMapping("/login")
// public ResponseEntity<AuthResponse> login(@RequestBody User user) {
// System.out.println("Here "+user);
// AuthResponse authResponse = authService.verify(user);
// System.out.println("HHHHHHHHHHHH"+authResponse.getUserId());
// return ResponseEntity.ok(authResponse);
// }
// @Autowired
// private UserRepo userrepo;

// @GetMapping("/getusername/{userId}")
// public String getUsername(@PathVariable String userId) {
// System.out.println("User ID: " + userId);

// User user = userrepo.getUserById(userId);

// if (user != null) {
// String name = user.getUsername();
// System.out.println("Username: " + name);
// return name != null ? name : "Username not found";
// } else {
// System.out.println("User not found for ID: " + userId);
// return "User not found";
// }
// }

// @Autowired
// private JWTService jwtservice;
// @Autowired
// private MyUserDetailsService myUserDetailsService;
// @PostMapping("/jwtcheck")
// public ResponseEntity<?> jwtCheck(HttpServletRequest request) {
// String authHeader = request.getHeader("Authorization");
// if (authHeader != null && authHeader.startsWith("Bearer ")) {
// String token = authHeader.substring(7); // Extract token part
// String username = jwtservice.extractUserName(token);
// System.out.println(username+";;;;;;;;;;;;");
// if (username != null) {
// UserDetails userDetails = myUserDetailsService.loadUserByUsername(username);

// if (jwtservice.validateToken(token, userDetails)) {
// System.out.println("SUCCESSFULLY VALIDATED");
// return ResponseEntity.ok(Collections.singletonMap("message", "JWT token is
// valid.")); // Return a JSON object
// }
// }

// }

// return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or
// expired token.");
// }
// }
