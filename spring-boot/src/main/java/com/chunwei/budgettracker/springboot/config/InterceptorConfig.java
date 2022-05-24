package com.chunwei.budgettracker.springboot.config;

import com.chunwei.budgettracker.springboot.interceptor.LoginStateInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class InterceptorConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // LoginStateInterceptor
        registry.addInterceptor(new LoginStateInterceptor())
                .addPathPatterns("/**")
                .excludePathPatterns("/user/login", "/user/register", "/user/refresh_token");
    }
}
