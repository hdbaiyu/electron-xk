import React, { useState, useEffect, useContext } from 'react';
import {
  message,
  Form,
  Input,
  Radio,
  Row,
  Col,
  Select,
  Button,
  Upload,
  notification,
  InputNumber,
  Modal,
} from 'antd';

import './index.less';
import ContentState from '../../../ContentState';
import { goods_category, addGoods, putGoods } from '@/api/goods';
import { getQiniuToken } from '@/api/upload';
import * as qiniu from 'qiniu-js';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

const { Option } = Select;

let hasQiniuToken = false;

const AddEditGoods = (props) => {
  const { visible, onClose } = props;
  const [loading, setLoading] = useState(false);
  const [fileListImg, setFileListImg] = useState([]);
  const [classifyListData, setClassifyListData] = useState([]);
  const [currentClassify, setCurrentClassify] = useState({ type: 0 }); // 选择某种商品

  const [editorState, setEditorState] = useState(BraftEditor.createEditorState(null));

  const [goodsForm] = Form.useForm();
  const config = useContext(ContentState);

  useEffect(() => {
    if (props?.visible) {
      goods_category().then((res) => {
        setClassifyListData(res);
      });
      // @ts-ignore
      if (props.goods.id) {
        getGoodsDetail();
      }
    }
  }, [props?.visible]);

  const loadQiniuToken = async () => {
    hasQiniuToken = await getQiniuToken();
    return hasQiniuToken;
  };
  // 上传文件前的校验
  const beforeUploadImg = (file) => {
    const isImg = ['png', 'jpeg', 'jpg', 'bmp'].indexOf(file.type.slice(6)) !== -1;
    if (!isImg) {
      message.error('图片上传暂仅支持png,jpg,jpeg,bmp类型');
    }
    const isLt10M = file.size / 1024 / 1024 < 5;
    if (!isLt10M) {
      message.error('图片的大小不能超过5M');
    }
    return isImg && isLt10M;
  };
  const observer = {
    next: () => {},
    error: (err) => {
      message.error(err.message);
    },
    complete: (res) => {
      fileListImg.push({
        url: config.assets + res.key,
        status: 'done',
        uid: res.hash,
        name: res.key,
      });
      setFileListImg([...fileListImg]);
    },
  };
  // 上传图片
  const handleCustomRequest = async (options) => {
    const { file } = options;
    let data = hasQiniuToken;

    if (!hasQiniuToken) {
      data = await loadQiniuToken();
    }
    const observable = qiniu.upload(
      file,
      `upload-${Date.now()}${file.type.replace('image/', '.')}`,
      data.token,
    );
    observable.subscribe(observer); // 上传开始
  };

  // 删除图片
  const handleRemoveImg = (file) => {
    const fiiles = fileListImg.filter((i) => file.url === i.url);
    setFileListImg(fiiles);
  };

  /**
   * 富文本内容改变
   * @param domEditorState
   */
  const handleContent = (domEditorState) => {
    setEditorState(domEditorState);
    goodsForm.setFieldsValue({ content: domEditorState.toHTML() });
  };
  // 编辑商品回显详情
  const getGoodsDetail = () => {
    const goodsItem = [];
    const { goods } = props;
    setEditorState(BraftEditor.createEditorState(goods.content));

    const fileterKey = ['category', 'id', 'created_at', 'updated_at', 'supplier_id', 'type'];
    setCurrentClassify({ type: goods.type });
    setFileListImg(goods.preview.map((file) => ({ url: file, uid: file })));
    for (const key in goods) {
      if (fileterKey.includes(key)) continue;
      goodsItem.push({
        name: key,
        value: goods[key],
      });
    }

    goodsForm.setFields(goodsItem);
  };
  const changeType = (id) => {
    const current = classifyListData.find((item) => item.id === id);
    setCurrentClassify(current || {});
  };

  // 保存商品
  const onFinish = (values) => {
    setLoading(false);
    values.preview = fileListImg.map((img) => img.url);
    if (props.goods.id) {
      // 更新

      putGoods(props.goods.id, values)
        .then(() => {
          onClose();
          goodsForm.resetFields();
          notification.success({
            message: '商品修改成功',
          });
          props.updateList();
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }
    addGoods(values)
      .then(() => {
        onClose();
        goodsForm.resetFields();
        notification.success({
          message: '商品添加成功',
        });
        props.updateList();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onCloseModal = () => {
    goodsForm.resetFields();
    onClose();
    setFileListImg([]);
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCloseModal}
      width={'70%'}
      title="商品管理"
      className="goods-drawer rightDraw"
      maskClosable={false}
      destroyOnClose={true}
    >
      <Form form={goodsForm} onFinish={onFinish} autoComplete={'off'} scrollToFirstError={true}>
        <Form.Item
          name="name"
          label="商品名称"
          rules={[{ required: true, message: '请输入商品名称' }]}
        >
          <Input placeholder="请输入商品名称" className="goods-name-input" />
        </Form.Item>

        <Row gutter={4}>
          <Col span={12}>
            <Form.Item
              name="category_id"
              label="请选择分类"
              rules={[{ required: true, message: '请选择分类' }]}
            >
              <Select
                placeholder="请选择分类"
                showSearch
                onChange={changeType}
                suffixIcon={<i className="iconfont sousuo" />}
              >
                {classifyListData?.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={10} className="statusCon">
            <Form.Item
              name="state"
              className="flex-center"
              label="状态"
              rules={[{ required: true }]}
              initialValue={1}
            >
              <Radio.Group>
                <Radio value={1}>上架</Radio>s<Radio value={0}>下架</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12} className="statusCon">
            <Form.Item
              name="price"
              label="价格"
              className="flex-center"
              rules={[{ required: true }]}
            >
              <InputNumber size="large" placeholder="请输入价格" className="max-input" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12} className="statusCon">
            <Form.Item
              name="single_buy"
              className="flex-center"
              label="单次限购"
              rules={[{ required: true }]}
              initialValue={0}
            >
              <Radio.Group>
                <Radio value={1}>允许</Radio>
                <Radio value={0}>不限购</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          {currentClassify.type === 1 ? (
            <Form.Item
              name="stock"
              className="flex-center"
              label="库存"
              rules={[{ required: false }]}
              initialValue={0}
            >
              <InputNumber size="large" placeholder="请输入库存" />
            </Form.Item>
          ) : null}
        </Row>

        <Form.Item name="img" label="商品图片">
          <Upload
            listType="picture-card"
            fileList={fileListImg}
            beforeUpload={beforeUploadImg}
            customRequest={handleCustomRequest}
            accept=".png, .jpg, .jpeg, .bmp"
            onRemove={handleRemoveImg}
            multiple={true}
          >
            {fileListImg.length >= 10 ? (
              ''
            ) : (
              <div className="form-item-upload">
                <i className="jiahao iconfont font-20" />
                <div>上传图片</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <div className="upload-img-text">提示：最多可上传10张，建议尺寸：600*600px</div>
        <Row>
          <Col span={12}>
            <Form.Item
              name="repair"
              className="flex-center"
              label="重复购买"
              rules={[{ required: true }]}
              initialValue={0}
            >
              <Radio.Group>
                <Radio value={0}>允许</Radio>
                <Radio value={1}>禁止</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span="12">
            <Form.Item
              name="sort"
              className="flex-center"
              label="排序"
              rules={[{ required: false }]}
              initialValue={1}
            >
              <InputNumber size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              name="content"
              label="商品详情"
              rules={[{ required: true, message: '请输入商品详情' }]}
            >
              <div style={{ border: '1px solid #00000014' }}>
                <BraftEditor value={editorState} onChange={handleContent} />
              </div>
            </Form.Item>
          </Col>
        </Row>
        {currentClassify.type === 1 ? (
          <Form.Item
            name="link"
            className="flex-center"
            label="下载连接"
            rules={[{ required: true }]}
          >
            <Input placeholder="请输入下载连接" />
          </Form.Item>
        ) : null}
        <Form.Item
          name="tips"
          className="flex-center"
          label="注意事项"
          rules={[{ required: false }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="description"
          className="flex-center"
          label="简介"
          rules={[{ required: false }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <div className="footer-btn">
          <Button className="cancel-btn" onClick={onCloseModal}>
            取消
          </Button>
          <Button className="save-btn" type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddEditGoods;
