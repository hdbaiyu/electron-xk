export interface LoginParams {
  contact: string;
  password: string;
}

export interface CertificationParams {
  username: string;
  //姓名
  sex: number
  //性别 (0=女 1=男)
  contact: string
  //手机号码
  id_number: string
  //身份证号码
  id_positive: string
  //身份证正面照片
  id_reverse: string
  // 身份证反面照片
}

export interface RegistryParams {
  contact: string
   //手机号
  main_body_type: string
   //主体类型: 0=个人1=媒体2=企业3=组织
  name: string
   //账号名称
  description: string
   //简介
  avatar: string
  //头像
  address: string
   //所在地
  sponsored_link: string
   //推广链接
  password: string
   //密码md5加密后的
}
export interface updatePasswordParams {
  old_password: string;
  password: string;
}
