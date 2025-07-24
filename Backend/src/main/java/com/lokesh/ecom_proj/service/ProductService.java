package com.lokesh.ecom_proj.service;

import com.lokesh.ecom_proj.exception.ResourceNotFoundException;
import com.lokesh.ecom_proj.model.Product;
import com.lokesh.ecom_proj.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;

    public List<Product> findProductsByIds(List<String> productIds) {
        return repo.findAllById(productIds);
    }
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Product getProductById(String id) { 
        return repo.findById(id).orElse(null);
    }

    public Product addProduct(Product product, MultipartFile imageFile, String userid) throws IOException {
        if (imageFile != null) {
            product.setUserId(product.getUserId());
            product.setImageName(imageFile.getOriginalFilename());
            product.setImageType(imageFile.getContentType());
            product.setImageDate(imageFile.getBytes());
            product.setUserId(userid);
            // product.setUserId("66f77627abfbd9561c15a4ac");
        }
        return repo.save(product);
    }

    public Product updateProduct(String id, Product product, MultipartFile imageFile) throws IOException {
        Product existingProduct = getProductById(id);
        if (existingProduct != null) {
            if (imageFile != null) {
                existingProduct.setImageDate(imageFile.getBytes());
                existingProduct.setImageName(imageFile.getOriginalFilename());
                existingProduct.setImageType(imageFile.getContentType());
            }
            existingProduct.setName(product.getName());
            existingProduct.setDescription(product.getDescription());
            existingProduct.setBrand(product.getBrand());
            existingProduct.setCategory(product.getCategory());
            existingProduct.setPrice(product.getPrice());
            existingProduct.setStockQuantity(product.getStockQuantity());
            existingProduct.setProductAvailable(product.isProductAvailable());
            if(!product.isProductAvailable())
            {
                existingProduct.setStockQuantity(0);
            }
            return repo.save(existingProduct);
        }
        return null;  
    }

    public void deleteProduct(String id) { 
        repo.deleteById(id);
    }

    public List<Product> searchProducts(String keyword) {
        return repo.searchProducts(keyword);
    }
    public List<Product> getProductsByUserId(String userId) {
        List<Product> result = repo.findByUserId(userId);
        if(result == null || result.isEmpty()) {
            // System.out.println("No products found for userId: " + userId);
        } 
        return result;
    }
    public Product incrementViewCount(String productId) {
        Product product = repo.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setViewCount(product.getViewCount() + 1);
        System.out.println("This is the view count : "+product.getViewCount());
        return repo.save(product);
    }
    
}
