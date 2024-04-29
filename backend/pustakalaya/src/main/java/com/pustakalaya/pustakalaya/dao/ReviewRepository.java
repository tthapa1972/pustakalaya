package com.pustakalaya.pustakalaya.dao;

import com.pustakalaya.pustakalaya.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByBookId(@RequestParam("bookId") Long bookId,  Pageable pageable);

    Review findByUserEmailAndBookId(String userEmail, Long bookId);
}
