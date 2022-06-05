import { BookOutlined, DesktopOutlined, DollarOutlined, ShoppingOutlined, StarOutlined, TeamOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, List, message, Popconfirm, Statistic, Table, Tabs, Tooltip } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useStore } from 'stores';
import { avatarColor, bookAuthor } from 'utils/constant';
import { v4 as uuidv4 } from 'uuid';
import './index.scss';


const { TabPane } = Tabs


const Partner = () => {

  const { partnerStore, bookStore } = useStore()

  useEffect(() => {
    partnerStore.getPartnerList()
    bookStore.getBookList()
  }, [bookStore, partnerStore])

  // for 1st tab
  // max of income + expense
  const getPrimaryBook = bookStatList => {
    if (bookStatList.length === 0) {
      return ''
    }
    if (bookStatList.length === 1) {
      return bookStatList[0].bookName
    }
    [...bookStatList].sort(
      (a, b) => - (a.partnerExpense + a.partnerIncome - b.partnerExpense + b.partnerIncome)
    )
    return bookStatList[0].bookName
  }

  // for 2nd tab
  // bookId list, those of the user is the author
  const userAuthorBookId = bookStore.bookList.reduce(
    (result, item) => {
      if (item.role === bookAuthor) {
        result.push(item.bookId)
      }
      return result
    }
    , []
  )

  const onRevoke = async (values) => {
    try {
      await partnerStore.revokePartner(values)
      message.success("revoke partner successfully")
    } catch (e) {
      message.error(e)
    }
  }

  const tableColumns = [
    {
      title: 'Partner',
      dataIndex: 'partnerNickname',
      render: (text, record) => {
        const idx = partnerStore.partnerList.map(item => item.nickname).indexOf(text)
        return (
          <div className='partner-nickname-wrapper'>
            <Avatar
              className='partner-nickname-avatar'
              style={{ backgroundColor: avatarColor[idx % avatarColor.length] }}>
              {text[0].toUpperCase()}
            </Avatar>
            <span className='partner-nickname-text'>{text}</span>
          </div>
        )
      }
    },
    {
      title: 'Book',
      dataIndex: 'bookName',
    },
    {
      title: 'Partner',
      children: [
        {
          title: 'Expense',
          dataIndex: 'partnerExpense',
          align: 'right',
          render: amount => amount.toLocaleString()
        },
        {
          title: 'Income',
          dataIndex: 'partnerIncome',
          align: 'right',
          render: amount => amount.toLocaleString()
        }
      ]
    },
    {
      title: 'Book',
      children: [
        {
          title: 'Expense',
          dataIndex: 'bookExpense',
          align: 'right',
          render: amount => amount.toLocaleString()
        },
        {
          title: 'Income',
          dataIndex: 'bookIncome',
          align: 'right',
          render: amount => amount.toLocaleString()
        }
      ]
    },
    {
      title: 'Action',
      align: 'center',
      render: (text, record) => (
        // can only revoke for the book he create (author)
        userAuthorBookId.indexOf(record.bookId.toString()) === -1 ? '' :
          <Popconfirm
            title="Revoke partner in this book?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onRevoke(record)}
          >
            <Button type="link">Revoke</Button>
          </Popconfirm>
      ),
    },
  ]

  // flat bookStatList, add with username, nickname, key
  const tableData = partnerStore.partnerList.map(
    ptn => ptn.bookStatList.map(
      bookStatObj => {
        return {
          ...bookStatObj,
          partnerUsername: ptn.username,
          partnerNickname: ptn.nickname,
          key: uuidv4()
        }
      }
    )
  ).flat()


  return (
    <Tabs>
      <TabPane key="1" tab={<><DesktopOutlined />Partner Overview</>}>
        <List
          itemLayout="vertical"
          size="large"
          // pagination={{
          //   onChange: page => { },
          //   pageSize: 5,
          // }}
          dataSource={partnerStore.partnerList}
          renderItem={(item, idx) => (
            <List.Item
              key={uuidv4()}
            >
              <List.Item.Meta
                avatar={<Avatar style={{ backgroundColor: avatarColor[idx % avatarColor.length] }}>{item.nickname[0].toUpperCase()}</Avatar>}
                title={item.nickname}
              // description={<span>username: {item.username}</span>}
              />
              <div className="partner-stat-wrapper">

                <Tooltip title="Book co-work together">
                  <Card size="small" bordered={false}>
                    <Statistic
                      title="Book"
                      value={item.bookStatList.length}
                      prefix={<BookOutlined />} />
                  </Card>
                </Tooltip>

                <Tooltip title="co-work book / your book">
                  <Card size="small" bordered={false}>
                    <Statistic
                      title="Book overlap"
                      value={Math.round(item.bookStatList.length / bookStore.bookList.length * 100, 0)}
                      prefix={<TeamOutlined />}
                      suffix="%" />
                  </Card>
                </Tooltip>

                <Tooltip title="Total expense in co-work book">
                  <Card size="small" bordered={false}>
                    <Statistic
                      title="Expense"
                      value={item.bookStatList.reduce((sum, stat) => sum + stat.partnerExpense, 0)}
                      prefix={<ShoppingOutlined />}
                      precision={0} />
                  </Card>
                </Tooltip>

                <Tooltip title="Total income in co-work book">
                  <Card size="small" bordered={false}>
                    <Statistic
                      title="Income"
                      value={
                        item.bookStatList.reduce(
                          (sum, stat) => sum + stat.partnerIncome, 0
                        )
                      }
                      prefix={<DollarOutlined />}
                      precision={0} />
                  </Card>
                </Tooltip>

                <Tooltip title="Max of expense + income">
                  <Card size="small" bordered={false}>
                    <Statistic
                      title="Primary book"
                      value={getPrimaryBook(item.bookStatList)}
                      prefix={<StarOutlined />} />
                  </Card>
                </Tooltip>
              </div>
            </List.Item>
          )}
        />
      </TabPane>
      <TabPane key="2" tab={<><TeamOutlined />Partner Management</>}>
        <Table
          className='partner-management-tbl'
          bordered
          columns={tableColumns}
          dataSource={tableData}
        />
      </TabPane>
    </Tabs>
  )
}

export default observer(Partner)
