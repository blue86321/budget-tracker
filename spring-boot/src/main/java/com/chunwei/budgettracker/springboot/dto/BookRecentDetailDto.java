package com.chunwei.budgettracker.springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookRecentDetailDto {
    Long bookId;
    List<RecentFinanceDto> recentDataList;
}
