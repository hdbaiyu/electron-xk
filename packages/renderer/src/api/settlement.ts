import request from './request';

// 提现
export const withdrawal = (data: Record<string, any>) => {
  return request.post('/withdrawal', data);
};
// 提现记录
export const withdrawalList = (params: Record<string, any>) => {
  return request.get('/withdrawal', { params });
};
// 提现记录账号
export const withdrawalAccount = () => {
  return request.get('/withdrawal_account');
};
// 结算管理
export const settlement = () => {
  return request.get('/settlement');
};

// 绑定银行卡
export const sendBindBack = (data: Record<string, any>) => {
  return request.post('/bank', data);
};

// 绑定支付宝
export const senBindAlipay = (data: { name: string; account: string }) => {
  return request.post('/alipay', data);
};
