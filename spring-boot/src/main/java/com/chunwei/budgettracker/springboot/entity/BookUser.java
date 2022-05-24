package com.chunwei.budgettracker.springboot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookUser {
    @TableId(type = IdType.AUTO)
    Long id;
    Long bookId;
    Long userId;
    String role;
    Date createTime;
    Date lastModifiedTime;
    String other;

    public BookUser(Long bookId, Long userId, String role) {
        this.bookId = bookId;
        this.userId = userId;
        this.role = role;
        this.createTime = new Date();
        this.lastModifiedTime = this.createTime;
    }
}
