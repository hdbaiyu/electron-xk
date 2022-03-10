import { Modal, Button, Form, Input, notification, Radio, AutoComplete } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import { withdrawal, withdrawalAccount } from '@/api/settlement';
import regexp from '../../utils/regexp';

import ContentState from '../../ContentState';

const withdrawalModal = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [debounce, setDebounce] = useState(false);
  const [btnType, changePayType] = useState('0');
  const [accounts, setAccounts] = useState([]);
  const config = useContext(ContentState);
  let { user } = config;

  /**
   * 获取提现账号
   */
  const getAccount = () => {
    withdrawalAccount().then((res) => {
      setAccounts(res);
    });
  };

  useEffect(() => {
    if (props.visible) {
      form.setFieldsValue({
        type: '0',
        bank: user.bank,
        name: user.bank_name,
        account: user.card_number,
      });
      return;
    }
    if (user.is_vip) {
      getAccount();
    }
    form.resetFields();
  }, [props.visible, user]);

  /**
   * 提交
   */
  const saveChange = (values) => {
    if (debounce) return;
    setLoading(true);
    values.type = Number(values.type);
    setDebounce(true);
    withdrawal(values)
      .then(() => {
        props.onClose();
        notification.success({
          message: '提现申请已提交',
        });
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          setDebounce(false)
        }, 5000)
      });
  };

  // 检测是否有中文
  const checkChinese = (_, val, cb) => {
    if (!val) {
      return cb('请输入');
    }
    if (!/[\u4e00-\u9fa5]+$/.test(val)) {
      return cb('请输入中文');
    }
    return cb();
  };
  const checkPrice = (_, val, cb) => {
    if (!val) {
      return cb('请输入金额');
    }
    const value = val.trim();

    if (!/[0-9]+(\.[0-9])?$/.test(value)) {
      return cb('请输入正确的金额');
    }
    cb();
  };

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
  };
  return (
    <Modal
      destroyOnClose={true}
      visible={props.visible}
      width={600}
      title="提现"
      onCancel={() => props.onClose(false)}
      className="withdrawal"
      footer={null}
    >
      <Form
        form={form}
        size="large"
        {...layout}
        style={{ width: '90%' }}
        onFinish={saveChange}
        validateTrigger="onBlur"
      >
        {btnType === '0' ? (
          <Form.Item
            name="bank"
            label="开户行"
            rules={[{ required: true, message: '' }, { validator: checkChinese }]}
          >
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.bank !== currentValues.bank}
            >
              {({ getFieldValue }) =>
                getFieldValue('bank') ? (
                  <Input
                    readOnly={!user.is_vip}
                    autoComplete="off"
                    placeholder="请输入开户行"
                    value={getFieldValue('bank')}
                  />
                ) : (
                  <Input
                    readOnly={!user.is_vip}
                    autoComplete="off"
                    placeholder="请输入开户行"
                    onChange={(e) => {
                      form.setFieldsValue({ bank: e.target.value });
                    }}
                  />
                )
              }
            </Form.Item>
          </Form.Item>
        ) : null}
        <Form.Item
          name="account"
          label="提现账号"
          rules={[{ required: true, message: '请输入提现账号' }]}
        >
          {!user.is_vip ? (
            <Input autoComplete="off" readOnly={true} placeholder="提现账号" />
          ) : (
            <AutoComplete
              placeholder="提现账号"
              onSelect={(e, index) => {
                const account = accounts[index.key];
                form.setFieldsValue({ name: account.name });
                form.setFieldsValue({ bank: account.bank });
              }}
              style={{ width: '100%' }}
            >
              {accounts.map((item, index) => (
                <AutoComplete.Option key={index} value={item.account}>
                  {item.account}
                </AutoComplete.Option>
              ))}
            </AutoComplete>
          )}
        </Form.Item>

        <Form.Item
          name="name"
          label="姓名"
          rules={[{ required: true, message: '' }, { validator: regexp.checkName }]}
        >
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.name !== currentValues.name}
          >
            {({ getFieldValue }) =>
              getFieldValue('name') ? (
                <Input
                  readOnly={!user.is_vip}
                  autoComplete="off"
                  placeholder="请输入姓名"
                  value={getFieldValue('name')}
                  onChange={(e) => {
                    form.setFieldsValue({ name: e.target.value });
                  }}
                />
              ) : (
                <Input
                  readOnly={!user.is_vip}
                  autoComplete="off"
                  placeholder="请输入姓名"
                  onChange={(e) => {
                    form.setFieldsValue({ name: e.target.value });
                  }}
                />
              )
            }
          </Form.Item>
        </Form.Item>
        <Form.Item
          name="price"
          label="金额"
          rules={[{ required: true, message: '' }, { validator: checkPrice }]}
        >
          <Input autoComplete="off" placeholder="请输入金额" />
        </Form.Item>

        <Form.Item
          name="type"
          label="提现方式"
          rules={[{ required: true, message: '请选择提现方式' }]}
        >
          <Radio.Group onChange={(e) => changePayType(e.target.value)} value={btnType}>
            <Radio className={'listRadio'} value="0" key="back">
              <div className="flex-center">
                <span className={`iconfont yinxingqia balancePay`} />
                <span className={'textLeft'}>&nbsp;银行卡</span>
              </div>
            </Radio>
            <Radio className={'listRadio'} value="1" key="ALIPAY">
              <div className="flex-center">
                <span className={`iconfont Alipayicon2x alipayPay`} />
                <span className={'textLeft'}>&nbsp;支付宝支付</span>
              </div>
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 2 }}>
          <div className="ant-col-md-10 flex-between margin-center">
            <Button onClick={() => props.onClose(false)}>取消</Button>
            <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>
              保存
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default withdrawalModal;
