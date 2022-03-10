import { Table, Popconfirm, Button } from 'antd';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import ContentState from '../../ContentState';

export default function AccountEquity(props) {
  const History = useHistory();
  const config = useContext(ContentState);
  const { user } = config;
  const confirm = () => {
    // vip-member
    History.push('/home/vip-member');
  };
  const columns = [
    {
      title: '权益名称',
      dataIndex: 'name',
      key: 'goods',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, item) => {
        if (text === 0) {
          let context = '暂未开放';
          if (item.key === 'code') {
            context = 'VIP享受此功能，点击开通';
            if (user.is_vip) {
              return (
                <div>
                  已开通
                  <Button
                    onClick={() => {
                      History.push('/home/gathering');
                    }}
                    type="link"
                  >
                    去查看
                  </Button>
                </div>
              );
            }
            return (
              <div>
                未开通&nbsp;
                <Popconfirm
                  placement="top"
                  title={context}
                  onConfirm={confirm}
                  okText="开通"
                  cancelText="取消"
                >
                  <i className="iconfont yiwen" />
                </Popconfirm>
              </div>
            );
          }
          return '未开通';
        }
        if (text === 1) {
          return '已开通';
        }
        if (text === 2) {
          return '未开放';
        }
      },
    },
    {
      title: '说明',
      dataIndex: 'desc',
      key: 'desc',
    },
  ];

  const data = [
    {
      key: '1',
      name: '商品发布',
      status: 1,
      desc: '为内容创作机构打造的一站式矩阵账号管理工具',
    },
    {
      key: 'code',
      name: '固定收款码',
      status: 0,
      desc: '目前只针对通过实名认证的VIP用户开放',
    },
    {
      key: '3',
      name: 'API对接',
      status: 0,
      desc: '暂未开放，敬请期待',
    },
  ];

  return (
    <div className="account-equity">
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
}
