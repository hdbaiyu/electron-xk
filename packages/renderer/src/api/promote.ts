import request from '@/api/request';

//我的推广
export const promote = (params: Record<string, any>) => {
  return request.get(`/promote`, { params });
};
