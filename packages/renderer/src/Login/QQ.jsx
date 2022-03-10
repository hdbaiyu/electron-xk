import React, { useContext, useEffect } from 'react';
import queryString from 'query-string';
import { message } from 'antd';
import ContentState from '../ContentState';
import { qqLogin } from '@/api/login';
import { bindQQ } from '@/api/account';

function QQ (props) {
  const config = useContext(ContentState);
  useEffect(() => {
    const { code, state } = queryString.parse(location.search);
    if (code) {
      if (state === 'login') {
        qqLogin({ code }).then((res) => {
          config.isLogin = true;
          localStorage.user = JSON.stringify(res);
          // 实名状态：-1=已驳回 0=未实名 1=审核中 2=已实名

          message.success('登录成功');
          props.history.push('/home')
        });
      } else {
        bindQQ({ code }).then((res) => {
          message.success('绑定成功');
          props.history.push('/home/account-center')
          // window.location.href = '/home/account-center';
        });
      }
    }
  }, []);
  return null;
}

export default QQ;
