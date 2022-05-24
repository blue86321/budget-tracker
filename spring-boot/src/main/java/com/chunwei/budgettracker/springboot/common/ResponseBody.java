package com.chunwei.budgettracker.springboot.common;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResponseBody {
    int code;
    String message;
    Object data;
}
