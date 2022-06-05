import { UserAddOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal } from 'antd';
import React, { useState } from 'react';
import { useStore } from 'stores';



const InvitePartnerForm = ({ visible, onCreate, onCancel }) => {

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
      title="Invite a partner"
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>
        ,
        <Button key="create" type="primary" onClick={onOk}>
          Invite
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
        <Form.Item name="partner" label="Partner username"
          rules={[{ required: true, message: 'please enter a partner' }]}
        >
          <Input type="textarea" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const InvitePartner = ({ bookInfo }) => {
  const [visible, setVisible] = useState(false)
  const { partnerStore, userStore } = useStore()

  const onCreate = async (partner, visible) => {
    try {
      if (partner.username === userStore.userInfo.username) {
        const errorMessage = "Cannot invite yourself";
        throw errorMessage
      }
      await partnerStore.sendInvitation(partner, bookInfo)
      message.success('send a invitation successfully')
      setVisible(visible)
    } catch (e) {
      message.error(e)
    }
  }

  return (
    <>
      <UserAddOutlined onClick={() => setVisible(true)} />
      <InvitePartnerForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => { setVisible(false) }}
      />
    </>
  )
}

export default InvitePartner
