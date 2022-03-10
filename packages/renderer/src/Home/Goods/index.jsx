import React, { useState } from 'react';
import { Modal, message, Tabs, Tag } from 'antd';
import './index.less';
import CategoryItem from '../Category/CategoryItem';
import GoodsManage from './GoodsManage';
import Cards from '../Card';
import Download from '../Download';
const { TabPane } = Tabs;

const Goods = () => {
  const [selectedTags, setSelectTags] = useState('');
  const { CheckableTag } = Tag;

  const actionGategory = (info, key) => {

    Modal.confirm({
      title: '提示',
      content: `确认要删除${info}分类？`,
      okText: '删除',
      cancelText: '取消',
      okButtonProps: { shape: 'round' },
      cancelButtonProps: { shape: 'round' },
      onOk: () => {
        message.success('删除成功');
      },
    });
  };

  const tagsData = [
    { name: '名称', key: 'name' },
    { name: '导入时间', key: 'importTime' },
    { name: '销售时间', key: 'time' },
    { name: '销售状态', key: 'status' },
    { name: '批量操作', key: 'more' },
  ];

  const callback = () => {};
  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    console.log('You are interested in: ', nextSelectedTags);
    setSelectTags(nextSelectedTags);
  };
  return (
    <div className="Goods layout">
      {/*<Table showHeader={false} columns={columns} dataSource={data} />*/}
      {/*<div className="top-info flex-center">*/}
      {/*  <span className="info-key">分类: </span>*/}
      {/*  <div className="category">*/}
      {/*    {tagsData.map((tag) => (*/}
      {/*      <CheckableTag*/}
      {/*        key={tag.key}*/}
      {/*        checked={selectedTags.indexOf(tag.key) > -1}*/}
      {/*        onChange={(checked) => handleChange(tag.key, checked)}*/}
      {/*      >*/}
      {/*        {tag.name}*/}
      {/*      </CheckableTag>*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*</div>*/}
      <Tabs defaultActiveKey="2" onChange={callback}>
        {/* <TabPane tab="商品分类" key="1">
          <CategoryItem />
        </TabPane> */}
        <TabPane tab="商品管理" key="2">
          <GoodsManage />
        </TabPane>
        <TabPane tab="卡密管理" key="3">
          <Cards />
        </TabPane>
        {/*<TabPane tab="下载链接管理" key="4">*/}
        {/*  <Download />*/}
        {/*</TabPane>*/}
      </Tabs>
    </div>
  );
};

export default Goods;
