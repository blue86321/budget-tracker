package com.chunwei.budgettracker.springboot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chunwei.budgettracker.springboot.dto.InvitationDto;
import com.chunwei.budgettracker.springboot.dto.PartnerDto;
import com.chunwei.budgettracker.springboot.dto.RecentFinanceDto;
import com.chunwei.budgettracker.springboot.dto.UserStatDto;
import com.chunwei.budgettracker.springboot.entity.User;

import java.util.Date;
import java.util.List;

//@Mapper  // 已交给 MybatisConfig 扫描
public interface UserMapper extends BaseMapper<User> {

    List<InvitationDto> getInvitation(Long userId);

    List<Long> getPartnerIdList(Long userId);

    List<PartnerDto> getPartnerList(Long userId, List<Long> partnerIdList, List<Long> authBookIdList);

    UserStatDto getUserStat(Long userId);

    List<RecentFinanceDto> getUserRecentDetailAllBook(Long userId, Date startDate);

    List<RecentFinanceDto> getUserRecentDetailPersonal(Long userId, Date startDate);
}
