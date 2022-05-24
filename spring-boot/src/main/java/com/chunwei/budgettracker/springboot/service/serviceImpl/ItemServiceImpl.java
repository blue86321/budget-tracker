package com.chunwei.budgettracker.springboot.service.serviceImpl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chunwei.budgettracker.springboot.dto.ItemDetailDto;
import com.chunwei.budgettracker.springboot.entity.BookItem;
import com.chunwei.budgettracker.springboot.entity.Item;
import com.chunwei.budgettracker.springboot.mapper.BookItemMapper;
import com.chunwei.budgettracker.springboot.mapper.BookMapper;
import com.chunwei.budgettracker.springboot.mapper.ItemMapper;
import com.chunwei.budgettracker.springboot.mapper.UserMapper;
import com.chunwei.budgettracker.springboot.service.ItemService;
import com.chunwei.budgettracker.springboot.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.*;

@Service
@Slf4j
public class ItemServiceImpl extends ServiceImpl<ItemMapper, Item> implements ItemService {

    @Autowired
    ItemMapper itemMapper;

    @Autowired
    BookItemMapper bookItemMapper;

    @Autowired
    BookMapper bookMapper;

    @Autowired
    UserMapper userMapper;

    @Autowired
    UserService userService;

    @Override
    @Transactional
    public Object addItem(Map<String, Object> map, HttpServletRequest request) throws ParseException {
        // verify item type
        String type = (String) map.get("type");
        boolean validType = false;
        for (String s : VALID_TYPE) {
            if (s.equals(type.toLowerCase())) {
                validType = true;
                break;
            }
        }
        if (!validType) {
            throw new RuntimeException("Unsupported item type");
        }
        Long userId = userService.getUserIdByRequest(request);
        Item item = new Item(userId, map);
        itemMapper.insert(item);
        List<Long> bookIdList = bookMapper.getAuthBookIdList(userId);
        // insert only when bookId == relatedBookId (has the right to insert)
        for (String bookId : (ArrayList<String>) map.get("bookList")) {
            boolean validBook = false;
            for (Long relatedBookId : bookIdList) {
                if (bookId.equals(String.valueOf(relatedBookId))) {
                    bookItemMapper.insert(new BookItem(Long.parseLong(bookId), item.getId()));
                    bookMapper.updateLastModifiedTimeById(Long.parseLong(bookId), new Date());
                    validBook = true;
                    break;
                }
            }
            if (!validBook) {
                throw new RuntimeException("Unauthorized to operate one of book");
            }
        }
        return null;
    }

    @Override
    @Transactional
    public Object deleteItemById(Long itemId, HttpServletRequest request) {
        Long userId = userService.getUserIdByRequest(request);
        // verify
        Item item = itemMapper.selectById(itemId);
        if (!Objects.equals(item.getUserId(), userId)) {
            List<Long> partnerIdList = userMapper.getPartnerIdList(userId);
            boolean validUser = false;
            for (Long partnerId : partnerIdList) {
                if (partnerId == item.getUserId()) {
                    validUser = true;
                    break;
                }
            }
            if (!validUser) {
                throw new RuntimeException("Illegal operation, no auth for itemId: " + itemId);
            }
        }
        // delete book_item
        List<Long> bookIdList = bookMapper.getAuthBookIdList(userId);
        bookItemMapper.deleteByItemId(itemId, bookIdList);
        // delete item if no book
        List<Long> noBookItemIdList = itemMapper.getNoBookItemIdList(Collections.singletonList(String.valueOf(itemId)));
        if (!noBookItemIdList.isEmpty()) {
            itemMapper.deleteBatchIds(noBookItemIdList);
        }
        return null;
    }

    @Override
    @Transactional
    public Object deleteBatchItems(Map<String, Object> map, HttpServletRequest request) {
        Long userId = userService.getUserIdByRequest(request);
        ArrayList<String> itemIdList = (ArrayList<String>) map.get("itemIdList");
        if (itemIdList.isEmpty()) {
            throw new RuntimeException("Item list is empty");
        }
        List<Long> bookIdList = bookMapper.getAuthBookIdList(userId);
        Integer authCnt = itemMapper.countAuthItem(userId, itemIdList, bookIdList);
        if (authCnt != itemIdList.size()) {
            throw new RuntimeException("Illegal operation, no auth for all items");
        }
        // delete book_item
        bookItemMapper.deleteBatchByItemAndBookIdList(itemIdList, bookIdList);
        // delete item if no book
        List<Long> noBookItemIdList = itemMapper.getNoBookItemIdList(itemIdList);
        if (!noBookItemIdList.isEmpty()) {
            itemMapper.deleteBatchIds(noBookItemIdList);
        }
        return null;
    }

    @Override
    public Object getItemList(Map<String, String> paramsMap, HttpServletRequest request) throws JsonProcessingException {
        Long userId = userService.getUserIdByRequest(request);
        // filter
        int curPage = Integer.parseInt(paramsMap.get("curPage"));
        int pageSize = Integer.parseInt(paramsMap.get("pageSize"));
        int cacheNum = Integer.parseInt(paramsMap.get("cacheNum"));
        Integer limitFrom = (curPage - 1) * pageSize;
        Map<String, Object> queryParamsMap = new HashMap<>();
        Map<String,Object> filterMap = new ObjectMapper().readValue(paramsMap.get("filter"), HashMap.class);
        // query parameter
        queryParamsMap.put("filter", filterMap);
        queryParamsMap.put("limitFrom", limitFrom);
        queryParamsMap.put("cacheNum", cacheNum);
        // partner + self
        List<Long> userIdList = userService.getPartnerIdList(request);
        userIdList.add(userId);
        queryParamsMap.put("userIdList", userIdList);
        List<Long> itemIdList = itemMapper.getCurrentPageItemIds(queryParamsMap);
        List<ItemDetailDto> itemDetailList = new ArrayList<>();
        if (!itemIdList.isEmpty() && filterMap.get("bookName") != null) {
            itemIdList = itemMapper.filterItemIdsByBookName(userId, itemIdList, (String) filterMap.get("bookName"));
        }
        if (!itemIdList.isEmpty()) {
            List<Long> bookIdList = bookMapper.getAuthBookIdList(userId);
            itemDetailList = itemMapper.getItemDetailByUserId(userId, itemIdList, bookIdList);
        }
        // return data
        Map<String, Object> data = new HashMap<>();
        data.put("itemList", itemDetailList);
        data.put("total", itemMapper.getItemCntByUserId(userId));
        return data;
    }

    @Override
    public Object getValidType() {
        return this.VALID_TYPE;
    }
}
