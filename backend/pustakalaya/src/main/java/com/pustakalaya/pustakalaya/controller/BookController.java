package com.pustakalaya.pustakalaya.controller;

import com.pustakalaya.pustakalaya.entity.Book;
import com.pustakalaya.pustakalaya.service.BookService;
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
    public int getCurrentLoans(){
        String userEmail = "testUser@email.com";
        return bookService.currentLoansAccount(userEmail);
    }

    @RequestMapping("/secure/isCheckedOut/byuser")
    public Boolean checkoutBookByUser(@RequestParam Long bookId){
        String userEmail = "testUser@email.com";
        return bookService.checkoutBookByUser(userEmail, bookId);
    }


    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestParam Long bookId) throws Exception{
        String userEmail = "testUser@email.com";
        return bookService.checkoutBook(userEmail, bookId);
    }
}
