package com.chunwei.budgettracker.springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookInfoDto {
    Long bookId;
    String bookName;
    Boolean canUserEdit;
    Date createTime;
    Date lastModifiedTime;
    String authorUsername;
    String authorNickname;
    BigDecimal totalIncome;
    BigDecimal totalExpense;
    List<BookPartnerDescriptionDto> partnerList;
}
