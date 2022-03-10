import React, { useEffect } from 'react';
import { Steps } from 'antd';
import Header from '../Components/Header';
import FirstStep from './FirstStep';
import FillAccount from './FillAccount';
import './index.less';
const { Step } = Steps;

function Register() {
  const [current, setCurrent] = React.useState(0);

  const steps = [
    {
      key: '1',
      content: <FirstStep setCurrent={setCurrent} current={current} />,
      title: '注册账号',
    },
    // {
    //   key: '2',
    //   title: '选择主体类型',
    //   content: <RegisterMain setCurrent={setCurrent} current={current} />,
    // },
    {
      key: '3',
      title: '填写账号信息',
      content: <FillAccount setCurrent={setCurrent} current={current} />,
    },
  ];

  return (
    <div className="register">
      <Header />
      <div className="padding-top">
        <Steps size="small" current={current}>
          {steps.map((item) => (
            <Step key={item.key} title={item.title} />
          ))}
        </Steps>
        <div className="steps-action">{steps[current].content}</div>
      </div>
    </div>
  );
}

export default Register;
