package com.chunwei.budgettracker.springboot.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.chunwei.budgettracker.springboot.entity.Book;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.Map;

public interface BookService extends IService<Book> {

    String[] DEFAULT_BOOKNAME = new String[]{"default"};

    Object getRelatedBookByUserId(HttpServletRequest request);

    Object getBookListInfo(HttpServletRequest request);

    Object getBookListRecentDetail(Map<String, String> map, HttpServletRequest request) throws ParseException;

    Object invitePartner(Map<String, Object> map, HttpServletRequest request);

    Object updateBookById(Long bookId, Map<String, Object> map, HttpServletRequest request);

    Object deleteBookById(Long bookId, HttpServletRequest request);

    Object addBook(Map<String, Object> map, HttpServletRequest request);
}
