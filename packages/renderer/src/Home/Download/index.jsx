import React, { useState } from 'react';
import { Divider, Table, Button, Modal, Form, Input, Radio } from 'antd';

const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
  const [downloadForm] = Form.useForm();
  const onCancelModal = () => {
    downloadForm.resetFields();
  };
  return (
    <Modal
      visible={visible}
      title="创建链接"
      okText="立即添加"
      afterClose={onCancelModal}
      cancelText="取消"
      onCancel={onCancel}
      cancelButtonProps={{ size: 'large' }}
      okButtonProps={{ size: 'large' }}
      onOk={() => {
        downloadForm
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={downloadForm}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form.Item
          name="goods"
          label="选择商品"
          rules={[
            {
              required: true,
              message: '请选择商品!',
            },
          ]}
        >
          <Input size={'large'} placeholder="请选择商品" />
        </Form.Item>
        <Form.Item
          name="description"
          label="下载地址"
          rules={[{ required: true, message: '请输入下载地址' }]}
        >
          <Input size={'large'} placeholder={'请输入下载地址'} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Download = () => {
  const [visible, setVisible] = useState(false);

  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    setVisible(false);
  };

  const columns = [
    {
      title: '商品',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '链接',
      dataIndex: 'link',
    },
    {
      title: '列新时间',
      dataIndex: 'update',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: () => {
        return (
          <div className="btns">
            <Button type={'primary'}>编辑</Button>
            <Button danger>删除</Button>
          </div>
        );
      },
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      link: 'www.pan.baidu.com',
      update: '2021-10-09',
      address: 'New York No. 1 Lake Park',
    },
  ];
  return (
    <div className="download-link">
      <div className="head">
        <Button type={'primary'} shape={'round'} onClick={() => setVisible(true)}>
          新增链接
        </Button>
      </div>
      <Table columns={columns} dataSource={data} />
      <CollectionCreateForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </div>
  );
};

export default Download;
