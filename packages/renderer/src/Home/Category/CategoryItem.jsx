import React,{ useEffect, useState } from 'react';
import { Row, Col, Image, Dropdown, Button, Menu, Space } from 'antd';
import './categoryItem.less';
import { goods_category } from '@/api/goods'
import utils from '../../utils/utils';


const CategoryItem = (props) => {
  const [category, setCategory] = useState([])

  useEffect(()=> {
    goods_category().then((res)=> {
      setCategory(res)
      setCategory(res)
    })
  }, [])

  const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item
        </a>
      </Menu.Item>
    </Menu>
  );
  return (
    <div className="categoryItem">
      <Row>
        {Array.isArray(category) && category.map((item) => (
          <Col span={12}>
            <div className="box flex-between">
              <Image src={item.icon} />
              <div className="goods-content">
                <div className="title">{item.name}</div>
                <div className="desc oneLine">

                </div>
                <Space wrap>
                  <div className="type">商品类型：{utils.goodsEnum(item.type)}</div>
                  <div className="action">
                    <Dropdown overlay={menu} placement="bottomLeft">
                      <Button type="primary">更多操作</Button>
                    </Dropdown>
                  </div>
                </Space>
              </div>
            </div>
          </Col>
          )
        )}

      </Row>
    </div>
  );
};

export default CategoryItem;
