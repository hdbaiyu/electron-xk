import { Alert, Button, Modal, Form, Input, Select, notification, message } from 'antd';
import React, { useContext, useState } from 'react';
import Utils from '../../utils/regexp';
import { senBindAlipay, sendBindBack } from '../../api/settlement';
import ContentState from '../../ContentState';

export default function Binds() {
  const [modalBlank, setModalBlank] = useState(false);
  const [modalWechat, setModalWechat] = useState(false);
  const [modalAlipay, setModalAlipay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const config = useContext(ContentState);
  let { user } = config;

  const closeModal = () => {
    if (modalWechat) {
      setModalWechat(false);
      return;
    }
    setModalAlipay(false);
  };

  /**
   * 绑定银行卡
   */
  const bindBlank = () => {
    form.validateFields().then(async (res) => {
      setLoading(true);
      const data = await sendBindBack(res).finally(() => setLoading(false));
      if (data) {
        setModalBlank(false);
        message.success('绑定成功');
      }
    });
  };

  /**
   * 绑定支付宝
   */
  const bindAlipay = () => {
    form.validateFields().then(async (res) => {
      setLoading(true);
      senBindAlipay(res)
        .then(() => {
          setModalAlipay(false);
          message.success('绑定成功');
        })
        .finally(() => setLoading(false));
    });
  };

  /**
   * 绑定银行卡表单显示
   */
  const blankShow = () => {
    setModalBlank(true);
    form.setFieldsValue({
      bank: user.bank,
      card_number: user.card_number,
      name: user.bank_name,
      phone: user.bank_phone,
    });
  };
  /**
   * 绑定支付宝表单显示
   */
  const alipayShow = () => {
    setModalAlipay(true);
    form.setFieldsValue({
      account: user.alipay_account,
      name: user.alipay_name,
    });
  };
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 },
  };

  const closeModalBlank = () => {
    form.resetFields();
  };

  /**
   * 绑定银行卡表单
   * @returns {JSX.Element}
   */
  const renderForm = () => {
    return (
      <Form form={form} {...layout} size="large" onFinish={bindBlank} validateTrigger="onBlur">
        <Form.Item name="bank" label="开户行" rules={[{ required: true, message: '请输入开户行' }]}>
          <Input placeholder="请输入开户行" />
        </Form.Item>
        <Form.Item
          name="card_number"
          label="卡号"
          rules={[{ required: true, validator: Utils.checkBack }]}
        >
          <Input size={'large'} placeholder={'请输入卡号'} />
        </Form.Item>
        <Form.Item
          name="name"
          label="姓名"
          rules={[{ required: true, message: '请输入姓名', validator: Utils.checkName }]}
        >
          <Input size={'large'} placeholder={'请输入姓名'} />
        </Form.Item>
        <Form.Item
          name="phone"
          label="电话号码"
          rules={[{ required: true, validator: Utils.checkPhone }]}
        >
          <Input size={'large'} placeholder={'请输入电话手码'} />
        </Form.Item>
        <div className={'text-center'}>
          <Button type={'primary'} htmlType="submit" disabled={loading} loading={loading}>
            提交
          </Button>
        </div>
      </Form>
    );
  };

  /**
   * 绑定支付宝表单
   * @returns {JSX.Element}
   */
  const renderAlipayForm = () => {
    return (
      <Form form={form} {...layout} size="large" onFinish={bindAlipay} validateTrigger="onBlur">
        <Form.Item name="account" label="账号" rules={[{ required: true, message: '请输入账号' }]}>
          <Input placeholder="请输入账号" />
        </Form.Item>

        <Form.Item
          name="name"
          label="姓名"
          rules={[{ required: true, message: '请输入姓名', validator: Utils.checkName }]}
        >
          <Input size={'large'} placeholder={'请输入姓名'} />
        </Form.Item>

        <div className={'text-center'}>
          <Button type={'primary'} htmlType="submit" disabled={loading} loading={loading}>
            提交
          </Button>
        </div>
      </Form>
    );
  };

  /**
   * 获取绑定支付按钮
   */
  const getAlipayButton = () => {
    // 绑定了是vip显示修改
    if (user.alipay_account.length > 0 && user.is_vip) {
      return (
        <Button type="primary" onClick={alipayShow}>
          修改
        </Button>
      );
    }
    // 没有绑定显示绑定
    if (user.alipay_account.length === 0) {
      return (
        <Button type="primary" onClick={alipayShow}>
          绑定
        </Button>
      );
    }
    return null;
  };
  /**
   * 获取绑定银行卡按钮
   */
  const getBankyButton = () => {
    // 绑定了是vip显示修改
    if (user.alipay_account.length > 0 && user.is_vip) {
      return (
        <Button type="primary" onClick={blankShow}>
          修改
        </Button>
      );
    }
    // 没有绑定显示绑定
    if (user.alipay_account.length === 0) {
      return (
        <Button type="primary" onClick={blankShow}>
          绑定
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="binds">
      <Alert
        message={
          '请尽快绑定收款帐号，以免影响提现。请选择以下收款方式中的一种进行提现。（至少绑定一种收款方式）'
        }
      />
      <div className="bind-list">
        <div className="bind-item flex-center">
          <div className="unit">&nbsp;</div>
          <div className="">
            {user.card_number.length > 0 ? (
              user.card_number
            ) : (
              <>
                <span className="iconfont yinxingqia" /> 银行卡绑定
              </>
            )}
          </div>
          {getBankyButton()}
        </div>
        {/*<div className="bind-item flex-center">*/}
        {/*  <div className="unit">&nbsp;</div>*/}
        {/*  <div>*/}
        {/*    <span className="iconfont WeChaticon2x" /> 微信绑定*/}
        {/*  </div>*/}
        {/*  <Button type="primary" onClick={() => setModalWechat(true)}>*/}
        {/*    绑定*/}
        {/*  </Button>*/}
        {/*</div>*/}
        <div className="bind-item flex-center">
          <div className="unit">&nbsp;</div>
          <div>
            {user.alipay_account.length > 0 ? (
              user.alipay_account
            ) : (
              <>
                <span className="iconfont Alipayicon2x" /> 支付宝绑定
              </>
            )}
          </div>
          {getAlipayButton()}
        </div>
      </div>
      <br />
      <div className="bind-notice text-center">至少绑定一种收款方式</div>
      <Modal
        visible={modalBlank}
        title={'绑定银行卡号'}
        centered={true}
        footer={null}
        width={560}
        onCancel={() => setModalBlank(false)}
        afterClose={closeModalBlank}
      >
        {renderForm()}
      </Modal>

      <Modal
        visible={modalWechat || modalAlipay}
        title={`绑定${modalWechat ? '微信' : '支付宝'}`}
        onCancel={closeModal}
        centered={true}
        footer={null}
      >
        {renderAlipayForm()}
      </Modal>
    </div>
  );
}
