import React from 'react';
import { Table, Button, Modal, message } from 'antd';
import './index.less';

const Index = () => {
  const actionGategory = (info, key) => {

    Modal.confirm({
      title: '提示',
      content: `确认要删除${info}分类？`,
      okText: '删除',
      cancelText: '取消',
      okButtonProps: { shape: 'round' },
      cancelButtonProps: { shape: 'round' },
      onOk: () => {
        message.success('删除成功');
      },
    });
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags, info) => (
        <>
          <Button type={'primary'} shape={'round'} className="cursor btns">
            添加商品
          </Button>
          <Button type="link" shape={'round'} className="cursor btns">
            商品管理
          </Button>
          <Button
            type={'primary'}
            shape={'round'}
            className="cursor btns"
            onClick={() => actionGategory(info.name, tags)}
          >
            {tags === 'up' ? '上架' : '下架'}分类
          </Button>
          <Button type={'ghost'} shape={'round'} className="cursor btns">
            编辑
          </Button>
          <Button
            type=""
            danger
            shape={'round'}
            className="cursor btns"
            onClick={() => actionGategory(info.name, tags)}
          >
            删除
          </Button>
        </>
      ),
    },
    {
      title: 'Action',
      key: 'time',
      dataIndex: 'time',
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      time: '2021-8-29',
      tags: 'up',
    },
    {
      key: '2',
      name: 'brown',
      time: '2020-1-2',
      tags: 'down',
    },
    {
      key: '3',
      name: 'green',
      time: '2019-10-01',
      tags: 'up',
    },
  ];
  return (
    <div className="category">
      <div className="add">
        商品分类管理：
        <Button type="primary" shape={'round'}>
          添加分类
        </Button>
      </div>
      <Table showHeader={false} columns={columns} dataSource={data} />
    </div>
  );
};
export default Index;
