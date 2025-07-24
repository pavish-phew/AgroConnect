// package com.lokesh.ecom_proj.service;


// import jakarta.servlet.http.HttpServletResponse;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.stereotype.Service;

// import com.lokesh.ecom_proj.model.User;
// import com.lokesh.ecom_proj.repo.UserRepo;

// @Service
// public class UserService {

//     // @Autowired
//     // private JWTService jwtService;

//     @Autowired
//     AuthenticationManager authManager;

//     @Autowired
//     private UserRepo repo;


//     private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

//     public User register(User user) {
//         System.out.println(user);
//         user.setPassword(encoder.encode(user.getPassword()));
//         repo.save(user);
//         return user;
//     }

//     public String verify(User user) {
//         // Find user from the database using mailId
//         User foundUser = repo.findByMailId(user.getMailId());
//         System.out.println(user.getPassword());
//         System.out.println(foundUser.getPassword());
//         if (foundUser != null) {
//             // Check if the raw password matches the encoded password in the database
//             if (encoder.matches(user.getPassword(), foundUser.getPassword())) {
//                 // Generate a JWT token if the password matches
//                 return jwtService.generateToken(foundUser.getUsername());
//             } else {
//                 System.out.println("Authentication error: Bad credentials");
//                 return "fail";
//             }
//         } else {
//             System.out.println("User not found.");
//             return "fail";
//         }
//     }
    
    
// //     public String verify(Users user) {
// //         System.out.println("In user"+user);
// //         Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getMailId(),user.getPassword()));
        
// //         Users foundUser = repo.findByMailId(user.getMailId());
// //         System.out.println("founded in db"+foundUser);
// //         if(authentication.isAuthenticated())
// //         {
// //             System.out.println("YESSSS");
// //             // System.out.println(user.getPassword());
// //             return jwtService.generateToken(user.getName());
// //         }
// //         return "fail";
// // // if (foundUser != null) {
// // //     System.out.println("Found User: " + foundUser);
// // //     System.out.println("Input pass: " + user.getPassword());
// // //     // System.out.println("Input p: " + user.getName());
// // //     if (foundUser.getPassword().equals(user.getPassword())) {
// // //                 System.out.println(jwtService.generateToken(user.getName()));
// // //         return jwtService.generateToken(user.getName());
// // //     } else {
// // //         System.out.println("Name does not match.");
// // //         return "fail";
// // //     }
// // // } else {
// // //     System.out.println("User not found.");
// // //     return "fail";
// // // }

// //     // Users foundUser = repo.findByMailId(user.getMailId());
// //     //     // Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getName(), user.getMailId()));
// //     //     // if (authentication.isAuthenticated()) {
// //     //         System.out.println(foundUser);
// //     //         if (foundUser != null && foundUser.getName().equals(user.getName())) {
// //     //             return jwtService.generateToken(user.getName());
// //     //         } else {
// //     //         System.out.println(jwtService.generateToken(user.getName()));
// //     //         return "fail";
// //     //     }
// //     }
// }