import { Popconfirm, Table, Tabs, Button, message } from 'antd';
import AccountEquity from './AccountEquity';
import './equityTable.less';
import React, { useContext } from 'react';
import ContentState from '../../ContentState';
import { useHistory } from 'react-router-dom';

export default function EquityTable() {
  const History = useHistory();
  const config = useContext(ContentState);
  const { user } = config;

  const confirm = () => {
    History.push('/home/vip-member');
  };
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
    },
    {
      title: '说明',
      dataIndex: 'desc',
      key: 'desc',
    },
  ];
  const getStatus = () => {
    if (user.is_vip) {
      return (
        <div className="bins">
          已开通
          <Button onClick={copy} type={'link'}>
            复制
          </Button>
        </div>
      );
    }
    return (
      <div>
        未开通
        <Popconfirm
          placement="top"
          onConfirm={confirm}
          okText="开通"
          cancelText="取消"
          title="VIP享受此功能，点击开通"
        >
          <i className="iconfont yiwen" />
        </Popconfirm>
      </div>
    );
  };

  const data = [
    {
      key: '1',
      name: '推广大使',
      status: getStatus(),
      desc: '开通后将根据内容的综合表现获得平台的分成收益',
    },
    {
      key: '2',
      name: '代理商',
      status:
        user.is_agent === 0 ? (
          <Button style={{ padding: 0 }} href="qq:254628638" size="small" type="link">
            去申请
          </Button>
        ) : (
          <Button
            style={{ padding: 0 }}
            target="_blank"
            href="http://agent.5xk.cn"
            size="small"
            type="link"
          >
            去登录
          </Button>
        ),
      desc: '目前只针对日营业额大于等于50万的推广大使/商家或者拥有大量供应商且能达到营业额标准的用户开放申请通道',
    },
  ];
  return (
    <div className="equity layout">
      <Tabs>
        <Tabs.TabPane key={'account'} tab={'账号权益'}>
          <AccountEquity />
        </Tabs.TabPane>
        <Tabs.TabPane key={'function'} tab={'功能权益'}>
          <Table columns={columns} dataSource={data} pagination={false} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
