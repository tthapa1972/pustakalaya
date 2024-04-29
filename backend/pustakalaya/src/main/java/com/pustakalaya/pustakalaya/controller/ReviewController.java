package com.pustakalaya.pustakalaya.controller;

import com.pustakalaya.pustakalaya.requestmodels.ReviewRequest;
import com.pustakalaya.pustakalaya.service.ReviewService;
import com.pustakalaya.pustakalaya.utils.ExtractJWT;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/secure/user/book")
    public void postReview(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");

        if(userEmail == null){
            throw new Exception("User Email is missing");
        }

        reviewService.userReviewListed(userEmail, bookId);
    }
    @PostMapping("/secure")
    public void postReview(@RequestHeader(value = "Authorization") String token, @RequestBody ReviewRequest reviewRequest) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");

        if(userEmail == null){
            throw new Exception("User Email is missing");
        }

        reviewService.postReview(userEmail, reviewRequest);
    }
}
