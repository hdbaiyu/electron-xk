import React, { useState, useEffect } from 'react';
import { Button, List, Space, Tag, Modal, Radio, notification, Input, Image } from 'antd';
import './Manage.less';
import { delGoods, goods_category, goods_list } from '@/api/goods';
import GoodsUpdate from './addGoods/AddEditGoods';

const GoodsManage = () => {
  const [goodsList, setList] = useState([]); //列表
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0); //总条数
  const [loading, setLoading] = useState(false); //加载状态
  const [visible, setVisible] = useState(false); //编辑添加

  const [selectedCategoryId, setSelectedCategoryID] = useState(0); //当前选中分类ID
  const [status, setStatus] = useState(0); //当前选中状态
  const [name, setName] = useState(''); //当前输入商品名称

  const [category, setCategory] = useState([]);
  const [currentGoods, setCurrentGoods] = useState({});

  /**
   * 分页
   */
  const pagination = {
    showSizeChanger: true,
    showTotal: (t) => {
      return `共 ${t} 条`;
    },
    total: total,
    onChange: (p, size) => {
      setPage(p);
      setPageSize(size);
    },
  };

  /**
   * 获取分类
   */
  const getCategory = () => {
    goods_category().then((res) => {
      setCategory(res);
    });
  };

  useEffect(() => {
    getCategory();
  }, []);
  /**
   * 加载数据
   */
  const loadData = () => {
    const query = {
      page: page,
      page_size: pageSize,
      name: name,
      category_id: selectedCategoryId,
      status: status,
    };
    setLoading(true);
    goods_list(query)
      .then((data) => {
        setList(data.list || []);
        setPage(data.page || 1);
        setTotal(data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [page, status, selectedCategoryId, name, pageSize]);

  const addModal = () => {
    setCurrentGoods({});
    setVisible(true);
  };
  const openModal = (list) => {
    setCurrentGoods(list);
    setVisible(true);
  };

  /**
   * 删除商品
   * @param id
   */
  const deleteGoods = (id) => {
    Modal.confirm({
      title: '删除商品',
      content: '确认要删除此商品？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        delGoods(id).then(() => {
          loadData();
          notification.success({
            message: '删除成功',
          });
        });
      },
    });
  };

  return (
    <div className="goodsManage" id="goodsManage">
      <div className="add">
        <Button type="primary" onClick={() => addModal()}>
          添加
        </Button>
      </div>
      {/*<ul className="filter-list flex-between">*/}
      <ul className="filter-list">
        <li>
          <span className="top-key">状态</span>
          <Radio.Group
            onChange={(e) => {
              setStatus(e.target.value);
            }}
            defaultValue={0}
            buttonStyle="solid"
          >
            <Radio.Button value={0}>全部</Radio.Button>
            <Radio.Button value={1}>上架</Radio.Button>
            <Radio.Button value={2}>下架</Radio.Button>
          </Radio.Group>
        </li>

        <li>
          <span className="top-key">分类</span>
          <Radio.Group
            onChange={(e) => {
              setSelectedCategoryID(e.target.value);
            }}
            defaultValue={0}
            buttonStyle="solid"
          >
            <Radio.Button value={0}>全部</Radio.Button>
            {category.map((item, index) => (
              <Radio.Button key={index.toString()} value={item.id}>
                {item.name}
              </Radio.Button>
            ))}
          </Radio.Group>
        </li>
        <li>
          <span className="top-key">名称</span>
          <Input
            allowClear
            onChange={(e) => {
              setName(e.target.value);
            }}
            style={{ width: '300px' }}
          />
        </li>
      </ul>

      <List
        loading={loading}
        pagination={pagination}
        itemLayout="horizontal"
        dataSource={goodsList}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <Button
                key="update"
                type="primary"
                onClick={() => {
                  openModal(item);
                }}
              >
                修改
              </Button>,
              <Button
                type="primary"
                key="delete"
                onClick={() => {
                  deleteGoods(item.id);
                }}
              >
                删除
              </Button>,
            ]}
          >
            <List.Item.Meta
              style={{ padding: '10px' }}
              avatar={<Image width={100} src={item.preview[0]} />}
              title={item.name}
              description={
                <Space wrap>
                  <span>发布时间：{item.created_at}</span>
                  <span>
                    状态：
                    {item.status === 1 ? (
                      <Tag color={'#f50'}>下架</Tag>
                    ) : (
                      <Tag color={'#2db7f5'}>上架</Tag>
                    )}
                  </span>
                  <span>销量：{item.sales}</span>
                </Space>
              }
            />
          </List.Item>
        )}
      />

      <GoodsUpdate
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        updateList={loadData}
        goods={currentGoods}
      />
    </div>
  );
};

export default GoodsManage;
