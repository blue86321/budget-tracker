package com.chunwei.budgettracker.springboot.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.chunwei.budgettracker.springboot.dto.InvitationDto;
import com.chunwei.budgettracker.springboot.dto.PartnerDto;
import com.chunwei.budgettracker.springboot.entity.User;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

public interface UserService extends IService<User> {

    enum UserBookRole {
        AUTHOR("author"),
        PARTNER("partner");

        public String value;

        UserBookRole (String value) {
            this.value = value;
        }
    }

    Object register(Map<String, Object> map);

    Object login(Map<String, Object> map);

    Object getUserInfoByRequest(HttpServletRequest request);

    Long getUserIdByRequest(HttpServletRequest request);

    List<InvitationDto> getInvitation(HttpServletRequest request);

    Object respondInvitation(Map<String, Object> map, HttpServletRequest request);

    List<Long> getPartnerIdList(HttpServletRequest request);

    List<PartnerDto> getPartnerList(HttpServletRequest request);

    Object revokePartner(Map<String, Object> map, HttpServletRequest request);

    Object getUserStat(HttpServletRequest request);

    Object getUserRecentDetail(Map<String, String> map, HttpServletRequest request) throws ParseException;

    Object refreshToken(Map<String, Object> map, HttpServletRequest request);
}
