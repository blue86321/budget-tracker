package com.chunwei.budgettracker.springboot.controller;

import com.chunwei.budgettracker.springboot.common.Result;
import com.chunwei.budgettracker.springboot.service.ItemService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/item")
@Slf4j
public class ItemController {

    @Autowired
    ItemService itemService;

    @PostMapping
    public ResponseEntity<Object> addItem(@RequestBody Map<String, Object> map, HttpServletRequest request) {
        try {
            Object data = itemService.addItem(map, request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage());
            return Result.fail("add an item error");
        }
    }

    /**
     * Delete item by ArrayList<String> itemIdList
     */
    @DeleteMapping("/list")
    public ResponseEntity<Object> batchDeleteItem(@RequestBody Map<String, Object> map, HttpServletRequest request) {
        try {
            Object data = itemService.deleteBatchItems(map, request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage());
            return Result.fail("batch delete item error");
        }
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Object> deleteItem(@PathVariable Long itemId, HttpServletRequest request) {
        try {
            Object data = itemService.deleteItemById(itemId, request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage());
            return Result.fail("delete an item error");
        }
    }

    @GetMapping("/list")
    public ResponseEntity<Object> getItemList(@RequestParam Map<String, String> paramsMap, HttpServletRequest request) {
        try {
            Object data = itemService.getItemList(paramsMap, request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage());
            return Result.fail("get item list error");
        }

    }

    @GetMapping("/valid_type")
    public ResponseEntity<Object> getValidType() {
        try {
            Object data = itemService.getValidType();
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage());
            return Result.fail("get valid type error");
        }
    }
}
