import request from '@/utils/request-count'
// 今日订单总数
export function ordersNum() {
  return request({
    url:'/count/ordersNum',
    method:'get',
  })
}
// 平台会员总数
export function membersNum() {
  return request({
    url:'/count/membersNum',
    method:'get',
  })
}
// 平台商家总数
export function merchantNum() {
  return request({
    url:'/count/merchantNum',
    method:'get',
  })
}
// 待审核注册商家数
export function reviewMerchant() {
  return request({
    url:'/count/reviewMerchant',
    method:'get',
  })
}
// 待审核商品数
export function reviewProduct() {
  return request({
    url:'/count/reviewProduct',
    method:'get',
  })
}
// 待审核产品认证数
export function reviewExamine() {
  return request({
    url:'/count/reviewExamine',
    method:'get',
  })
}
// 根据销量请求商品信息
export function hotSaleProduct(params) {
  return request({
    url:'/count/hotSaleProduct',
    method:'get',
    params:params
  })
}
// 请求各个分类的销售情况
export function hotSaleCategory() {
  return request({
    url:'/count/hotSaleCategory',
    method:'get',
  })
}



