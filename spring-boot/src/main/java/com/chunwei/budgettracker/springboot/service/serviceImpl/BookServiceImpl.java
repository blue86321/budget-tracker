package com.chunwei.budgettracker.springboot.service.serviceImpl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chunwei.budgettracker.springboot.dto.BookInfoDto;
import com.chunwei.budgettracker.springboot.dto.BookRecentDetailDto;
import com.chunwei.budgettracker.springboot.dto.BookUserDto;
import com.chunwei.budgettracker.springboot.entity.*;
import com.chunwei.budgettracker.springboot.mapper.*;
import com.chunwei.budgettracker.springboot.service.BookService;
import com.chunwei.budgettracker.springboot.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Slf4j
public class BookServiceImpl extends ServiceImpl<BookMapper, Book> implements BookService {

    @Autowired
    BookMapper bookMapper;

    @Autowired
    BookUserMapper bookUserMapper;

    @Autowired
    UserService userService;

    @Autowired
    UserMapper userMapper;

    @Autowired
    BookInviteMapper bookInviteMapper;

    @Autowired
    BookItemMapper bookItemMapper;

    @Override
    public Object getRelatedBookByUserId(HttpServletRequest request) {
        Long userId = userService.getUserIdByRequest(request);
        List<BookUserDto> bookUserDtoList = bookMapper.getRelatedBooksByUserId(userId);
        return bookUserDtoList;
    }

    @Override
    public Object getBookListInfo(HttpServletRequest request) {
        Long userId = userService.getUserIdByRequest(request);
        List<Long> bookIdList = bookMapper.getAuthBookIdList(userId);
        List<BookInfoDto> bookListInfo = bookMapper.getBookListInfo(bookIdList, userId);
        return bookListInfo;
    }

    @Override
    public Object getBookListRecentDetail(Map<String, String> map, HttpServletRequest request) throws ParseException {
        Long userId = userService.getUserIdByRequest(request);
        List<Long> bookIdList = bookMapper.getAuthBookIdList(userId);
        Date startDate = new SimpleDateFormat("yyyy-MM-dd").parse(map.get("startDate"));
        List<BookRecentDetailDto> bookListRecentDetail = bookMapper.getBookListRecentDetail(bookIdList, userId, startDate);
        return bookListRecentDetail;
    }

    @Override
    public Object invitePartner(Map<String, Object> map, HttpServletRequest request) {
        User invitee = userMapper.selectOne(new QueryWrapper<User>().eq("username", map.get("username")));
        if (invitee == null) {
            throw new RuntimeException("User does not exist");
        }
        Long userId = userService.getUserIdByRequest(request);
        if (invitee.getId() == userId) {
            throw new RuntimeException("Cannot invite yourself");
        }
        Long bookId = Long.parseLong(String.valueOf(map.get("bookId")));
        // check pending
        BookInvite pendingBookInvite = bookInviteMapper.selectOne(
                new QueryWrapper<BookInvite>()
                        .eq("inviter_id", userId)
                        .eq("invitee_id", invitee.getId())
                        .eq("book_id", bookId)
                        .eq("status", BookInvite.Status.PENDING.value));
        if (pendingBookInvite != null) {
            throw new RuntimeException("Waiting for user to respond");
        }
        // check accept
        BookInvite acceptBookInvite = bookInviteMapper.selectOne(
                new QueryWrapper<BookInvite>()
                        .eq("inviter_id", userId)
                        .eq("invitee_id", invitee.getId())
                        .eq("book_id", bookId)
                        .eq("status", BookInvite.Status.ACCEPT.value)
        );
        if (acceptBookInvite != null) {
            throw new RuntimeException("Already a partner in this book");
        }

        bookInviteMapper.insert(new BookInvite(userId, invitee.getId(), bookId));
        return null;
    }

    @Override
    public Object updateBookById(Long bookId, Map<String, Object> map, HttpServletRequest request) {
        Long userId = userService.getUserIdByRequest(request);
        verifyBook(userId, bookId);
        Book book = bookMapper.selectById(bookId);
        String newBookName = (String) map.get("newBookName");
        book.setName(newBookName);
        book.setLastModifiedTime(new Date());
        bookMapper.updateById(book);
        return null;
    }

    @Override
    @Transactional
    public Object addBook(Map<String, Object> map, HttpServletRequest request) {
        Long userId = userService.getUserIdByRequest(request);
        List<BookUserDto> bookList = bookMapper.getRelatedBooksByUserId(userId);
        String bookName = (String) map.get("bookName");
        if (bookName.isEmpty()) {
            throw new RuntimeException("Error, empty book name");
        }
        for (BookUserDto bookUserDto : bookList) {
            if (bookName.equals(bookUserDto.getName())) {
                throw new RuntimeException("Book exists");
            }
        }
        Book book = new Book(userId, bookName);
        bookMapper.insert(book);
        bookUserMapper.insert(new BookUser(book.getId(), userId, UserService.UserBookRole.AUTHOR.value));
        return null;
    }

    @Override
    @Transactional
    public Object deleteBookById(Long bookId, HttpServletRequest request) {
        Long userId = userService.getUserIdByRequest(request);
        verifyBook(userId, bookId);
        // user
        bookMapper.deleteById(bookId);
        // book_user
        bookUserMapper.delete(new QueryWrapper<BookUser>().eq("book_id", bookId));
        // book_item
        bookItemMapper.delete(new QueryWrapper<BookItem>().eq("book_id", bookId));
        // book_invite
        bookInviteMapper.delete(new QueryWrapper<BookInvite>().eq("book_id", bookId));
        return null;
    }

    private void verifyBook(Long userId, Long bookId) {
        Book book = bookMapper.selectById(bookId);
        if (book == null) {
            throw new RuntimeException("Book not found");
        }
        if (!Objects.equals(book.getUserId(), userId)) {
            throw new RuntimeException("Illegal operation, book is not created by user ");
        }
        List<Book> bookList = bookMapper.selectList(new QueryWrapper<Book>().eq("user_id", userId));
        if (bookList.size() == 1) {
            throw new RuntimeException("Cannot delete the last book you created");
        }
    }
}
