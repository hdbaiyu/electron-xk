import React, { useContext, useState } from 'react';
// 实名认证
import { Form, Input, Button, notification, Radio, Upload, Row, Col, message } from 'antd';
import ContentState from '../ContentState';
import './index.less';
import { PlusOutlined } from '@ant-design/icons';

import regexp from '../utils/regexp';
import { getQiniuToken } from '../api/upload';
import * as qiniu from 'qiniu-js';
import { useHistory } from 'react-router-dom';
import { certification } from '@/api/login';

let hasQiniuToken = false;

/**
 * 认证
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const CertificationPage = (props) => {
  const { setCurrent, current, type } = props;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const config = useContext(ContentState);
  const History = useHistory();

  /**
   * 提交
   * @param values
   */
  const onFinish = (values) => {
    values.type = type;
    setLoading(true);
    certification(values)
      .then(() => {
        History.replace('/home');
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
        form.setFieldsValue({ [column]: config.assets + res.key });
      },
    };
    const observable = qiniu.upload(
      file,
      `id-${Date.now()}${file.type.replace('image/', '.')}`,
      data.token,
    );
    observable.subscribe(observer);
  };

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

  return (
    <div className="certification">
      <Row>
        <Col span={18} offset={2}>
          <Form
            form={form}
            size="large"
            name="certification"
            className="form-certification"
            wrapperCol={{ span: 18 }}
            labelCol={{ span: 4 }}
            autoComplete={'off'}
            scrollToFirstError={true}
            onFinish={onFinish}
            validateTrigger={'onBlur'}
          >
            <Form.Item
              name="username"
              label="姓名"
              rules={[{ required: true, validator: regexp.checkName }]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item name="sex" label="性别" rules={[{ required: true, message: '请选择性别' }]}>
              <Radio.Group>
                <Radio value={1}>男</Radio>
                <Radio value={0}>女</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="phone"
              label="手机号码"
              rules={[{ required: true, validator: regexp.checkPhone }]}
            >
              <Input placeholder="请输入手机号码" />
            </Form.Item>
            <Form.Item
              name="id_number"
              label="身份证号码"
              rules={[{ required: true, validator: regexp.checkIsCard }]}
            >
              <Input placeholder="请输入身份证号码" />
            </Form.Item>

            {type !== 0 ? (
              <>
                <Form.Item
                  name="business_license"
                  label="营业执照"
                  rules={[{ required: true, message: '请上传账号运营授权书' }]}
                >
                  {getUpload('business_license')}
                </Form.Item>
                <Form.Item name="credit_code" label="统一社会信用代码" rules={[{ required: true }]}>
                  <Input placeholder="请输入统一社会信用代码" />
                </Form.Item>

                <Form.Item label="身份证" extra="第一张为正面，第二张为反面">
                  <Row gutter={8}>
                    <Col span={5}>
                      <Form.Item
                        name="id_positive"
                        noStyle
                        rules={[{ required: true, message: '请上传身份证正面' }]}
                      >
                        {getUpload('id_positive')}
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        name="id_reverse"
                        noStyle
                        rules={[{ required: true, message: '请上传身份证反面' }]}
                      >
                        {getUpload('id_reverse')}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item
                  name="power_of_attorney"
                  label="账号运营授权书"
                  rules={[{ required: true, message: '请上传账号运营授权书' }]}
                >
                  {getUpload('power_of_attorney')}
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  name="id_positive"
                  label="身份证正面照片"
                  rules={[{ required: true, message: '请上传身份证正面照片' }]}
                >
                  {getUpload('id_positive')}
                </Form.Item>

                <Form.Item
                  name="id_reverse"
                  label="身份证反面照片"
                  rules={[{ required: true, message: '请上传身份证反面照片' }]}
                >
                  {getUpload('id_reverse')}
                </Form.Item>
              </>
            )}

            <Form.Item wrapperCol={{ offset: 8, span: 6 }}>
              <div className="flex-between">
                <Button
                  shape="round"
                  className="cancel-btn"
                  onClick={() => setCurrent(current - 1)}
                >
                  上一步
                </Button>
                <Button
                  shape="round"
                  className="save-btn"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  保存
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default CertificationPage;
