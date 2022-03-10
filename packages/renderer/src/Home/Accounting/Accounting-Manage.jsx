import React, { useContext, useEffect } from 'react';
import { Table, Tabs } from 'antd';
import AccountIngRecord from './Accounting-record';
import Binds from './Binds';
import Transfer from './Transfer';
import './Accounting-common.less';
import ContentState from '../../ContentState';
import { userInfo } from '@/api/login';

export default function AccountingManage() {
  const config = useContext(ContentState);
  let { user } = config;
  useEffect(() => {
    loadUser();
  }, []);
  /**
   * 加载用户信息
   * @returns {Promise<void>}
   */
  const loadUser = async () => {
    user = await userInfo();
  };

  return (
    <div className="accounting">
      <Tabs>
        <Tabs.TabPane tab="结算管理" key="manage">
          <AccountIngRecord />
        </Tabs.TabPane>
        <Tabs.TabPane tab="账务设置" key="accounting">
          <Binds />
        </Tabs.TabPane>

        <Tabs.TabPane tab="转账" key="transfer">
          <Transfer />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
