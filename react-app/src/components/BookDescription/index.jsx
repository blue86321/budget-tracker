import { Avatar, Descriptions, Tooltip } from 'antd';
import RecentLineChart from 'components/RecentLineChart';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { useState } from 'react';
import { useStore } from 'stores';
import { avatarColor } from 'utils/constant';
import { v4 as uuidv4 } from 'uuid';


const BookDescription = () => {

  const { bookStore } = useStore()
  const [trendDate, setTrendDate] = useState(moment())

  const onTrendDateChange = (date) => {
    setTrendDate(date)
    bookStore.getBookRecentDetailList(date.format("YYYY-MM-01"))
  }

  return (
    <Descriptions
      title="Book Info"
      layout='vertical'
      size="small"
      bordered
      column={4}
      className="book-description"
    >
      <Descriptions.Item label="Book Name">{bookStore.carouselBookInfo.bookName}</Descriptions.Item>
      <Descriptions.Item label="Income">{bookStore.carouselBookInfo.totalIncome?.toLocaleString()}</Descriptions.Item>
      <Descriptions.Item label="Create Time">{moment(new Date(bookStore.carouselBookInfo.createTime)).format("YYYY-MM-DD HH:mm:ss")}</Descriptions.Item>
      <Descriptions.Item label="Partner Number">{bookStore.carouselBookInfo.partnerList?.length}</Descriptions.Item>
      <Descriptions.Item label="Author">{bookStore.carouselBookInfo.authorNickname}</Descriptions.Item>
      <Descriptions.Item label="Expense">{bookStore.carouselBookInfo.totalExpense?.toLocaleString()}</Descriptions.Item>
      <Descriptions.Item label="Update Time">{moment(new Date(bookStore.carouselBookInfo.lastModifiedTime)).format("YYYY-MM-DD HH:mm:ss")}</Descriptions.Item>
      <Descriptions.Item label="Partner">
        {
          <Avatar.Group
            maxCount={3}
            size="large"
            maxStyle={{
              color: '#f56a00',
              backgroundColor: '#fde3cf',
            }}
          >
            {bookStore.carouselBookInfo.partnerList?.map(
              (partner, idx) =>
                <Tooltip title={partner.nickname} key={uuidv4()}>
                  <Avatar style={{ backgroundColor: avatarColor[idx % avatarColor.length] }}>{partner.nickname[0].toUpperCase()}</Avatar>
                </Tooltip>
            )
            }
          </Avatar.Group>
        }
      </Descriptions.Item>
      <Descriptions.Item
        label="Recent Trend"
        span={4}
      >
        <RecentLineChart
          recentDataList={bookStore.carouselBookRecentDetail?.recentDataList}
          onDateChange={onTrendDateChange}
          date={trendDate}
        />
      </Descriptions.Item>
    </Descriptions>
  )
}


export default observer(BookDescription)