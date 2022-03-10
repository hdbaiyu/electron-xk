import React, { useState, useContext, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Row, Col, message } from 'antd';
import { register, captcha, sms } from '../api/login';
import regexp from '../utils/regexp';
import md5 from 'js-md5';
import ContentState from '../ContentState';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

// 填写账号信息
const FillAccount = (props) => {
  const [loading, setLoading] = useState(false);
  const [forms] = Form.useForm();
  const { setCurrent, current } = props;
  const storage = JSON.parse(window.sessionStorage.getItem('register'));
  const config = useContext(ContentState);
  const [captchaId, setCaptchaId] = useState();
  const [captchaImg, setCaptchaImg] = useState();
  const [captchaCode, setCaptchaCode] = useState('');

  const location = useLocation();

  /**
   * 获取图形验证码
   */
  const getCaptcha = () => {
    captcha().then((res) => {
      setCaptchaId(res.captcha_id);
      setCaptchaImg(res.data);
    });
  };

  useEffect(() => {
    getCaptcha();
    const { code } = queryString.parse(location.search);
    if (code) {
      localStorage.setItem('xkcode', code);
    }
    forms.setFieldsValue({
      link_code: localStorage.getItem('xkcode'),
    });
  }, []);
  /**
   * 发送验证码
   */
  const handleSms = () => {
    const params = {
      phone: forms.getFieldValue('contact'),
      captcha_id: captchaId,
      captcha_code: captchaCode,
    };
    sms(params).then((res) => {
      message.success('验证码发送成功');
      console.log(res);
    });
  };

  /**
   * 提交
   * @param values
   */
  const finished = (values) => {
    if (!values.agreement) {
      forms.setFields([
        {
          name: 'agreement',
          errors: ['请先阅读并遵守上面各项协议'],
        },
      ]);
      return;
    }
    const params = { ...values };
    setLoading(true);
    params.password = md5(values.password);
    delete params.agreement;
    delete params.link_code;
    params.sponsored_link = values.link_code;
    if (!values.code) {
      params.sponsored_link = '';
    }
    if (storage.type !== 'contact') {
      params.code = '';
    }
    register(params)
      .then((res) => {
        setLoading(false);
        config.user = res;
        localStorage.user = JSON.stringify(res);
        message.success('注册成功');
        setTimeout(() => {
          window.location.href = '/home';
        }, 1000);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className="fill-account flex-justify-center">
      <div className="title text-center">填写账号信息</div>
      <div className="wrap container">
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          form={forms}
          autoComplete={'off'}
          scrollToFirstError={true}
          onFinish={finished}
          validateTrigger="onBlur"
        >
          {storage.type === 'contact' ? (
            <>
              <Form.Item
                label="手机号"
                name="contact"
                rules={[{ required: true, validator: regexp.checkPhone }]}
              >
                <Input size="large" placeholder="请输入手机号" />
              </Form.Item>
              <Form.Item label="获取验证码">
                <Row gutter={8}>
                  <Col span={8}>
                    <Form.Item noStyle>
                      <Input
                        size="large"
                        onChange={(e) => {
                          setCaptchaCode(e.target.value);
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <img
                      style={{ borderRadius: '6px' }}
                      onClick={getCaptcha}
                      src={captchaImg}
                      alt=""
                    />
                  </Col>
                  <Col span={8}>
                    <Button size="large" onClick={handleSms} disabled={captchaCode === ''}>
                      获取验证码
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item label="验证码" name="code" rules={[{ required: true }]}>
                <Input size="large" placeholder="请输入验证码" />
              </Form.Item>
            </>
          ) : (
            <Form.Item
              label="邮箱"
              name="email"
              rules={[{ required: true, validator: regexp.checkEmail }]}
            >
              <Input size="large" placeholder="请输入邮箱" />
            </Form.Item>
          )}

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, validator: regexp.checkPassword }]}
          >
            <Input.Password size="large" placeholder="请输入密码" />
          </Form.Item>

          <Form.Item label="推广码" name="link_code" rules={[{ required: false, max: 255 }]}>
            <Input size="large" disabled={true} placeholder="如果有，请输入推广码" />
          </Form.Item>

          <Form.Item
            name="agreement"
            rules={[{ required: true, message: '请先阅读并遵守上面各项协议' }]}
            valuePropName="checked"
            wrapperCol={{ span: 18, offset: 6 }}
          >
            <Checkbox>
              我同意并遵守
              <span className="a-default">
                <a target="_blank" href="https://www.5xk.cn/agreement/user">
                  《星卡平台用户协议》
                </a>
                <a href="https://www.5xk.cn/agreement/clause" target="_blank">
                  《法律声明及隐私权政策》
                </a>
                <a href="https://www.5xk.cn/agreement/forbid" target="_blank">
                  《平台禁售商品目录》
                </a>
              </span>
            </Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <div className="flex-between footerBtn">
              <Button size="large" onClick={() => setCurrent(current - 1)}>
                上一步
              </Button>
              <Button type="primary" htmlType="submit" size="large" loading={loading}>
                提交
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default FillAccount;
