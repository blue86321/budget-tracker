package com.chunwei.budgettracker.springboot.service.serviceImpl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chunwei.budgettracker.springboot.common.Result;
import com.chunwei.budgettracker.springboot.dto.InvitationDto;
import com.chunwei.budgettracker.springboot.dto.PartnerDto;
import com.chunwei.budgettracker.springboot.dto.RecentFinanceDto;
import com.chunwei.budgettracker.springboot.dto.UserStatDto;
import com.chunwei.budgettracker.springboot.entity.*;
import com.chunwei.budgettracker.springboot.mapper.*;
import com.chunwei.budgettracker.springboot.service.BookService;
import com.chunwei.budgettracker.springboot.service.CategoryService;
import com.chunwei.budgettracker.springboot.service.UserService;
import com.chunwei.budgettracker.springboot.utils.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Slf4j
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Autowired
    UserMapper userMapper;

    @Autowired
    CategoryMapper categoryMapper;

    @Autowired
    BookMapper bookMapper;

    @Autowired
    BookUserMapper bookUserMapper;

    @Autowired
    BookInviteMapper bookInviteMapper;

    private Map<String, String> getJwtPayloadByUser(User user) {
        Map<String, String> payload = new HashMap<>();
        payload.put("username", user.getUsername());
        payload.put("userId", user.getId().toString());
        payload.put("nickname", user.getNickname());
        return payload;
    }

    private Map<String, String> getJwtPayloadByHeadToken(String headToken) {
        Map<String, String> tokenData = JwtUtil.getTokenData(headToken);
        Map<String, String> payload = new HashMap<>();
        payload.put("username", tokenData.get("username"));
        payload.put("userId", tokenData.get("userId"));
        payload.put("nickname", tokenData.get("nickname"));
        return payload;
    }

    private Map<String, Object> jwtEncode(Map<String, String> payload) {
        String token = JwtUtil.getNewToken(payload);
        String refreshToken = JwtUtil.getNewRefreshToken(payload);
        // return data
        Map<String, Object> data = new HashMap<>();
        data.put("success", true);
        data.put("token", token);
        data.put("refreshToken", refreshToken);
        return data;
    }

    @Override
    @Transactional
    public Object register(Map<String, Object> map) {
        if (!Objects.equals(map.get("password"),map.get("confirm"))) {
            throw new RuntimeException("two password do not match");
        }
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", map.get("username"));
        User userOne = userMapper.selectOne(queryWrapper);
        if (userOne != null) {
            throw new RuntimeException("username exists");
        }
        User newUser = new User(map);
        userMapper.insert(newUser);
        // default data
        for (String bookName : BookService.DEFAULT_BOOKNAME) {
            Book newBook = new Book(newUser.getId(), bookName);
            bookMapper.insert(newBook);
            bookUserMapper.insert(new BookUser(newUser.getId(), newBook.getId(), UserBookRole.AUTHOR.value));
        }
        for (String category : CategoryService.DEFAULT_CATEGORY) {
            categoryMapper.insert(new Category(newUser.getId(), category));
        }
        Map<String, Object> data = jwtEncode(getJwtPayloadByUser(newUser));
        return data;
    }

    @Override
    public Object login(Map<String, Object> map) {
        String username = (String) map.get("username");
        String password = (String) map.get("password");
        // parameter check
        if (!StringUtils.hasText(username) || !StringUtils.hasText(password)) {
            throw new RuntimeException("parameter error");
        }
        // query
        User user = userMapper.selectOne(new QueryWrapper<User>().eq("username", username));
        // login check
        if (user == null || !user.getPassword().equals(password)) {
            throw new RuntimeException("incorrect username or password");
        }
        // success, jwt encode
        Map<String, Object> data = jwtEncode(getJwtPayloadByUser(user));
        // update database
        Date currentTime = new Date();
        user.setLastVisitTime(currentTime);
        user.setLastModifiedTime(currentTime);
        userMapper.updateById(user);
        return data;
    }

    @Override
    public Object getUserInfoByRequest(HttpServletRequest request) {
        String headToken = request.getHeader("Authorization");
        Map<String, String> jwtData = JwtUtil.getTokenData(headToken);
        Map<String, String> data = new HashMap<>();
        data.put("username", jwtData.get("username"));
        data.put("nickname", jwtData.get("nickname"));
        return data;
    }

    @Override
    public Long getUserIdByRequest(HttpServletRequest request) {
        String headToken = request.getHeader("Authorization");
        return Long.parseLong((String) JwtUtil.getTokenData(headToken).get("userId"));
    }

    @Override
    public List<InvitationDto> getInvitation(HttpServletRequest request) {
        Long userId = getUserIdByRequest(request);
        List<InvitationDto> invitationList = userMapper.getInvitation(userId);
        return invitationList;
    }

    @Override
    @Transactional
    public Object respondInvitation(Map<String, Object> map, HttpServletRequest request) {
        Long inviteId = Long.parseLong(String.valueOf(map.get("inviteId")));
        BookInvite bookInvite = bookInviteMapper.selectById(inviteId);
        Long userId = this.getUserIdByRequest(request);
        // verify
        if (!Objects.equals(bookInvite.getInviteeId(), userId)) {
            return Result.fail("illegal operation");
        }
        // respond
        if ((Boolean) map.get("accept")) {
            bookInvite.setStatus(BookInvite.Status.ACCEPT.value);
            Long bookId = bookInvite.getBookId();
            bookUserMapper.insert(new BookUser(bookId, userId, UserBookRole.PARTNER.value));
        } else {
            bookInvite.setStatus(BookInvite.Status.REJECT.value);
        }
        bookInvite.setLastModifiedTime(new Date());
        bookInviteMapper.updateById(bookInvite);
        return null;
    }

    @Override
    public List<Long> getPartnerIdList(HttpServletRequest request) {
        Long userId = this.getUserIdByRequest(request);
        return userMapper.getPartnerIdList(userId);
    }

    @Override
    public List<PartnerDto> getPartnerList(HttpServletRequest request) {
        Long userId = this.getUserIdByRequest(request);
        List<Long> partnerIdList = userMapper.getPartnerIdList(userId);
        List<Long> bookIdList = bookMapper.getAuthBookIdList(userId);
        List<PartnerDto> partnerList = userMapper.getPartnerList(userId, partnerIdList, bookIdList);
        return partnerList;
    }

    @Override
    @Transactional
    public Object revokePartner(Map<String, Object> map, HttpServletRequest request) {
        Long userId = this.getUserIdByRequest(request);
        Long bookId = Long.parseLong(String.valueOf(map.get("bookId")));
        User partner = userMapper.selectOne(new QueryWrapper<User>().eq("username", map.get("partnerUsername")));
        if (partner == null) {
            throw new RuntimeException("invalid partner username");
        }
        Long partnerId = partner.getId();
        // check user's authority
        BookUser bookUser = bookUserMapper.selectOne(
                new QueryWrapper<BookUser>()
                        .eq("user_id", userId)
                        .eq("book_id", bookId)
        );
        if (bookUser == null || !UserBookRole.AUTHOR.value.equals(bookUser.getRole())) {
            throw new RuntimeException("Invalid. No authority in book or book does not exist");
        }
        // check partner exists
        BookUser partnerBookUser = bookUserMapper.selectOne(
                new QueryWrapper<BookUser>()
                        .eq("user_id", partnerId)
                        .eq("book_id", bookId)
        );
        BookInvite bookInvite = bookInviteMapper.selectOne(
                new QueryWrapper<BookInvite>()
                        .eq("invitee_id", partnerId)
                        .eq("book_id", bookId)
                        .eq("status", BookInvite.Status.ACCEPT.value)
        );
        if (partnerBookUser == null || bookInvite == null) {
            throw new RuntimeException("Partner does not exist in the book");
        }
        bookUserMapper.deleteById(partnerBookUser);
        bookInvite.setStatus(BookInvite.Status.REVOKE.value);
        bookInvite.setLastModifiedTime(new Date());
        bookInviteMapper.updateById(bookInvite);
        return null;
    }

    @Override
    public Object getUserStat(HttpServletRequest request) {
        Long userId = getUserIdByRequest(request);
        UserStatDto userStat = userMapper.getUserStat(userId);
        return userStat;
    }

    @Override
    public Object getUserRecentDetail(Map<String, String> map, HttpServletRequest request) throws ParseException {
        Long userId = getUserIdByRequest(request);
        String scope = map.get("scope");
        Date startDate = new SimpleDateFormat("yyyy-MM-dd").parse(map.get("startDate"));

        if ("personal".equals(scope)) {
            List<RecentFinanceDto> userRecentDetail = userMapper.getUserRecentDetailPersonal(userId, startDate);
            return userRecentDetail;
        } else if ("allBook".equals(scope)) {
            List<RecentFinanceDto> userRecentDetail = userMapper.getUserRecentDetailAllBook(userId, startDate);
            return userRecentDetail;
        } else {
            throw new RuntimeException("Invalid scope: " + scope);
        }
    }

    @Override
    public Object refreshToken(Map<String, Object> map, HttpServletRequest request) {
        String refreshToken = (String) map.get("refreshToken");
        Map<String, Object> data = jwtEncode(getJwtPayloadByHeadToken("Bearer " + refreshToken));
        return data;
    }
}
