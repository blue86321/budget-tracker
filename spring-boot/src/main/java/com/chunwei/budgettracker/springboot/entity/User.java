package com.chunwei.budgettracker.springboot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @TableId(type = IdType.AUTO)
    Long id;
    String username;
    String password;
    String nickname;
    Date createTime;
    Date lastModifiedTime;
    Date lastVisitTime;
    String other;

    public User(Map<String, Object> map) {
        this.username = (String) map.get("username");
        this.password = (String) map.get("password");
        this.nickname = map.get("nickname") == null || "".equals(map.get("nickname")) ?
                username : (String) map.get("nickname");
        this.createTime = new Date();
        this.lastModifiedTime = createTime;
        this.lastVisitTime = createTime;
    }
}
