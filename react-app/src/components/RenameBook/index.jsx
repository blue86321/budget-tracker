import { EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal } from 'antd';
import React, { useState } from 'react';
import { useStore } from 'stores';



const RenameBookForm = ({ visible, onCreate, onCancel, oldBookName }) => {

  const [form] = Form.useForm()

  const onOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields()
        onCreate(values, false)
      })
      .catch((info) => { })
  }

  return (

    <Modal
      width={400}
      visible={visible}
      title="Rename a book"
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>
        ,
        <Button key="create" type="primary" onClick={onOk}>
          Rename
        </Button>
      ]}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        initialValues={{
          newBookName: oldBookName,
        }}
      >
        <Form.Item name="newBookName" label="New book name"
          rules={[{ required: true, message: 'please enter a new name' }]}
        >
          <Input type="textarea" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const RenameBook = ({ bookInfo }) => {
  const [visible, setVisible] = useState(false)
  const { bookStore } = useStore()

  const onCreate = async (values, visible) => {
    try {
      await bookStore.renameBook(values, bookInfo)
      message.success("rename successfully")
      setVisible(visible)
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message
      message.error(errorMessage)
    }
  }

  return (
    <>
      <EditOutlined onClick={() => setVisible(true)} />
      <RenameBookForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => { setVisible(false) }}
        oldBookName={bookInfo.bookName}
      />
    </>
  )
}

export default RenameBook
