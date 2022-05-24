package com.chunwei.budgettracker.springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class BookUserDto {
    String bookId;
    String role;
    String name;
    Date createTime;
}
