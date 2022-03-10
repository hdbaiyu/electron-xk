import { Table, Radio } from 'antd';
import React, { useState, useEffect } from 'react';
import { loginLog } from '@/api/login';

export default function LoginLog() {
  const [loadType, setLoadType] = useState('record');
  const [logData, setDataLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loginPage, setLoginPage] = useState(1);
  const [logTotal, setLogTotal] = useState(1);

  const changeType = (e) => {
    setLoadType(e.target.value);
  };

  const loadLog = () => {
    setLoading(true);
    loginLog({ page: loginPage, page_size: 10 })
      .then((log) => {
        setDataLog(log.list);
        setLogTotal(log.total);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadLog();
  }, [loginPage]);

  const loginType = {
    0: '帐户',
    1: '微信',
    2: 'QQ',
  };

  const forMetPlatform = (type)=> {
    if (type.indexOf('Android') > -1) {
      return 'Android'
    }
    if (type.indexOf('Macintosh') > -1) {
      return 'macOS'
    }
    if (type.indexOf('iPhone') > -1) {
      return 'iPhone'
    }
    return 'windows'
  }

  const columns = [
    {
      title: '登录时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'IP地址',
      key: 'tags',
      dataIndex: 'ip',
    },
    {
      title: '设备',
      key: 'device',
      dataIndex: 'device',
      render: (text) => {
        return text === 1 ? '手机' : 'PC';
      },
    },
    {
      title: '平台',
      key: 'user_agent',
      dataIndex: 'user_agent',
      render: (text) => forMetPlatform(text)
    },
    {
      title: '登录方式',
      key: 'way',
      dataIndex: 'way',
      render: (type) => {
        return loginType[type];
      },
    },
  ];

  return (
    <div className="security-center">
      {/*<Radio.Group value={loadType} onChange={changeType}>*/}
      {/*  <Radio.Button value="record">登录记录</Radio.Button>*/}
      {/*  /!* <Radio.Button value="sensitivity">敏感操作</Radio.Button> *!/*/}
      {/*</Radio.Group>*/}
      <Table
        columns={columns}
        rowKey="created_at"
        dataSource={logData}
        loading={loading}
        pagination={{ onChange: setLoginPage, total: logTotal }}
      />
    </div>
  );
}
