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
   * ??????
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
      message.error('????????????????????????');
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
        message.success('????????????');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  /**
   * ??????
   * @param id
   */
  const deleteCard = (id) => {
    Modal.confirm({
      title: '????????????',
      content: '???????????????????????????',
      okText: '??????',
      cancelText: '??????',
      onOk: () => {
        delCard([id]).then(() => {
          loadCard();
          message.success('????????????');
        });
      },
    });
  };

  /**
   * ??????
   */
  const pagination = {
    showSizeChanger: true,
    showTotal: (t) => {
      return `??? ${t} ???`;
    },
    total: cardTotal,
    onChange: (p, size) => {
      setCardPage(p);
      setPageSize(size);
    },
  };
  /**
   * ????????????
   */
  const deleteCards = () => {
    Modal.confirm({
      title: '????????????',
      content: '???????????????????????????',
      okText: '??????',
      cancelText: '??????',
      onOk: () => {
        delCard(selectedRowKeys).then(() => {
          loadCard();
          setSelectedRowKeys([]);
          message.success('????????????');
        });
      },
    });
  };
  const columns = [
    {
      title: '????????????',
      dataIndex: 'goods',
      key: 'goods',
      render: (d) => <a>{d.name}</a>,
    },
    {
      title: '????????????',
      key: 'content',
      dataIndex: 'content',
      render: (content) => {
        return (
          <Popover content={content} title="????????????" trigger="click">
            <Button type={'link'}>????????????</Button>
          </Popover>
        );
      },
    },
    {
      title: '????????????',
      key: 'status',
      dataIndex: 'status',
      render: (text) => {
        if (text === 1) {
          return <Tag color={'#f50'}>?????????</Tag>;
        }
        return <Tag color={'#2db7f5'}>?????????</Tag>;
      },
    },
    {
      title: '????????????',
      key: 'created_at',
      dataIndex: 'created_at',
    },
    {
      title: '???????????????????????????????????????',
      key: 'action',
      dataIndex: 'action',
      render: (key, item) => {
        let buttons = [
          <Button key="del" size="small" danger onClick={() => deleteCard(item.id)}>
            ??????
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
              ??????
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
  // ????????????????????????
  const beforeUploadImg = (file) => {
    const isImg = file.type.indexOf('text/') !== -1;
    if (!isImg) {
      message.error('?????????txt??????');

      return false;
    }
    const isLt10M = file.size / 1024 / 1024 < 1;
    if (!isLt10M) {
      message.error('????????????????????????1M');
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
  // ????????????
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
    observable.subscribe(observer); // ????????????
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
          label="????????????"
          rules={[{ required: true, message: '???????????????' }]}
        >
          <Select
            placeholder="???????????????"
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

        <Form.Item name="content" label="????????????">
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 10 }}
            placeholder="?????????????????????????????????????????????????????????"
          />
        </Form.Item>
        <Form.Item name="file" label="????????????">
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
                <div>????????????</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          name="is_filter"
          label="????????????"
          className="flex-center"
          rules={[{ required: true, message: '?????????????????????, ?????????????????????????????????' }]}
        >
          <Radio.Group onChange={() => setRefreshPage(!refreshPage)}>
            <Radio value={true}>??????</Radio>
            <Radio value={false}>?????????</Radio>
          </Radio.Group>
        </Form.Item>
        {!form.getFieldValue('is_filter') ? (
          <Form.Item label={'??????'}>
            <Alert message="?????????????????????????????????" type="warning" />
          </Form.Item>
        ) : null}

        <div className={'text-center footer-btn'}>
          <Button className="cancel-btn" onClick={() => setVisible(false)}>
            ??????
          </Button>
          <Button className="save-btn" type={'primary'} htmlType="submit" loading={loading}>
            ??????
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
            ??????
          </Button>
          <Button type="primary" disabled={selectedRowKeys.length <= 0} onClick={deleteCards}>
            ??????
          </Button>
        </Space>

        <ul className="filter-list">
          <li>
            <span className="top-key">??????</span>
            <Radio.Group
              onChange={(e) => {
                setStatus(e.target.value);
              }}
              defaultValue=""
              buttonStyle="solid"
            >
              <Radio.Button value="">??????</Radio.Button>
              <Radio.Button value={0}>?????????</Radio.Button>
              <Radio.Button value={1}>?????????</Radio.Button>
            </Radio.Group>
          </li>

          <li>
            <span className="top-key">??????</span>
            <Radio.Group
              onChange={(e) => {
                setGoodsID(e.target.value);
              }}
              defaultValue={0}
              buttonStyle="solid"
            >
              <Radio.Button value={0}>??????</Radio.Button>
              {goodsList.map((item, index) => (
                <Radio.Button key={index.toString()} value={item.id}>
                  {item.name}
                </Radio.Button>
              ))}
            </Radio.Group>
          </li>
          <li>
            <span className="top-key">??????</span>
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
        title="????????????"
        onCancel={() => setVisible(false)}
        className="goods-drawer rightDraw"
        maskClosable={false}
        destroyOnClose={true}
      >
        {renderForm()}
      </Modal>

      {/*????????????*/}
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
