export interface WithdrawalParams {
  account: string
  //账号(vip才能填)
  name: string
  //姓名(vip才能填)
  price: string
   //价格
  type: number
   //(0=银行卡 1=支付宝
  bank: string
   //开户行(vip才能填)
}

export interface CollectionQuery {
  page: string;
  page_size: string;
  goods_name?: string
  status?: string;
  no?: string;
}

export interface BindBackParams {
  // 姓名
  name: string
  // 手机号
  contact: string
  // 卡号
  card_number: string
  // 银行
  bank: string
}
