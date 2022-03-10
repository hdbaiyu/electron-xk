import React, { useState, useEffect, useContext } from 'react';
import { Card, Carousel, Table, Tag, Image, Space, Button, message } from 'antd';
import { getHome, getOrderLatest, getBalance } from '@/api/home';
import utils from '../utils/utils';
import ContentState from '../ContentState';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

const Hello = () => {
  const [account, setAccount] = useState({});
  const [order, setOrder] = useState([]);
  const [info, setInfo] = useState({ banner: [], notice: [] });
  const config = useContext(ContentState);
  const { user } = config;
  const History = useHistory();

  useEffect(() => {
    getBalance().then((b) => setAccount(b));
    getHome().then((i) => setInfo(i));
  }, []);
  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = () => {
    getOrderLatest().then((order) => {
      setOrder(order);
    });
  };

  const pay_type = {
    1: '微信',
    2: '支付宝',
    0: '其他',
  };

  const hoursTime = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 6) {
      return '凌晨好';
    } else if (hour < 9) {
      return '早上好';
    } else if (hour < 12) {
      return '上午好';
    } else if (hour < 14) {
      return '中午好';
    } else if (hour < 17) {
      return '下午好';
    } else if (hour < 19) {
      return '傍晚好';
    } else if (hour <= 23) {
      return '晚上好';
    }
  };

  const columns = [
    {
      title: '商品',
      dataIndex: 'product_name',
      key: 'product_name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '订单号',
      dataIndex: 'order_no',
    },
    {
      title: '金额',
      dataIndex: 'price',
      key: 'price',
      render: (text) => utils.formatPrice(text),
    },
    {
      title: '数量',
      dataIndex: 'total',
    },
    {
      title: '支付方式',
      key: 'pay_type',
      dataIndex: 'pay_type',
      render: (type) => {
        return pay_type[type];
      },
    },
    {
      title: '支付状态',
      key: 'status',
      dataIndex: 'status',
      render: (text) => {
        if (text === 1) {
          return <Tag color={'#2db7f5'}>已支付</Tag>;
        }
        return <Tag color={'#f50'}>未支付</Tag>;
      },
    },
    {
      title: '支付时间',
      key: 'pay_time',
      dataIndex: 'created_at',
    },
  ];
  /**
   * 复制
   */
  const copy = () => {
    const createInput = document.createElement('input');
    createInput.value = 'https://supplier.5xk.cn/register?code=' + user.sponsored_link;
    document.body.appendChild(createInput);
    createInput.select();
    document.execCommand('Copy'); // document执行复制操作
    createInput.remove();
    message.success('复制成功!');
  };

  return (
    <div className="hello">
      <div className="top-header a-default font-20">
        <Space>
          <span>
            {hoursTime()}，{user.name}
          </span>
          <span style={{ marginLeft: '20px' }}>
            您的推广链接：https://supplier.5xk.cn/register?code={user.sponsored_link}
            <Button type="link" onClick={copy}>
              点击复制
            </Button>
          </span>
        </Space>
      </div>

      <div className="view">
        <div className="home-top-row flex-between">
          <div className="item-box">
            <div className="text">累计收入（元）</div>
            <div
              className="number font-24 cursor"
              onClick={() => History.push(`${config.homePath}/balance-center`)}
            >
              {utils.formatPrice(account.total_balance)}
            </div>
          </div>
          <div className="item-box">
            <div className="text">商品数据</div>
            <div
              className="number font-24 cursor"
              onClick={() => History.push(`${config.homePath}/goods`)}
            >
              {account.goods_count || 0}
            </div>
          </div>
          <div className="item-box">
            <div className="text">余额</div>
            <div className="number font-24">{utils.formatPrice(account.balance)}</div>
          </div>
          <div className="item-box">
            <div className="text">冻结金额</div>
            <div className="number font-24">{utils.formatPrice(account.freeze_balance)}</div>
          </div>
          <div className="item-box notice-box">
            <div className="notice-header flex-between">
              <div className="a-default">公告</div>
              {info.notice.length > 3 ? <div>更多</div> : null}
            </div>
            <ul className="notice">
              {info.notice &&
                info.notice.slice(0, 3).map((item) => (
                  <li className="notice-text oneLine" key={`not-${item.id}`}>
                    <span className="data-time">{moment(item.created_at).format('MM-DD')}</span>
                    {item.title}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="tip-carousel">
          <Carousel autoplay>
            {info.banner.map((i) => (
              <div className="banner" key={`banner-${i.type}`}>
                <Image src={i.path} preview={false} />
              </div>
            ))}
          </Carousel>
        </div>
        <div className="order">
          <Card title="最新订单" bordered={false}>
            <Table
              columns={columns}
              rowKey="id"
              dataSource={order}
              size="small"
              pagination={false}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Hello;
