import React, { useContext } from 'react';
import { Space } from 'antd';
import ContentState from '../ContentState';

export default function SettingLogin() {
  const config = useContext(ContentState);

  const handBindWechat = () => {
    const url =
      'https://open.weixin.qq.com/connect/qrconnect?appid=wxb97152a9516bab7c&redirect_uri=https://supplier.5xk.cn/home/account-center&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect';
    window.open(url, '_blank');
  };

  const handBindQQ = () => {
    const url = encodeURIComponent('https://supplier.5xk.cn/qq');
    const qqLoginSrc = `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101997328&redirect_uri=${url}&state=bind`;

    window.open(qqLoginSrc, '_blank');
  };
  return (
    <>
      <div className="account-info">
        <div className="info-list flex-between">
          <div className="info-key">绑定手机</div>
          <div className="info-content">
            <span>{config.user.contact}</span>
          </div>
        </div>

        <div className="info-list flex-between">
          <div className="info-key">登录账号</div>
          <div className="info-content">
            <span>{config.user.name}</span>
            <div className="info-more" />
          </div>
        </div>

        <div className="info-list flex-between">
          <div className="info-key">登录QQ</div>
          <div className="info-content flex-between">
            <Space wrap size="large">
              {config.user.is_bind_qq && (
                <span className="a-default">{config.user.qq_nickname} </span>
              )}
              <span className="a-default" onClick={handBindQQ}>
                {config.user.is_bind_qq ? '换绑' : '绑定'}
              </span>
            </Space>
            <span className="flex1">登录QQ作为管理员QQ，享用多重特权</span>
          </div>
        </div>
        <div className="info-list flex-between">
          <div className="info-key">登录微信</div>
          <div className="info-content flex-between">
            <Space wrap size="large">
              {config.user.is_bind_wechat && (
                <span className="a-default">{config.user.wechat_nickname} </span>
              )}
              <span className="a-default" onClick={handBindWechat}>
                {config.user.is_bind_wechat ? '换绑' : '绑定'}
              </span>
            </Space>
            <span className="flex1">绑定后可使用微信扫码登录</span>
          </div>
        </div>
      </div>
    </>
  );
}
