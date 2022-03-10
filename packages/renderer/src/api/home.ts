import request from './request';
import { OrderQuery, Income } from './home.d';

export const getBalance = () => {
  return request.get('/home');
};

export const getOrderLatest = () => {
  return request.get('/order_latest');
};

// 收支明细
export const income = (params: Income) => {
  return request.get('/income', { params });
};

// 所有公告
export const announcement = () => {
  return request.get('/announcement');
};
// 公告详情
export const announcementDetail = (params: { id: string }) => {
  return request.get('/announcement', { params });
};

export const getBanner = () => {
  return request.get('/banner');
};

export const getHome = async () => {
  const banner = await request.get('/banner');
  const notice = await request.get('/announcement');
  return {
    banner,
    notice,
  };
};
