import React, { useState, useEffect, useContext } from 'react';
import {
  Table,
  Button,
  Tag,
  Popover,
  Modal,
  notification,
  Select,
  Form,
  Input,
  Upload,
  Radio,
  Alert,
  Space,
  message,
} from 'antd';
import './index.less';
import ContentState from '../../ContentState';
import { cardList, delCard, addCard, classifyList } from '../../api/goods';
import { getQiniuToken } from '@/api/upload';
import * as qiniu from 'qiniu-js';
import Order from './components/Order';

const { Option } = Select;
let hasQiniuToken = false;

const Card = () => {
  const [cardData, setCardList] = useState([]);
  const [cardTotal, setCardTotal] = useState(0);
  const [cardPage, setCardPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [visibleCard, setVisible] = useState(false);
  const [fileListImg, setFileListImg] = useState([]);
  const [goodsList, setGoods] = useState([]);
  const [refreshPage, setRefreshPage] = useState(false);
  const [status, setStatus] = useState('');
  const [goodsID, setGoodsID] = useState(0);
  const [content, setContent] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [orderVisible, setOrderVisible] = useState(false);
  const [cardId, setCardId] = useState(0);
  const [cardContent, setCardContent] = useState('');

  const [form] = Form.useForm();
  const config = useContext(ContentState);

  const loadCard = () => {
    const params = {
      content: content,
      status: status,
      page: cardPage,
      page_size: pageSize,
      goods_id: goodsID,
    };
    setLoading(true);
    cardList(params)
      .then((res) => {
        setCardList(res.list);
        setCardPage(res.page);
        setCardTotal(res.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    loadCard();
  }, [cardPage, goodsID, pageSize, status, content]);

  const openAddModal = () => {
    setVisible(true);
    classifyList({ type: 0 }).then((res) => {
      setGoods(res);
    });
  };

  /**
   * 选择
   */
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => {
      setSelectedRowKeys(keys);
    },
  };

  const onFinish = (values) => {
    console.log(values);
    if (!values.file && !values.content) {
      message.error('文件和内容二选一');
      return;
    }
    if (values.file) {
      values.file = `${fileListImg[0].url}`;
    }

    if (values.content) {
      values.content = values.content.split('\n');
    }

    setLoading(true);
    addCard(values)
      .then(() => {
        loadCard();
        setVisible(false);
        message.success('添加成功');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  /**
   * 删除
   * @param id
   */
  const deleteCard = (id) => {
    Modal.confirm({
      title: '删除卡密',
      content: '确认要删除此卡密？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        delCard([id]).then(() => {
          loadCard();
          message.success('删除成功');
        });
      },
    });
  };

  /**
   * 分页
   */
  const pagination = {
    showSizeChanger: true,
    showTotal: (t) => {
      return `共 ${t} 条`;
    },
    total: cardTotal,
    onChange: (p, size) => {
      setCardPage(p);
      setPageSize(size);
    },
  };
  /**
   * 多个删除
   */
  const deleteCards = () => {
    Modal.confirm({
      title: '删除卡密',
      content: '确认要删除此卡密？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        delCard(selectedRowKeys).then(() => {
          loadCard();
          setSelectedRowKeys([]);
          message.success('删除成功');
        });
      },
    });
  };
  const columns = [
    {
      title: '绑定商品',
      dataIndex: 'goods',
      key: 'goods',
      render: (d) => <a>{d.name}</a>,
    },
    {
      title: '卡密内容',
      key: 'content',
      dataIndex: 'content',
      render: (content) => {
        return (
          <Popover content={content} title="卡密内容" trigger="click">
            <Button type={'link'}>点击查看</Button>
          </Popover>
        );
      },
    },
    {
      title: '卡密状态',
      key: 'status',
      dataIndex: 'status',
      render: (text) => {
        if (text === 1) {
          return <Tag color={'#f50'}>已销售</Tag>;
        }
        return <Tag color={'#2db7f5'}>未销售</Tag>;
      },
    },
    {
      title: '创建时间',
      key: 'created_at',
      dataIndex: 'created_at',
    },
    {
      title: '操作（数据无价，谨慎操作）',
      key: 'action',
      dataIndex: 'action',
      render: (key, item) => {
        let buttons = [
          <Button key="del" size="small" danger onClick={() => deleteCard(item.id)}>
            删除
          </Button>,
        ];
        if (item.status === 1) {
          buttons = buttons.concat([
            <Button
              key="show"
              size="small"
              onClick={() => {
                setCardId(item.id);
                setOrderVisible(true);
                setCardContent(item.content);
              }}
            >
              查看
            </Button>,
          ]);
        }
        return <Space>{buttons}</Space>;
      },
    },
  ];

  const loadQiniuToken = async () => {
    hasQiniuToken = await getQiniuToken();
    return hasQiniuToken;
  };
  // 上传文件前的校验
  const beforeUploadImg = (file) => {
    const isImg = file.type.indexOf('text/') !== -1;
    if (!isImg) {
      message.error('只支持txt文件');

      return false;
    }
    const isLt10M = file.size / 1024 / 1024 < 1;
    if (!isLt10M) {
      message.error('文件大小不能超过1M');
    }
    return isImg && isLt10M;
  };
  const observer = {
    error: (err) => {
      message.error(err.message);
    },
    complete: (res) => {
      const textFile = [{ url: config.assets + res.key, status: 'done', name: res.key }];
      setFileListImg(textFile);
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
      `txt-${Date.now()}.${file.name.split('.')[1]}`,
      data.token,
    );
    observable.subscribe(observer); // 上传开始
  };

  const renderForm = () => {
    return (
      <Form
        form={form}
        size="large"
        onFinish={onFinish}
        initialValues={{ is_filter: true }}
        validateTrigger="onBlur"
      >
        <Form.Item
          name="goods_id"
          label="关联商品"
          rules={[{ required: true, message: '请选择商品' }]}
        >
          <Select
            placeholder="请选择商品"
            showSearch
            suffixIcon={<i className="iconfont sousuo" />}
          >
            {goodsList?.map((item) => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item name="content" label="卡密内容">
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 10 }}
            placeholder="请输入卡密内容，一行一个，按换行符拆分"
          />
        </Form.Item>
        <Form.Item name="file" label="文件导入">
          <Upload
            listType="picture-card"
            fileList={fileListImg}
            beforeUpload={beforeUploadImg}
            customRequest={handleCustomRequest}
            accept=".txt"
            multiple={true}
          >
            {fileListImg.length >= 1 ? (
              ''
            ) : (
              <div className="form-item-upload">
                <i className="jiahao iconfont font-20" />
                <div>上传文件</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          name="is_filter"
          label="过滤重复"
          className="flex-center"
          rules={[{ required: true, message: '请选择过滤重复, 防止重复售卖，建议过滤' }]}
        >
          <Radio.Group onChange={() => setRefreshPage(!refreshPage)}>
            <Radio value={true}>过滤</Radio>
            <Radio value={false}>不过滤</Radio>
          </Radio.Group>
        </Form.Item>
        {!form.getFieldValue('is_filter') ? (
          <Form.Item label={'提示'}>
            <Alert message="建议过滤，防止重复售卖" type="warning" />
          </Form.Item>
        ) : null}

        <div className={'text-center footer-btn'}>
          <Button className="cancel-btn" onClick={() => setVisible(false)}>
            取消
          </Button>
          <Button className="save-btn" type={'primary'} htmlType="submit" loading={loading}>
            提交
          </Button>
        </div>
      </Form>
    );
  };

  return (
    <div className="category">
      <div className="add">
        <Space>
          <Button type="primary" onClick={openAddModal}>
            添加
          </Button>
          <Button type="primary" disabled={selectedRowKeys.length <= 0} onClick={deleteCards}>
            删除
          </Button>
        </Space>

        <ul className="filter-list">
          <li>
            <span className="top-key">状态</span>
            <Radio.Group
              onChange={(e) => {
                setStatus(e.target.value);
              }}
              defaultValue=""
              buttonStyle="solid"
            >
              <Radio.Button value="">全部</Radio.Button>
              <Radio.Button value={0}>未销售</Radio.Button>
              <Radio.Button value={1}>已销售</Radio.Button>
            </Radio.Group>
          </li>

          <li>
            <span className="top-key">商品</span>
            <Radio.Group
              onChange={(e) => {
                setGoodsID(e.target.value);
              }}
              defaultValue={0}
              buttonStyle="solid"
            >
              <Radio.Button value={0}>全部</Radio.Button>
              {goodsList.map((item, index) => (
                <Radio.Button key={index.toString()} value={item.id}>
                  {item.name}
                </Radio.Button>
              ))}
            </Radio.Group>
          </li>
          <li>
            <span className="top-key">内容</span>
            <Input
              allowClear
              onChange={(e) => {
                setContent(e.target.value);
              }}
              style={{ width: '300px' }}
            />
          </li>
        </ul>
      </div>
      <Table
        rowKey={(record) => record.id}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={cardData}
        size={'small'}
        loading={loading}
        pagination={pagination}
      />
      <Modal
        visible={visibleCard}
        width={600}
        title="添加卡密"
        onCancel={() => setVisible(false)}
        className="goods-drawer rightDraw"
        maskClosable={false}
        destroyOnClose={true}
      >
        {renderForm()}
      </Modal>

      {/*订单详情*/}
      <Order
        visible={orderVisible}
        content={cardContent}
        onClose={() => setOrderVisible(false)}
        cardId={cardId}
      />
    </div>
  );
};
export default Card;
