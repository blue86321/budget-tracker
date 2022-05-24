package com.chunwei.budgettracker.springboot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class Book {
    @TableId(type = IdType.AUTO)
    Long id;
    Long userId;
    String name;
    Date createTime;
    Date lastModifiedTime;
    String other;

    public Book(Long userId, String name) {
        this.userId = userId;
        this.name = name;
        this.createTime = new Date();
        this.lastModifiedTime = this.createTime;
    }
}
