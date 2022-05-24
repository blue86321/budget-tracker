# Budget Tracker (Full-Stack Project)
Author: Chunwei Chang


- [Introduction](#introduction)
- [Project Preview](#project-preview)
- [Tech Stack List](#tech-stack-list)
- [Highlight](#highlight)
  - [Front-end](#front-end)
  - [Back-end](#back-end)
- [Limitation](#limitation)
- [How to run on your computer](#how-to-run-on-your-computer)
- [Development Timeline and Detail](#development-timeline-and-detail)
  - [Development Timeline](#development-timeline)
  - [Development Detail](#development-detail)

## Introduction
**Budget Tracker**: an website for users to track their money privitely or **with others**.

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


## Development Timeline and Detail

### Development Timeline
| Date         | Title                                      |
| ------------ | ------------------------------------------ |
| May 9, 2022  | React + SpringBoot init                    |
| May 10, 2022 | Database Design (ERD, MySQL)               |
| May 11, 2022 | MyBatis, React, MobX, Antd                 |
| May 12, 2022 | JWT, Interceptor, CORS, Antd               |
| May 13, 2022 | Http code, Echarts, Antd table             |
| May 14, 2022 | database, Service, MyBatis-Plus, [NewItem] |
| May 15, 2022 | [NewItem] done, both end                   |
| May 16, 2022 | [Finance] filter, query cache optimization |
| May 17, 2022 | MyBatis <if>, [Book] (carousel, Echarts)   |
| May 18, 2022 | page draft, business logic                 |
| May 19, 2022 | [Notification], partner logic              |
| May 20, 2022 | [Partner], tabs                            |
| May 21, 2022 | Break                                      |
| May 22, 2022 | [Dashboard], logo                          |
| May 23, 2022 | Refresh Token, test data                   |


### Development Detail
#### May 9, 2022 - React + SpringBoot init


#### May 10, 2022 - Database Design (ERD, MySQL)
![](https://github.com/blue86321/budget-tracker/blob/master/ER_diagram.png)

#### May 11, 2022 - MyBatis, React, MobX, Antd
**Front-end**
1. MobX: manage data, similar to Redux
2. scss (sassy CSS), similar to Less
3. Antd UI framework (look up, then copy & paste, that’s how UI framework works)

**Back-end**
1. DTO (Data Transfer Object)
2. separate Controller, Service


#### May 12, 2022 - JWT, Interceptor, CORS, Antd
**Back-end**
1. token (local storage), login, logout
2. Antd, prepare Layout

**Front-end**
1. JSON Web Token (JWT), how it works (header.payload.signature)
2. combine with interceptor to make sure a user has logged in
3. configure CORS in SpringBoot, make sure Front-end can get data


#### May 13, 2022 - Http code, Echarts, Antd table
**Front-end**
1. sign out feature
2. filter (go to /login when GET response 401 status code)
3. Echarts init
4. Antd table, init, delete feature (only on front-end)

**Back-end**
1. customized http code, re-constructure filter, JwtUtil, UserService


#### May 14, 2022 - database, Service, MyBatis-Plus, [NewItem]
**Front-end**
1. Antd, [NewItem] button and its form

**Back-end**
1. database re-construct, new table: book_invite
2. SpringBoot Service re-construct, send map parameter, remove most DTO
3. MyBatis-Plus, query data from database


#### May 15, 2022 - [NewItem] done, both end
**Front-end**
1. [NewItem] form complete
2. default data, data validation, extended dropdown
3. data population. Get data from back-end, then populate the drop menu

**Back-end**
1. ItemService: addItem
2. database, new table: Category
3. query for front-end data population. e.g. category, book


#### May 16, 2022 - [Finance] filter, query cache optimization
**Front-end**
1. [Finance] filter done
2. cache some data in front-end, reduce frequency to directly query database
3. mobx stores optimization. Mostly, getter will query back-end when dataList is empty

**Back-end**
1. SpringBoot controller parse data in different request.
   - get: @RequestParam
   - other: front-end wrap in “data”, which is @RequestBody
2. query itemDetailList by front-end params


#### May 17, 2022 - MyBatis <if>, [Book] (carousel, Echarts
**Front-end**
1. Antd Carousel with arrows (prev, next)
2. Carousel Card
3. Connect carousel data and description section
4. (draft) implement echarts in desription section

**Back-end**
1. MyBatis &lt;if&gt; inject HashMap parameter
2. BookDetail SQL query with resultMap


#### May 18, 2022 - page draft, business logic
**Front-end**
1. [Book] page 90%, with double-axis Echarts, invite, new book, rename function
2. [Partner] page draft, framework
3. [Notification] page draft, framework

**Back-end**
1. Book Controller, REST API, with delete, put (update), add


#### May 19, 2022 - [Notification], partner logic
**Front-end**
1. mobx data
   - [Notification]
   - [Book], partner detail, delete book

**Back-end**
1. `@Controller` try-catch, pack data into ResponseEntity, `@Service` return raw data
2. partner logic done: send invitation, respond, the right to see item detail, book stat
3. [Finance] table, delete logic, as long as they have the right in the book:
   - user can see partner’s item
   - user can delete partner’s item


#### May 20, 2022 - [Partner], tabs
**Front-end**
1. [Partner], tabs (overview, management). Originally using modals wrap a table to edit, but when table data update, all page will re-render, so using [tabs] in the end.
2. support revoke partnership

**Back-end**
1. partnerList, partner nested with book stat
2. revoke partnership logic
3. queryWrapper code rewrite


#### May 21, 2022 - ✌️ Break


#### May 22, 2022 - [Dashboard], logo
**Back-end**
1. separate [Dashboard] query, 1 for static, 1 for dynamic chart

**Front-end**
1. separate [Dashboard] query, 1 for static, 1 for dynamic chart
2. [Dashboard] page done
3. separate Personal and AllBook part
4. combine echarts and antd component, so that user can filter data
5. notification badge
6. side menu logo
7. [Book] trend chart optimization, same as [Dashboard] (user can filter)
8. [Book] card actions. It shows only when user has the authority


#### May 23, 2022 - Refresh Token, test data
**Front-end**
1. refresh token with axios
2. sample test data when server is down

**Back-end**
1. JWT refresh token
