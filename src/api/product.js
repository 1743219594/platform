import request from '@/utils/request'
// 获取商品列表
export function fetchList(params) {
  return request({
    url:'/product/list',
    method:'get',
    params:params
  })
}
// 更改商品上架状态
export function updatePublishStatus(params) {
  return request({
    url:'/product/update/publishStatus',
    method:'post',
    params:params
  })
}
// 更改商品上架状态
export function updateVerifyStatus(params) {
  return request({
    url:'/product/update/verifyStatus',
    method:'post',
    params:params
  })
}
// 根据id获取商品的详细信息
export function getProduct(id) {
  return request({
    url:'/product/detail/'+id,
    method:'get',
  })
}

// 获取未审核的商品列表
export function fetchListNotExamine(params) {
  return request({
    url:'/product/notexaminelist',
    method:'get',
    params:params
  })
}
// 通过商品审核申请
export function passNotExamine(id) {
  return request({
    url:'/product/passnotexamine/' + id,
    method:'get',
  })
}
// 退回商品审核申请
export function refuseNotAuthDetail(id) {
  return request({
    url:'/product/refusenotexamine/' + id,
    method:'get',
  })
}

// 获取产品认证申请列表
export function fetchListNotAuth(params) {
  return request({
    url:'/product/listApprove',
    method:'get',
    params:params
  })
}
// 获取产品认证申请具体信息
export function fetchNotAuthDetail(id) {
  return request({
    url:'/product/notauthdetail/' + id,
    method:'get',
  })
}
// 处理产品认证审核
export function handleApprove(id,params) {
  return request({
    url:'/product/isApprove/' + id,
    method:'get',
    params: params
  })
}
// 通过产品认证审核申请
export function passNotAuth(id) {
  return request({
    url:'/product/passnotauth/' + id,
    method:'get',
  })
}
// 退回产品认证审核申请
export function refuseNotAuth(id) {
  return request({
    url:'/product/refusenotauth/' + id,
    method:'get',
  })
}
// 批量修改商品删除状态
export function updateDeleteStatus(params) {
  return request({
    url:'/product/update/deleteStatus',
    method:'post',
    params:params
  })
}
// 批量修改商品同源认证状态
export function updateNewStatus(params) {
  return request({
    url:'/product/update/newStatus',
    method:'post',
    params:params
  })
}

export function updateProduct(id,data) {
  return request({
    url:'/product/update/'+id,
    method:'post',
    data:data
  })
}