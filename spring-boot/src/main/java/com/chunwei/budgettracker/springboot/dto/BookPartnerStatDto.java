package com.chunwei.budgettracker.springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookPartnerStatDto {
    Long bookId;
    String bookName;
    String partnerRole;
    BigDecimal partnerExpense;
    BigDecimal partnerIncome;
    BigDecimal bookExpense;
    BigDecimal bookIncome;
}
