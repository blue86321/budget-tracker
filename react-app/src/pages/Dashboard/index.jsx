import { BookOutlined, EditOutlined, LeftSquareOutlined, RightSquareOutlined, TeamOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Row, Statistic } from 'antd';
import RecentLineChart from 'components/RecentLineChart';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useStore } from 'stores';
import './index.scss';


const Dashboard = () => {

  const { userStore } = useStore()
  const [personalDate, setPersonalDate] = useState(moment())
  const [allBookDate, setAllBookDate] = useState(moment())

  const onPersonalDateChange = (date) => {
    setPersonalDate(date)
    userStore.getUserPersonalRecentDataList(date.format("YYYY-MM-01"))
  }

  const onAllBookDateChange = (date) => {
    setAllBookDate(date)
    userStore.getUserAllBookRecentDataList(date.format("YYYY-MM-01"))
  }

  useEffect(() => {
    userStore.getUserStat()
    userStore.getUserPersonalRecentDataList(moment().format("YYYY-MM-01"))
    userStore.getUserAllBookRecentDataList(moment().format("YYYY-MM-01"))
  }, [])


  return (
    <>
      {/* 1. Personal */}
      <Divider orientation="left" style={{ fontSize: 24 }}>Personal</Divider>
      <Row gutter={16} wrap>
        {/* 1.1. History */}
        <Col span={24} lg={12}>
          <Row>
            <span className='sub-divider-header-text'>History</span>
          </Row>
          <Row>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Book"
                  valueRender={(item) => <>{item.prefix}{item.suffix}</>}
                  prefix={<BookOutlined />}
                  suffix={userStore.userStat.selfBookCnt?.toLocaleString()}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Record"
                  valueRender={(item) => <>{item.prefix}{item.suffix}</>}
                  prefix={<EditOutlined />}
                  suffix={userStore.userStat.selfItemCnt?.toLocaleString()}
                />
              </Card>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Expense"
                  valueRender={(item) => <>{item.prefix}{item.suffix}</>}
                  prefix={<RightSquareOutlined style={{ color: "#ff4d4f" }} />}
                  suffix={<CountUp
                    decimal='.'
                    separator=','
                    decimals={2}
                    duration={0.6}
                    end={userStore.userStat.selfExpense}
                  />}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Income"
                  valueRender={(item) => <>{item.prefix}{item.suffix}</>}
                  prefix={<LeftSquareOutlined style={{ color: "#73d13d" }} />}
                  suffix={<CountUp
                    decimal='.'
                    separator=','
                    decimals={2}
                    duration={0.6}
                    end={userStore.userStat.selfIncome}
                  />}
                />
              </Card>
            </Col>
          </Row>
        </Col>

        {/* 1.2. Recent */}
        <Col span={24} lg={12}>
          <Row>
            <Col>
              <span className='sub-divider-header-text'>Recent</span>
            </Col>
          </Row>
          <RecentLineChart
            recentDataList={userStore.userPersonalRecentDataList}
            onDateChange={onPersonalDateChange}
            date={personalDate}
          />
        </Col>
      </Row>

      {/* 2. All Book */}
      <Divider orientation="left" style={{ fontSize: 24 }}>All Book</Divider>
      <Row gutter={16} wrap>
        {/* 2.1. History */}
        <Col span={24} lg={12}>
          <Row>
            <span className='sub-divider-header-text'>History</span>
          </Row>
          <Row>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Book"
                  valueRender={(item) => <>{item.prefix}{item.suffix}</>}
                  prefix={<BookOutlined />}
                  suffix={userStore.userStat.totalBookCnt?.toLocaleString()}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Record"
                  valueRender={(item) => <>{item.prefix}{item.suffix}</>}
                  prefix={<EditOutlined />}
                  suffix={userStore.userStat.totalItemCnt?.toLocaleString()}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Partner"
                  valueRender={(item) => <>{item.prefix}{item.suffix}</>}
                  prefix={<TeamOutlined />}
                  suffix={userStore.userStat.partnerCnt?.toLocaleString()}
                />
              </Card>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Expense"
                  valueRender={(item) => <>{item.prefix}{item.suffix}</>}
                  prefix={<RightSquareOutlined style={{ color: "#ff4d4f" }} />}
                  suffix={<CountUp
                    decimal='.'
                    separator=','
                    decimals={2}
                    duration={0.6}
                    end={userStore.userStat.totalExpense}
                  />}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Income"
                  valueRender={(item) => <>{item.prefix}{item.suffix}</>}
                  prefix={<LeftSquareOutlined style={{ color: "#73d13d" }} />}
                  suffix={<CountUp
                    decimal='.'
                    separator=','
                    decimals={2}
                    duration={0.6}
                    end={userStore.userStat.totalIncome}
                  />}
                />
              </Card>
            </Col>
          </Row>
        </Col>

        {/* 2.2. Recent */}
        <Col span={24} lg={12}>

          <Row>
            <Col>
              <span className='sub-divider-header-text'>Recent</span>
            </Col>
          </Row>
          <RecentLineChart
            recentDataList={userStore.userAllBookRecentDataList}
            onDateChange={onAllBookDateChange}
            date={allBookDate}
          />
        </Col>
      </Row>

    </>

  )
}

export default observer(Dashboard)
