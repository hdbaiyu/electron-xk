import request from '@/api/request';

//订单详情
export const orderDetails = (params: Record<string, any>) => {
  return request.get(`/order_details`, { params });
};
// 订单列表
export const getOrder = (params: Record<string, any>) => {
  return request.get('/order', { params });
};
