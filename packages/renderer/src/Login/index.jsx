import React, { useEffect, useState, useContext } from 'react';
import './index.less';
import Wechat from './Wechat';
import regexp from '../utils/regexp';
import { Tabs, Form, Input, Checkbox, Button, message, Space } from 'antd';
import { drawFrame, init } from '../utils/lib/star';
import ContentState from '../ContentState';
import { useHistory } from 'react-router-dom';
import { login } from '@/api/login';
import md5 from 'js-md5';
const { TabPane } = Tabs;

function Login(props) {
  const [loginType, setLoginType] = useState('default');
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const config = useContext(ContentState);
  const History = useHistory();

  const url = encodeURIComponent('https://supplier.5xk.cn/qq');
  const qqLoginSrc = `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101997328&redirect_uri=${url}&state=login`;

  useEffect(() => {
    init();
    drawFrame();
  }, []);

  /**
   * 选择登录方式
   * @param type
   */
  const switchLoginType = (type) => {
    setLoginType(type);
    if (localStorage.contact) {
      form.setFieldsValue({ contact: localStorage.contact });
      form.setFieldsValue({ record: true });
      setTimeout(() => {
        document.getElementById('basic_password').focus();
      }, 500);
      return;
    }
    setTimeout(() => {
      document.getElementById('basic_contact').focus();
    }, 500);
  };

  /**
   * 登录
   * @param value
   */
  const onFinish = (value) => {
    if (value.record) {
      localStorage.contact = value.contact;
    } else {
      localStorage.removeItem('contact');
    }
    setLoading(true);
    const data = {
      contact: value.contact,
      password: md5(value.password),
    };
    login(data)
      .then((res) => {
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
        setTimeout(() => {
          setLoading(false);
          props.history.push('/home')
        }, 500);

      })
      .catch(() => {
        setLoading(false);
      });
  };
  /**
   * tab改变
   * @param key
   */
  const onChange = (key) => {
    if (key === 'phone') {
      switchLoginType(loginType === 'account' ? 'default' : 'account');
    }
  };

  // 内容区
  return (
    <div id="login">
      <header>
        <div className="logos">
          <img src={config.darkLogo} className="logo-1" alt="" />
        </div>
        <div className="nav">
          <a className="nav-item cursor" href="https://www.5xk.cn/knowledge" target="_blank">
            常见问题
          </a>
          <span className="nav-item">联系客服</span>
        </div>
      </header>
      <main id="bg">
        <div className="loginBox">
          <div className="loginHeader flex-between">
            <span className="font-20 header-left">
              {loginType === 'account' ? (
                <span className="cursor" onClick={() => setLoginType('default')}>
                  <i className="iconfont zuojiantou font-20" />
                  返回QQ/微信登录
                </span>
              ) : (
                '登录'
              )}
            </span>
            <span>
              还没有账号？<a onClick={() => History.push('/register')}>注册</a>
            </span>
          </div>
          {loginType === 'account' ? (
            <Form
              form={form}
              size="large"
              name="basic"
              wrapperCol={{ offset: 3, span: 18 }}
              initialValues={{ record: false }}
              onFinish={onFinish}
            >
              <Form.Item
                name="contact"
                rules={[{ required: true, validator: regexp.checkNameOrNumber }]}
              >
                <Input placeholder="邮箱/手机号" className="item-input" />
              </Form.Item>

              <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                <Input.Password className="item-input" placeholder="密码" />
              </Form.Item>
              <Form.Item
                className="checkMe"
                name="record"
                valuePropName="checked"
                wrapperCol={{ offset: 3, span: 8 }}
              >
                <Checkbox>记住账号</Checkbox>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 3, span: 18 }}>
                <Button type="primary" block htmlType="submit" disabled={loading} loading={loading}>
                  登录
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Tabs onChange={onChange} centered defaultActiveKey="wechat" size="small">
              <TabPane tab="微信" key="wechat">
                <Wechat />
              </TabPane>
              <TabPane tab="QQ" key="qq">
                <div className="qq-tab" style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button href={qqLoginSrc} type="link">
                    <img style={{ width: '80px' }} src="/assets/image/qq.png" alt="" />
                    <p style={{ marginTop: '10px', color: '#333' }}>QQ账号登录</p>
                  </Button>
                </div>
              </TabPane>
              <TabPane tab="手机/邮箱登录" key="phone" />
            </Tabs>
          )}
          <div className="text-right">
            <Space>
              {/*<Button href={qqLoginSrc} target="_blank" type="link">*/}
              {/*  QQ登录*/}
              {/*</Button>*/}
              {/*<div*/}
              {/*    className="account-login"*/}
              {/*    onClick={() => switchLoginType(loginType === 'account' ? 'default' : 'account')}*/}
              {/*>*/}
              {/*  手机/邮箱登录*/}
              {/*</div>*/}
              {/*<Button*/}
              {/*  onClick={() => switchLoginType(loginType === 'account' ? 'default' : 'account')}*/}
              {/*  type="link"*/}
              {/*>*/}
              {/*  手机/邮箱登录*/}
              {/*</Button>*/}
            </Space>
          </div>
        </div>
        <div className="sound-container">
          <ul className="sound">
            {new Array(4).fill(5).map((item, index) => (
              <li key={index.toString()} />
            ))}
          </ul>
        </div>

        {/*<div className="waves"></div>*/}
        <canvas id="canvas" />
      </main>
    </div>
  );
}

export default Login;
