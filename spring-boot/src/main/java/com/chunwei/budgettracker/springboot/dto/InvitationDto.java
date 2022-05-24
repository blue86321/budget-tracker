package com.chunwei.budgettracker.springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvitationDto {
    Long inviteId;
    String nickname;
    String username;
    Long bookId;
    String bookName;
}
