import request from './request';
import type { CreateBackParams, BindAlipayParams, CollectionQuery } from './account.d';

// 绑定银行
export const bindBank = (data: CreateBackParams) => {
  return request.post('/bank', { data });
};
// 绑定微信
export const bindWechat = (data: Record<string, any>) => {
  return request.post('/bind_wechat', data);
};
// 绑定qq
export const bindQQ = (data: Record<string, any>) => {
  return request.post('/bind_qq', data);
};

// 绑定支付宝
export const bindAlipay = (data: BindAlipayParams) => {
  return request.post('/alipay', { data });
};

// 收款记录
export const collection = (params: CollectionQuery) => {
  return request.get('/collection', { params });
};
// 收款码
export const getQrcode = () => {
  return request.get('/collection_qrcode');
};
// 修改资料
export const updateInfo = (data: any) => {
  return request.post('/update_info', data);
};

// 发送原手机号验证码
export const sendOldPhone = (phone: string) => {
  return request.post('/send_old_phone', { old_phone: phone });
};
// 发送绑定手机号验证码
export const sendBindPhone = (phone: string) => {
  return request.post('/send_bind_phone', { phone });
};
// 修改手机号
export const updatePhone = (data: Record<string, any>) => {
  return request.post('/update_phone', data);
};
