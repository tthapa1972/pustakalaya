package com.pustakalaya.pustakalaya.controller;

import com.pustakalaya.pustakalaya.entity.Book;
import com.pustakalaya.pustakalaya.service.BookService;
import com.pustakalaya.pustakalaya.utils.ExtractJWT;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class BookController {

    private BookService bookService;


    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/secure/currentloans/count")
    public int getCurrentLoans(@RequestHeader(value = "Authorization") String token) {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"\\sub\"");
        return bookService.currentLoansAccount(userEmail);
    }

    @RequestMapping("/secure/isCheckedOut/byuser")
    public Boolean checkoutBookByUser(@RequestHeader(value = "Authorization") String token,
                                      @RequestParam Long bookId) {
        String userEmail = ExtractJWT.payloadJWTExtraction(token,  "\"\\sub\"");
        return bookService.checkoutBookByUser(userEmail, bookId);
    }


    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestHeader(value = "Authorization") String token,
                             @RequestParam Long bookId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token,  "\"\\sub\"");
        return bookService.checkoutBook(userEmail, bookId);
    }
}
