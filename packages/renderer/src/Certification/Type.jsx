import React from 'react';
import { Button } from 'antd';

/**
 * 选择主体类型
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Type = (props) => {
  const { setCurrent, current, setType } = props;
  const config = [
    {
      icon: 'gerenguanli',
      name: '个人',
      description: '适合人个造作者',
      info: [{ name: '申请人身份证' }],
      type: 0,
    },
    {
      icon: 'qimeiti',
      name: '媒体',
      description:
        '适合通讯社、报刊杂志、电视台、电台等传统媒体及有新闻资质的网站，如人民日报、地方广播电视台等',
      info: [
        { name: '统一社会信用代码/营业照' },
        { name: '管理者身份证' },
        { name: '账号运营授权书', url: 'www.baidu.com' },
      ],
      type: 1,
    },
    {
      icon: 'qiye',
      name: '企业',
      description: '适合企业、企业分支机构、企业相关品牌、MCN等',
      info: [
        { name: '企业营业执照' },
        { name: '管理者身份证' },
        { name: '账号运营授权书', url: 'www.baidu.com' },
      ],
      type: 2,
    },
    {
      icon: 'zuzhijigou1',
      name: '其他组织',
      description: '不属于媒体、企业和其他媒体，如大学，公立医院、协会等',
      info: [
        { name: '统一社会信用代码证/事业单位法人证书' },
        { name: '管理者身份证' },
        { name: '账号运营授权书', url: 'www.baidu.com' },
      ],
      type: 3,
    },
  ];
  /**
   * 下一步
   * @param type
   */
  const nextStep = (type) => {
    setType(type);
    setCurrent(current + 1);
  };
  return (
    <div className="mainBody">
      <div className="container text-center">
        <div className="select-title">选择主体类型</div>
        <div className="notice-default">账号一旦成功，主体类型不可更改</div>
      </div>
      <div className="main-box container">
        {config.map((item, index) => (
          <div className="subject-item" key={index.toString() + '-main'}>
            <div className="icon">
              <i className={`iconfont ${item.icon}`} />
            </div>
            <div className="name">{item.name}</div>
            <div className="description">{item.description}</div>
            <div className="info-line">注册所属资料</div>
            <ul className="info">
              {item.info.map((i, key) => (
                <li key={index.toString() + key + '-info'}>
                  {i.name}{' '}
                  {i.url ? (
                    <a href={i.url} target="_blank">
                      下载
                    </a>
                  ) : (
                    ''
                  )}
                </li>
              ))}
            </ul>
            <div className="text-center">
              <Button
                type="primary"
                shape={'round'}
                size="large"
                onClick={() => nextStep(item.type)}
              >
                选择
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Type;
