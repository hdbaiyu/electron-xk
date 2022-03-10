import React from 'react';
// import { Modal } from 'antd';

const FirstStep = (props) => {
  const selectType = (type) => {
    window.sessionStorage.register = JSON.stringify({type})
    if (type === 'contact' || type === 'email') {
      props.setCurrent(1)
    }
  };
  return (
    <div className="registerFirst">
      <div className="flex-between registerTypeWrapper">
        <div className="registerType-item registerTypePhone" onClick={() => selectType('contact')} />
        <div className="registerType-item registerTypeEmail" onClick={() => selectType('email')} />
        <div className="registerType-item registerTypeQQ" onClick={() => selectType('qq')} />
        <div
          className="registerType-item registerTypeWechat"
          onClick={() => selectType('wechat')}
        />
      </div>
      <div className="text-center mt40">请选择注册方式</div>

    </div>
  );
};
export default FirstStep;
