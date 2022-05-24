# Budget Tracker (full-stack project)
Author: Chunwei Chang


- [Introduction](#introduction)
- [Project Preview](#project-preview)
- [Tech Stack List](#tech-stack-list)
- [Highlight](#highlight)
  - [Front-end](#front-end)
  - [Back-end](#back-end)
- [Limitation](#limitation)
- [How to run on your computer](#how-to-run-on-your-computer)


## Introduction
**Budget Tracker**
: an website for users to track their money privitely or **with others**.

**Full-Stack Project**
- **Front-end**: `React` + `MobX`, [Front-end Priview](https://blue86321.github.io/budget-tracker/) (test data)
- **Back-end**: `SpringBoot` + `MyBatis`, SSM (Spring-SpringMVC-MyBatis) structure


## Project Preview
![](https://github.com/blue86321/budget-tracker/blob/master/project_preview.gif)

## Tech Stack List
| Type      | Tool         | Version | Comment                              |
| --------- | ------------ | ------- | ------------------------------------ |
| Front-end | React        | 18.1.0  | functional component, hooks          |
|           | Mobx         | 6.5.0   | manage data, similiar to `Redux`     |
|           | scss         |         | Sassy css, similar to `Less`         |
|           | axios        | 0.27.2  | send/receive data from back-end      |
|           | Ant Design   | 4.20.3  | UI framework                         |
|           | Echarts      | 5.3.2   | Chart framework                      |
| Back-end  | SpringBoot   | 2.6.7   | `Spring` + `SpringMVC`, easy to use  |
|           | MyBatis      | 3.5.9   | operate data in database             |
|           | MyBatis-Plus | 3.5.1   | some helper API for `MyBatis`        |
|           | MySQL        | 5.7     | database                             |
|           | JWT          |         | authorization (token, refresh token) |


## Highlight
### Front-end
- ✅ Developed by lots of `React hooks`, such as `useState()`, `useEffect()`, `useRef()`
- ✅ `MobX` + `hooks` to manage data, components can get data with `useStore()`
- ✅ `Axisos` interceptor, use `token` to check if an user is logged-in, otherwise go to login page
- ✅ `Auth` component to ensure an user is valid
    ```js
    <Route path="/" element={
        <Auth>
            <MainLayout />
        </Auth>
    }>
    ```
    ```js
    function Auth({ children }) {
        const token = getLocalToken()

        if (token) {
            // token exists, show children component
            return <>{children}</>
        } else {
            // not exist, go to login page
            return <Navigate to='/login' replace></Navigate>
        }
    }
    ```
- ✅ Simple cache
  - Since back-end will not return all table data, we might query every time when user go to another page, here we cache some table data in the front-end.
    ```js
    const updateTable = async (newPageParams) => {
        setTableLoading(true)
        const { oldFilter } = financeStore.pageParams
        const newFilter = newPageParams.filter
        const {
            curCacheIndex,
            refreshMinIdx, 
            refreshMaxIdx, 
            cacheNum, 
            pageSize,
        } = financeStore.pageParams
        
        financeStore.setPageParams({ ...financeStore.pageParams, ...newPageParams })
        
        /**
         * query database condition: 
         *  Cache some data on the front-end, only when condition meet will query the database.
         *  在前端 cache 一部分数据, 只有当查看的数据不在 cache 时, 才会发起请求
         */
        if (curCacheIndex < refreshMinIdx ||
            curCacheIndex + pageSize > refreshMaxIdx ||
            JSON.stringify(oldFilter) !== JSON.stringify(newFilter)) {

            await financeStore.getItemList()
            financeStore.setPageParams({ 
                ...financeStore.pageParams, 
                refreshMinIdx: curCacheIndex, 
                refreshMaxIdx: curCacheIndex + cacheNum
            })
        }
        setTableLoading(false)
    }
    ```


### Back-end
- ✅ `JWT token + refresh token` to ensure a request is valid
- ✅ `Spring` IOC container, easy to use `Bean` by calling  `@Autowire`
- ✅ `Model-View-Controller` (MVC) structure
  - Model: `MyBatis` + `MySQL`
  - View: Json Object
  - Controller: `SpringMVC` controller
- ✅ Unified response obejct, **Result** is an object to handle return value to the front-end
    ```java
    @GetMapping("/stat")
    public ResponseEntity<Object> getUserStat(HttpServletRequest request) {
        try {
            Object data = userService.getUserStat(request);
            return Result.success(data);
        } catch (Exception e) {
            log.info(e.getMessage());
            return Result.fail("Get user stat error");
        }
    }
    ```

## Limitation
- ⚠️ No formal cache mechanism
  - Front-end will query database directly via `SpringBoot`, there is no cache in-between such as **`Redis`**
- ⚠️ Not using too many database features
  - No `Foreign Key` to ensure cascade update, all controlled by developer in code
  - No `Storage procedure` to package a series operation
- ⚠️ No password encryption in transmiting and data storage


## How to run on your computer
1. Clone the project to your computer
2. Install dependencies
   1. **React (Front-end)**
       - `cd react-app`
       - `npm install`
       - `npm start`
       - Visit http://localhost:3000
   2. **MySQL (Database)**
       - Import data in `MySQLDump` to your MySQL database
       - (Optional) Assign a username and password to opearte this schema
   3. **SpringBoot (Back-end)**
       - Visit `spring-boot` directory
       - Open `pom.xml` as a Maven project in your IDE
       - Refresh and install Maven dependencies
       - Edit datasource settings
         - **`application.yaml`** in `spring-boot/src/java/resources/`
         - especially the `username` and `password` to link MySQL
       - Maven compile and Run the project
       - Base URL: http://localhost:8080
3. You are ready to go
