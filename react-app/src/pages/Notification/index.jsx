import { Avatar, Button, List } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useStore } from 'stores';
import { avatarColor } from 'utils/constant';


const Notification = () => {

  const { partnerStore } = useStore()

  useEffect(() => {
    partnerStore.getInvite()
  }, [])


  const onClick = async (values, accept) => {
    await partnerStore.respondInvitation({ ...values, accept })
  }

  // for avatar index
  const inviteUsernameList = partnerStore.inviteList.map(item => item.username)
  const inviteUsernameSet = Array.from(new Set(inviteUsernameList))

  return (
    <>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={partnerStore.inviteList}
        renderItem={item => (
          <List.Item
            actions={[
              <Button onClick={() => onClick(item, true)} type='primary' key="partner-request-accept">Accept</Button>
              ,
              <Button onClick={() => onClick(item, false)} key="partner-request-ignore">Ignore</Button>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar style={{ backgroundColor: avatarColor[inviteUsernameSet.indexOf(item.username) % avatarColor.length] }}>{item.nickname[0].toUpperCase()}</Avatar>}
              title={item.nickname}
              description={<><div>Username: {item.username}</div><div>Book: {item.bookName}</div></>}
            />
          </List.Item>
        )}
      />
    </>
  )
}

export default observer(Notification)
