package com.chunwei.budgettracker.springboot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chunwei.budgettracker.springboot.entity.BookItem;

import java.util.List;

//@Mapper  // 已交给 MybatisConfig 扫描
public interface BookItemMapper extends BaseMapper<BookItem> {

    Integer verifyAuthForItems(Integer userId, List<String> itemIds);

    Integer deleteBatchByItemAndBookIdList(List<String> itemIdList, List<Long> bookIdList);

    Integer deleteByItemId(Long itemId, List<Long> bookIdList);
}
