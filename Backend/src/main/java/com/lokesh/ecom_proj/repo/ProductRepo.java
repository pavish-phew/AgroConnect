package com.lokesh.ecom_proj.repo;

import com.lokesh.ecom_proj.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends MongoRepository<Product, String> {

    List<Product> findByUserId(String userId); 
    @Query("{ '$or': [ { 'name': { '$regex': ?0, '$options': 'i' } }, " +
            "{ 'description': { '$regex': ?0, '$options': 'i' } }, " +
            "{ 'brand': { '$regex': ?0, '$options': 'i' } }, " +
            "{ 'category': { '$regex': ?0, '$options': 'i' } } ] }")
    List<Product> searchProducts(String keyword);
    List<Product> findAllById(Iterable<String> ids);
}
