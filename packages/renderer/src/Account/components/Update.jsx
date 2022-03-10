import React, { useContext } from 'react';
import { Form, Input, message, Modal, notification, Upload } from 'antd';
import { updateInfo } from '../../api/account';
import { getQiniuToken } from '../../api/upload';
import * as qiniu from 'qiniu-js';
import { PlusOutlined } from '@ant-design/icons';
import ContentState from '../../ContentState';
import regexp from '../../utils/regexp';

// export type Props = {
//   visible: boolean, // 是否弹出
//   content: string, //原始内容
//   type: number, //类型 1=名称 2=简介 3=头像  4=店铺地址
//   onClose: () => void, //关闭
// };
let hasQiniuToken = false;

const Update = (props) => {
  const [form] = Form.useForm();
  const config = useContext(ContentState);
  /**
   * 获取七牛云token
   * @returns {Promise<AxiosResponse<any>>}
   */
  const loadQiniuToken = async () => {
    hasQiniuToken = await getQiniuToken();
    return hasQiniuToken;
  };
  /**
   * 上传文件前的校验
   * @param file
   * @returns {boolean}
   */
  const beforeUploadImg = (file) => {
    const isImg = ['png', 'jpeg', 'jpg', 'bmp'].indexOf(file.type.slice(6)) !== -1;
    if (!isImg) {
      notification.error({
        message: '错误提示',
        description: '图片上传暂仅支持png,jpg,jpeg,bmp类型',
      });
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      notification.error({
        message: '错误提示',
        description: '图片的大小不能超过10M',
      });
    }
    return isImg && isLt10M;
  };

  /**
   * 上传图片
   * @param file
   * @param column
   * @returns {Promise<void>}
   */
  const handleUpload = async (file, column) => {
    form.setFieldsValue({ [column]: '' });
    let data = hasQiniuToken;
    if (!hasQiniuToken) {
      data = await loadQiniuToken();
    }
    const observer = {
      error() {
        message.error('上传失败');
      },
      complete(res) {
        console.log(config.assets + res.key);
        form.setFieldsValue({ [column]: config.assets + res.key });
      },
    };
    const options = {
      quality: 0.94,
      noCompressIfLarger: true,
      maxWidth: 240,
      maxHeight: 240
    }
    qiniu.compressImage(file, options).then(res => {
      const observable = qiniu.upload(
        new File([res.dist], file.name),
        `id-${Date.now()}${file.type.replace('image/', '.')}`,
        data.token,
      );
      observable.subscribe(observer);
    })

  };

  /**
   * 获取上传组件
   * @param column
   * @returns {JSX.Element}
   */
  const getUpload = (column) => {
    return (
      <>
        <Upload
          name="id_positive"
          listType="picture-card"
          beforeUpload={beforeUploadImg}
          customRequest={(e) => {
            handleUpload(e.file, column);
          }}
          showUploadList={false}
          maxCount={1}
        >
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues[column] !== currentValues[column]
            }
          >
            {({ getFieldValue }) =>
              getFieldValue(column) ? (
                <img src={getFieldValue(column)} alt="" style={{ width: '100%' }} />
              ) : (
                <PlusOutlined />
              )
            }
          </Form.Item>
        </Upload>
      </>
    );
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
            console.log(values);
            const params = { ...values };
            updateInfo(params).then(() => {
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

  /**
   * 根据类型获取FormItem
   * @returns {JSX.Element}
   */
  const getFormItemByType = () => {
    const type = props.type;
    //类型 1=名称 2=简介 3=头像 4=修改手机号 5=店铺地址
    if (type === 1) {
      form.setFieldsValue({ name: props.content });
      return (
        <Form.Item rules={[{ required: true }]} label="名称" name="name">
          <Input />
        </Form.Item>
      );
    }
    if (type === 2) {
      form.setFieldsValue({ description: props.content });
      return (
        <Form.Item label="简介" rules={[{ required: true }]} name="description">
          <Input.TextArea autoSize={{ minRows: 3 }} />
        </Form.Item>
      );
    }
    if (type === 3) {
      form.setFieldsValue({ avatar: props.content });
      return (
        <Form.Item name="avatar" label="头像" rules={[{ required: true, message: '请上传头像' }]}>
          {getUpload('avatar')}
        </Form.Item>
      );
    }
    if (type === 4) {
      form.setFieldsValue({ domain: props.content });
      return (
        <Form.Item label="店铺地址" rules={[{ required: true }]} name="domain">
          <Input />
        </Form.Item>
      );
    }
  };

  return (
    <Modal
      title="修改 "
      centered
      visible={props.visible}
      onCancel={() => {
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
        {getFormItemByType()}
      </Form>
    </Modal>
  );
};

export default Update;
