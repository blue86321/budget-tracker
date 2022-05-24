package com.chunwei.budgettracker.springboot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

@Data
@AllArgsConstructor
public class Item {
    @TableId(type = IdType.AUTO)
    Long id;
    Long userId;
    Date date;
    String type;  // income / expense
    BigDecimal amount;
    String category;
    String note;
    Date createTime;
    String other;

    public Item(Long userId, Map<String, Object> map) throws ParseException {
        this.userId = userId;
        date = new SimpleDateFormat("yyyy-MM-dd").parse((String) map.get("date"));
        type = ((String) map.get("type")).toLowerCase();
        amount = BigDecimal.valueOf(Double.parseDouble(String.valueOf(map.get("amount"))));
        category = (String) map.get("category");
        note = map.get("note") == null ? "" : (String) map.get("note");
        createTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse((String) map.get("createTime"));
    }
}
