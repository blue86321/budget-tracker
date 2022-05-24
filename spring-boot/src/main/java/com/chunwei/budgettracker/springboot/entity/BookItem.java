package com.chunwei.budgettracker.springboot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class BookItem {
    @TableId(type = IdType.AUTO)
    Long id;
    Long bookId;
    Long itemId;
    Date createTime;
    String other;

    public BookItem(Long bookId, Long itemId) {
        this.bookId = bookId;
        this.itemId = itemId;
        this.createTime = new Date();
    }
}
