import { useState } from 'react';
import { Form, Input, Button, message, InputNumber } from 'antd';
import { transfer } from '@/api/income';

const Transfer = () => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  /**
   * 提交
   * @param values
   */
  const submit = (values) => {
    setLoading(true);
    transfer(values)
      .then(() => {
        message.success('转账成功！');
        form.resetFields();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form
      onFinish={submit}
      form={form}
      size="large"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 10 }}
    >
      <Form.Item
        name="account"
        label="对方账号"
        rules={[{ required: true, message: '请输入对方登录账号' }]}
      >
        <Input placeholder="请输入对方登录账号" />
      </Form.Item>
      <Form.Item name="price" label="金额" rules={[{ required: true, message: '请输入金额' }]}>
        <InputNumber min={0.01} placeholder="请输入金额" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 4 }}>
        <Button htmlType="submit" type="primary" loading={loading}>
          确定
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Transfer;
