package com.chunwei.budgettracker.springboot;

import com.chunwei.budgettracker.springboot.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.stream.Stream;

@SpringBootTest
class ApplicationTests {

    @Autowired
    UserService userService;

    /**
     * Test if register works
     * 测试注册是否正常
     * @param username
     * @param password
     * @param success expected result
     */
    @Deprecated
    @DisplayName("Register Test")
    @ParameterizedTest
    @Transactional
    @MethodSource("registerTestProvider")
    void registerTest(String username, String password, Date birthday, boolean success) {

    }

    @Deprecated
    @DisplayName("Login Test")
    @ParameterizedTest
    @Transactional
    @MethodSource("loginTestProvider")
    void loginTest(String username, String password, boolean success) {

    }

    private static Stream<Arguments> registerTestProvider() {
        return Stream.of(
                Arguments.of("abc", "123456", new Date(), false),
                Arguments.of("test_username", "789123", new Date(), true)
        );
    }

    private static Stream<Arguments> loginTestProvider() {
        return Stream.of(
                Arguments.of("abc", "123456", true),
                Arguments.of("test_username", "789123", false)
        );
    }
}
