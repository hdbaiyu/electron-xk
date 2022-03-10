import React, { useContext, useState } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import { updatePhone, sendOldPhone, sendBindPhone } from '../../api/account';
import regexp from '../../utils/regexp';

// export type Props = {
//   visible: boolean, // 是否弹出
//   onClose: () => void, //关闭
// };

const Update = (props) => {
  const [form] = Form.useForm();
  const [time, setTime] = useState(60);
  const [isShowCode, setIsShowCode] = useState(false);

  const [bindTime, setBindTime] = useState(60);
  const [isShowBindCode, setIsShowBindCode] = useState(false);

  /**
   * 发送验证码
   * @returns {Promise<void>}
   */
  const sendCode = async () => {
    const fields = await form.validateFields(['old_phone']);
    if (isShowCode) {
      // 倒计时未结束,不能重复点击
      return;
    }
    setIsShowCode(true);
    // 倒计时
    const active = setInterval(() => {
      setTime((preSecond) => {
        if (preSecond <= 1) {
          setIsShowCode(false);
          clearInterval(active);
          // 重置秒数
          return 60;
        }
        return preSecond - 1;
      });
    }, 1000);

    sendOldPhone(fields.old_phone).then(() => {
      message.success('发送成功,请注意查收');
    });
  };

  /**
   * 发送验证码
   * @returns {Promise<void>}
   */
  const sendBindCode = async () => {
    const fields = await form.validateFields(['phone']);
    if (isShowBindCode) {
      // 倒计时未结束,不能重复点击
      return;
    }
    setIsShowBindCode(true);
    // 倒计时
    const active = setInterval(() => {
      setBindTime((preSecond) => {
        if (preSecond <= 1) {
          setIsShowBindCode(false);
          clearInterval(active);
          // 重置秒数
          return 60;
        }
        return preSecond - 1;
      });
    }, 1000);

    sendBindPhone(fields.phone).then(() => {
      message.success('发送成功,请注意查收');
    });
  };

  /**
   * 提交
   */
  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        Modal.confirm({
          title: '确认要提交吗?',
          onOk: async () => {
            const params = { ...values };
            params;
            updatePhone(params).then(() => {
              form.resetFields();
              props.onClose();
              props.loadData();

              message.success('修改成功');
            });
          },
        });
      })
      .catch((info) => {
        console.log(info);
      });
  };

  return (
    <Modal
      title="修改手机号"
      centered
      visible={props.visible}
      onCancel={() => {
        form.resetFields();
        props.onClose();
      }}
      onOk={handleSubmit}
    >
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        name="basic"
        autoComplete="off"
      >
        <Form.Item
          label="原手机号"
          rules={[{ required: true, validator: regexp.checkPhone }]}
          name="old_phone"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="验证码"
          name="old_code"
          extra={
            <Button style={{ padding: 0 }} href="qq:254628638" size="small" type="link">
              原手机号无法接收短信？
            </Button>
          }
          rules={[{ required: true, message: '请输入验证码！' }]}
        >
          <Input
            maxLength={6}
            suffix={
              <a onClick={() => sendCode()}>{isShowCode ? `${time}秒后重新发送` : '发送验证码'}</a>
            }
          />
        </Form.Item>

        <Form.Item
          label="新手机号"
          rules={[{ required: true, validator: regexp.checkPhone }]}
          name="phone"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="验证码"
          name="code"
          rules={[{ required: true, message: '请输入验证码！' }]}
        >
          <Input
            maxLength={6}
            suffix={
              <a onClick={() => sendBindCode()}>
                {isShowBindCode ? `${bindTime}秒后重新发送` : '发送验证码'}
              </a>
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Update;
