package com.chunwei.budgettracker.springboot.controller;

import com.chunwei.budgettracker.springboot.common.Result;
import com.chunwei.budgettracker.springboot.service.CategoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/category")
@Slf4j
public class CategoryController {

    @Autowired
    CategoryService categoryService;

    @GetMapping("/list")
    public ResponseEntity<Object> getCategoryList(HttpServletRequest request) {
        try {
            Object data = categoryService.getUniqueCategoryList(request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage());
            return Result.fail("get category list error");
        }
    }

    @PostMapping
    public ResponseEntity<Object> addCategory(@RequestBody Map<String, Object> map, HttpServletRequest request) {
        try {
            Object data = categoryService.addCategory(map, request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage());
            return Result.fail("add category error");
        }
    }
}
