package com.pustakalaya.pustakalaya.dao;

import com.pustakalaya.pustakalaya.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
}
