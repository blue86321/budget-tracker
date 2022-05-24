import { makeAutoObservable } from "mobx";
import { http } from "utils";
import TestData from "utils/test";


export default class UserStore {

  userInfo = {}
  userStat = {}
  userPersonalRecentDataList = []
  userAllBookRecentDataList = []

  constructor() {
    makeAutoObservable(this)
  }

  getUserInfo = async () => {
    try {
      const res = await http.get('/user/info')
      this.setUserInfo(res.data)
    } catch (e) {
      this.setUserInfo(TestData.userInfo)
      console.log("server side is down", e)
    }
  }

  setUserInfo = (values) => this.userInfo = values

  getUserStat = async () => {
    try {
      const res = await http.get('/user/stat')
      this.setUserStat(res.data)
    } catch (e) {
      this.setUserStat(TestData.userStat)
      console.log("server side is down", e)
    }
  }

  setUserStat = (values) => this.userStat = values

  getUserPersonalRecentDataList = async (startDate) => {
    try {
      const res = await http.get('/user/recent_detail', { params: { scope: 'personal', startDate } })
      res.data = res.data?.sort((a, b) => a.date > b.date ? 1 : -1)
      this.setUserPersonalRecentDataList(res.data)
    } catch (e) {
      this.setUserPersonalRecentDataList(TestData.userPersonalRecentDataList)
      console.log("server side is down", e)
    }
  }

  setUserPersonalRecentDataList = (values) => this.userPersonalRecentDataList = values

  getUserAllBookRecentDataList = async (startDate) => {
    try {
      const res = await http.get('/user/recent_detail', { params: { scope: 'allBook', startDate } })
      res.data = res.data?.sort((a, b) => a.date > b.date ? 1 : -1)
      this.setUserAllBookRecentDataList(res.data)
    } catch (e) {
      this.setUserAllBookRecentDataList(TestData.userAllBookRecentDataList)
      console.log("server side is down", e)
    }
  }

  setUserAllBookRecentDataList = (values) => this.userAllBookRecentDataList = values

}
