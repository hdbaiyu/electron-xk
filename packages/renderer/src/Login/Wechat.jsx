import React, { useContext, useEffect } from 'react';

import { wechatLogin } from '@/api/login';
import queryString from 'query-string';
import { message } from 'antd';
import ContentState from '../ContentState';

function Wechat(props) {
  const config = useContext(ContentState);

  useEffect(() => {
    new window.WxLogin({
      id: 'wechatlogin',
      appid: 'wxb97152a9516bab7c',
      scope: 'snsapi_login',
      response_type: 'code',
      redirect_uri: encodeURIComponent('https://supplier.5xk.cn'),
    });

    const { code } = queryString.parse(location.search);
    if (code) {
      wechatLogin({ code }).then((res) => {
        config.isLogin = true;
        localStorage.user = JSON.stringify(res);
        // 实名状态：-1=已驳回 0=未实名 1=审核中 2=已实名
        let msg = '';
        switch (res.real_status) {
          case 0:
            msg = '您还未通过实名认证，请先通过实名认证';
            break;
          case -1:
            msg = '已驳回, 信息未通过';
            break;
          case 1:
            msg = '审核中，请稍后再试，或联系客服';
            break;
          default:
            break;
        }
        message.success('登录成功');
        props.history.push('/home')
        // window.location.href = '/home';
      });
    }
  }, []);

  return (
    <div className="wechat-tab flex-center">
      <div id="wechatlogin" />
    </div>
  );
}

export default Wechat;
