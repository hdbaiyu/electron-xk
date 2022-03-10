import React, { useEffect } from 'react';
import { message, Tabs } from 'antd';
import './Account-common.less';
import SettingLogin from './Setting-login';
import AccountStatus from './Account-status';
import WechatMessage from './OpenWechat';
import SecurityCenter from './Security-Center';
import LoginLog from './LoginLog';
import AccountInfo from './Account-info';
import queryString from 'query-string';
import { bindWechat } from '@/api/account';

const { TabPane } = Tabs;

export default function AccountTab() {
  useEffect(() => {
    const { code } = queryString.parse(location.search);
    if (code) {
      bindWechat({ code }).then((res) => {
        message.success('绑定成功');
        window.location.href = '/home/account-center';
      });
    }
  }, []);

  return (
    <Tabs className="accountTab layout">
      <TabPane tab="账号详情" key="account-info">
        <AccountInfo />
      </TabPane>
      <TabPane tab="登录设置" key="login-setting">
        <SettingLogin />
      </TabPane>
      {/*<TabPane tab="微信消息通知管理" key="message-manage">*/}
      {/*  <WechatMessage />*/}
      {/*</TabPane>*/}
      <TabPane tab="账号状态" key="account-status">
        <AccountStatus />
      </TabPane>
      <TabPane tab="安全中心" key="security-center">
        <SecurityCenter />
      </TabPane>
      <TabPane tab="登录日志" key="login-log">
        <LoginLog />
      </TabPane>
    </Tabs>
  );
}
