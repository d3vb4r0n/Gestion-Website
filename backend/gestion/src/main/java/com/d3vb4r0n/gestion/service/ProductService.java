package com.d3vb4r0n.gestion.service;

import com.d3vb4r0n.gestion.dto.ProductRequest;
import com.d3vb4r0n.gestion.entity.Product;
import com.d3vb4r0n.gestion.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public List<Product> getAvailableProducts() {
        return productRepository.findByIsAvailable(true);
    }
    
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryAndIsAvailable(category, true);
    }
    
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
    
    public List<Product> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }
    
    @Transactional
    public Product createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(request.getCategory());
        product.setStock(request.getStock() != null ? request.getStock() : 0);
        product.setIsAvailable(true);
        
        return productRepository.save(product);
    }
    
    @Transactional
    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);
        
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(request.getCategory());
        
        if (request.getStock() != null) {
            product.setStock(request.getStock());
        }
        
        return productRepository.save(product);
    }
    
    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
    
    @Transactional
    public Product toggleAvailability(Long id) {
        Product product = getProductById(id);
        product.setIsAvailable(!product.getIsAvailable());
        return productRepository.save(product);
    }
}
