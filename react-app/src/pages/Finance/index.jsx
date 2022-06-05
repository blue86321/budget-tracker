import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, message, Popconfirm, Row, Select, Table, Tag, Tooltip } from 'antd';
import NewItem from 'components/NewItem';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useStore } from 'stores';
import { antdTagColor } from 'utils/constant';
import { v4 as uuidv4 } from 'uuid';
import './index.scss';

const { Option } = Select;
const { RangePicker } = DatePicker

const Finance = () => {

  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const { financeStore, bookStore } = useStore()
  const [form] = Form.useForm()

  useEffect(() => {
    financeStore.getItemList()
    financeStore.getTypeList()
    financeStore.getCategoryList()
    bookStore.getBookList()
  }, [bookStore, financeStore])


  const updateTable = async (newPageParams) => {
    setTableLoading(true)
    const { oldFilter } = financeStore.pageParams
    const newFilter = newPageParams.filter
    financeStore.setPageParams({ ...financeStore.pageParams, ...newPageParams })
    /**
     * query database condition: 
     *  Cache some data on the front-end, only when condition meet will query the database.
     *  在前端 cache 一部分数据, 只有当查看的数据不在 cache 时, 才会发起请求
     */
    const { curCacheIndex, refreshMinIdx, refreshMaxIdx, cacheNum, pageSize } = financeStore.pageParams
    if (curCacheIndex < refreshMinIdx ||
      curCacheIndex + pageSize > refreshMaxIdx ||
      JSON.stringify(oldFilter) !== JSON.stringify(newFilter)) {
      await financeStore.getItemList()
      financeStore.setPageParams({ ...financeStore.pageParams, refreshMinIdx: curCacheIndex, refreshMaxIdx: curCacheIndex + cacheNum })
    }
    setTableLoading(false)
  }

  const onPageChange = (curPage, pageSize) => {
    const newPageParams = { curPage, pageSize, curCacheIndex: (curPage - 1) * pageSize }
    updateTable(newPageParams)
  }

  const onFilterFinish = (values) => {
    const { date, type, category, bookList } = values
    const newFilterParams = {}
    if (date) {
      newFilterParams.dateBegin = date[0].format("YYYY-MM-DD")
      newFilterParams.dateEnd = date[1].format("YYYY-MM-DD")
    }
    if (type) {
      newFilterParams.type = type
    }
    if (category) {
      newFilterParams.category = category
    }
    if (bookList) {
      newFilterParams.bookName = bookList
    }
    updateTable({ filter: newFilterParams })
  }

  const deleteRecord = async (record) => {
    await financeStore.deleteItem(record)
    setSelectedRowKeys(selectedRowKeys.filter(key => key !== record.key))
  }

  const deleteBatchItems = async () => {
    setLoading(true)
    try {
      await financeStore.deleteBatchItems(selectedRowKeys)
    } catch (e) {
      message.error(e)
    }
    setSelectedRowKeys([])
    setLoading(false)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedRowKeys => {
      setSelectedRowKeys(selectedRowKeys)
    }
  }

  const hasSelected = selectedRowKeys.length > 0;

  const filterItems = [
    <Col span={6} key="col-date">
      <Form.Item name="date" label="Date" key="filter-date">
        <RangePicker style={{ width: '100%' }} />
      </Form.Item>
    </Col>
    ,
    <Col span={6} key="col-type">
      <Form.Item name="type" label="Type" key="filter-type">
        <Select allowClear placeholder="Type">
          {financeStore.typeList.map(item => (
            <Option key={uuidv4()} value={item}>{item}</Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
    ,
    <Col span={6} key="col-category">
      <Form.Item name="category" label="Category" key="filter-category">
        <Select allowClear placeholder="Category">
          {financeStore.categoryList.map(item => (
            <Option key={uuidv4()} value={item}>{item}</Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
    ,
    <Col span={6} key="col-book">
      <Form.Item name="bookList" label="Book" key="filter-book">
        <Select allowClear placeholder="Book">
          {bookStore.bookList.map(item => (
            <Option key={uuidv4()} value={item.name}>{item.name}</Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  ]

  /**
   * because of using cache, disable sort function
   */
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      width: 130,
      // sorter: (a, b) => (a.date + a.createTime) > (b.date + b.createTime) ? 1 : -1,
      // defaultSortOrder: 'descend',
      editable: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 130,
      // sorter: (a, b) => a.category > b.category ? 1 : -1,
      editable: true,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: 150,
      // sorter: (a, b) => a.amount - b.amount,
      editable: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      width: 150,
      ellipsis: true,
      // sorter: (a, b) => a.category > b.category ? 1 : -1,
      editable: true,
    },
    {
      title: 'Book',
      dataIndex: 'book',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      editable: true,
      render: (text, record) => {
        const bookNameStr = record.bookList.map(item => item.bookName).join(', ')
        const tmpBookIdList = bookStore.bookList.map(item => item.bookId)
        return (
          <span>
            <Tooltip placement="topLeft" title={bookNameStr}>
              {record.bookList.map(item => (
                <Tag color={antdTagColor[(tmpBookIdList.indexOf(item.bookId.toString()) % antdTagColor.length)]} key={item.bookName}>
                  {item.bookName}
                </Tag>
              ))}
            </Tooltip>
          </span>
        )
      }
    },
    {
      title: 'Note',
      dataIndex: 'note',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Author',
      dataIndex: 'authorNickname',
      ellipsis: true,
      width: 100,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      width: 100,
      render: (text, record) => (
        <Popconfirm
          title="Are you sure to delete this record?"
          onConfirm={() => deleteRecord(record)}
          okText="Yes"
          cancelText="No"
        >
          <Button shape='circle'>
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      ),
    }
  ]

  return (
    <>
      {/* Filter */}
      <Form
        form={form}
        name="advanced_search"
        className="finance-advanced-search-form"
        onFinish={onFilterFinish}
        style={{ marginBottom: "8px" }}
      >
        <Row gutter={16} justify="space-between">
          {filterItems}
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button onClick={() => form.resetFields()} style={{ marginRight: '8px' }}>
              Clear
            </Button>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Col>
        </Row>
      </Form>
      {/* Table header */}
      <div className='table-title' style={{ marginBottom: 16 }}>
        <NewItem />
        <span className='multi-select-info' style={{ marginLeft: 8 }}>
          <Button type='primary' danger onClick={deleteBatchItems} disabled={!hasSelected} loading={loading}>
            Delete
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </span>
      </div>
      {/* Table */}
      <Table
        columns={columns}
        dataSource={financeStore.itemList}
        loading={tableLoading}
        pagination={{
          pageSize: financeStore.pageParams.pageSize,
          current: financeStore.pageParams.curPage,
          total: financeStore.pageParams.total,
          showTotal: total => `Total ${total} items`,
          showSizeChanger: true,
          onChange: onPageChange,
        }}
        scroll={{ x: '100%' }}
        size="middle"
        rowSelection={rowSelection}
      />
    </>
  )
}

export default observer(Finance)
