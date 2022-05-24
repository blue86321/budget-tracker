package com.chunwei.budgettracker.springboot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class Category {
    @TableId(type = IdType.AUTO)
    Long id;
    Long userId;
    String category;
    Date createTime;
    String other;


    public Category(Long userId, String category) {
        this.userId = userId;
        this.category = category;
        this.createTime = new Date();
    }

    public Category(String category) {
        this.category = category;
    }
}
