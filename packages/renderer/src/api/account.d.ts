export interface CreateBackParams {
  // 银行
  bank: string
  // 卡号
  card_number: string
  // 名字
  name: string
  // 手机号
  contact: string
}

export interface BindAlipayParams {
  // 名字
  name: string
  // 手机号
  contact: string
}


export interface CollectionQuery {
  page: string;
  page_size: string;
  goods_name?: string
  status?: string;
  no?: string;
}

