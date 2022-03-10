import request from './request';

/**
 * 收支记录
 */
export const list = (params: Record<string, any>) => {
  return request.get('/income', { params });
};

/**
 * 转账
 * @param data
 */
export const transfer = (data: Record<string, any>) => {
  return request.post('/transfer', data);
};
