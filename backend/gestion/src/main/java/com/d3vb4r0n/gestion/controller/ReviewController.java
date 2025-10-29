package com.d3vb4r0n.gestion.controller;

import com.d3vb4r0n.gestion.dto.ReviewRequest;
import com.d3vb4r0n.gestion.entity.Review;
import com.d3vb4r0n.gestion.entity.ReviewStatus;
import com.d3vb4r0n.gestion.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ReviewController {
    
    private final ReviewService reviewService;
    
    @PostMapping
    public ResponseEntity<Review> createReview(
            @Valid @RequestBody ReviewRequest request,
            HttpServletRequest httpRequest) {
        
        String ipAddress = getClientIpAddress(httpRequest);
        Review review = reviewService.createReview(request, ipAddress);
        return new ResponseEntity<>(review, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/unread")
    public ResponseEntity<List<Review>> getUnreadReviews() {
        List<Review> reviews = reviewService.getUnreadReviews();
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Review>> getReviewsByStatus(@PathVariable ReviewStatus status) {
        List<Review> reviews = reviewService.getReviewsByStatus(status);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
        Review review = reviewService.getReviewById(id);
        return ResponseEntity.ok(review);
    }
    
    @PatchMapping("/{id}/read")
    public ResponseEntity<Review> markAsRead(@PathVariable Long id) {
        Review review = reviewService.markAsRead(id);
        return ResponseEntity.ok(review);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Review> updateStatus(
            @PathVariable Long id,
            @RequestParam ReviewStatus status) {
        Review review = reviewService.updateStatus(id, status);
        return ResponseEntity.ok(review);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0];
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}
