package com.chunwei.budgettracker.springboot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chunwei.budgettracker.springboot.dto.BookInfoDto;
import com.chunwei.budgettracker.springboot.dto.BookRecentDetailDto;
import com.chunwei.budgettracker.springboot.dto.BookUserDto;
import com.chunwei.budgettracker.springboot.entity.Book;

import java.util.Date;
import java.util.List;

//@Mapper  // 已交给 MybatisConfig 扫描
public interface BookMapper extends BaseMapper<Book> {

    List<BookUserDto> getRelatedBooksByUserId(Long userId);

    List<Long> getAuthBookIdList(Long userId);

    List<BookUserDto> getRelatedBooksDetailByUserId(Long userId);

    List<BookInfoDto> getBookListInfo(List<Long> bookIdList, Long userId);

    List<BookRecentDetailDto> getBookListRecentDetail(List<Long> bookIdList, Long userId, Date startDate);

    Integer updateLastModifiedTimeById(Long bookId, Date updateTime);
}
