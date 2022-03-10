// qiniu_token
import request from './request'

export const getQiniuToken = () => {
  return request.get('/qiniu_token')
}
