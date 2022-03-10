import request from './request'

export const getVip = ()=> {
  return request.get('/vip')
}

// 会员支付地址
export const sendPay = (data: any)=> {
  return request.post('/vip', data)
}
