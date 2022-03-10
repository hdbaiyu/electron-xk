import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { Menu, Modal, message } from 'antd';
import NProgress from 'nprogress'
import Header from '../Components/Header';
import './index.less';
import { renderRoutes } from 'react-router-config';
import ContentState from '../ContentState';
import { userInfo } from '@/api/login';
import 'nprogress/nprogress.css'

let path = ''
NProgress.configure({ easing: 'ease', speed: 300 });

const BaseLayouts = (props) => {
  const [openKeys, setOpenKeys] = useState(['home']);
  const config = useContext(ContentState);
  const [userData, setUserData] = useState({});

  useLayoutEffect(() => {
    const user = window.localStorage.getItem('user')
    if (user) {
      config.isLogin = true
    }
    const { pathname } = props.location

    if (!config.isLogin) {
      if (pathname !== '/login' && pathname !== '/') {
        message.warning('登录失效，请重新登录')
      }
      props.history.push('/login')
      return
    }
    if (user && pathname === '/') {
      props.history.replace('/home')
      return
    }
    if (config.isLogin && pathname === '/login') {
      props.history.replace('/home')
    }
    window.addEventListener('error', e => {
      if (e.error === "Unexpected token '<'" && !window.sessionStorage.errReload) {
        window.sessionStorage.errReload = true
        window.location.reload()
      }
    })
  }, [])
  /**
   * 加载用户
   * @returns {Promise<void>}
   */
  const loadUser = async () => {
    const user = await userInfo();
    if (user) {
      setUserData(user);
      config.user = user;
    }
  };
  /**
   * 点击菜单
   * @param key
   */
  const onOpenChange = ({ key }) => {
    //实名状态：-1=已驳回 0=未实名 1=审核中 2=已实名
    let msg = '';
    switch (userData.real_status) {
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
    if (userData.real_status !== 2) {
      const modalConfig = {
        title: '您还未实名',
        content: msg,
        okText: '去实名',
        cancelText: '取消',
        onOk: () => {
          props.history.push('/certification');
        },
      };
      if (userData.real_status === 1) {
        modalConfig.title = '实名审核中';
        delete modalConfig.okText;
        delete modalConfig.onOk;
      }

      Modal.confirm(modalConfig);
    }
    if (key === 'home') {
      props.history.push(`/home`);
    } else {
      props.history.push(`/home/${key}`);
    }
    setOpenKeys(key);
  };
  useEffect(() => {
    if (!config.isLogin) {
      // props.history.replace('/login');
      return;
    }
    loadUser();
    const pathnames = props.location.pathname.split('/');
    if (pathnames.length === 3) {
      setOpenKeys(pathnames[2]);
      return;
    }
    setOpenKeys(pathnames[1]);
  }, []);

  useEffect(() => {
		if (path === props.location.pathname) return
		NProgress.start()
    setTimeout(() => {
      NProgress.done()
    }, 200)
    const pathnames = props.location.pathname.split('/');
    if (pathnames.length === 3) {
      setOpenKeys(pathnames[2]);
    } else {
      setOpenKeys(pathnames[1]);
    }

		path = props.location.pathname
	}, [path, props.location.pathname])

  return (
    <main id="main">
      <Header user={userData} />
      <div className="content">
        <div className="menus">
          <Menu mode="inline" selectedKeys={openKeys} onClick={onOpenChange}>
            <Menu.Item key="home">
              <i className="iconfont icon-test" />
              我的主页
            </Menu.Item>
            <Menu.Item key="goods">
              <i className="iconfont shangpinguanli" />
              商品管理
            </Menu.Item>
            {userData.is_vip ? (
              <Menu.Item key="gathering">
                <i className="iconfont shoukuanma" />
                我的收款码
              </Menu.Item>
            ) : null}

            <Menu.Item key="balance-center">
              <i className="iconfont caiwuguanli" />
              财务管理
            </Menu.Item>
            <Menu.Item key="equity-manage">
              <i className="iconfont quanyiguanli-" />
              权益管理
            </Menu.Item>
            <Menu.Item key="income">
              <i className="iconfont dingdanjihe" />
              收支记录
            </Menu.Item>
            <Menu.Item key="order">
              <i className="iconfont dingdan" />
              订单列表
            </Menu.Item>
            <Menu.Item key="promote">
              <i className="iconfont yaoqing" />
              我的推广
            </Menu.Item>
            <Menu.Item key="account-center">
              <i className="iconfont shezhi" />
              账号管理
            </Menu.Item>
            <Menu.Item key="vip-member">
              <i className="iconfont vip" />
              VIP会员
            </Menu.Item>
          </Menu>
        </div>
        <div className="content-center">
          {renderRoutes(props.route?.routes)}
          {/*{props.children}*/}
        </div>
      </div>
    </main>
  );
};

export default BaseLayouts;
