import React,{useState} from 'react';
import { Steps } from 'antd';
import Header from '../Components/Header';
import Form from './Form';
import Type from './Type';
import './index.less';
const { Step } = Steps;

function Certification() {
    const [current, setCurrent] = useState(0);
    const [type, setType] = useState(0);
    const steps = [
        {
          key: '1',
          title: '选择主体类型',
          content: <Type setCurrent={setCurrent} current={current} setType={setType}  />,
        },
        {
            key: '2',
            title: '填写认证信息',
            content: <Form setCurrent={setCurrent} current={current} type={type} />,
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

export default Certification;
