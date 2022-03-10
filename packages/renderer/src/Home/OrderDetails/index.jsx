import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Table } from 'antd';
import { orderDetails } from '../../api/order';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';

const OrderDetails = () => {
  const [data, setData] = useState();
  const location = useLocation();
  useEffect(() => {
    const { no } = queryString.parse(location.search);
    orderDetails({ no }).then((res) => {
      setData(res);
    });
  }, []);

  const payType = {
    0: '未知',
    1: '微信',
    2: '支付宝',
  };

  const columns = [
    {
      title: '卡密内容',
      dataIndex: 'content',
      key: 'content',
    },
  ];

  return (
    <Card title="订单详情">
      {data && (
        <>
          <Descriptions bordered>
            <Descriptions.Item label="订单号" span={3}>
              {data.order.order_no}
            </Descriptions.Item>

            <Descriptions.Item label="商品名称">{data.order.product_name}</Descriptions.Item>
            <Descriptions.Item label="支付方式">{payType[data.order.pay_type]}</Descriptions.Item>
            <Descriptions.Item label="购买数量">{data.order.number}</Descriptions.Item>
            <Descriptions.Item label="支付金额">{data.order.price}</Descriptions.Item>
            <Descriptions.Item label="支付时间">{data.order.pay_time}</Descriptions.Item>
          </Descriptions>
          <Table
            rowKey="id"
            style={{ marginTop: '20px' }}
            dataSource={data.cards}
            columns={columns}
          />
        </>
      )}
    </Card>
  );
};

export default OrderDetails;
