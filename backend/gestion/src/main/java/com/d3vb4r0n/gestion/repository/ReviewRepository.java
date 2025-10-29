package com.d3vb4r0n.gestion.repository;

import com.d3vb4r0n.gestion.entity.Review;
import com.d3vb4r0n.gestion.entity.ReviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByIsRead(Boolean isRead);
    
    List<Review> findByStatus(ReviewStatus status);
    
    List<Review> findByEmail(String email);
}
