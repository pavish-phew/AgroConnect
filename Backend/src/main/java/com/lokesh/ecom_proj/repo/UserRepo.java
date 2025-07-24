package com.lokesh.ecom_proj.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import com.lokesh.ecom_proj.model.User;


@Repository
public interface UserRepo extends MongoRepository<User,String>
{
    User findByMailId(String mailId);
    User findByUsername(String username);
    User getUserById(String userId);
}