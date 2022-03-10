export interface goodsQueryList {
  page: number
  page_size?: number
  name?: string
  category_id?: string
}

export interface categoryVO {
  id: number
  created_at: string
  updated_at: string
  supplier_id: number
  name: string
  //名称
  icon: string
  //图标
  type: number
  //类型：0=卡密，1=下载连接
  status: number
  //0上架，1下架
}
