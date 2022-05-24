package com.chunwei.budgettracker.springboot.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("com.chunwei.budgettracker.springboot.mapper")
public class MybatisConfig {

//    @Bean
//    public MybatisPlusInterceptor MybatisPlusInterceptor() {
//        MybatisPlusInterceptor mybatisPlusInterceptor = new MybatisPlusInterceptor();
//        // 分页插件
//        mybatisPlusInterceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
//        return mybatisPlusInterceptor;
//    }
}
