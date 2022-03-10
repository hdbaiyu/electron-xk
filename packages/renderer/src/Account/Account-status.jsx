import { Button, Table } from 'antd';
import React, { useContext } from 'react';
import ContentState from '../ContentState';

export default function AccountStatus() {
  const config = useContext(ContentState);

  const columns = [
    {
      title: '账号信息',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      key: 'tags',
      dataIndex: 'status',
    },
    {
      title: '说明',
      key: 'time',
      dataIndex: 'desc',
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
    },
  ];

  const mainBodyType = {
    0: '个人商家',
    1: '媒体',
    2: '企业',
    3: '组织',
  };

  const data = [
    {
      key: '1',
      name: '登录账号',
      status: '正常',
      desc: mainBodyType[config.user.main_body_type],
      action: (
        <Button size="small" type="link">
          注销账号
        </Button>
      ),
    },
  ];
  return (
    <div className="account-status">
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
}
