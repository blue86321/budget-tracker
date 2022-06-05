import { PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Form, Input, InputNumber, message, Modal, Radio, Select, Space, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useStore } from 'stores';
import './index.scss';

const { Option } = Select


const NewItemForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm()
  const [newCategory, setNewCategory] = useState('')
  const [selectBook, setSelectBook] = useState([])
  const { financeStore, bookStore } = useStore()

  useEffect(() => {
    financeStore.getCategoryList()
    bookStore.getBookList()
  }, [bookStore, financeStore])

  const onNewCategoryChange = e => {
    setNewCategory(e.target.value)
  }

  const addCategory = e => {
    e.preventDefault()
    if (financeStore.categoryList.indexOf(newCategory) === - 1 && newCategory !== '') {
      financeStore.addCategory(newCategory)
      setNewCategory('')
    }
  }

  const onOk = (visible) => {
    if (form.getFieldValue("amount") <= 0) {
      message.error("amount must be at least 0.01")
    } else {
      form
      .validateFields()
      .then((values) => {
        form.resetFields()
        onCreate(values, visible)
      })
      .catch((info) => {})
    }
  }

  const onOkThenStay = () => onOk(true)
  const onOkThenClose = () => onOk(false)

  return (
    <Modal
      width={400}
      visible={visible}
      title="Add a new item"
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={onOkThenStay}>
          Create and Stay
        </Button>,
        <Button key="create" type="primary" onClick={onOkThenClose}>
          Create
        </Button>
      ]}
      onCancel={onCancel}
      onOk={onOkThenClose}
    >
      <Form
        form={form}
        layout="horizontal"
        name="form_in_modal"
        requiredMark="optional"
        initialValues={{
          date: moment(),
          type: "expense",
        }}
      >
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: 'Please select a type' }]}
        >
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value="expense">Expense</Radio>
            <Radio value="income">Income</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: 'Please input the amount' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            precision={2}
            min={0.01}
          />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          required="true"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select
            placeholder="Select a category"
            dropdownRender={menu => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Space align="center" style={{ padding: '0 8px 4px' }}>
                  <Input placeholder="new category" value={newCategory} onChange={onNewCategoryChange} />
                  <Typography.Link onClick={addCategory} style={{ whiteSpace: 'nowrap' }}>
                    <PlusOutlined />Add
                  </Typography.Link>
                </Space>
              </>
            )}
          >
            {financeStore.categoryList.map(cat => (
              <Option key={cat} value={cat}>{cat}</Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="bookList"
          label="Book"
          rules={[{ required: true, message: 'Please select at least one book' }]}
        >
          <Select 
            mode='multiple'
            // style={{width: '100%'}}
            value={selectBook}
            options={bookStore.bookList.map(item => {return {label: item.name, value: item.bookId}})}
            onChange={ newBook => setSelectBook(newBook) }
            placeholder='Select books'
            maxTagCount='responsive'
          />
        </Form.Item>

        <Form.Item name="note" label="Note">
          <Input type="textarea" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const NewItem = () => {
  const [visible, setVisible] = useState(false)
  const { financeStore } = useStore()

  const onCreate = (values, visible) => {
    financeStore.addItem(values)
    setVisible(visible)
  }

  return (
    <>
      <Button type="primary" onClick={() => { setVisible(true) }}>
        New Item
      </Button>
      <NewItemForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => { setVisible(false) }}
      />
    </>
  )
}

export default NewItem