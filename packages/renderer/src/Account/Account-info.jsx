import { Image, Button, message } from 'antd';
import { useEffect, useState, useContext } from 'react';
import { userInfo } from '@/api/login';
import ContentState from '../ContentState';

import Update from './components/Update';
import UpdatePhone from './components/UpdatePhone';
import { useHistory } from 'react-router-dom';

export default function AccountInfo() {
  const [user, setUser] = useState({});
  const [visible, setVisible] = useState(false);
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [content, setContent] = useState('');
  const [type, setType] = useState(1);
  const config = useContext(ContentState);
  const History = useHistory();

  const loadUser = () => {
    userInfo().then((u) => {
      setUser(u);
    });
  };
  useEffect(() => {
    if (config.user) {
      setUser(config.user);
      return
    }
    loadUser();
  }, []);

  const mainBodyType = {
    0: '个人',
    1: '媒体',
    2: '企业',
    3: '组织',
  };

  /**
   * 复制
   */
  const copy = () => {
    const createInput = document.createElement('input');
    createInput.value = 'https://www.5xk.cn/' + user.domain;
    document.body.appendChild(createInput);
    createInput.select();
    document.execCommand('Copy'); // document执行复制操作
    createInput.remove();
    message.success('复制成功!');
  };
  return (
    <div className="account-info">
      <div className="info-list flex-between">
        <div className="info-key">账号名称</div>
        <div className="info-content flex-between">
          <span>{user.name}</span>
          <Button
            type="link"
            onClick={() => {
              setVisible(true);
              setType(1);
              setContent(user.name);
            }}
          >
            编辑
          </Button>
        </div>
      </div>

      <div className="info-list flex-between">
        <div className="info-key">VIP状态</div>
        {user.is_vip ? (
          <div className="info-content flex-between">
            {/*<span>到期时间：{moment(user.vip_end_time).format('YYYY-MM-DD HH:mm')}:00</span>*/}
            <span>到期时间：{user.vip_end_time} </span>
            <Button type="link" onClick={() => History.push(`${config.homePath}/vip-member`)}>
              续期
            </Button>
          </div>
        ) : (
          <div className="info-content flex-between">
            <span>
              你还不是VIP，立即
              <Button type="link" onClick={() => History.push(`${config.homePath}/vip-member`)}>
                购买
              </Button>
              ，解锁更多权限
            </span>
            <Button type="link" onClick={() => History.push(`${config.homePath}/vip-member`)}>
              购买
            </Button>
          </div>
        )}
      </div>

      <div className="info-list flex-between">
        <div className="info-key">账号简介</div>
        <div className="info-content flex-between">
          <span>{user.description}</span>
          <Button
            type="link"
            onClick={() => {
              setVisible(true);
              setType(2);
              setContent(user.description);
            }}
          >
            编辑
          </Button>
        </div>
      </div>

      <div className="info-list flex-between">
        <div className="info-key">账号头像</div>
        <div className="info-content flex-between">
          <Image src={user.avatar} className="avatar" />
          <Button
            type="link"
            onClick={() => {
              setVisible(true);
              setType(3);
              setContent(user.avatar);
            }}
          >
            编辑
          </Button>
        </div>
      </div>
      <div className="info-list flex-between">
        <div className="info-key">主体类型</div>
        <div className="info-content flex-between">
          <span>{mainBodyType[user.main_body_type]}</span>
          {/*<Button type="link">编辑</Button>*/}
        </div>
      </div>

      <div className="info-list flex-between">
        <div className="info-key">店铺链接</div>
        <div className="info-content flex-between">
          <span>{user.domain}</span>
          <div>
            <Button type="link" onClick={copy}>
              复制
            </Button>
            <Button
              type="link"
              onClick={() => {
                setVisible(true);
                setType(4);
                setContent(user.domain);
              }}
            >
              编辑
            </Button>
          </div>
        </div>
      </div>

      {/*<div className="info-list flex-between">*/}
      {/*  <div className="info-key">主体信息</div>*/}
      {/*  <ul className="info-main-content flex1">*/}
      {/*    <li className="flex-between">*/}
      {/*      <div>主体信息</div>*/}
      {/*    </li>*/}
      {/*    <li className="flex-between">*/}
      {/*      <div>身份证号码</div>*/}
      {/*    </li>*/}
      {/*  </ul>*/}
      {/*</div>*/}

      <div className="info-list flex-between">
        <div className="info-key">联系方式</div>
        <div className="info-content flex-between">
          <span>{user.contact}</span>
          <Button
            type="link"
            onClick={() => {
              setPhoneVisible(true);
            }}
          >
            编辑
          </Button>
        </div>
      </div>

      {/*<div className="info-list flex-between">*/}
      {/*  <div className="info-key">联系人</div>*/}
      {/*  <div className="info-content flex-between">*/}
      {/*    <span>{user.phone}</span>*/}
      {/*    <Button type="link" onClick={() => setVisible(true)}>编辑</Button>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*<div className="info-list flex-between">*/}
      {/*  <div className="info-key">联系邮箱</div>*/}
      {/*  <div className="info-content flex-between">*/}
      {/*    <span></span>*/}
      {/*    <Button type="link">编辑</Button>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <Update
        visible={visible}
        onClose={() => setVisible(false)}
        content={content}
        type={type}
        loadData={loadUser}
      />
      <UpdatePhone
        visible={phoneVisible}
        onClose={() => setPhoneVisible(false)}
        loadData={loadUser}
      />
    </div>
  );
}
