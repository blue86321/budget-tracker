package com.chunwei.budgettracker.springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserStatDto {
    String username;
    String nickname;
    BigDecimal selfExpense;
    BigDecimal selfIncome;
    BigDecimal totalExpense;
    BigDecimal totalIncome;
    Integer selfItemCnt;
    Integer selfBookCnt;
    Integer totalItemCnt;
    Integer totalBookCnt;
    Integer partnerCnt;
}
