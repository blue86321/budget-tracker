package com.chunwei.budgettracker.springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemDetailDto {
    Long itemId;
    String date;
    String type;
    BigDecimal amount;
    String category;
    String note;
    String createTime;
    String authorUsername;
    String authorNickname;
    List<ItemDetailNestedBookDto> bookList;
}
