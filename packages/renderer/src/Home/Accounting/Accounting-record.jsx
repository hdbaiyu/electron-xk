import { Table, Button, Popover } from 'antd';
import React, { useState, useEffect } from 'react';
import { settlement, withdrawalList } from '@/api/settlement';
import utils from '../../utils/utils';
import WithdrawalModal from './withdrawalModal';

export default function Record() {
  const [account, setAccount] = useState({});
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [listTotal, setListTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const loadList = () => {
    const query = {
      page,
      pageSize,
      status: '',
      no: '',
    };
    setLoading(true);
    withdrawalList(query)
      .then((res) => {
        setList(res.list);
        setListTotal(res.total);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    settlement().then((res) => setAccount(res));
    loadList();
  }, []);
  const formatStatus = {
    '-1': '驳回',
    0: '待审核',
    1: '审核通过',
  };

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
      title: '提现日期',
      dataIndex: 'created_at',
      key: 'name',
    },
    {
      title: '金额',
      key: 'memory',
      dataIndex: 'price',
      render: (t) => utils.formatPrice(t),
    },
    {
      title: '结算单',
      key: 'statement',
      dataIndex: 'order_no',
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: (text) => formatStatus[text],
    },
    {
      title: '备注',
      key: 'action',
      dataIndex: 'remark',
    },
  ];

  return (
    <div className="accounting-record">
      <div className="memory flex-between">
        <div className="memory-item">
          <div className="memory-text">可提现金额（元）</div>
          <div className="memory-number">{utils.formatPrice(account.can_be_withdrawn)}</div>
          <Button type="primary" onClick={() => setVisible(true)}>
            提现
          </Button>
        </div>

        <div className="memory-item">
          <div className="memory-text">余额（元）</div>
          <div className="memory-number">{utils.formatPrice(account.balance)}</div>
        </div>

        <div className="memory-item">
          <div className="memory-text">已提现金额（元）</div>
          <div className="memory-number">{utils.formatPrice(account.withdrawn)}</div>
        </div>
      </div>
      <ul className="account-rule">
        <li>1. 提现要求：成功绑定银行卡，且提现金额大于等于100元</li>
        <li>
          2.
          提现时间：支付宝、微信(暂未开通,静候通知)提现即时到账，银行卡提现T+2到账(即：2022年1月1日申请提现，则最晚到账时间为：2022年1月3日
          23:59:59)
        </li>
        <li>
          3.
          提现到账：支付宝、微信(暂未开通,静候通知)提现即时到账，银行卡提现T+2到账，平台暂未代扣代征税，后续变动将以：公告、短信、站内信、邮箱通知，请注意查收。
        </li>
        <li>4. 提现须知：提现至银行卡时可在提交后至审核前申请撤销。</li>
      </ul>
      <div className="record">
        <div className="table-title">提现记录</div>
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={list}
          loading={loading}
          pagination={pagination}
        />
      </div>
      <WithdrawalModal visible={visible} refreshList={loadList} onClose={() => setVisible(false)} />
    </div>
  );
}
