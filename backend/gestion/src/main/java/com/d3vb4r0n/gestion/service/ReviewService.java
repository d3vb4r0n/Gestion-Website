package com.d3vb4r0n.gestion.service;

import com.d3vb4r0n.gestion.dto.ReviewRequest;
import com.d3vb4r0n.gestion.entity.Review;
import com.d3vb4r0n.gestion.entity.ReviewStatus;
import com.d3vb4r0n.gestion.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    
    @Transactional
    public Review createReview(ReviewRequest request, String ipAddress) {
        Review review = new Review();
        review.setName(request.getName());
        review.setEmail(request.getEmail());
        review.setPhone(request.getPhone());
        review.setMessage(request.getMessage());
        review.setIpAddress(ipAddress);
        review.setIsRead(false);
        review.setStatus(ReviewStatus.PENDING);
        
        return reviewRepository.save(review);
    }
    
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
    
    public List<Review> getUnreadReviews() {
        return reviewRepository.findByIsRead(false);
    }
    
    public List<Review> getReviewsByStatus(ReviewStatus status) {
        return reviewRepository.findByStatus(status);
    }
    
    public Review getReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));
    }
    
    @Transactional
    public Review markAsRead(Long id) {
        Review review = getReviewById(id);
        review.setIsRead(true);
        return reviewRepository.save(review);
    }
    
    @Transactional
    public Review updateStatus(Long id, ReviewStatus status) {
        Review review = getReviewById(id);
        review.setStatus(status);
        return reviewRepository.save(review);
    }
    
    @Transactional
    public void deleteReview(Long id) {
        Review review = getReviewById(id);
        reviewRepository.delete(review);
    }
}
