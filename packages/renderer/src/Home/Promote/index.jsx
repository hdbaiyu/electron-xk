import React, { useEffect, useState } from 'react';

import { Form, Input, Table, Image } from 'antd';

import { promote } from '../../api/promote';

export default function Promote() {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [listTotal, setListTotal] = useState(0);
  const [name, setName] = useState(''); //订单号

  const [form] = Form.useForm();

  const loadList = async () => {
    setLoading(true);
    const query = {
      page: page,
      page_size: pageSize,
      name: name,
    };
    const data = await promote(query).finally(() => {
      setLoading(false);
    });
    if (data) {
      setDataList(data.list);
      setListTotal(data.total);
    }
  };
  useEffect(() => {
    loadList();
  }, [page, pageSize, name]);

  /**
   * 分页
   */
  const pagination = {
    showSizeChanger: true,
    showTotal: (t) => {
      return `共 ${t} 条`;
    },
    total: listTotal,
    onChange: (p, size) => {
      setPage(p);
      setPageSize(size);
    },
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },

    {
      title: '联系方式',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (text) => {
        return <Image width={50} src={text} />;
      },
    },
  ];

  return (
    <div className="gathering layout">
      <div style={{ marginBottom: '50px' }}>
        <Form form={form} name="horizontal_login" layout="inline" style={{ marginBottom: '20px' }}>
          <Form.Item name="no" label="名称">
            <Input
              onChange={(e) => {
                setName(e.target.value);
              }}
              allowClear={true}
              style={{ width: 300 }}
            />
          </Form.Item>
        </Form>
      </div>

      <div className="flex-box">
        <div className="table-title">
          <Table
            rowKey={(record) => record.name}
            columns={columns}
            dataSource={dataList}
            loading={loading}
            pagination={pagination}
          />
        </div>
      </div>
    </div>
  );
}
