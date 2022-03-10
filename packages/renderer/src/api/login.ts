import request from './request';
import type {
  LoginParams,
  RegistryParams,
  CertificationParams,
  updatePasswordParams,
} from './login.d';
import { data } from 'autoprefixer';

export const login = (data: LoginParams) => {
  return request.post('/login', data);
};

export const register = (data: RegistryParams) => {
  return request.post('/register', data);
};

export const loginLog = (params: { page: string; page_size: string }) => {
  return request.get('/login_log', { params });
};

// 供应商信息
export const userInfo = () => {
  return request.get('/info');
};

/**
 * 实名认证
 * @param data
 */
export const certification = (data: Record<string, any>) => {
  return request.post('/certification', data);
};

export const updatePassword = (data: updatePasswordParams) => {
  return request.post('/update_password', data);
};

/**
 * 获取图形验证码
 */
export const captcha = () => {
  return request.get('/captcha');
};
/**
 * 发送验证码
 * @param data
 */
export const sms = (data: Record<string, any>) => {
  return request.post('/sms', data);
};

// 微信登录
export const wechatLogin = (data: Record<string, any>) => {
  return request.post('/wechat_login', data);
};

// qq登录
export const qqLogin = (data: Record<string, any>) => {
  return request.post('/qq_login', data);
};
