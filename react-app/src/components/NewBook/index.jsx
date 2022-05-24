import { Button, Form, Input, message, Modal } from 'antd';
import React, { useState } from 'react';
import { useStore } from 'stores';



const NewBookForm = ({ visible, onCreate, onCancel, confirmLoading }) => {

  const [form] = Form.useForm()

  const onOk = () => {
    form
      .validateFields()
      .then((values) => {
        onCreate(values)
        form.resetFields()
      })
      .catch((info) => { })
  }

  return (

    <Modal
      width={400}
      visible={visible}
      title="Add a new book"
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="create" type="primary" onClick={onOk} loading={confirmLoading}>
          Create
        </Button>
      ]}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
      >
        <Form.Item name="bookName" label="Book Name"
          rules={[{ required: true, message: 'please enter a book name' }]}
        >
          <Input type="textarea" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const NewBook = ({ className }) => {

  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { bookStore } = useStore()

  const onCreate = async (values) => {
    try {
      setConfirmLoading(true)
      await bookStore.addBook(values)
      message.success("add a new book")
      setVisible(false)
      setConfirmLoading(false)
    } catch (e) {
      const errorMessage = e.response.data.message || e.message
      message.error(errorMessage)
    }
  }

  return (
    <>
      <Button className={className} type="primary" onClick={() => { setVisible(true) }}>
        New Book
      </Button>
      <NewBookForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => { setVisible(false) }}
        confirmLoading={confirmLoading}
      />
    </>
  )
}

export default NewBook
