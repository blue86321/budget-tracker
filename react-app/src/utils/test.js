
import moment from 'moment';


const generateRecentDataList = (idx) => {
  const now = moment()
  const days = new Date(now.format("YYYY"), now.format("MM"), 0).getDate()
  const recentDataList = []
  for (let i = days; i >= 1; i -= 1) {
    recentDataList.push({
      date: now.format("YYYY-MM-" + new Array(2 - i.toString().length + 1).join(0) + i),
      income: Math.round(10 * i * Math.sin(i * 50), 2) + 400 + Math.floor(Math.random() * 100) - 20,
      expense: Math.floor(2 * i * Math.cos(i * 100)) + 150 + Math.floor(Math.random() * 100) - 30,
    })
  }
  return recentDataList
}


const generateRandomParamForDate = () => {
  const now = moment()
  const days = new Date(now.format("YYYY"), now.format("MM"), 0).getDate()
  const randomParam = []
  for (let i = 1; i <= days; i += 1) {
    const param = Math.round(Math.random(), 2) + 0.2
    randomParam.push(param < 1 ? param : 0.9)
  }
  return randomParam
}


/**
 * Generate test data when server side is down
 */
class RootTest {
  constructor() {
    this.userInfo = { nickname: "Zack", username: "asdf" }
    this.bookList = [
      {
        bookId: "1",
        createTime: "2022-05-14T07:15:00.000+00:00",
        name: "Peronsal",
        role: "author",
      },
      {
        bookId: "10",
        createTime: "2022-05-18T17:45:15.000+00:00",
        name: "Household",
        role: "partner",
      },
      {
        bookId: "11",
        createTime: "2022-05-22T16:23:15.000+00:00",
        name: "Empty Book",
        role: "author",
      }
    ]

    this.bookRecentDetailList = [
      {
        bookId: 1,
        recentDataList: [],
      },
      {
        bookId: 10,
        recentDataList: generateRecentDataList(1),
      },
      {
        bookId: 11,
        recentDataList: [],
      },
    ]

    const incomeRandomParam = generateRandomParamForDate()
    const expenseRandomParam = generateRandomParamForDate()
    this.bookRecentDetailList[0].recentDataList = this.bookRecentDetailList[1].recentDataList
      .map((item, idx) => {
        const newItem = { ...item }
        newItem.income = Math.floor(newItem.income * incomeRandomParam[idx])
        newItem.expense = Math.floor(newItem.expense * expenseRandomParam[idx])
        return newItem
      })
    this.bookRecentDetailList[2].recentDataList = this.bookRecentDetailList[1].recentDataList
      .map(item => {
        const newItem = { ...item }
        newItem.expense = 0
        newItem.income = 0
        return newItem
      })


    this.bookInfoList = [
      {
        authorNickname: "Zack",
        authorUsername: "asdf",
        bookId: 1,
        bookName: "Personal",
        canUserEdit: true,
        createTime: "2022-05-01T07:15:00.000+00:00",
        lastModifiedTime: "2022-05-31T07:15:00.000+00:00",
        partnerList: [
          { username: 'asdf', nickname: 'Zack' },
        ],
        totalExpense: this.bookRecentDetailList[0].recentDataList.map(i => i.expense).reduce((prev, cur) => prev + cur),
        totalIncome: this.bookRecentDetailList[0].recentDataList.map(i => i.income).reduce((prev, cur) => prev + cur),
      },
      {
        authorNickname: "Cindy",
        authorUsername: "asdf111",
        bookId: 10,
        bookName: "Household",
        canUserEdit: false,
        createTime: "2022-05-01T17:45:15.000+00:00",
        lastModifiedTime: "2022-05-31T13:51:31.000+00:00",
        partnerList: [
          { username: 'asdf111', nickname: 'Cindy' },
          { username: 'asdf', nickname: 'Zack' },
          { username: 'zxcv', nickname: 'John' },
        ],
        totalExpense: this.bookRecentDetailList[1].recentDataList.map(i => i.expense).reduce((prev, cur) => prev + cur),
        totalIncome: this.bookRecentDetailList[1].recentDataList.map(i => i.income).reduce((prev, cur) => prev + cur),
      },
      {
        authorNickname: "Zack",
        authorUsername: "asdf",
        bookId: 11,
        bookName: "Empty Book",
        canUserEdit: true,
        createTime: "2022-05-22T16:23:15.000+00:00",
        lastModifiedTime: "2022-05-22T16:23:15.000+00:00",
        partnerList: [
          { username: 'asdf', nickname: 'Zack' },
          { username: 'zxcv', nickname: 'John' },
        ],
        totalExpense: 0,
        totalIncome: 0,
      },
    ]

    this.userPersonalRecentDataList = this.bookRecentDetailList[0].recentDataList
    this.userAllBookRecentDataList = this.bookRecentDetailList[1].recentDataList

    this.inviteList = [
      {
        bookId: 12,
        bookName: "Cindy and Zack",
        inviteId: 7,
        nickname: "Cindy",
        username: "asdf111",
      },
      {
        bookId: 14,
        bookName: "Travel",
        inviteId: 9,
        nickname: "Cindy",
        username: "asdf111",
      },
      {
        bookId: 25,
        bookName: "School Life",
        inviteId: 13,
        nickname: "Jogn",
        username: "zxcv",
      },
    ]

    this.categoryList = ['Food', 'Transport', 'Top-up']

    this.typeList = ['income', 'expense']

    const possibleItemAuthor = [
      { username: 'asdf111', nickname: 'Cindy' },
      { username: 'zxcv', nickname: 'John' },
      { username: 'asdf', nickname: 'Zack' },
    ]

    const itemBookList = [{ bookId: 1, bookName: 'Personal' }, { bookId: 10, bookName: 'Household' }]
    this.itemList = this.bookRecentDetailList[1].recentDataList.map((item, idx) => {
      const randomAuthorIdx = Math.floor(Math.random() * possibleItemAuthor.length)
      const isUserAuthor = possibleItemAuthor[randomAuthorIdx].username === this.userInfo.username
      const newItemList = [
        {
          itemId: idx * 2,
          date: item.date,
          type: 'expense',
          amount: item.expense,
          note: "",
          createTime: new Date().toISOString(),
          category: this.categoryList[Math.floor(Math.random() * 3)],
          authorUsername: possibleItemAuthor[randomAuthorIdx].username,
          authorNickname: possibleItemAuthor[randomAuthorIdx].nickname,
          bookList: isUserAuthor ? itemBookList : itemBookList.filter(item => item.bookId !== 1)
        },
        {
          itemId: idx * 2 + 1,
          date: item.date,
          type: 'income',
          amount: item.income,
          note: "",
          createTime: moment(),
          category: 'paycheck',
          authorUsername: possibleItemAuthor[randomAuthorIdx].username,
          authorNickname: possibleItemAuthor[randomAuthorIdx].nickname,
          bookList: isUserAuthor ? itemBookList : itemBookList.filter(item => item.bookId !== 1)
        },
      ]
      return newItemList

    }).flat()


    this.userStat = {
      nickname: "Zack",
      partnerCnt: 2,
      selfBookCnt: 1,
      selfExpense: this.userPersonalRecentDataList.map(item => item.expense).reduce((prev, cur) => prev + cur),
      selfIncome: this.userPersonalRecentDataList.map(item => item.income).reduce((prev, cur) => prev + cur),
      selfItemCnt: this.itemList.filter(item => item.authorUsername === this.userInfo.username).length,
      totalBookCnt: 3,
      totalExpense: this.userAllBookRecentDataList.map(item => item.expense).reduce((prev, cur) => prev + cur),
      totalIncome: this.userAllBookRecentDataList.map(item => item.income).reduce((prev, cur) => prev + cur),
      totalItemCnt: this.itemList.length,
      username: "asdf",
    }

    this.partnerList = [
      {
        nickname: "John",
        username: "zxcv",
        bookStatList: [
          {
            bookId: 10,
            bookName: 'Household',
            bookExpense: this.bookInfoList[1].totalExpense,
            bookIncome: this.bookInfoList[1].totalIncome,
            partnerRole: 'partner',
            partnerExpense: this.itemList
              .filter(item => item.authorUsername === 'zxcv' && item.type === 'expense')
              .map(item => item.amount)
              .reduce((prev, cur) => prev + cur),
            partnerIncome: this.itemList
              .filter(item => item.authorUsername === 'zxcv' && item.type === 'income')
              .map(item => item.amount)
              .reduce((prev, cur) => prev + cur),
          },
          {
            bookId: 11,
            bookName: 'Empty Book',
            bookExpense: 0,
            bookIncome: 0,
            partnerRole: 'partner',
            partnerExpense: 0,
            partnerIncome: 0,
          },
        ],
      },
      {
        nickname: "Cindy",
        username: "asdf111",
        bookStatList: [
          {
            bookId: 10,
            bookName: 'Household',
            bookExpense: this.bookInfoList[1].totalExpense,
            bookIncome: this.bookInfoList[1].totalIncome,
            partnerRole: 'author',
            partnerExpense: this.itemList
              .filter(item => item.authorUsername === 'asdf111' && item.type === 'expense')
              .map(item => item.amount)
              .reduce((prev, cur) => prev + cur),
            partnerIncome: this.itemList
              .filter(item => item.authorUsername === 'asdf111' && item.type === 'income')
              .map(item => item.amount)
              .reduce((prev, cur) => prev + cur),
          },
        ],
      }
    ]
  }
}


const TestData = new RootTest()
export default TestData
