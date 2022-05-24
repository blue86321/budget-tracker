package com.chunwei.budgettracker.springboot.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.chunwei.budgettracker.springboot.entity.Item;
import com.fasterxml.jackson.core.JsonProcessingException;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.Map;

public interface ItemService extends IService<Item> {

    public static final String[] VALID_TYPE = new String[]{"income", "expense"};

    Object addItem(Map<String, Object> map, HttpServletRequest request) throws ParseException;

    Object deleteBatchItems(Map<String, Object> map, HttpServletRequest request);

    Object deleteItemById(Long itemId, HttpServletRequest request);

    Object getItemList(Map<String, String> paramsMap, HttpServletRequest request) throws JsonProcessingException;

    Object getValidType();
}
