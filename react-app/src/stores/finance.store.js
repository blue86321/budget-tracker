import { makeAutoObservable } from "mobx";
import moment from 'moment';
import { http } from "utils";
import TestData from "utils/test";
import { v4 as uuidv4 } from 'uuid';

const TABLE_CACHE_ITEM_NUM = 100

export default class FinanceStroe {
  itemList = []
  categoryList = []
  typeList = []
  pageParams = {
    pageSize: 10,
    curPage: 1,
    total: 100,
    cacheNum: TABLE_CACHE_ITEM_NUM,
    curCacheIndex: 0,
    refreshMaxIdx: TABLE_CACHE_ITEM_NUM * 1,
    refreshMinIdx: 0,
    filter: {},
  }

  constructor() {
    makeAutoObservable(this)
  }

  setPageParams = (values) => this.pageParams = values

  getItemList = async () => {
    try {
      const res = await http.get('/item/list', { params: this.pageParams })
      this.setItemList(res.data?.itemList?.map(item => ({ ...item, key: uuidv4() })))
      if (res.data?.total) {
        this.setPageParams({ ...this.pageParams, total: res.data.total })
      }
    } catch (e) {
      this.setItemList(TestData.itemList.map(item => ({ ...item, key: uuidv4() })))
      this.setPageParams({ ...this.pageParams, total: TestData.itemList.length })
      console.log("server side is down", e)
    }
  }

  setItemList = (values) => this.itemList = values

  getCategoryList = async () => {
    try {
      const res = await http.get('/category/list')
      this.setCategoryList(res.data)
    } catch (e) {
      this.setCategoryList(TestData.categoryList)
      console.log("server side is down", e)
    }
  }

  setCategoryList = (values) => this.categoryList = values

  getTypeList = async () => {
    try {
      const res = await http.get('/item/valid_type')
      this.setTypeList(res.data)
    } catch (e) {
      this.setTypeList(TestData.typeList)
      console.log("server side is down", e)
    }
  }

  setTypeList = (values) => this.typeList = values

  addItem = async (itemParams, pageParams) => {
    try {
      const formatParams = { ...itemParams, createTime: moment().format("YYYY-MM-DD HH:mm:ss") }
      formatParams.date = itemParams.date.format("YYYY-MM-DD")
      const res = await http.post('/item', formatParams)
      this.getItemList(pageParams)
    } catch (e) {
      console.log("server side is down", e)
    }
  }

  addCategory = async (newCategory) => {
    try {
      const res = await http.post('/category', { newCategory })
    } catch (e) {
      console.log("server side is down", e)
    } finally {
      this.setCategoryList([...this.categoryList, newCategory])
    }
  }

  deleteItem = async (record) => {
    try {
      const res = await http.delete(`/item/${record.itemId}`)
    } catch (e) {
      console.log("server side is down", e)
    } finally {
      this.setItemList(this.itemList.filter(item => item.key !== record.key))
    }
  }

  deleteBatchItems = async (selectedRowKeys) => {
    try {
      const itemIdList = this.itemList
        .filter(item => selectedRowKeys.indexOf(item.key) !== -1)
        .map(item => item.itemId)
      const res = await http.delete('/item/list', { data: { itemIdList } })
    } catch (e) {
      console.log("server side is down", e)
      throw e
    } finally {
      this.setItemList(this.itemList.filter(item => selectedRowKeys.indexOf(item.key) === -1))
      this.setPageParams({ ...this.pageParams, total: this.pageParams.total - selectedRowKeys.length })
    }
  }
}
