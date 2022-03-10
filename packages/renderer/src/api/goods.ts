import request from './request';
import type { goodsQueryList } from './goods.d';

// 商品分类
export const goods_category = () => {
  return request.get('/goods_category');
};
// 商品列表
export const goods_list = (params: goodsQueryList) => {
  return request.get('/goods', { params });
};

// 添加商品
export const addGoods = (data: any) => {
  return request.post('/goods', data);
};

// 删除商品
export const delGoods = (id: string) => {
  return request.delete(`/goods/${id}`);
};
// 修改商品
export const putGoods = (id: string, data: any) => {
  return request.put(`/goods/${id}`, data);
};

// 添加卡密
export const addCard = (data: string) => {
  return request.post(`/card`, data);
};
// 卡密
export const cardList = (params: goodsQueryList) => {
  return request.get(`/card`, { params });
};

// 卡密订单
export const cardOrder = (params: Record<string, any>) => {
  return request.get(`/card_order`, { params });
};

// 删除商品
export const delCard = (ids: number[]) => {
  return request.post(`/card_del`, { ids: ids });
};

// 商品分类
export const classifyList = (params: { type: string }) => {
  return request.get(`/goods_type`, { params });
};
