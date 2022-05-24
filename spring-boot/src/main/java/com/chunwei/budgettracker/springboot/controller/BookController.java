package com.chunwei.budgettracker.springboot.controller;

import com.chunwei.budgettracker.springboot.common.Result;
import com.chunwei.budgettracker.springboot.service.BookService;
import com.chunwei.budgettracker.springboot.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/book")
@Slf4j
public class BookController {

    @Autowired
    BookService bookService;

    @Autowired
    UserService userService;

    @PostMapping
    public ResponseEntity<Object> addBook(@RequestBody Map<String, Object> map, HttpServletRequest request) {
        try {
            Object data = bookService.addBook(map, request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage(), "Add a book error");
            return Result.fail(e.getMessage());
        }
    }

    @DeleteMapping("/{bookId}")
    public ResponseEntity<Object> deleteBook(@PathVariable Long bookId, HttpServletRequest request) {
        try {
            Object data = bookService.deleteBookById(bookId, request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage(), "Delete a book error, bookId: ", bookId);
            return Result.fail(e.getMessage());
        }
    }

    @PutMapping("/{bookId}")
    public ResponseEntity<Object> updateBook(@PathVariable Long bookId,
                                             @RequestBody Map<String, Object> map,
                                             HttpServletRequest request) {
        try {
            Object data = bookService.updateBookById(bookId, map, request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage());
            return Result.fail("Update book error");
        }
    }

    @GetMapping("/list")
    public ResponseEntity<Object> getRelatedBooks(HttpServletRequest request) {
        try {
            Object data = bookService.getRelatedBookByUserId(request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage());
            return Result.fail("Get related books error");
        }
    }

    @GetMapping("/list/info")
    public ResponseEntity<Object> getBookListInfo(HttpServletRequest request) {
        try {
            Object data = bookService.getBookListInfo(request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage());
            return Result.fail("Get book detail error");
        }
    }

    @GetMapping("/list/recent_detail")
    public ResponseEntity<Object> getBookListRecentDetail(@RequestParam Map<String, String> map,
                                                          HttpServletRequest request) {
        try {
            Object data = bookService.getBookListRecentDetail(map, request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage());
            return Result.fail("Get book detail error");
        }
    }

    @PostMapping("/partner/invite")
    public ResponseEntity<Object> invitePartner(@RequestBody Map<String, Object> map, HttpServletRequest request) {
        try {
            Object data = bookService.invitePartner(map, request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage(), "invite partner error");
            return Result.fail(e.getMessage());
        }
    }

}
