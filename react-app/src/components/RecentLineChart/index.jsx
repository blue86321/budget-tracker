import { Col, DatePicker, Row, Segmented, Space } from 'antd';
import * as echarts from 'echarts';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
// import './index.scss';


/**
 * @param recentDataList format must be like this:
 *  [
 *    {date: moment(), expense: xxx, income: xxx},
 *    {date: moment(), expense: xxx, income: xxx},
 *    ...
 *  ]
 * @param date: moment()
 */
const RecentLineChart = ({ recentDataList, onDateChange, date }) => {

  const chartDomRef = useRef()
  const [yLabel, setYLabel] = useState('Expense')


  const getChartOption = (xData, yData) => {
    return {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisTick: {
          alignWithLabel: true
        },

      },
      yAxis: {
        type: 'value',
        max: yData ? Math.floor(Math.max(...yData) * 1.2) : 0,
        axisTick: {
          show: true,
        },
        axisLine: {
          show: true,
        },
        splitLine: {
          show: false
        },
      },
      series: [
        {
          data: yData,
          type: 'line',
          smooth: true,
        }
      ],
      grid: {
        left: '1%',
        right: '5%',
        bottom: '1%',
        containLabel: true,
      },
    }
  }

  var chartDom;
  useEffect(() => {

    // chart
    chartDom = echarts.getInstanceByDom(chartDomRef.current)
    if (!chartDom) {
      setTimeout(() => {
        chartDom?.dispose()
        chartDom = echarts.init(chartDomRef.current)
        window.addEventListener('resize', () => chartDom.resize())
      }, 0)
    }
    setTimeout(() => {
      const chartOption = getChartOption(
        recentDataList?.map(item => moment(new Date(item.date)).format("MM-DD")),
        recentDataList?.map(item => yLabel === 'Expense' ? item.expense : item.income),
      )
      chartDom.setOption(chartOption)
    }, 0)
  }, [recentDataList, date, yLabel])

  return (
    <>
      <Row justify='space-between'>
        <Col>
          <Space>
            <span>Type:</span>
            <Segmented options={['Expense', 'Income']} value={yLabel} onChange={setYLabel} />
          </Space>
        </Col>
        <Col>
          <DatePicker
            allowClear={false}
            picker='month'
            value={date}
            onChange={(newDate) => onDateChange(newDate)}
          />
        </Col>
      </Row>
      <div ref={chartDomRef} style={{ width: '100%', height: '100%', minHeight: '250px' }}></div>
    </>
  )
}


export default RecentLineChart
