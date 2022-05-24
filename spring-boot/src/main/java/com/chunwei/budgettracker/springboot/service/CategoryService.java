package com.chunwei.budgettracker.springboot.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.chunwei.budgettracker.springboot.entity.Category;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

public interface CategoryService extends IService<Category> {

    String[] DEFAULT_CATEGORY = new String[]{
            "Food", "Transport", "Top-up", "Entertainment", "Other"
    };

    Object getUniqueCategoryList(HttpServletRequest request);

    Object addCategory(Map<String, Object> map, HttpServletRequest request);
}
