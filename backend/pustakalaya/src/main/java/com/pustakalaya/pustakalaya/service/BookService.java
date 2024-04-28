package com.pustakalaya.pustakalaya.service;

import com.pustakalaya.pustakalaya.dao.BookRepository;
import com.pustakalaya.pustakalaya.dao.CheckoutRepository;
import com.pustakalaya.pustakalaya.entity.Book;
import com.pustakalaya.pustakalaya.entity.Checkout;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@Transactional
public class BookService {

    private BookRepository bookRepository;

    private CheckoutRepository checkoutRepository;

    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
    }

    public Book checkoutBook(String userEmail, Long bookId) throws Exception{

        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if(!book.isPresent() || validateCheckout != null || book.get().getCopiesAvailable() <= 0){
            throw  new Exception("Books not present");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);

        bookRepository.save(book.get());

        Checkout checkout = new Checkout(
                userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                book.get().getId()
        );

        checkoutRepository.save(checkout);

        return book.get();
    }

    public Boolean checkoutBookByUser(String userEmail , Long bookId){

        Checkout checkout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if(checkout != null){
            return true;
        }else {
            return false;
        }
    }

    public int currentLoansAccount(String userEmail){
        return checkoutRepository.findBooksByUserEmail(userEmail).size();
    }

}
