package com.chunwei.budgettracker.springboot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chunwei.budgettracker.springboot.dto.ItemDetailDto;
import com.chunwei.budgettracker.springboot.entity.Item;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

//@Mapper  // 已交给 MybatisConfig 扫描
public interface ItemMapper extends BaseMapper<Item>{

    Integer countAuthItem(Long userId, List<String> itemIdList, List<Long> authBookIdList);

    List<ItemDetailDto> getItemDetailByUserId(Long userId, List<Long> itemIdList, List<Long> bookIdList);

    List<Long> filterItemIdsByBookName(Long userId, List<Long> itemIdList, String bookName);

    List<Long> getCurrentPageItemIds(@Param("map") Map<String, Object> queryParamsMap);

    List<Long> getNoBookItemIdList(List<String> itemIdList);

    Integer getItemCntByUserId(Long userId);
}





