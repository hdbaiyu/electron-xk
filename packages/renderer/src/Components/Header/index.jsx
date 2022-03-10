import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import './index.less';
import {Avatar, Dropdown, Menu} from "antd";
import ContentState from '../../ContentState';
// import { userInfo } from "@/api/login";

import SocketClient from '@/utils/client';

function Header(props) {
  const config = useContext(ContentState);
  const History = useHistory();
  const Client = new SocketClient(config.WSS);
  let local = window.localStorage.getItem('user');
  local = JSON.parse(local)

  // const loadUser = async ()=> {
  //   const user = await userInfo()
  //   if (user) {
  //     config.user = user
  //   }
  // }
  useEffect(()=> {
    if (local) {
      Client.on('start', ()=>  {
        Client.send(
          {"request_id": `login-${Date.now()}`, //请求ID
            "type": "login",
            "data": {
              "app_id": config.rootPath,
              token: local.token
            }
          })
      })
    }
    setInterval(()=> {
      Client.send({
        "request_id": Date.now()+'', //请求ID
        "type": "heartbeat", //心跳
        "data": {}
        })
    }, 4000)

    config.Client = Client// socket 存起来
    const user = localStorage.getItem('user')
    if (user) {// 登录状态
      config.isLogin = true
      // loadUser();
    }
  }, [])

  const handLogout = ()=> {
    config.user = ''
    config.isLogin = false
    localStorage.removeItem('user')
    History.replace('/')
  }
  const menu = (
    <Menu onClick={handLogout}>
      <Menu.Item key={'logout'}>退出登录</Menu.Item>
    </Menu>
  )
  return (
    <header className="header">
      <div className="logos" onClick={() => History.push('/')}>
        <img className="logo-1" src={config.whiteLogo} />
        {/*<span className="platform">{config.platform}</span>*/}
      </div>
      <div className="navigation">
        <a className="navitem cursor" href="https://www.5xk.cn/knowledge" target="_blank">
          常见问题
        </a>
        <span className="navitem">联系客服</span>
        {config.isLogin ? (
          <Dropdown overlay={menu}>
            <span>
              <Avatar src={props.user?.avatar} alt=""/>
              <i className="iconfont jiantou-copy-copy-copy"></i>
            </span>
            {/*<Tooltip title="退出登录">*/}
            {/*  <Button onClick={handLogout} className="cursor" type="ghost">*/}
            {/*    退出*/}
            {/*  </Button>*/}
            {/*</Tooltip>*/}
          </Dropdown>
          )

          :null
        }
      </div>
    </header>
  );
}

export default Header;
