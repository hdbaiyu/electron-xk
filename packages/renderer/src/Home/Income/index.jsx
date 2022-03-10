import React, { useEffect, useState } from 'react';
import { list } from '@/api/income';
import { Table } from 'antd';
import Util from '../../utils/utils';

export default function Gathering() {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [listTotal, setListTotal] = useState(0);

  const loadList = async () => {
    setLoading(true);
    const query = {
      page: page,
      page_size: pageSize,
    };
    const data = await list(query).finally(() => {
      setLoading(false);
    });
    if (data) {
      setDataList(data.list);
      setListTotal(data.total);
    }
  };
  useEffect(() => {
    loadList();
  }, [page, pageSize]);

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

  //收支类型，-3=购买vip -2=转账-1=提现 0=订单 1=佣金 2=收款码 3=收到转账
  const type = {
    '-3': '购买vip',
    '-2': '转账',
    '-1': '提现',
    0: '订单',
    1: '佣金',
    2: '收款码',
    3: '收到转账',
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
      render: (text, record) => {
        return record.type > 0 ? '+' + Util.formatPrice(text) : '-' + Util.formatPrice(text);
      },
    },
    {
      title: '付款时间',
      dataIndex: 'pay_time',
      key: 'pay_time',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (text) => {
        return type[text];
      },
    },
  ];

  return (
    <div className="layout">
      <div>收支列表</div>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={dataList}
        loading={loading}
        pagination={pagination}
      />
    </div>
  );
}
