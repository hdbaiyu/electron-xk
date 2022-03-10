import axios from 'axios';
import { message } from 'antd';
// @ts-ignore
import config from '../../config'

// const hasHttps = window.location.protocol === 'http:' ? 'https:':'https:'
const instance = axios.create({
  baseURL: config.api + '/' + config.rootPath,
  timeout: 60000,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    const user = localStorage.getItem('user')
    let keys = {
      token: ''
    }
    if (user) {
      keys = JSON.parse(user)
    }
    config.headers['Authorization'] = `Bearer ${keys.token}`
    // Do something before request is sent
    return config;
  },
  function (error) {
    message.error(error.data.msg || error.message);
    return Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  function (res) {
    if (res.data && res.data.code === 200) {
      return res.data.data
    }
    if (res.data && res.data.code === 401) {
      window.location.href = '/'
      return
    }
    if (res.data && res.data.code === 500) {
      message.error(res.data?.message);
    }
    return Promise.reject(new Error(res.data?.message||"服务器开小差了～"));
  },
  function (error) {
    message.error(error.data.msg || error.message);
    return Promise.reject(new Error(error.message||"服务器开小差了～"));
  },
);

export default instance;
