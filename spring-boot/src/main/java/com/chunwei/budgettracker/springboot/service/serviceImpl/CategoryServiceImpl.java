package com.chunwei.budgettracker.springboot.service.serviceImpl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chunwei.budgettracker.springboot.common.Result;
import com.chunwei.budgettracker.springboot.entity.Category;
import com.chunwei.budgettracker.springboot.mapper.CategoryMapper;
import com.chunwei.budgettracker.springboot.service.CategoryService;
import com.chunwei.budgettracker.springboot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {



    @Autowired
    UserService userService;

    @Autowired
    CategoryMapper categoryMapper;

    private List<String> getUniqueCategoryList(Long userId) {
        List<Category> categoryList = categoryMapper.selectList(
                new QueryWrapper<Category>()
                        .select("DISTINCT category")
                        .eq("user_id", userId)
        );
        List<String> categoryNameList = new ArrayList<>();
        for (Category category : categoryList) {
            categoryNameList.add(category.getCategory());
        }
        return categoryNameList;
    }

    @Override
    public Object getUniqueCategoryList(HttpServletRequest request) {
        Long userId = userService.getUserIdByRequest(request);
        List<String> categoryList = this.getUniqueCategoryList(userId);
        return categoryList;
    }

    @Override
    public Object addCategory(Map<String, Object> map, HttpServletRequest request) {
        String newCategory = (String) map.get("newCategory");
        Long userId = userService.getUserIdByRequest(request);
        if (newCategory == null || "".equals(newCategory)) {
            throw new RuntimeException("Parameter error: newCategory is null or empty");
        }
        for (String category : this.getUniqueCategoryList(userId)) {
            if (newCategory.equals(category)) {
                throw new RuntimeException("Category exists");
            }
        }
        categoryMapper.insert(new Category(userId, newCategory));
        return null;
    }
}
