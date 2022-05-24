package com.chunwei.budgettracker.springboot.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookInvite {

    public enum Status {
        PENDING(0),
        ACCEPT(1),
        REJECT(-1),
        REVOKE(2);

        public int value;

        Status(int value) {
            this.value = value;
        }
    }

    @TableId(type = IdType.AUTO)
    Long id;
    Long inviterId;
    Long inviteeId;
    Long bookId;
    Date createTime;
    Date lastModifiedTime;
    Integer status;
    String other;

    public BookInvite(Long inviterId, Long inviteeId, Long bookId) {
        this.inviterId = inviterId;
        this.inviteeId = inviteeId;
        this.bookId = bookId;
        this.createTime = new Date();
        this.lastModifiedTime = this.createTime;
        this.status = Status.PENDING.value;
    }
}
