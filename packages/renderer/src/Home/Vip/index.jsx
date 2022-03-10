import React, {useState, useEffect, useContext} from 'react';
import {Button, Modal, message} from 'antd';
import QRCode from 'qrcode.react';
import './index.less';
import {getVip, sendPay} from '@/api/vip';
import {userInfo} from '@/api/login';
import ContentState from '../../ContentState';

const VipPage = () => {
  const [selectVipId, setSelectVipId] = useState(1);
  const [qrValue, setQrValue] = useState('');
  const [vipList, setVipList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payType, setPayType] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const config = useContext(ContentState);
  const {user} = config;

  config.Client.on('alipay', (e) => {
    if (modalVisible) {
      message.success('支付成功');
      setModalVisible(false);
    }
  });

  /**
   * 加载用户信息
   * @returns {Promise<void>}
   */
  const loadUser = async () => {
    setLoading(true);
    config.user = await userInfo();
    setLoading(false);
  };
  /**
   * 获取vip列表
   */
  const getVipList = () => {
    getVip().then(async (vip) => {
      setVipList(vip);
    });
  };

  useEffect(() => {
    getVipList();
  }, []);

  /**
   * 支付
   */
  const handlePay = () => {
    if (!selectVipId) {
      message.error('请选择需要购买的vip天数');
      return;
    }
    if (!payType) {
      message.error('请选择支付方式');
      return;
    }
    // 1=微信 2=支付宝 3=余额
    sendPay({vip_id: selectVipId, pay_type: payType}).then((res) => {
      if (!res.is_jump) {
        loadUser();
        message.success('支付成功');
        return;
      }
      setModalVisible(true);
      setQrValue(res.pay_url);
    });
  };

  // const renderCodeType = () => {
  //   if (btnType === 'wechat' || btnType === 'alipay') {
  //     return (
  //       <>
  //         <div className={`justifyCenter`}>
  //           <span
  //             className={`iconfont ${
  //               btnType === 'wechat' ? `WeChaticon2x wechatPay` : `Alipayicon2x alipayPay`
  //             }`}
  //           />
  //           &nbsp;&nbsp;{PayLink[btnType]}扫码支付
  //         </div>
  //         <div className={'qrCode'}>
  //           <QRCode value={qrValue} className={'qucodeSize'} />
  //           {isExpiry && (
  //             <div className={'expiry'} onClick={() => handlePayType(btnType)}>
  //               二维码已失败， 点击刷新
  //             </div>
  //           )}
  //         </div>
  //         <div className="font-18">打开在{PayLink[btnType]}扫一扫继续付款</div>
  //       </>
  //     );
  //   }
  //   return null;
  // };

  return (
    <div className="vip-page">
      <div className="vip-title">
        1、选择会员时长
        <span className="vip-time">
          {config.user.is_vip ? `【 到时时间：${config.user.vip_end_time} 】` : ''}
        </span>
      </div>

      <div className="vip-item">
        {vipList.map((item) => (
          <div
            className={`price-item flex-center ${selectVipId === item.id ? 'active' : ''}`}
            onClick={() => setSelectVipId(item.id)}
            key={item.id}
          >
            <div className="wrapperCol">
              <span className="price">{'¥' + item.price}</span>
              <span>元/{item.days / 30}月</span>
            </div>
            <i className={`iconfont gou ${selectVipId === item.id ? 'selectedIcon' : 'hideIcon'}`}/>
          </div>

        ))}
      </div>

      <div className="vip-title">2、选择付款支付方式（当前余额：￥{user.balance}元）</div>

      <div className="pay">
        {/*<div*/}
        {/*  className={`pay-item flex-center ${payType === 1 ? 'active' : ''}`}*/}
        {/*  onClick={() => setPayType(1)}*/}
        {/*  key={1}*/}
        {/*>*/}
        {/*  <span className={`iconfont WeChaticon2x wechatPay`} />*/}
        {/*  <span className={'pay-type'}>微信</span>*/}
        {/*</div>*/}
        <div
          className={`pay-item flex-center ${payType === 2 ? 'active' : ''}`}
          onClick={() => setPayType(2)}
          key={2}
        >
          <div className="wrap-type">
            <span className={`iconfont Alipayicon2x alipayPay`}/>
            <span className={'pay-type'}>支付宝</span>
          </div>
          <i className={`iconfont gou ${payType === 2 ? 'paySelect' : 'hideIcon'}`}/>
        </div>
        <div
          className={`pay-item flex-center ${payType === 3 ? 'active' : ''}`}
          onClick={() => setPayType(3)}
          key={3}
        >
          <div className="wrap-type">
            <span className={`iconfont Balancepaymenticon2x balancePay`}/>
            <span className={'pay-type'}>余额支付</span>
          </div>
          <i className={`iconfont gou ${payType === 3 ? 'paySelect' : 'hideIcon'}`}/>
        </div>
        <div>
          <Button
            shape="default"
            type="primary"
            size="large"
            className={['onPay', 'listRadio', 'pay-btn'].join(' ')}
            onClick={handlePay}
            loading={loading}
          >
            立即支付
          </Button>
        </div>
      </div>

      <Modal
        title="二维码"
        onCancel={() => {
          setModalVisible(false);
        }}
        onOk={() => {
          setModalVisible(false);
        }}
        visible={modalVisible}
        okText={'已支付'}
      >
        <div className={'justifyCenter'}>
          <h1>
            {payType === 2 ? (
              <div className={'payText'}>
                <span className={`iconfont Alipayicon2x alipayPay`}/>
                请打开支付宝扫一扫支付
              </div>
            ) : (
              <div className={'payText'}>
                <span className={`iconfont WeChaticon2x wechatPay`}/>
                请打开微信扫一扫支付
              </div>
            )}
          </h1>
        </div>

        <div className={'justifyCenter'}>
          <QRCode className={['qrcodeSize', 'qrcode'].join(' ')} value={qrValue}/>
        </div>
      </Modal>
    </div>
  );
};

export default VipPage;
