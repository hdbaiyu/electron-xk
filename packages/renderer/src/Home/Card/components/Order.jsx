import React, { useEffect, useState } from 'react';
import { Button, Descriptions, Modal } from 'antd';
import { cardOrder } from '../../../api/goods';
import { useHistory } from 'react-router-dom';
// export type Props = {
//   visible: boolean, // 是否弹出
//   cardId: number, // 卡密ID
//   content: string, // 卡密内容
//   onClose: () => void, //关闭
// };

const Order = (props) => {
  const [order, setOrder] = useState({});
  const History = useHistory();
  useEffect(() => {
    if (props.cardId > 0) {
      cardOrder({ id: props.cardId }).then((res) => {
        setOrder(res);
      });
    }
  }, [props.cardId]);

  const payType = {
    0: '未知',
    1: '微信',
    2: '支付宝',
  };

  return (
    <Modal
      width={'50%'}
      title="订单"
      centered
      visible={props.visible}
      onCancel={() => {
        props.onClose();
      }}
      onOk={() => props.onClose()}
    >
      <Descriptions title="订单" bordered>
        <Descriptions.Item label="卡密内容" span={3}>
          {props.content}
        </Descriptions.Item>
        <Descriptions.Item label="订单号" span={3}>
          <Button
            onClick={() => {
              History.push('/home/order-details?no=' + order.order_no);
            }}
            type="link"
          >
            {order.order_no}
          </Button>
        </Descriptions.Item>

        <Descriptions.Item label="商品名称">{order.product_name}</Descriptions.Item>
        <Descriptions.Item label="支付方式">{payType[order.pay_type]}</Descriptions.Item>
        <Descriptions.Item label="购买数量">{order.number}</Descriptions.Item>
        <Descriptions.Item label="支付金额">{order.price}</Descriptions.Item>
        <Descriptions.Item label="支付时间">{order.pay_time}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default Order;
