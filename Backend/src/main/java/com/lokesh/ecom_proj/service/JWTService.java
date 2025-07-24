package com.lokesh.ecom_proj.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTService {

    // Fixed secret key based on the keyword "lokesh"
    private final String secretKey;

    public JWTService() throws NoSuchAlgorithmException {
        this.secretKey = generateKey("lokesh");
    }

    private String generateKey(String keyword) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] keyBytes = new byte[32]; // 256 bits
        System.arraycopy(digest.digest(keyword.getBytes()), 0, keyBytes, 0, Math.min(keyBytes.length, digest.digest(keyword.getBytes()).length));
        return Base64.getEncoder().encodeToString(keyBytes);
    }

    public String generateToken(String mailId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", mailId);
    
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000))

                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}

// package com.lokesh.ecom_proj.service;

// import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.SignatureAlgorithm;
// import io.jsonwebtoken.io.Decoders;
// import io.jsonwebtoken.security.Keys;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.stereotype.Service;

// import javax.crypto.SecretKey;
// import java.util.Base64;
// import java.util.Date;
// import java.util.HashMap;
// import java.util.Map;
// import java.util.function.Function;

// @Service
// public class JWTService {

//     // Use a fixed secret key (ensure it's securely stored in a real application)
//     private final String secretKey = "H3cP++4p1Ic/T4WsLZyZ1lx1h3oBg6I5ZtGpEONfYhU="; // Example key


//     public String generateToken(String mailId) {
//         Map<String, Object> claims = new HashMap<>();
//         claims.put("sub", mailId);
    
//         return Jwts.builder()
//                 .setClaims(claims)
//                 .setIssuedAt(new Date(System.currentTimeMillis()))
//                 .setExpiration(new Date(System.currentTimeMillis() + 60 * 60 * 1000))
//                 .signWith(getKey(), SignatureAlgorithm.HS256)
//                 .compact();
//     }

//     private SecretKey getKey() {
//         byte[] keyBytes = Decoders.BASE64.decode(secretKey);
//         return Keys.hmacShaKeyFor(keyBytes);
//     }

//     public String extractUserName(String token) {
//         return extractClaim(token, Claims::getSubject);
//     }

//     private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
//         final Claims claims = extractAllClaims(token);
//         return claimResolver.apply(claims);
//     }

//     private Claims extractAllClaims(String token) {
//         return Jwts.parser()
//                 .setSigningKey(getKey())
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody();
//     }

//     public boolean validateToken(String token, UserDetails userDetails) {
//         final String userName = extractUserName(token);
//         return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
//     }

//     private boolean isTokenExpired(String token) {
//         return extractExpiration(token).before(new Date());
//     }

//     private Date extractExpiration(String token) {
//         return extractClaim(token, Claims::getExpiration);
//     }
// }

// package com.lokesh.ecom_proj.service;

// import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.SignatureAlgorithm;
// import io.jsonwebtoken.io.Decoders;
// import io.jsonwebtoken.security.Keys;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.stereotype.Service;

// import javax.crypto.SecretKey;
// import java.security.SecureRandom;
// import java.util.Base64;
// import java.util.Date;
// import java.util.HashMap;
// import java.util.Map;
// import java.util.function.Function;

// @Service
// public class JWTService {

//     private final String secretKey;

//     public JWTService() {
//         byte[] keyBytes = new byte[32]; 
//         new SecureRandom().nextBytes(keyBytes);
//         this.secretKey = Base64.getEncoder().encodeToString(keyBytes);
//     }

//     @SuppressWarnings("deprecation")
//     public String generateToken(String mailId) {
//         Map<String, Object> claims = new HashMap<>();
//         claims.put("sub", mailId);
    
//         return Jwts.builder()
//                 .setClaims(claims)
//                 .setIssuedAt(new Date(System.currentTimeMillis()))
//                 .setExpiration(new Date(System.currentTimeMillis() + 60 * 60 * 1000))
//                 .signWith(getKey(), SignatureAlgorithm.HS256) 
//                 .compact();
//     }
    
    

//     private SecretKey getKey() {
//         byte[] keyBytes = Decoders.BASE64.decode(secretKey);
//         return Keys.hmacShaKeyFor(keyBytes);
//     }

//     public String extractUserName(String token) {
//         return extractClaim(token, Claims::getSubject);
//     }

//     private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
//         final Claims claims = extractAllClaims(token);
//         return claimResolver.apply(claims);
//     }

//     @SuppressWarnings("deprecation")
//     private Claims extractAllClaims(String token) {
//         return Jwts.parser()
//                 .setSigningKey(getKey()) 
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody();
//     }
    
    
    

//     public boolean validateToken(String token, UserDetails userDetails) {
//         final String userName = extractUserName(token);
//         System.out.println("---------------"+userName);
//         return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
//     }

//     private boolean isTokenExpired(String token) {
//         return extractExpiration(token).before(new Date());
//     }

//     private Date extractExpiration(String token) {
//         return extractClaim(token, Claims::getExpiration);
//     }
// }
