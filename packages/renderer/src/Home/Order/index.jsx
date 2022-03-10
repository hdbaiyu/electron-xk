import React, { useEffect, useState } from 'react';

import { Form, Input, Select, Tag, Table } from 'antd';

import Util from '../../utils/utils';
import { getOrder } from '../../api/order';

export default function Order() {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [listTotal, setListTotal] = useState(0);
  const [status, setStatus] = useState(2); //状态
  const [no, setNo] = useState(''); //订单号
  const [remark, setRemark] = useState(''); //备注

  const [form] = Form.useForm();

  const loadList = async () => {
    setLoading(true);
    const query = {
      page: page,
      page_size: pageSize,
      status: status,
      no: no,
      remark: remark,
    };
    const data = await getOrder(query).finally(() => {
      setLoading(false);
    });
    if (data) {
      setDataList(data.list);
      setListTotal(data.total);
    }
  };
  useEffect(() => {
    loadList();
  }, [page, pageSize, no, status, remark]);

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
      title: '订单号',
      dataIndex: 'order_no',
      key: 'goods',
    },
    {
      title: '金额',
      dataIndex: 'price',
      key: 'memory',
      render: (text) => Util.formatPrice(text),
    },
    {
      title: '付款时间',
      dataIndex: 'pay_time',
      key: 'pay_time',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, item) => {
        if (text === 0) {
          return <Tag color="warning">已失效</Tag>;
        }
        if (text === 1) {
          return <Tag color="#2db7f5">已支付</Tag>;
        }
        if (text === 2) {
          return <Tag color="#f50">未付款</Tag>;
        }
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'desc',
    },
  ];

  return (
    <div className="gathering layout">
      <div style={{ marginBottom: '50px' }}>
        <Form form={form} name="horizontal_login" layout="inline" style={{ marginBottom: '20px' }}>
          <Form.Item name="no" label="订单号">
            <Input
              onChange={(e) => {
                setNo(e.target.value);
              }}
              allowClear={true}
              style={{ width: 300 }}
            />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select
              defaultValue={status}
              onChange={(value) => {
                setStatus(value);
              }}
              style={{ width: 150 }}
            >
              <Select.Option value={0}>全部</Select.Option>
              <Select.Option value={1}>未支付</Select.Option>
              <Select.Option value={2}>已支付</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input
              onChange={(e) => {
                setRemark(e.target.value);
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
            rowKey={(record) => record.id}
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
