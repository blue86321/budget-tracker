import { makeAutoObservable } from "mobx";
import { http } from "utils";
import TestData from "utils/test";


export default class BookStore {
  bookList = []
  bookInfoList = []
  bookRecentDetailList = []
  carouselBookInfo = {}
  carouselBookRecentDetail = {}

  constructor() {
    makeAutoObservable(this)
  }

  getBookList = async () => {
    try {
      const res = await http.get('/book/list')
      this.setBookList(res.data)
    } catch (e) {
      this.setBookList(TestData.bookList)
      console.log("server side is down", e)
    }
  }

  setBookList = (values) => this.bookList = values

  getBookInfoList = async () => {
    try {
      const res = await http.get('/book/list/info')
      this.setBookInfoList(res.data)
      this.setCarouselBookInfoByIdx(0)
    } catch (e) {
      this.setBookInfoList(TestData.bookInfoList)
      this.setCarouselBookInfoByIdx(0)
      console.log("server side is down", e)
    }
  }

  getBookRecentDetailList = async (startDate) => {
    try {
      const res = await http.get('/book/list/recent_detail', { params: { startDate } })
      res.data = res.data.map(item => {
        if (item.recentDataList) {
          item.recentDataList = item.recentDataList.sort((a, b) => a.date > b.date ? 1 : -1)
        }
        return item
      })
      this.setBookRecentDetailList(res.data)
      this.setCarouselBookRecentDetailByIdx(0)
    } catch (e) {
      this.setBookRecentDetailList(TestData.bookRecentDetailList)
      this.setCarouselBookRecentDetailByIdx(0)
      console.log("server side is down", e)
    }
  }

  setCarouselBookRecentDetailByIdx = (index) => {
    this.setCarouselBookRecentDetail(this.bookRecentDetailList[index])
  }

  setCarouselBookRecentDetail = values => this.carouselBookRecentDetail = values

  setCarouselBookInfoByIdx = (index) => {
    this.setCarouselBookInfo(this.bookInfoList[index])
  }

  setCarouselBookInfo = (values) => this.carouselBookInfo = values

  setCarouselBookInfoBookName = (newBookName) => this.carouselBookInfo.bookName = newBookName

  addBook = async (values) => {
    const { bookName } = values
    const formatParams = { bookName }
    try {
      const res = await http.post('/book', formatParams)
    } catch (e) {
      console.log("server side is down", e)
    } finally {
      this.getBookList()
      this.getBookInfoList()
    }
  }

  deleteBook = async (values) => {
    const { bookId } = values
    try {
      const res = await http.delete(`/book/${bookId}`)
    } catch (e) {
      console.log("server side is down", e)
    } finally {
      this.setBookInfoList(this.bookInfoList.filter(book => book.bookId !== bookId))
      this.setBookRecentDetailList(this.bookRecentDetailList.filter(book => book.bookId !== bookId))
    }
  }

  renameBook = async (values, bookInfo) => {
    const { newBookName } = values
    const { bookId } = bookInfo
    const formatParams = { newBookName }
    try {
      const res = await http.put(`/book/${bookId}`, formatParams)
    } catch (e) {
      console.log("server side is down", e)
    } finally {
      this.setCarouselBookInfoBookName(newBookName)
      this.setBookInfoList(
        this.bookInfoList.map(book => {
          if (book.bookId === bookId) {
            book.bookId = bookId
            return book
          } else {
            return book
          }
        })
      )
    }
  }

  setBookInfoList = (values) => this.bookInfoList = values

  setBookRecentDetailList = (values) => this.bookRecentDetailList = values
}
